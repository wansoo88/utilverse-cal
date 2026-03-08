import { PostStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { publishPostToBlogger } from "@/lib/integrations/blogger";
import { generateDraftWithGemini } from "@/lib/integrations/gemini";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createPostFromKeyword(keywordId: string) {
  const keyword = await db.keyword.findUnique({
    where: { id: keywordId },
  });

  if (!keyword) {
    throw new Error("Keyword not found.");
  }

  const existing = await db.post.findFirst({
    where: {
      keywordId,
    },
  });

  if (existing) {
    return existing;
  }

  const title = keyword.keyword
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const post = await db.post.create({
    data: {
      keywordId: keyword.id,
      title,
      slug: `${slugify(title)}-${keyword.id.slice(0, 6)}`,
      category: keyword.category,
      targetCountry: keyword.country,
      status: PostStatus.QUEUED,
    },
  });

  await db.keyword.update({
    where: { id: keyword.id },
    data: {
      status: "ASSIGNED",
    },
  });

  return post;
}

export async function listPostsByStatus() {
  return db.post.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      keyword: true,
      publishJobs: {
        orderBy: { scheduledFor: "desc" },
        take: 1,
      },
    },
  });
}

export async function getReviewPosts() {
  return db.post.findMany({
    where: {
      status: {
        in: ["DRAFTED", "REVIEW"],
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      keyword: true,
    },
  });
}

export async function getPublishPosts() {
  return db.post.findMany({
    where: {
      status: {
        in: ["APPROVED", "SCHEDULED", "PUBLISHED"],
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      publishJobs: {
        orderBy: {
          scheduledFor: "desc",
        },
        take: 1,
      },
      keyword: true,
    },
  });
}

export async function generateDraftForPost(postId: string) {
  const post = await db.post.findUnique({
    where: { id: postId },
    include: {
      keyword: true,
    },
  });

  if (!post || !post.keyword) {
    throw new Error("Post or linked keyword not found.");
  }

  const result = await generateDraftWithGemini({
    title: post.title,
    keyword: post.keyword.keyword,
    category: post.category,
    country: post.targetCountry,
  });

  return db.post.update({
    where: { id: post.id },
    data: {
      draftMarkdown: result.draft,
      status: PostStatus.REVIEW,
      aiScore: 80,
      wordCount: result.draft.split(/\s+/).filter(Boolean).length,
      faqCount: result.draft.includes("FAQ") ? 3 : 0,
      reviewNotes: `Draft generated with ${result.model} at ${new Date().toISOString()}`,
    },
  });
}

export async function updatePostStatus(postId: string, status: PostStatus) {
  const data: {
    status: PostStatus;
    approvedAt?: Date;
    publishedAt?: Date;
  } = {
    status,
  };

  if (status === PostStatus.APPROVED) {
    data.approvedAt = new Date();
  }

  if (status === PostStatus.PUBLISHED) {
    data.publishedAt = new Date();
  }

  return db.post.update({
    where: { id: postId },
    data,
  });
}

export async function schedulePost(postId: string, scheduledFor: Date) {
  await db.publishJob.create({
    data: {
      postId,
      scheduledFor,
      status: "PENDING",
    },
  });

  return db.post.update({
    where: { id: postId },
    data: {
      status: PostStatus.SCHEDULED,
      targetPublishDate: scheduledFor,
    },
  });
}

export async function publishPost(postId: string) {
  const post = await db.post.findUnique({
    where: { id: postId },
  });

  if (!post || !post.draftMarkdown) {
    throw new Error("Post draft not found.");
  }

  const result = await publishPostToBlogger({
    title: post.title,
    contentMarkdown: post.draftMarkdown,
    labels: [post.category],
  });

  await db.publishJob.updateMany({
    where: {
      postId,
      status: "PENDING",
    },
    data: {
      status: "SUCCESS",
    },
  });

  return db.post.update({
    where: { id: postId },
    data: {
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
      bloggerPostId: result.bloggerPostId,
      bloggerUrl: result.bloggerUrl,
    },
  });
}

export async function touchPaths() {
  revalidatePath("/");
  revalidatePath("/guide");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/keywords");
  revalidatePath("/dashboard/pipeline");
  revalidatePath("/dashboard/review");
  revalidatePath("/dashboard/publish");
  revalidatePath("/dashboard/notifications");
  revalidatePath("/dashboard/settings");
}
