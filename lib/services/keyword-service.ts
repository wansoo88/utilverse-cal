import { Category, Country, KeywordStatus } from "@prisma/client";
import { db } from "@/lib/db";

type CreateKeywordInput = {
  keyword: string;
  category: Category;
  country: Country;
  intent: string;
  priority: number;
  notes?: string;
};

export async function createKeyword(input: CreateKeywordInput) {
  return db.keyword.create({
    data: {
      keyword: input.keyword,
      category: input.category,
      country: input.country,
      intent: input.intent,
      priority: input.priority,
      notes: input.notes,
      status: KeywordStatus.QUEUED,
    },
  });
}

export async function listKeywords() {
  return db.keyword.findMany({
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    include: {
      posts: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });
}
