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

function cleanHtmlTags(html: string): string {
  return html
    // 1. Remove all scripts, styles, noscript, svg, nav, headers, footers and comments
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, " ")
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, " ")
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, " ")
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
}

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

function isValidParagraph(text: string): boolean {
  if (!text || text.length < 45) return false;

  const lower = text.toLowerCase();

  // Reject JS / CSS code leakages
  if (
    lower.includes("document.getelementbyid") ||
    lower.includes("addeventlistener") ||
    lower.includes("classlevel") ||
    lower.includes("classlist.") ||
    lower.includes(".loader") ||
    lower.includes("@keyframes") ||
    lower.includes("-webkit-") ||
    lower.includes("function (") ||
    lower.includes("function()") ||
    lower.includes("display: none") ||
    lower.includes("border-radius:") ||
    lower.includes("animation:") ||
    lower.includes("transform:") ||
    text.includes("{") ||
    text.includes("}") ||
    text.includes("/*") ||
    text.includes("*/")
  ) {
    return false;
  }

  // Reject navigation breadcrumb headers (e.g. "Home News World Sports...")
  if (
    lower.startsWith("home news") ||
    lower.startsWith("home >") ||
    lower.includes("trending health videos technology") ||
    lower.includes("royal trending")
  ) {
    return false;
  }

  // Reject boilerplate, copyright, and subscriptions
  if (
    lower.includes("copyright") ||
    lower.includes("all rights reserved") ||
    lower.includes("subscribe") ||
    lower.includes("join our whatsapp") ||
    lower.includes("read more:") ||
    lower.includes("follow us on") ||
    lower.includes("googletag") ||
    lower.includes("terms of service") ||
    lower.includes("privacy policy") ||
    lower.startsWith("photo courtesy") ||
    lower.startsWith("listen to article")
  ) {
    return false;
  }

  return true;
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
      let rawHtml = await res.text();

      // Extract image before stripping tags
      const ogImageMatch =
        rawHtml.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i) ||
        rawHtml.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]+)"/i);
      const image = ogImageMatch?.[1] || null;

      // Extract author / byline
      const authorMatch =
        rawHtml.match(/<meta[^>]*name="author"[^>]*content="([^"]+)"/i) ||
        rawHtml.match(/<span[^>]*class="[^"]*story__byline[^"]*"[^>]*>([\s\S]*?)<\/span>/i) ||
        rawHtml.match(/<a[^>]*rel="author"[^>]*>([\s\S]*?)<\/a>/i);
      const author = authorMatch ? decodeHtml(authorMatch[1]) : undefined;

      // Clean HTML from all script/style/nav/header/footer tags
      const cleanHtml = cleanHtmlTags(rawHtml);

      // Extract title
      const titleMatch =
        cleanHtml.match(/<h1[^>]*class="[^"]*story__title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) ||
        cleanHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
        cleanHtml.match(/<title>([\s\S]*?)<\/title>/i);
      const title = decodeHtml(titleMatch?.[1] || "News Story");

      // Extract publisher / site name from domain
      const parsedUrl = new URL(url);
      let siteName = "Verified News Source";
      if (parsedUrl.hostname.includes("dawn.com")) siteName = "DAWN News";
      else if (parsedUrl.hostname.includes("tribune.com.pk")) siteName = "The Express Tribune";
      else if (parsedUrl.hostname.includes("thenews.com.pk")) siteName = "The News International";
      else if (parsedUrl.hostname.includes("dailytimes.com.pk")) siteName = "Daily Times";

      // Try finding story body container first
      const containerMatch =
        cleanHtml.match(/<article[\s\S]*?<\/article>/i) ||
        cleanHtml.match(/<div[^>]*class="[^"]*(?:story__content|story-content|story-text|story-body|story-detail|detail-content|story_detail|detail-body)[^"]*"[^>]*>([\s\S]*?)<\/div>/i);

      const targetHtml = containerMatch ? containerMatch[0] : cleanHtml;

      // Extract story paragraphs
      const pMatches = targetHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || cleanHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
      const paragraphs: string[] = [];

      for (const p of pMatches) {
        const cleaned = decodeHtml(p);
        if (isValidParagraph(cleaned)) {
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
