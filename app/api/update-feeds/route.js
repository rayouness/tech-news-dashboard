import { NextResponse } from "next/server";
import { fetchAllFeeds, saveArticles } from "@/lib/rss-parser";
import { summarizeArticles } from "@/lib/gemini";

// This endpoint is called by Vercel Cron daily.
// It can also be called manually: GET /api/update-feeds

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request) {
  try {
    console.log("[Cron] Starting feed update...");
    console.log("[Cron] GEMINI_API_KEY present:", !!process.env.GEMINI_API_KEY);

    const data = await fetchAllFeeds();

    // Summarize new articles with Gemini (skips if no API key)
    console.log("[Cron] Starting Gemini summarization...");
    data.articles = await summarizeArticles(data.articles);

    // Save to in-memory cache
    saveArticles(data);

    const summarizedCount = data.articles.filter((a) => a.aiSummary).length;
    console.log(`[Cron] Complete — ${data.articles.length} articles, ${summarizedCount} summarized`);

    return NextResponse.json({
      ok: true,
      articlesCount: data.articles.length,
      summarizedCount,
      lastUpdated: data.lastUpdated,
      stats: data.stats,
    });
  } catch (error) {
    console.error("[Cron] Update failed:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
