import Dashboard from "@/components/Dashboard";
import { fetchAllFeeds } from "@/lib/rss-parser";

export const dynamic = "force-dynamic";

async function getArticles() {
  try {
    const data = await fetchAllFeeds();
    return data;
  } catch (error) {
    console.error("[Page] Failed to fetch feeds:", error);
    return { articles: [], lastUpdated: null, stats: { success: 0, failed: 0, total: 0 } };
  }
}

export default async function HomePage() {
  const data = await getArticles();
  return <Dashboard initialData={data} />;
}
