# 📡 Tech News Dashboard

A minimal, mobile-optimized personal tech news dashboard that automatically collects and displays technology and cybersecurity news from RSS feeds.

**Zero cost** · **Auto-updates hourly** · **Works on iPhone & desktop** · **No maintenance needed**

---

## Features

- 📰 Aggregates news from 20+ tech and cybersecurity RSS feeds
- 📱 Mobile-first design optimized for iPhone Safari
- 🔄 Auto-updates every hour via Vercel Cron Jobs
- 🌙 Dark mode by default
- ⚡ Fast loading with server-side rendering
- 🏷️ Six categories: AI, Dev Tools, Tech Industry, Cybersecurity, Data Breaches, Vulnerabilities
- 🔧 Easy to customize — add/remove feeds in one config file
- 🧩 Architected for optional Gemini AI summarization later

---

## Prerequisites

- **Node.js 18+** — Download from [https://nodejs.org](https://nodejs.org) (LTS recommended)
- **Git** — Download from [https://git-scm.com](https://git-scm.com)
- **A free Vercel account** — Sign up at [https://vercel.com](https://vercel.com)

Check if you have Node.js installed:
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
```

---

## Local Setup (Step by Step)

### 1. Clone or create the project

If you have the project files already:
```bash
cd tech-news-dashboard
```

Or clone from your GitHub repo:
```bash
git clone https://github.com/YOUR_USERNAME/tech-news-dashboard.git
cd tech-news-dashboard
```

### 2. Install dependencies

```bash
npm install
```

This installs Next.js, React, Tailwind CSS, and the RSS parser. Takes about 30-60 seconds.

### 3. Run locally

```bash
npm run dev
```

Open your browser to **http://localhost:3000**

The first load will take a moment as it fetches RSS feeds for the first time.

### 4. Test feed fetching manually

In a new terminal tab, trigger a manual feed update:
```bash
curl http://localhost:3000/api/update-feeds
```

You should see a JSON response with article counts and stats.

### 5. Test on your phone (local network)

1. Find your computer's local IP address:
   - **Mac**: System Settings → Wi-Fi → Details → IP Address
   - **Windows**: `ipconfig` in Command Prompt → look for IPv4 Address
2. On your iPhone, open Safari and go to `http://YOUR_IP:3000`
3. Both devices must be on the same Wi-Fi network

---

## Deploy to Vercel (Free)

### 1. Push to GitHub

Create a new repo on [GitHub](https://github.com/new), then:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tech-news-dashboard.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/log in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Select your `tech-news-dashboard` repository
4. Vercel auto-detects Next.js — leave all settings as default
5. Click **"Deploy"**
6. Wait 1-2 minutes for the build to complete
7. You'll get a URL like `tech-news-dashboard-xxxx.vercel.app`

### 3. Verify Cron Jobs

The `vercel.json` file configures automatic hourly updates. After deployment:

1. Go to your project in the Vercel dashboard
2. Click **Settings** → **Cron Jobs**
3. You should see: `/api/update-feeds` scheduled for `0 */1 * * *` (every hour)
4. You can click **"Trigger"** to run it manually

> **Note**: Vercel free tier includes cron jobs that run once per day. For hourly updates on free tier, the dashboard also auto-refreshes stale data when users visit (if cache is older than 2 hours). For true hourly cron, you'd need Vercel Pro, but the stale-while-revalidate approach works great for personal use.

### 4. Access from iPhone

Just open Safari and visit your Vercel URL. That's it!

**Tip**: Add to Home Screen for an app-like experience:
1. Open the URL in Safari
2. Tap the Share button (square with arrow)
3. Tap **"Add to Home Screen"**
4. Name it "Tech News" and tap Add

---

## Customizing RSS Feeds

Edit `lib/feed-sources.js` to add or remove feeds:

```javascript
// Add a new feed:
{
  name: "Wired",
  url: "https://www.wired.com/feed/rss",
  category: "tech-industry",  // Must match a category ID
},

// Remove a feed: just delete or comment out its entry
```

### Available categories:
| Category ID      | Label              |
|------------------|--------------------|
| `ai`             | AI News            |
| `dev-tools`      | Developer Tools    |
| `tech-industry`  | Tech Industry      |
| `cybersecurity`  | Cybersecurity      |
| `data-breaches`  | Data Breaches      |
| `vulnerabilities`| Vulnerabilities    |

After editing, push to GitHub and Vercel will auto-redeploy:
```bash
git add .
git commit -m "Updated RSS feeds"
git push
```

---

## Project Structure

```
tech-news-dashboard/
├── app/
│   ├── page.js              # Homepage (server component)
│   ├── layout.js             # Root layout + metadata
│   ├── globals.css            # Global styles + Tailwind
│   └── api/
│       ├── update-feeds/
│       │   └── route.js       # Cron endpoint (fetches RSS)
│       └── feeds/
│           └── route.js       # GET cached articles
├── components/
│   ├── Dashboard.jsx          # Main client component
│   ├── Header.jsx             # Top bar with status
│   ├── CategoryNav.jsx        # Category filter tabs
│   ├── CategorySection.jsx    # Category article grid
│   ├── ArticleCard.jsx        # Individual article card
│   └── LoadingSkeleton.jsx    # Loading placeholder
├── lib/
│   ├── feed-sources.js        # ⭐ RSS feed config (edit this!)
│   ├── rss-parser.js          # Feed fetching logic
│   └── utils.js               # Date formatting, helpers
├── data/
│   └── articles.json          # Cached article data
├── vercel.json                # Cron job config
├── tailwind.config.js
├── next.config.js
└── package.json
```

---

## Troubleshooting

### "No articles yet" on first load
The first load fetches all RSS feeds which takes 10-30 seconds. Click the "Fetch Articles Now" button or visit `/api/update-feeds` directly.

### Some feeds fail
This is normal! RSS feeds occasionally go down or timeout. The dashboard handles this gracefully — it fetches what it can and skips failed feeds. Check the console logs for details.

### Build fails on Vercel
Make sure `data/articles.json` exists with the initial empty structure (it's included in the project). If the build still fails, check that your Node.js version is 18+ in Vercel project settings.

### Cron not running on free tier
Vercel Hobby (free) plan supports cron jobs but limited to once per day. The dashboard compensates by checking cache freshness on each visit and refreshing if stale (>2 hours old). For personal use this works great.

### Styles look wrong
Run `npm run build` locally to check for errors. Ensure `postcss.config.js` and `tailwind.config.js` are present.

---

## (Optional) Adding Gemini AI Summarization Later

The codebase is pre-structured for AI summaries. Each article object has an `aiSummary` field (currently `null`). When you're ready:

### 1. Get a Gemini API key
Visit [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey) and create a free API key.

### 2. Add to Vercel environment variables
In Vercel dashboard → Settings → Environment Variables:
```
GEMINI_API_KEY = your_key_here
```

### 3. Create a summarization module
Create `lib/gemini.js`:
```javascript
export async function summarizeArticle(title, description) {
  if (!process.env.GEMINI_API_KEY) return null;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Summarize this tech news in 1-2 sentences:\nTitle: ${title}\nDescription: ${description}`
          }]
        }]
      })
    }
  );

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
}
```

### 4. Integrate into the feed parser
In `lib/rss-parser.js`, import and call `summarizeArticle()` for each article, storing the result in the `aiSummary` field.

### 5. Display in ArticleCard
The `ArticleCard` component already uses `article.aiSummary || article.description` — AI summaries will automatically appear when available.

---

## Tech Stack

- **Next.js 14** — React framework with App Router
- **Tailwind CSS** — Utility-first styling
- **rss-parser** — RSS feed parsing
- **Vercel** — Free hosting + cron jobs

---

## License

Personal use. Built for learning and daily news monitoring.
