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

function cleanXmlText(text: string): string {
  if (!text) return "";
  return text
    .replace(/<!\[CDATA\[/gi, "")
    .replace(/\]\]>/gi, "")
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
    .replace(/\]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface CacheEntry {
  data: NewsArticle[];
  timestamp: number;
}
let cachedFeed: CacheEntry | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60s cache for real-time live breaking speed

const FEED_SOURCES = [
  { name: "Geo News Pakistan", url: "https://www.geo.tv/rss/1/1" },
  { name: "ARY News Pakistan", url: "https://arynews.tv/category/pakistan/feed/" },
  { name: "DAWN Pakistan", url: "https://www.dawn.com/feeds/pakistan" },
  { name: "Express Tribune", url: "https://tribune.com.pk/feed/pakistan" },
  { name: "The News Pakistan", url: "https://www.thenews.com.pk/rss/1/1" },
];

export const CATEGORY_DEFAULT_IMAGES: Record<NewsArticle["category"], string> = {
  "Breaking News": "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop",
  "National": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop",
  "Legal & Courts": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop",
  "Economy & Trade": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
  "Citizen & Tech": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
  "Official Announcement": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop",
};

export function getCategoryFallbackImage(cat?: string | null): string {
  if (cat && cat in CATEGORY_DEFAULT_IMAGES) {
    return CATEGORY_DEFAULT_IMAGES[cat as NewsArticle["category"]];
  }
  return "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop";
}

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
      const titleMatch = raw.match(/<title>([\s\S]*?)<\/title>/i);
      const linkMatch = raw.match(/<link>([\s\S]*?)<\/link>/i);
      const pubDateMatch = raw.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
      const descMatch = raw.match(/<description>([\s\S]*?)<\/description>/i);
      
      const mediaMatch = raw.match(/<media:(?:content|thumbnail)[^>]*url=["']([^"']+)["']/i);
      const enclosureMatch = raw.match(/<enclosure[^>]*url=["']([^"']+)["']/i);
      const imgTagMatch = raw.match(/<img[^>]+src=["']([^"']+)["']/i);
      const rawImgUrlMatch = raw.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp|avif)/i);

      const title = cleanXmlText(titleMatch?.[1] || "Untitled Headline");
      const link = cleanXmlText(linkMatch?.[1] || "");
      const pubDate = cleanXmlText(pubDateMatch?.[1] || new Date().toISOString());
      const rawDesc = descMatch?.[1] || "";
      let summary = cleanXmlText(rawDesc).slice(0, 320);

      if (!title || title.length < 5 || !link) continue;

      // If summary is empty, CDATA artifact (like ']]>'), or only punctuation, generate clean summary from title
      if (!summary || summary.length < 15 || summary.includes("]]>") || /^[\s.,;:\-_[\]<>]+$/.test(summary)) {
        summary = `Verified editorial dispatch on "${title}" reported by ${sourceName.replace(" Pakistan", "")}. Read the full story on 47 Say Ab Tak.`;
      }

      const lower = (title + " " + summary).toLowerCase();
      const isCelebrityGossip =
        lower.includes("hollywood") ||
        lower.includes("bollywood") ||
        lower.includes("box office") ||
        lower.includes("actress") ||
        lower.includes("actor") ||
        lower.includes("hathaway") ||
        lower.includes("kardashian") ||
        lower.includes("movie") ||
        lower.includes("film review") ||
        lower.includes("grammy") ||
        lower.includes("oscars") ||
        lower.includes("celebrity") ||
        lower.includes("gossip") ||
        lower.includes("horoscope");

      const isForeignNonPakistan =
        (lower.includes("white house") ||
          lower.includes("us state dept") ||
          lower.includes("trump") ||
          lower.includes("biden") ||
          lower.includes("gaza") ||
          lower.includes("israel") ||
          lower.includes("ukraine") ||
          lower.includes("russia") ||
          lower.includes("taiwan") ||
          lower.includes("china president") ||
          lower.includes("xi jinping") ||
          lower.includes("bill gates") ||
          lower.includes("nepal flood") ||
          lower.includes("us army")) &&
        !lower.includes("pakistan") &&
        !lower.includes("islamabad") &&
        !lower.includes("lahore") &&
        !lower.includes("karachi") &&
        !lower.includes("rawalpindi") &&
        !lower.includes("peshawar") &&
        !lower.includes("quetta");

      if (isCelebrityGossip || isForeignNonPakistan) continue;

      // Smart topic categorization
      let cat: NewsArticle["category"] = "National";
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

      const candidateImg = mediaMatch?.[1] || enclosureMatch?.[1] || imgTagMatch?.[1] || rawImgUrlMatch?.[0];
      let image = CATEGORY_DEFAULT_IMAGES[cat];
      if (candidateImg && candidateImg.startsWith("http")) {
        image = candidateImg;
      } else if (candidateImg && candidateImg.startsWith("//")) {
        image = "https:" + candidateImg;
      }

      articles.push({
        id: `rss-${sourceName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${idx}-${encodeURIComponent(title.slice(0, 15))}`,
        title,
        url: link,
        published: pubDate,
        site: sourceName.replace(" Pakistan", ""),
        category: cat,
        image,
        summary,
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
