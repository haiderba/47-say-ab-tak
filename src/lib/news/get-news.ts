import { createServerFn } from "@tanstack/react-start";
import { fetchLiveRssNews, NewsArticle } from "./rss.server";

export interface CombinedNewsData {
  articles: NewsArticle[];
  lastUpdated: string;
  source: string;
}

export const getAggregatedNews = createServerFn({ method: "GET" })
  .validator((category?: string) => category || "all")
  .handler(async () => {
    // Fetch ONLY 100% verified real-time live news from DAWN, The Express Tribune, The News International
    const liveArticles = await fetchLiveRssNews();

    return {
      articles: liveArticles,
      lastUpdated: new Date().toISOString(),
      source: "Verified National Editorial Network (DAWN, Express Tribune, The News International)",
    };
  });
