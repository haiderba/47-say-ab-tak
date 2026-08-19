export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  published: string;
  site: string;
  category: "Breaking News" | "National" | "Legal & Courts" | "Economy & Trade" | "Citizen & Tech" | "Official Announcement";
  image?: string | null;
  summary: string;
  sourceType: "live_rss" | "official_portal";
}

function decodeHtml(html: string): string {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "-")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface CacheEntry {
  data: NewsArticle[];
  timestamp: number;
}
let cachedFeed: CacheEntry | null = null;
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes cache for live breaking speed

const FEED_SOURCES = [
  { name: "DAWN News", url: "https://www.dawn.com/feeds/home" },
  { name: "DAWN Pakistan", url: "https://www.dawn.com/feeds/pakistan" },
  { name: "The Express Tribune", url: "https://tribune.com.pk/feed/pakistan" },
  { name: "The News International", url: "https://www.thenews.com.pk/rss/1/1" },
  { name: "Daily Times", url: "https://dailytimes.com.pk/feed/" },
];

async function fetchSingleFeed(sourceName: string, url: string): Promise<NewsArticle[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) return [];
    const xml = await res.text();
    const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) || [];

    const articles: NewsArticle[] = [];

    for (let idx = 0; idx < Math.min(itemMatches.length, 12); idx++) {
      const raw = itemMatches[idx];
      const titleMatch = raw.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      const linkMatch = raw.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
      const pubDateMatch = raw.match(/<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i);
      const descMatch = raw.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
      const imgMatch =
        raw.match(/<media:content[^>]*url="([^"]+)"/i) ||
        raw.match(/<enclosure[^>]*url="([^"]+)"/i) ||
        raw.match(/<img[^>]*src="([^"]+)"/i);

      const title = decodeHtml(titleMatch?.[1] || "Untitled Headline");
      const link = (linkMatch?.[1] || "").trim();
      const pubDate = pubDateMatch?.[1] || new Date().toISOString();
      const rawDesc = descMatch?.[1] || "";
      const summary = decodeHtml(rawDesc).slice(0, 320);
      const image = imgMatch?.[1] || null;

      if (!title || title.length < 5 || !link) continue;

      // Smart topic categorization
      let cat: NewsArticle["category"] = "National";
      const lower = (title + " " + summary).toLowerCase();
      if (
        lower.includes("court") ||
        lower.includes("supreme court") ||
        lower.includes("high court") ||
        lower.includes("justice") ||
        lower.includes("judge") ||
        lower.includes("law") ||
        lower.includes("plea") ||
        lower.includes("verdict") ||
        lower.includes("bail") ||
        lower.includes("sc ruling")
      ) {
        cat = "Legal & Courts";
      } else if (
        lower.includes("economy") ||
        lower.includes("rupee") ||
        lower.includes("tax") ||
        lower.includes("fbr") ||
        lower.includes("imf") ||
        lower.includes("trade") ||
        lower.includes("inflation") ||
        lower.includes("market")
      ) {
        cat = "Economy & Trade";
      } else if (
        lower.includes("nadra") ||
        lower.includes("digital") ||
        lower.includes("tech") ||
        lower.includes("app") ||
        lower.includes("passport") ||
        lower.includes("cyber") ||
        lower.includes("ai")
      ) {
        cat = "Citizen & Tech";
      } else if (
        lower.includes("breaking") ||
        lower.includes("urgent") ||
        lower.includes("alert") ||
        lower.includes("dies") ||
        lower.includes("attack")
      ) {
        cat = "Breaking News";
      }

      articles.push({
        id: `rss-${sourceName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${idx}-${encodeURIComponent(title.slice(0, 15))}`,
        title,
        url: link,
        published: pubDate,
        site: sourceName.replace(" Pakistan", ""),
        category: cat,
        image,
        summary: summary || `Live news update from ${sourceName} regarding national, constitutional, and governance developments.`,
        sourceType: "live_rss",
      });
    }

    return articles;
  } catch (err) {
    console.warn(`Error fetching feed ${sourceName}:`, err);
    return [];
  }
}

export async function fetchLiveRssNews(): Promise<NewsArticle[]> {
  const now = Date.now();
  if (cachedFeed && now - cachedFeed.timestamp < CACHE_TTL_MS) {
    return cachedFeed.data;
  }

  try {
    const results = await Promise.allSettled(
      FEED_SOURCES.map((f) => fetchSingleFeed(f.name, f.url))
    );

    const merged: NewsArticle[] = [];
    const seenTitles = new Set<string>();

    for (const res of results) {
      if (res.status === "fulfilled" && Array.isArray(res.value)) {
        for (const item of res.value) {
          const norm = item.title.toLowerCase().slice(0, 40);
          if (!seenTitles.has(norm)) {
            seenTitles.add(norm);
            merged.push(item);
          }
        }
      }
    }

    // Sort by publication date (most recent first)
    merged.sort((a, b) => {
      const tA = new Date(a.published).getTime();
      const tB = new Date(b.published).getTime();
      if (isNaN(tA) || isNaN(tB)) return 0;
      return tB - tA;
    });

    cachedFeed = { data: merged, timestamp: now };
    return merged;
  } catch (err) {
    console.error("Error in fetchLiveRssNews:", err);
    return cachedFeed?.data || [];
  }
}
