// Feed URLs change over time. A broken feed is skipped safely; replace it if the logs show errors.
export const FEEDS = [
  { name: "The Hindu", lang: "en", url: "https://www.thehindu.com/news/national/feeder/default.rss" },
  { name: "NDTV", lang: "en", url: "https://feeds.feedburner.com/ndtvnews-top-stories" },
  { name: "Indian Express", lang: "en", url: "https://indianexpress.com/section/india/feed/" },
  { name: "Hindustan Times", lang: "en", url: "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml" },
  { name: "Times of India", lang: "en", url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms" },
  { name: "BOOM", lang: "en", url: "https://www.boomlive.in/feed", factcheck: true },
  { name: "Alt News", lang: "en", url: "https://www.altnews.in/feed/", factcheck: true },
  { name: "BBC Hindi", lang: "hi", url: "https://feeds.bbci.co.uk/hindi/rss.xml" },
  { name: "NDTV Khabar", lang: "hi", url: "https://feeds.feedburner.com/ndtvkhabar-latest" },
  { name: "Hindustan", lang: "hi", url: "https://www.livehindustan.com/rss/3127" },
];
