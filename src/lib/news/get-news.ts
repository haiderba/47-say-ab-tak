import { createServerFn } from "@tanstack/react-start";
import { fetchLiveRssNews, NewsArticle } from "./rss.server";

export interface CombinedNewsData {
  articles: NewsArticle[];
  lastUpdated: string;
  source: string;
}

let cachedNews: CombinedNewsData | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export const getAggregatedNews = createServerFn({ method: "GET" })
  .validator((category?: string) => category || "all")
  .handler(async () => {
    const now = Date.now();
    if (cachedNews && now - lastFetchTime < CACHE_TTL_MS) {
      return cachedNews;
    }

    try {
      const liveArticles = await fetchLiveRssNews();
      if (liveArticles && liveArticles.length > 0) {
        cachedNews = {
          articles: liveArticles,
          lastUpdated: new Date().toISOString(),
          source: "Verified National Editorial Network (DAWN, Express Tribune, The News International)",
        };
        lastFetchTime = now;
        return cachedNews;
      }
    } catch (err) {
      console.warn("Failed to fetch fresh live news, serving cached:", err);
      if (cachedNews) return cachedNews;
    }

    return cachedNews || {
      articles: [],
      lastUpdated: new Date().toISOString(),
      source: "47 Say Ab Tak News Network",
    };
  });
