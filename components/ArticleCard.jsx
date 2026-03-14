"use client";

import { timeAgo } from "@/lib/utils";
import { CATEGORIES } from "@/lib/feed-sources";

export default function ArticleCard({ article, index = 0 }) {
  const cat = CATEGORIES[article.category] || {};

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="article-card block rounded-xl p-4 sm:p-5 transition-all animate-fade-in-up"
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      {/* Category badge + date */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-md ${cat.bgClass || "bg-surface-2"} ${cat.colorClass || "text-text-secondary"}`}
        >
          <span className="text-xs">{cat.icon}</span>
          {cat.label || article.category}
        </span>
        <span className="text-[11px] font-mono text-text-muted whitespace-nowrap">
          {timeAgo(article.pubDate)}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-[15px] sm:text-base leading-snug text-text-primary mb-2 line-clamp-2">
        {article.title}
      </h3>

      {/* Description */}
      {article.description && (
        <p className="text-[13px] sm:text-sm leading-relaxed text-text-secondary line-clamp-3 mb-3">
          {article.aiSummary || article.description}
        </p>
      )}

      {/* Footer: source + read link */}
      <div className="flex items-center justify-between pt-2 border-t border-surface-3/50">
        <span className="text-[11px] font-mono text-text-muted truncate mr-3">
          {article.source}
        </span>
        <span className="text-[11px] font-medium text-accent-teal whitespace-nowrap flex items-center gap-1">
          Read
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-70">
            <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </a>
  );
}
