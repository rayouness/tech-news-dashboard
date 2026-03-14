"use client";

import ArticleCard from "./ArticleCard";
import { CATEGORIES } from "@/lib/feed-sources";

export default function CategorySection({ categoryId, articles }) {
  const cat = CATEGORIES[categoryId];
  if (!cat || !articles || articles.length === 0) return null;

  return (
    <section id={categoryId} className="scroll-mt-32">
      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
        <span className="text-xl sm:text-2xl">{cat.icon}</span>
        <h2 className="font-display font-bold text-lg sm:text-xl text-text-primary">
          {cat.label}
        </h2>
        <span className="text-[11px] font-mono text-text-muted bg-surface-2 px-2 py-0.5 rounded-md border border-surface-3/50">
          {articles.length}
        </span>
        <div className="flex-1 h-px bg-surface-3/50 ml-2" />
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 stagger-children">
        {articles.map((article, i) => (
          <ArticleCard key={article.id} article={article} index={i} />
        ))}
      </div>
    </section>
  );
}
