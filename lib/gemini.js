/**
 * Gemini AI Summarization
 * =======================
 * Uses Google Gemini 2.5 Flash (free tier) to generate
 * 1-2 sentence summaries of news articles.
 *
 * Set GEMINI_API_KEY in your environment variables.
 * If no key is set, summarization is silently skipped.
 */

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/**
 * Summarize a batch of articles in a single Gemini API call.
 * Sends up to 10 articles at once to minimize API calls and stay fast.
 * Returns an array of summaries in the same order.
 */
async function summarizeBatch(articles) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return articles.map(() => null);

  // Build a numbered list of articles for the prompt
  const articleList = articles
    .map((a, i) => `[${i + 1}] Title: ${a.title}\nDescription: ${a.description}`)
    .join("\n\n");

  const prompt = `Summarize each article below in exactly 1 sentence. Be direct and factual. Return ONLY a numbered list matching the input numbers, one summary per line. No extra text.

${articleList}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.2,
        },
      }),
      signal: AbortSignal.timeout(15000), // 15s timeout
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`[Gemini] API error ${response.status}: ${err.slice(0, 200)}`);
      return articles.map(() => null);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse numbered responses: "[1] summary" or "1. summary" or "1) summary"
    const summaries = new Array(articles.length).fill(null);
    const lines = text.split("\n").filter((l) => l.trim());

    for (const line of lines) {
      const match = line.match(/^\[?(\d+)[\].):\-]\s*(.+)/);
      if (match) {
        const index = parseInt(match[1], 10) - 1;
        const summary = match[2].trim();
        if (index >= 0 && index < articles.length && summary.length > 10) {
          summaries[index] = summary;
        }
      }
    }

    return summaries;
  } catch (error) {
    console.error(`[Gemini] Batch failed: ${error.message}`);
    return articles.map(() => null);
  }
}

/**
 * Summarize articles using Gemini in efficient batches.
 * Processes 10 articles per API call, max 3 calls per run = 30 articles.
 * Stays well within the free tier (10 RPM, 250 RPD).
 *
 * @param {Array} articles - Array of article objects
 * @returns {Array} Articles with aiSummary populated where possible
 */
export async function summarizeArticles(articles) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("[Gemini] No API key set, skipping summarization");
    return articles;
  }

  // Only summarize articles without existing summaries
  const toSummarize = articles.filter(
    (a) => !a.aiSummary && a.description && a.title
  );

  if (toSummarize.length === 0) {
    console.log("[Gemini] All articles already summarized");
    return articles;
  }

  const BATCH_SIZE = 10;
  const MAX_BATCHES = 3; // Max 30 articles, 3 API calls
  const batches = [];

  for (let i = 0; i < Math.min(toSummarize.length, BATCH_SIZE * MAX_BATCHES); i += BATCH_SIZE) {
    batches.push(toSummarize.slice(i, i + BATCH_SIZE));
  }

  console.log(`[Gemini] Summarizing ${batches.reduce((a, b) => a + b.length, 0)} articles in ${batches.length} batch(es)...`);
  let successCount = 0;

  for (const batch of batches) {
    const summaries = await summarizeBatch(batch);

    for (let i = 0; i < batch.length; i++) {
      if (summaries[i]) {
        batch[i].aiSummary = summaries[i];
        successCount++;
      }
    }

    // Small delay between batches
    if (batches.indexOf(batch) < batches.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log(`[Gemini] Done — ${successCount} articles summarized`);
  return articles;
}
