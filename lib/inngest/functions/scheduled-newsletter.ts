import { fetchArticles } from "@/lib/news";
import { inngest } from "../client";
import { marked } from "marked";
import { sendEmail } from "@/lib/email";

export default inngest.createFunction(
  { id: "newsletter/scheduled" },
  { event: "newsletter.schedule" },
  async ({ event, step, runId }) => {
    // step 1. Fetch articles per category
    const categories = event.data.categories;
    const allArticles = await step.run("fetch-news", async () => {
      return fetchArticles(categories);
    });

    // step 2.  Generate ai summary
    const summary = await step.ai.infer("summarize-news", {
      model: step.ai.models.openai({ model: "gpt-4o" }),
      body: {
        messages: [
          {
            role: "system",
            content: `You are an export newsletter editor creating a personalized newsletter.
                    Write a concise, engaging summary that:
                    - Highlights the most important stories
                    - Provides context and insights
                    - Uses a friendly, converstaional tone
                    - Is well-structured with clear sections
                    - Keeps the reader informed and engaged
                    Format the response as a proper newsletter with a title and organized content.
                    Make it email friendly with clear sections and engaging subject lines.`,
          },
          {
            role: "user",
            content: `Create a newsletter summary for these articles from the past week.
            Categories requested: ${categories.join(", ")}
            
            Articles:
            ${allArticles
              .map(
                (article: any, idx: number) =>
                  `${idx + 1}. ${article.title}\n  ${article.description}\n  Source: ${article.url} \n`,
              )
              .join("\n")}
            `,
          },
        ],
      },
    });

    console.log(summary.choices[0].message.content);

    const newsletterContent = summary.choices[0].message.content;

    if (!newsletterContent) {
      throw new Error("Failed to generate newsletter content");
    }

    const htmlResult = await marked(newsletterContent);

    // Step 3. Send email
    await step.run("send-email", async () => {
      await sendEmail(
        event.data.email,
        event.data.categories.join(", "),
        allArticles.length,
        htmlResult,
      );
    });

    return {};
  },
);
