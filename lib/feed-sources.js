/**
 * RSS Feed Sources Configuration
 * ================================
 * Add or remove feeds by editing this file.
 * Each feed needs: name, url, and category.
 *
 * Categories: "ai", "dev-tools", "tech-industry", "cybersecurity", "data-breaches", "vulnerabilities"
 */

export const CATEGORIES = {
  ai: {
    id: "ai",
    label: "AI News",
    icon: "⚡",
    color: "var(--accent-violet)",
    colorClass: "text-accent-violet",
    bgClass: "bg-accent-violet/10",
    borderClass: "border-accent-violet/20",
  },
  "dev-tools": {
    id: "dev-tools",
    label: "Developer Tools",
    icon: "🛠",
    color: "var(--accent-blue)",
    colorClass: "text-accent-blue",
    bgClass: "bg-accent-blue/10",
    borderClass: "border-accent-blue/20",
  },
  "tech-industry": {
    id: "tech-industry",
    label: "Tech Industry",
    icon: "📡",
    color: "var(--accent-teal)",
    colorClass: "text-accent-teal",
    bgClass: "bg-accent-teal/10",
    borderClass: "border-accent-teal/20",
  },
  cybersecurity: {
    id: "cybersecurity",
    label: "Cybersecurity",
    icon: "🔒",
    color: "var(--accent-green)",
    colorClass: "text-accent-green",
    bgClass: "bg-accent-green/10",
    borderClass: "border-accent-green/20",
  },
  "data-breaches": {
    id: "data-breaches",
    label: "Data Breaches",
    icon: "🚨",
    color: "var(--accent-red)",
    colorClass: "text-accent-red",
    bgClass: "bg-accent-red/10",
    borderClass: "border-accent-red/20",
  },
  vulnerabilities: {
    id: "vulnerabilities",
    label: "Vulnerabilities",
    icon: "⚠️",
    color: "var(--accent-amber)",
    colorClass: "text-accent-amber",
    bgClass: "bg-accent-amber/10",
    borderClass: "border-accent-amber/20",
  },
};

export const FEED_SOURCES = [
  // ── AI News ──────────────────────────────────────
  {
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "ai",
  },
  {
    name: "MIT Tech Review AI",
    url: "https://www.technologyreview.com/feed/",
    category: "ai",
  },
  {
    name: "The Verge AI",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    category: "ai",
  },
  {
    name: "Ars Technica AI",
    url: "https://feeds.arstechnica.com/arstechnica/technology-lab",
    category: "ai",
  },

  // ── Developer Tools ──────────────────────────────
  {
    name: "Hacker News",
    url: "https://hnrss.org/frontpage",
    category: "dev-tools",
  },
  {
    name: "Dev.to",
    url: "https://dev.to/feed",
    category: "dev-tools",
  },
  {
    name: "GitHub Blog",
    url: "https://github.blog/feed/",
    category: "dev-tools",
  },

  // ── Tech Industry ────────────────────────────────
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    category: "tech-industry",
  },
  {
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    category: "tech-industry",
  },
  {
    name: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    category: "tech-industry",
  },

  // ── Cybersecurity ────────────────────────────────
  {
    name: "Krebs on Security",
    url: "https://krebsonsecurity.com/feed/",
    category: "cybersecurity",
  },
  {
    name: "Bleeping Computer",
    url: "https://www.bleepingcomputer.com/feed/",
    category: "cybersecurity",
  },
  {
    name: "The Hacker News",
    url: "https://feeds.feedburner.com/TheHackersNews",
    category: "cybersecurity",
  },
  {
    name: "Dark Reading",
    url: "https://www.darkreading.com/rss.xml",
    category: "cybersecurity",
  },
  {
    name: "SecurityWeek",
    url: "https://feeds.feedburner.com/securityweek",
    category: "cybersecurity",
  },

  // ── Data Breaches ────────────────────────────────
  {
    name: "HaveIBeenPwned Blog",
    url: "https://www.troyhunt.com/rss/",
    category: "data-breaches",
  },
  {
    name: "DataBreaches.net",
    url: "https://www.databreaches.net/feed/",
    category: "data-breaches",
  },

  // ── Vulnerabilities ──────────────────────────────
  {
    name: "CISA Advisories",
    url: "https://www.cisa.gov/cybersecurity-advisories/all.xml",
    category: "vulnerabilities",
  },
  {
    name: "CVE Recent",
    url: "https://cvefeed.io/rssfeed/severity/high.xml",
    category: "vulnerabilities",
  },
  {
    name: "US-CERT",
    url: "https://www.cisa.gov/uscert/ncas/alerts.xml",
    category: "vulnerabilities",
  },
];

/**
 * How many articles to keep per category
 */
export const ARTICLES_PER_CATEGORY = 10;

/**
 * How many articles to show in the "Latest" section
 */
export const LATEST_ARTICLES_COUNT = 15;

/**
 * Feed fetch timeout in milliseconds
 */
export const FETCH_TIMEOUT_MS = 10000;
