"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Header from "./Header";
import CategoryNav from "./CategoryNav";
import CategorySection from "./CategorySection";
import ArticleCard from "./ArticleCard";
import LoadingSkeleton from "./LoadingSkeleton";
import { CATEGORIES, LATEST_ARTICLES_COUNT, ARTICLES_PER_CATEGORY } from "@/lib/feed-sources";

export default function Dashboard({ initialData }) {
  const [data, setData] = useState(initialData);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Group articles by category
  const articlesByCategory = useMemo(() => {
    const grouped = {};
    for (const catId of Object.keys(CATEGORIES)) {
      grouped[catId] = (data?.articles || [])
        .filter((a) => a.category === catId)
        .slice(0, ARTICLES_PER_CATEGORY);
    }
    return grouped;
  }, [data]);

  // Article counts per category
  const articleCounts = useMemo(() => {
    const counts = {};
    for (const [catId, articles] of Object.entries(articlesByCategory)) {
      counts[catId] = articles.length;
    }
    return counts;
  }, [articlesByCategory]);

  // Latest articles across all categories
  const latestArticles = useMemo(() => {
    return (data?.articles || []).slice(0, LATEST_ARTICLES_COUNT);
  }, [data]);

  // Refresh data from API
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const res = await fetch("/api/feeds");
      if (!res.ok) throw new Error("Failed to fetch");
      const newData = await res.json();
      setData(newData);
    } catch (err) {
      setError("Failed to refresh. Pull down to try again.");
      console.error("[Dashboard] Refresh failed:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Auto-refresh every 15 minutes when tab is visible
  useEffect(() => {
    let interval;
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        interval = setInterval(refreshData, 15 * 60 * 1000);
      } else {
        clearInterval(interval);
      }
    };
    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [refreshData]);

  const hasArticles = data?.articles?.length > 0;

  return (
    <div className="min-h-screen bg-surface-0">
      <Header lastUpdated={data?.lastUpdated} stats={data?.stats} />
      <CategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        articleCounts={articleCounts}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
        {/* Refresh bar */}
        {isRefreshing && (
          <div className="flex items-center justify-center gap-2 py-2 mb-4 text-[12px] font-mono text-accent-teal">
            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="60" strokeLinecap="round" />
            </svg>
            Refreshing feeds…
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-3 mb-4 text-[13px] text-accent-red/80 bg-accent-red/5 rounded-lg border border-accent-red/10">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!hasArticles && !isRefreshing && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📡</p>
            <h2 className="font-display font-bold text-xl text-text-primary mb-2">
              No articles yet
            </h2>
            <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
              The dashboard will populate automatically. You can also trigger a manual refresh.
            </p>
            <button
              onClick={async () => {
                setIsRefreshing(true);
                try {
                  await fetch("/api/update-feeds");
                  await refreshData();
                } catch (e) {
                  setError("Failed to fetch feeds.");
                } finally {
                  setIsRefreshing(false);
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent-teal/10 text-accent-teal text-sm font-medium border border-accent-teal/20 hover:bg-accent-teal/20 transition-colors min-h-[44px]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.65 2.35A8 8 0 1 0 16 8h-2a6 6 0 1 1-1.76-4.24L10 6h6V0l-2.35 2.35z" fill="currentColor"/>
              </svg>
              Fetch Articles Now
            </button>
          </div>
        )}

        {/* Content */}
        {hasArticles && (
          <div className="space-y-10 sm:space-y-14">
            {activeCategory === "all" ? (
              <>
                {/* Latest section */}
                <section>
                  <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
                    <span className="text-xl sm:text-2xl">🔥</span>
                    <h2 className="font-display font-bold text-lg sm:text-xl text-text-primary">
                      Latest
                    </h2>
                    <span className="text-[11px] font-mono text-text-muted bg-surface-2 px-2 py-0.5 rounded-md border border-surface-3/50">
                      {latestArticles.length}
                    </span>
                    <div className="flex-1 h-px bg-surface-3/50 ml-2" />

                    {/* Manual refresh button */}
                    <button
                      onClick={refreshData}
                      disabled={isRefreshing}
                      className="p-2 rounded-lg text-text-muted hover:text-accent-teal hover:bg-accent-teal/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="Refresh feeds"
                    >
                      <svg
                        width="16" height="16" viewBox="0 0 16 16" fill="none"
                        className={isRefreshing ? "animate-spin" : ""}
                      >
                        <path d="M13.65 2.35A8 8 0 1 0 16 8h-2a6 6 0 1 1-1.76-4.24L10 6h6V0l-2.35 2.35z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 stagger-children">
                    {latestArticles.map((article, i) => (
                      <ArticleCard key={article.id} article={article} index={i} />
                    ))}
                  </div>
                </section>

                {/* Each category section */}
                {Object.keys(CATEGORIES).map((catId) => (
                  <CategorySection
                    key={catId}
                    categoryId={catId}
                    articles={articlesByCategory[catId]}
                  />
                ))}
              </>
            ) : (
              /* Single category view */
              <CategorySection
                categoryId={activeCategory}
                articles={articlesByCategory[activeCategory]}
              />
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pb-8 text-center">
          <p className="text-[11px] font-mono text-text-muted/60">
            Tech News Dashboard · RSS-powered · Auto-updates hourly
          </p>
        </footer>
      </main>
    </div>
  );
}
