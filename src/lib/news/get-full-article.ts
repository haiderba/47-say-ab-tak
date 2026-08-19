import { createServerFn } from "@tanstack/react-start";

export interface FullArticleData {
  title: string;
  author?: string;
  published: string;
  site: string;
  image?: string | null;
  paragraphs: string[];
  readingTimeMinutes: number;
}

const articleCache = new Map<string, { data: FullArticleData; timestamp: number }>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache for full articles

function decodeHtml(html: string): string {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, "\"")
    .replace(/&#8221;/g, "\"")
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "-")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const getFullArticleContent = createServerFn({ method: "POST" })
  .validator((url: string) => url)
  .handler(async ({ data: url }) => {
    if (!url || !url.startsWith("http")) {
      return null;
    }

    const cached = articleCache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
      clearTimeout(timeoutId);

      if (!res.ok) return null;
      const html = await res.text();

      // Extract title
      const titleMatch =
        html.match(/<h1[^>]*class="[^"]*story__title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) ||
        html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
        html.match(/<title>([\s\S]*?)<\/title>/i);
      const title = decodeHtml(titleMatch?.[1] || "News Story");

      // Extract publisher / site name from domain
      const parsedUrl = new URL(url);
      let siteName = "Verified News Source";
      if (parsedUrl.hostname.includes("dawn.com")) siteName = "DAWN News";
      else if (parsedUrl.hostname.includes("tribune.com.pk")) siteName = "The Express Tribune";
      else if (parsedUrl.hostname.includes("thenews.com.pk")) siteName = "The News International";
      else if (parsedUrl.hostname.includes("dailytimes.com.pk")) siteName = "Daily Times";

      // Extract image
      const ogImageMatch =
        html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i) ||
        html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]+)"/i);
      const image = ogImageMatch?.[1] || null;

      // Extract author / byline
      const authorMatch =
        html.match(/<meta[^>]*name="author"[^>]*content="([^"]+)"/i) ||
        html.match(/<span[^>]*class="[^"]*story__byline[^"]*"[^>]*>([\s\S]*?)<\/span>/i) ||
        html.match(/<a[^>]*rel="author"[^>]*>([\s\S]*?)<\/a>/i);
      const author = authorMatch ? decodeHtml(authorMatch[1]) : undefined;

      // Extract story paragraphs
      const pMatches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
      const paragraphs: string[] = [];

      for (const p of pMatches) {
        const cleaned = decodeHtml(p);
        // Filter out boilerplate, short lines, ads, comments, copyright
        if (
          cleaned.length > 55 &&
          !cleaned.toLowerCase().includes("copyright") &&
          !cleaned.toLowerCase().includes("all rights reserved") &&
          !cleaned.toLowerCase().includes("subscribe") &&
          !cleaned.toLowerCase().includes("join our whatsapp") &&
          !cleaned.toLowerCase().includes("read more:") &&
          !cleaned.toLowerCase().includes("follow us on") &&
          !cleaned.toLowerCase().includes("googletag") &&
          !cleaned.toLowerCase().includes("terms of service") &&
          !cleaned.toLowerCase().includes("privacy policy") &&
          !cleaned.startsWith("Photo courtesy") &&
          !cleaned.startsWith("Listen to article")
        ) {
          paragraphs.push(cleaned);
        }
      }

      // If we got good paragraphs, calculate reading time
      const totalWords = paragraphs.join(" ").split(/\s+/).length;
      const readingTimeMinutes = Math.max(1, Math.ceil(totalWords / 200));

      const fullData: FullArticleData = {
        title,
        author,
        published: new Date().toISOString(),
        site: siteName,
        image,
        paragraphs: paragraphs.slice(0, 35), // Up to 35 rich paragraphs
        readingTimeMinutes,
      };

      articleCache.set(url, { data: fullData, timestamp: Date.now() });
      return fullData;
    } catch (err) {
      console.warn("Error scraping full article content:", err);
      return null;
    }
  });
