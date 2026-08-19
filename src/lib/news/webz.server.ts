export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  published: string;
  site: string;
  category: "National" | "Legal & Courts" | "Economy & Trade" | "Citizen & Tech" | "Official Announcement";
  image?: string | null;
  summary: string;
  sourceType: "live_webz" | "official_portal";
}

const WEBZ_API_KEY =
  process.env.WEBZ_API_KEY || "f7561916-7e89-4ab4-8b93-f1c9910ec77c";

// In-memory cache with 5-minute TTL
interface CacheEntry {
  data: NewsArticle[];
  timestamp: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function fetchWebzNews(category: string = "all"): Promise<NewsArticle[]> {
  const cacheKey = `webz_${category}`;
  const cached = cache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  let searchQuery = "pakistan language:english";
  let catLabel: NewsArticle["category"] = "National";

  switch (category) {
    case "national":
      searchQuery = "pakistan (government OR parliament OR constitution OR nation OR minister OR citizen) language:english";
      catLabel = "National";
      break;
    case "legal":
      searchQuery = "pakistan (court OR supreme court OR high court OR law OR legal OR justice OR judge) language:english";
      catLabel = "Legal & Courts";
      break;
    case "economy":
      searchQuery = "pakistan (economy OR rupee OR state bank OR inflation OR tax OR fbr OR trade OR finance) language:english";
      catLabel = "Economy & Trade";
      break;
    case "tech":
      searchQuery = "pakistan (nadra OR digital OR technology OR telecom OR biometric OR online OR it) language:english";
      catLabel = "Citizen & Tech";
      break;
    default:
      searchQuery = "pakistan language:english";
      catLabel = "National";
      break;
  }

  try {
    const url = `https://api.webz.io/newsApiLite?token=${WEBZ_API_KEY}&q=${encodeURIComponent(searchQuery)}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Webz.io API returned status ${res.status}`);
      return cached?.data || [];
    }

    const data = await res.json();
    const rawPosts = data.posts || [];

    const articles: NewsArticle[] = rawPosts.map((p: any, idx: number) => {
      // Determine image
      const img =
        p.thread?.main_image ||
        p.main_image ||
        (p.thread?.site_full?.includes("yahoo")
          ? "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80"
          : null);

      // Clean site name
      const site = p.thread?.site || p.site || "News Agency";

      // Excerpt / summary
      let summary = p.text || p.title;
      if (summary.includes("Full text is unavailable")) {
        summary = `Latest news report from ${site} regarding Pakistan legal, governance, and national developments.`;
      } else if (summary.length > 220) {
        summary = summary.slice(0, 220) + "...";
      }

      return {
        id: p.uuid || `webz-${idx}-${Date.now()}`,
        title: p.title,
        url: p.url,
        published: p.published || new Date().toISOString(),
        site: site.replace(/^www\./, ""),
        category: catLabel,
        image: img,
        summary,
        sourceType: "live_webz",
      };
    });

    cache.set(cacheKey, { data: articles, timestamp: now });
    return articles;
  } catch (err) {
    console.error("Error fetching Webz.io news:", err);
    return cached?.data || [];
  }
}
