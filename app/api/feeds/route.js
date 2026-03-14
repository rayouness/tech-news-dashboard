import { NextResponse } from "next/server";
import { loadArticles, fetchAllFeeds, saveArticles } from "@/lib/rss-parser";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Try loading cached data first
    let data = loadArticles();

    // If no cache or cache is empty, fetch fresh
    if (!data || !data.articles || data.articles.length === 0) {
      console.log("[API] No cache found, fetching fresh data...");
      data = await fetchAllFeeds();
      await saveArticles(data);
    }

    // If cache is older than 2 hours, fetch fresh in background
    if (data.lastUpdated) {
      const age = Date.now() - new Date(data.lastUpdated).getTime();
      const TWO_HOURS = 2 * 60 * 60 * 1000;
      if (age > TWO_HOURS) {
        console.log("[API] Cache is stale, refreshing...");
        // Return stale data but refresh in background
        fetchAllFeeds().then(saveArticles).catch(console.error);
      }
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("[API] Failed:", error);
    return NextResponse.json(
      { articles: [], lastUpdated: null, stats: {}, error: error.message },
      { status: 500 }
    );
  }
}
