const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

type GeminiGenerateArgs = {
  title: string;
  keyword: string;
  category: string;
  country: string;
};

function buildDraftPrompt(args: GeminiGenerateArgs) {
  return [
    "You are creating a practical English blog draft for a lifehack Blogger site.",
    `Target keyword: ${args.keyword}`,
    `Working title: ${args.title}`,
    `Category: ${args.category}`,
    `Target country: ${args.country}`,
    "",
    "Requirements:",
    "- Write in English.",
    "- Audience: busy workers and households looking to save time and money.",
    "- Length: 1000 to 1400 words.",
    "- Structure: intro, quick answer, step-by-step guide, real-life use case, time or money saving section, FAQ, related-post suggestions.",
    "- Avoid medical, legal, tax, loan, or investment advice.",
    "- Use concrete examples and avoid generic AI tone.",
    "- Output markdown only.",
  ].join("\n");
}

export async function generateDraftWithGemini(args: GeminiGenerateArgs) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const response = await fetch(`${GEMINI_API_URL}/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: buildDraftPrompt(args),
            },
          ],
        },
      ],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini request failed: ${response.status} ${text}`);
  }

  const json = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
    }>;
  };

  const text = json.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Gemini returned an empty draft.");
  }

  return {
    model,
    draft: text,
  };
}
