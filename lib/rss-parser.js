import RSSParser from "rss-parser";
import {
  FEED_SOURCES,
  ARTICLES_PER_CATEGORY,
  FETCH_TIMEOUT_MS,
} from "./feed-sources.js";
import { stripHtml, truncate, simpleHash } from "./utils.js";

const parser = new RSSParser({
  timeout: FETCH_TIMEOUT_MS,
  headers: {
    "User-Agent": "TechNewsDashboard/1.0",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
  maxRedirects: 3,
});

/**
 * In-memory cache (persists across requests in the same serverless instance).
 * On Vercel, this survives for the lifetime of the warm function (~5-15 min).
 */
global.__articleCache = global.__articleCache || null;

/**
 * Fetch a single RSS feed with timeout and error handling.
 */
async function fetchFeed(source) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const feed = await parser.parseURL(source.url);
    clearTimeout(timeout);

    const articles = (feed.items || []).slice(0, ARTICLES_PER_CATEGORY).map((item) => {
      const description = truncate(
        stripHtml(item.contentSnippet || item.content || item.summary || item.description || ""),
        250
      );

      return {
        id: simpleHash((item.link || "") + (item.title || "")),
        title: stripHtml(item.title || "Untitled"),
        link: item.link || "",
        description,
        source: source.name,
        category: source.category,
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        aiSummary: null,
      };
    });

    return { success: true, source: source.name, articles };
  } catch (error) {
    clearTimeout(timeout);
    console.error(`[RSS] Failed to fetch ${source.name}: ${error.message}`);
    return { success: false, source: source.name, articles: [], error: error.message };
  }
}

/**
 * Fetch all RSS feeds in parallel.
 */
export async function fetchAllFeeds() {
  console.log(`[RSS] Fetching ${FEED_SOURCES.length} feeds...`);
  const startTime = Date.now();

  const results = await Promise.allSettled(
    FEED_SOURCES.map((source) => fetchFeed(source))
  );

  const allArticles = [];
  const stats = { success: 0, failed: 0, total: FEED_SOURCES.length };
  const errors = [];

  for (const result of results) {
    if (result.status === "fulfilled" && result.value.success) {
      allArticles.push(...result.value.articles);
      stats.success++;
    } else {
      stats.failed++;
      const val = result.status === "fulfilled" ? result.value : result.reason;
      errors.push(val?.source || "unknown");
    }
  }

  // Deduplicate by id
  const seen = new Set();
  const unique = allArticles.filter((a) => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });

  // Sort by date, newest first
  unique.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(
    `[RSS] Done in ${duration}s — ${stats.success}/${stats.total} feeds OK, ${unique.length} articles`
  );
  if (errors.length > 0) {
    console.log(`[RSS] Failed feeds: ${errors.join(", ")}`);
  }

  return {
    articles: unique,
    lastUpdated: new Date().toISOString(),
    stats,
  };
}

/**
 * Save articles to in-memory cache.
 */
export function saveArticles(data) {
  global.__articleCache = data;
  console.log(`[Cache] Saved ${data.articles.length} articles to memory`);
  return true;
}

/**
 * Load articles from in-memory cache.
 */
export function loadArticles() {
  return global.__articleCache;
}
