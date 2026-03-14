"use client";

import { useState, useEffect } from "react";
import { timeAgo } from "@/lib/utils";

export default function Header({ lastUpdated, stats }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch(e) {}
  };

  return (
    <header className="dashboard-header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <span className="text-lg sm:text-xl">📡</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-lg sm:text-xl tracking-tight"
                  style={{ color: 'var(--header-text)' }}>
                Tech News
              </h1>
              <p className="text-[11px] sm:text-xs font-mono tracking-wide uppercase"
                 style={{ color: 'var(--header-subtle)' }}>
                Dashboard
              </p>
            </div>
          </div>

          {/* Status + Theme Toggle */}
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" />
                  <span className="text-[11px] sm:text-xs font-mono"
                        style={{ color: 'var(--header-subtle)' }}>
                    {timeAgo(lastUpdated)}
                  </span>
                </div>
                {stats && stats.success > 0 && (
                  <p className="text-[10px] font-mono mt-0.5 hidden sm:block"
                     style={{ color: 'var(--header-subtle)', opacity: 0.6 }}>
                    {stats.success}/{stats.total} feeds
                  </p>
                )}
              </div>
            )}

            {/* Dark/Light toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/25 transition-colors min-w-[44px] min-h-[44px]"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--header-text)' }}>
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--header-text)' }}>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
