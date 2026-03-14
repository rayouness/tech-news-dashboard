"use client";

import { CATEGORIES } from "@/lib/feed-sources";

export default function CategoryNav({ activeCategory, onCategoryChange, articleCounts }) {
  const categories = [
    { id: "all", label: "Latest", icon: "🔥" },
    ...Object.values(CATEGORIES),
  ];

  return (
    <nav className="sticky top-[65px] sm:top-[73px] z-40 border-b border-surface-3/60 shadow-sm"
         style={{ background: 'var(--nav-bg)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="category-nav flex overflow-x-auto px-4 sm:px-6 py-2.5 gap-1.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = cat.id === "all"
              ? Object.values(articleCounts).reduce((a, b) => a + b, 0)
              : (articleCounts[cat.id] || 0);

            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all min-h-[44px]
                  ${isActive
                    ? "shadow-sm"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-2/60"
                  }`}
                style={isActive ? {
                  background: 'var(--nav-active-bg)',
                  color: 'var(--nav-active-text)',
                } : undefined}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.label}</span>
                {count > 0 && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isActive ? "bg-accent-teal/10 text-accent-teal" : "bg-surface-2 text-text-muted"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
