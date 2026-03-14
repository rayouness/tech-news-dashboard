import Dashboard from "@/components/Dashboard";
import { loadArticles, fetchAllFeeds, saveArticles } from "@/lib/rss-parser";

export const dynamic = "force-dynamic";
export const revalidate = 300; // Revalidate every 5 minutes

async function getArticles() {
  // Try cache first
  let data = loadArticles();

  // If no cache or empty, fetch fresh
  if (!data || !data.articles || data.articles.length === 0) {
    try {
      data = await fetchAllFeeds();
      await saveArticles(data);
    } catch (error) {
      console.error("[Page] Failed to fetch feeds:", error);
      data = { articles: [], lastUpdated: null, stats: { success: 0, failed: 0, total: 0 } };
    }
  }

  return data;
}

export default async function HomePage() {
  const data = await getArticles();

  return <Dashboard initialData={data} />;
}
