function markdownToHtml(markdown: string) {
  return markdown
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();

      if (!trimmed) {
        return "";
      }

      if (trimmed.startsWith("### ")) {
        return `<h3>${trimmed.slice(4)}</h3>`;
      }

      if (trimmed.startsWith("## ")) {
        return `<h2>${trimmed.slice(3)}</h2>`;
      }

      if (trimmed.startsWith("# ")) {
        return `<h1>${trimmed.slice(2)}</h1>`;
      }

      const lines = trimmed.split("\n");
      const listItems = lines.filter((line) => line.startsWith("- "));

      if (listItems.length === lines.length) {
        return `<ul>${listItems
          .map((item) => `<li>${item.slice(2)}</li>`)
          .join("")}</ul>`;
      }

      return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .filter(Boolean)
    .join("");
}

export async function publishPostToBlogger(args: {
  title: string;
  contentMarkdown: string;
  labels: string[];
}) {
  const blogId = process.env.BLOGGER_BLOG_ID;
  const accessToken = process.env.BLOGGER_ACCESS_TOKEN;

  if (!blogId || !accessToken) {
    throw new Error("BLOGGER_BLOG_ID or BLOGGER_ACCESS_TOKEN is not configured.");
  }

  const response = await fetch(
    `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?isDraft=false`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: args.title,
        content: markdownToHtml(args.contentMarkdown),
        labels: args.labels,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Blogger publish failed: ${response.status} ${text}`);
  }

  const json = (await response.json()) as {
    id?: string;
    url?: string;
  };

  return {
    bloggerPostId: json.id ?? null,
    bloggerUrl: json.url ?? null,
  };
}
