# Desh Dispatch

Auto-updating Indian news site (English + Hindi). Next.js + Supabase + Claude.

Every 15 minutes a GitHub Action calls `/api/cron`, which:
1. reads the RSS feeds in `lib/feeds.js`
2. groups the same story from different outlets
3. asks Claude for a short summary, Hindi translation, category and breaking flag
4. (optional) finds a YouTube video for breaking stories

Labels: Confirmed = 3+ outlets, Unverified = fewer, Fact-check = a fact-check outlet covered it.
We show headlines, short AI summaries and links to the original. We do not copy full articles.

Setup steps are in the chat.
