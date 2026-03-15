import { NextResponse } from "next/server";
import { fetchAllFeeds } from "@/lib/rss-parser";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  try {
    const data = await fetchAllFeeds();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
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
