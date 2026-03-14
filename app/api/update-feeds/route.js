import { NextResponse } from "next/server";
import { fetchAllFeeds, saveArticles } from "@/lib/rss-parser";

// This endpoint is called by Vercel Cron every hour.
// It can also be called manually: GET /api/update-feeds

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s for feed fetching

export async function GET(request) {
  // Optional: Verify cron secret in production
  // const authHeader = request.headers.get("authorization");
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    console.log("[Cron] Starting feed update...");
    const data = await fetchAllFeeds();
    const saved = await saveArticles(data);

    return NextResponse.json({
      ok: true,
      saved,
      articlesCount: data.articles.length,
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
