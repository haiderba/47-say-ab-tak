import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  DollarSign,
  ExternalLink,
  Eye,
  Filter,
  Flame,
  Globe,
  Info,
  Landmark,
  Layers,
  Loader2,
  Mail,
  Newspaper,
  Radio,
  RefreshCw,
  Search,
  Share2,
  Shield,
  Sparkles,
  TrendingUp,
  Type,
  X,
  Zap,
} from "lucide-react";
import { getAggregatedNews } from "@/lib/news/get-news";
import { getFullArticleContent, FullArticleData } from "@/lib/news/get-full-article";
import { NewsArticle } from "@/lib/news/rss.server";
import { getCategoryFallbackImage } from "@/lib/news/news-helpers";
import { toast } from "sonner";

export interface NewsSearchParams {
  story?: string;
}

export const Route = createFileRoute("/news/")({
  validateSearch: (search: Record<string, unknown>): NewsSearchParams => {
    return {
      story: typeof search.story === "string" ? search.story : undefined,
    };
  },
  loader: async () => {
    return await getAggregatedNews({ data: "all" });
  },
  head: () => ({
    meta: [
      { title: "Pakistan Breaking News & Legal Gazette | 47 Say Ab Tak Newsroom" },
      {
        name: "description",
        content: "Verified real-time national dispatches from DAWN, The Express Tribune, and The News International. Covering Supreme Court verdicts, FBR tax policy, and Pakistani administrative news.",
      },
      {
        name: "keywords",
        content: "Pakistan breaking news, Supreme Court of Pakistan news, FBR tax circular, NADRA latest news, DAWN news live, Pakistan legal gazette, 47 Say Ab Tak",
      },
      { property: "og:title", content: "Pakistan Breaking News & Legal Gazette | 47 Say Ab Tak" },
      {
        property: "og:description",
        content: "Verified national reporting on constitutional law, civil documentation, and public governance in Pakistan.",
      },
      { property: "og:url", content: "https://47sayabtak.com/news" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://47sayabtak.com/news" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsMediaOrganization",
          "name": "47 Say Ab Tak Newsroom",
          "url": "https://47sayabtak.com/news",
          "description": "Verified Pakistan national newsroom and legal gazette aggregation.",
        }),
      },
    ],
  }),
  component: NewsBlogPage,
});

const CATEGORY_TABS = [
  { id: "all", label: "All Stories", icon: Globe },
  { id: "breaking", label: "Breaking", icon: Flame },
  { id: "national", label: "National & Policy", icon: Landmark },
  { id: "legal", label: "Legal & Courts", icon: Shield },
  { id: "economy", label: "Economy & Trade", icon: TrendingUp },
  { id: "tech", label: "Citizen & Tech", icon: Zap },
] as const;

function formatNewsDate(dateStr?: string | null): string {
  if (!dateStr) return "August 2026";
  try {
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) {
      return dateStr;
    }
    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "August 2026";
  }
}

function getSiteBadgeColor(site: string) {
  const s = site.toLowerCase();
  if (s.includes("dawn")) return "bg-[#01411c]/15 text-[#01411c] border-[#01411c]/30";
  if (s.includes("tribune")) return "bg-red-500/15 text-red-700 border-red-500/30";
  if (s.includes("the news")) return "bg-blue-600/15 text-blue-700 border-blue-600/30";
  if (s.includes("daily times")) return "bg-purple-600/15 text-purple-700 border-purple-600/30";
  return "bg-primary/10 text-primary border-primary/20";
}

function formatSummary(summary?: string | null, title?: string, site?: string): string {
  if (!summary) return `Verified news report on "${title || 'this development'}" reported by ${site || 'national press'}. Read full story.`;
  const clean = summary
    .replace(/<!\[CDATA\[/gi, "")
    .replace(/\]\]>/gi, "")
    .replace(/\]+>/g, "")
    .trim();
  if (clean.length < 15 || clean.includes("]]>") || /^[\s.,;:\-_[\]<>]+$/.test(clean)) {
    return `Verified news report on "${title || 'this development'}" reported by ${site || 'national press'}. Read full story.`;
  }
  return clean;
}

function filterCleanParagraphs(paragraphs: string[]): string[] {
  return paragraphs.filter((p) => {
    if (!p || p.trim().length < 35) return false;
    const lower = p.toLowerCase();
    if (
      lower.includes("document.getelementbyid") ||
      lower.includes("addeventlistener") ||
      lower.includes("classlist.") ||
      lower.includes(".loader") ||
      lower.includes("@keyframes") ||
      lower.includes("-webkit-") ||
      lower.includes("function (") ||
      lower.includes("function()") ||
      lower.includes("display: none") ||
      lower.startsWith("home news") ||
      lower.includes("trending health videos technology") ||
      p.includes("]]>") ||
      p.includes("{") ||
      p.includes("}") ||
      p.includes("/*")
    ) {
      return false;
    }
    return true;
  });
}

function NewsBlogPage() {
  const initialData = Route.useLoaderData();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [fullArticleData, setFullArticleData] = useState<FullArticleData | null>(null);
  const [loadingFullStory, setLoadingFullStory] = useState(false);
  const [fontSizeClass, setFontSizeClass] = useState<"text-base" | "text-lg" | "text-xl">("text-base");
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const articles = initialData.articles;
  const search = Route.useSearch();

  // If a story is requested in the search params (e.g. from the Top Header News Ticker), open it immediately
  useEffect(() => {
    const storyId = search.story;
    if (storyId && articles && articles.length > 0) {
      const target = articles.find((a) => a.id === storyId || a.id.includes(storyId));
      if (target) {
        setSelectedArticle(target);
      }
    }
  }, [search.story, articles]);

  // Load full article content whenever an article is selected in Reader
  useEffect(() => {
    if (!selectedArticle) {
      setFullArticleData(null);
      return;
    }

    let isMounted = true;
    setLoadingFullStory(true);

    getFullArticleContent({ data: selectedArticle.url })
      .then((data) => {
        if (isMounted) {
          if (data && data.paragraphs.length > 0) {
            setFullArticleData(data);
          } else {
            setFullArticleData({
              title: selectedArticle.title,
              published: selectedArticle.published,
              site: selectedArticle.site,
              image: selectedArticle.image,
              paragraphs: [selectedArticle.summary],
              readingTimeMinutes: 1,
            });
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setFullArticleData({
            title: selectedArticle.title,
            published: selectedArticle.published,
            site: selectedArticle.site,
            image: selectedArticle.image,
            paragraphs: [selectedArticle.summary],
            readingTimeMinutes: 1,
          });
        }
      })
      .finally(() => {
        if (isMounted) setLoadingFullStory(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedArticle]);

  // Filter based on active tab and search query
  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      let matchesTab = true;
      if (activeTab === "breaking") {
        matchesTab = item.category === "Breaking News" || item.category === "Legal & Courts";
      } else if (activeTab === "national") {
        matchesTab = item.category === "National";
      } else if (activeTab === "legal") {
        matchesTab = item.category === "Legal & Courts";
      } else if (activeTab === "economy") {
        matchesTab = item.category === "Economy & Trade";
      } else if (activeTab === "tech") {
        matchesTab = item.category === "Citizen & Tech";
      }

      const matchesSearch =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.site.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [articles, activeTab, searchQuery]);

  const featuredArticle = filteredArticles[0] || articles[0];
  const secondaryLeadStories = filteredArticles.slice(1, 4);
  const remainingArticles = filteredArticles.slice(4);

  // Trending Top 5 for Sidebar
  const trendingArticles = useMemo(() => {
    return articles.slice(0, 5);
  }, [articles]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info("Removed from saved bookmarks");
      } else {
        next.add(id);
        toast.success("Story bookmarked!");
      }
      return next;
    });
  };

  const copyArticleLink = (article: NewsArticle, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(article.url);
    toast.success("Link copied to clipboard!");
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Subscribed! You will receive daily breaking news dispatches.");
    setNewsletterEmail("");
  };

  return (
    <div className="min-h-screen bg-bg pb-32">
      {/* Top Live Breaking Ticker */}
      <div className="border-b border-border/80 bg-primary/5 px-4 py-2.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2 overflow-hidden text-primary">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
              <span className="size-2 rounded-full bg-emerald-600 animate-ping" />
              Live Newsroom
            </span>
            <span className="hidden sm:inline text-muted">•</span>
            <span className="truncate font-medium text-fg/80">
              Pakistan National &amp; Breaking Press Feed (DAWN, Express Tribune, The News)
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-3 text-muted">
            <span className="hidden md:inline text-[11px]">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="rounded-md bg-surface px-2 py-0.5 text-[11px] font-mono text-primary border border-border">
              {articles.length} Verified Stories
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8">
        {/* TOP LEADERBOARD AD BANNER (Google AdSense Slot 1) */}
        

        {/* Magazine Masthead & Search */}
        <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary shadow-sm backdrop-blur-md">
              <Newspaper className="size-3.5 text-accent" />
              <span>The Citizen Dispatch • Pakistan News &amp; Legal Gazette</span>
            </div>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl font-black text-primary tracking-tight">
              Pakistan Breaking News &amp; Law
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted leading-relaxed">
              In-depth reporting from verified national correspondents. Read complete articles in-app without leaving the portal.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 size-4 text-muted" />
            <input
              type="text"
              placeholder="Search news, Supreme Court, FBR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border bg-surface pl-10 pr-4 py-2.5 text-xs font-semibold text-fg outline-none focus:border-primary shadow-sm"
            />
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-border/60 pb-4">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-primary text-surface shadow-md scale-105"
                    : "border border-border bg-surface text-muted hover:border-primary/40 hover:text-primary"
                }`}
              >
                <Icon className={`size-3.5 ${isActive ? "text-accent" : "text-muted"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* HERO EDITORIAL FEATURE (Magazine Lead Section) */}
        {featuredArticle && (
          <div className="mt-6 grid gap-6 lg:grid-cols-12 items-stretch">
            {/* Primary Feature Story */}
            <div
              onClick={() => setSelectedArticle(featuredArticle)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-primary/20 bg-surface shadow-lg transition-all duration-300 hover:border-primary hover:shadow-2xl lg:col-span-8 flex flex-col justify-between"
            >
              {featuredArticle.image ? (
                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-primary/10">
                  <img
                    src={featuredArticle.image || getCategoryFallbackImage(featuredArticle.category)}
                    alt={featuredArticle.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = getCategoryFallbackImage(featuredArticle.category);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="rounded-full bg-primary px-3.5 py-1 text-xs font-bold text-accent shadow-md">
                      ★ Top Breaking Story
                    </span>
                    <span className={`font-mono text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-md border shadow-md bg-surface text-primary`}>
                      {featuredArticle.site}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-surface">
                    <span className="text-xs font-bold text-accent">
                      {formatNewsDate(featuredArticle.published)}
                    </span>
                    <h2 className="mt-1 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-surface group-hover:text-accent transition-colors leading-tight">
                      {featuredArticle.title}
                    </h2>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-primary via-primary-light to-primary p-6 sm:p-8 text-surface">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="rounded-full bg-accent px-3 py-0.5 text-xs font-black text-primary uppercase tracking-wider">
                      ★ Top Breaking Story
                    </span>
                    <span className="font-mono text-xs font-bold uppercase px-2.5 py-0.5 rounded-md bg-white/20 text-white">
                      {featuredArticle.site}
                    </span>
                    <span className="text-xs text-accent ml-auto">
                      {formatNewsDate(featuredArticle.published)}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-surface group-hover:text-accent transition-colors leading-tight">
                    {featuredArticle.title}
                  </h2>
                </div>
              )}

              <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-fg/80 leading-relaxed line-clamp-3 font-medium">
                  {formatSummary(featuredArticle.summary, featuredArticle.title, featuredArticle.site)}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/70 text-xs">
                  <span className="text-primary font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Complete Story In-App <ChevronRight className="size-4" />
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(featuredArticle.id, e)}
                      className="p-1.5 rounded-lg hover:bg-bg text-muted hover:text-primary transition-colors"
                      title="Bookmark"
                    >
                      <Bookmark className={`size-4 ${bookmarkedIds.has(featuredArticle.id) ? "fill-primary text-primary" : ""}`} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => copyArticleLink(featuredArticle, e)}
                      className="p-1.5 rounded-lg hover:bg-bg text-muted hover:text-primary transition-colors"
                      title="Share link"
                    >
                      <Share2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Lead Column */}
            <div className="space-y-6 lg:col-span-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
                  <Flame className="size-4 text-red-600" /> Hot Developing News
                </h3>
              </div>

              {secondaryLeadStories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => setSelectedArticle(story)}
                  className="group cursor-pointer rounded-2xl border border-border bg-surface p-4 shadow-sm hover:border-primary hover:shadow-md transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px] text-muted">
                    <span className={`font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${getSiteBadgeColor(story.site)}`}>
                      {story.site}
                    </span>
                    <span>{formatNewsDate(story.published)}</span>
                  </div>

                  <h4 className="font-display text-sm font-bold text-primary group-hover:text-primary-light transition-colors line-clamp-2 leading-snug">
                    {story.title}
                  </h4>

                  <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                    {formatSummary(story.summary, story.title, story.site)}
                  </p>

                  <span className="text-[11px] font-bold text-primary inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform pt-1">
                    Read in-app <ChevronRight className="size-3" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2-COLUMN BLOG GRID: MAIN ARTICLES (8 COLS) + MONETIZED STICKY SIDEBAR (4 COLS) */}
        <div className="mt-14 grid gap-10 lg:grid-cols-12 items-start">
          {/* LEFT 8 COLUMNS: MAIN EDITORIAL FEED WITH NATIVE IN-FEED AD UNITS */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <h2 className="font-display text-2xl font-black text-primary flex items-center gap-2">
                <Newspaper className="size-6 text-primary" /> Latest Journalistic Dispatches
              </h2>
              <span className="text-xs font-mono text-muted">{filteredArticles.length} Stories</span>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="rounded-3xl border border-border bg-surface p-12 text-center">
                <AlertCircle className="mx-auto size-10 text-muted" />
                <h3 className="mt-3 font-display text-lg font-bold text-primary">No articles found</h3>
                <p className="mt-1 text-xs text-muted">
                  Try searching for a different keyword or switch category filters.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Articles Loop with In-Feed AdSlot Insertion every 4 articles */}
                {remainingArticles.map((art, idx) => (
                  <div key={art.id}>
                    <div
                      onClick={() => setSelectedArticle(art)}
                      className="group cursor-pointer rounded-3xl border border-border bg-surface p-6 shadow-sm hover:border-primary hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start"
                    >
                      <div className="h-44 sm:h-36 w-full sm:w-56 shrink-0 overflow-hidden rounded-2xl bg-primary/5">
                        <img
                          src={art.image || getCategoryFallbackImage(art.category)}
                          alt={art.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.src = getCategoryFallbackImage(art.category);
                          }}
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                          <span className={`font-mono text-[11px] font-bold uppercase px-2 py-0.5 rounded-md border ${getSiteBadgeColor(art.site)}`}>
                            {art.site}
                          </span>
                          <span className="text-[11px] font-mono">
                            {formatNewsDate(art.published)}
                          </span>
                        </div>

                        <h3 className="font-display text-xl font-bold text-primary group-hover:text-primary-light transition-colors leading-snug">
                          {art.title}
                        </h3>

                        <p className="text-xs text-muted leading-relaxed line-clamp-3">
                          {formatSummary(art.summary, art.title, art.site)}
                        </p>

                        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                          <span className="text-primary font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Read Full Story <ChevronRight className="size-3.5" />
                          </span>

                          <div className="flex items-center gap-2 text-muted">
                            <button
                              type="button"
                              onClick={(e) => toggleBookmark(art.id, e)}
                              className="p-1 rounded-md hover:bg-bg text-muted hover:text-primary transition-colors"
                              title="Bookmark"
                            >
                              <Bookmark className={`size-3.5 ${bookmarkedIds.has(art.id) ? "fill-primary text-primary" : ""}`} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => copyArticleLink(art, e)}
                              className="p-1 rounded-md hover:bg-bg text-muted hover:text-primary transition-colors"
                              title="Share"
                            >
                              <Share2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT 4 COLUMNS: HIGH-MONETIZATION STICKY SIDEBAR */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-8">
            {/* GOOGLE ADSENSE SIDEBAR DISPLAY AD (300x250) */}
            

            {/* TRENDING & MOST READ HEADLINES */}
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
                  <TrendingUp className="size-4 text-emerald-600" /> Most Read in Pakistan
                </h3>
              </div>

              <div className="space-y-3.5">
                {trendingArticles.map((t, idx) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedArticle(t)}
                    className="group cursor-pointer flex items-start gap-3 border-b border-border/40 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="font-display text-lg font-black text-primary/30 group-hover:text-accent transition-colors">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-display text-xs font-bold text-primary group-hover:text-primary-light transition-colors line-clamp-2 leading-snug">
                        {t.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-muted">
                        <span className="font-semibold">{t.site}</span>
                        <span>•</span>
                        <span>{formatNewsDate(t.published)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BREAKING NEWSLETTER DISPATCH BOX */}
            <div className="rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary via-primary-light to-primary p-6 text-surface shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <div className="grid size-9 place-items-center rounded-xl bg-accent text-primary">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h4 className="font-display text-base font-black text-accent">
                    The Daily Citizen Digest
                  </h4>
                  <p className="text-[11px] text-surface/80">Get daily legal &amp; breaking briefs</p>
                </div>
              </div>

              <p className="text-xs text-surface/90 leading-relaxed font-medium">
                Subscribe to receive verified notifications on constitutional verdicts, NADRA procedures, and national law.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full rounded-xl bg-surface/10 border border-surface/30 px-3.5 py-2.5 text-xs text-surface placeholder:text-surface/60 outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-accent py-2.5 text-xs font-black text-primary hover:bg-accent-hover transition-colors shadow-md"
                >
                  Subscribe for Free Updates →
                </button>
              </form>
            </div>

            {/* VERIFIED PUBLISHER DIRECTORY */}
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm space-y-3">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-muted">
                Official Media Partners
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-primary">
                <div className="rounded-xl border border-border/80 bg-bg p-2.5 text-center">
                  🟢 DAWN News
                </div>
                <div className="rounded-xl border border-border/80 bg-bg p-2.5 text-center">
                  🔴 Express Tribune
                </div>
                <div className="rounded-xl border border-border/80 bg-bg p-2.5 text-center">
                  🔵 The News Int.
                </div>
                <div className="rounded-xl border border-border/80 bg-bg p-2.5 text-center">
                  🟣 Daily Times
                </div>
              </div>
            </div>

            {/* STICKY SKYSCRAPER AD UNIT (300x600) */}
            
          </div>
        </div>

        {/* FULL IN-APP ARTICLE READER MODAL (NO EXTERNAL REDIRECTS) */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-primary/50 backdrop-blur-md animate-in fade-in duration-200">
            <div
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-surface p-6 sm:p-12 shadow-2xl space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Navigation Bar inside Reader */}
              <div className="flex items-center justify-between border-b border-border/80 pb-4 sticky top-0 bg-surface/95 backdrop-blur-md z-20 -mt-2 pt-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className={`font-mono text-xs font-bold uppercase px-2.5 py-1 rounded-md border ${getSiteBadgeColor(selectedArticle.site)}`}>
                    {selectedArticle.site}
                  </span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">
                    {selectedArticle.category}
                  </span>
                  {fullArticleData && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-muted font-medium">
                      <Clock className="size-3" /> {fullArticleData.readingTimeMinutes} min read
                    </span>
                  )}
                </div>

                {/* Reader Controls */}
                <div className="flex items-center gap-2">
                  {/* Font Size Adjuster */}
                  <div className="hidden sm:flex items-center gap-1 rounded-full border border-border bg-bg p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setFontSizeClass("text-base")}
                      className={`px-2 py-0.5 rounded-full font-bold transition-colors ${fontSizeClass === "text-base" ? "bg-primary text-surface" : "text-muted hover:text-primary"}`}
                      title="Normal font size"
                    >
                      A
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSizeClass("text-lg")}
                      className={`px-2 py-0.5 rounded-full font-bold transition-colors ${fontSizeClass === "text-lg" ? "bg-primary text-surface" : "text-muted hover:text-primary"}`}
                      title="Large font size"
                    >
                      A+
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSizeClass("text-xl")}
                      className={`px-2 py-0.5 rounded-full font-bold transition-colors ${fontSizeClass === "text-xl" ? "bg-primary text-surface" : "text-muted hover:text-primary"}`}
                      title="Extra large font size"
                    >
                      A++
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedArticle(null)}
                    className="grid size-9 place-items-center rounded-full border border-border bg-bg text-muted hover:text-primary hover:border-primary transition-all shadow-sm"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* Headline */}
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary leading-tight">
                {selectedArticle.title}
              </h2>

              {/* Byline and Timestamp */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted border-b border-border/60 pb-4">
                <div className="flex items-center gap-2">
                  {fullArticleData?.author && (
                    <>
                      <span className="font-semibold text-fg">{fullArticleData.author}</span>
                      <span>•</span>
                    </>
                  )}
                  <span>{formatNewsDate(selectedArticle.published)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => toggleBookmark(selectedArticle.id, e)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold text-muted hover:text-primary transition-all"
                  >
                    <Bookmark className={`size-3.5 ${bookmarkedIds.has(selectedArticle.id) ? "fill-primary text-primary" : ""}`} />
                    <span>{bookmarkedIds.has(selectedArticle.id) ? "Saved" : "Save"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => copyArticleLink(selectedArticle, e)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold text-muted hover:text-primary transition-all"
                  >
                    <Share2 className="size-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Lead Image */}
              <div className="overflow-hidden rounded-2xl border border-border bg-primary/5 shadow-md">
                <img
                  src={selectedArticle.image || getCategoryFallbackImage(selectedArticle.category)}
                  alt={selectedArticle.title}
                  className="w-full max-h-[380px] object-cover"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = getCategoryFallbackImage(selectedArticle.category);
                  }}
                />
                <div className="p-2.5 bg-bg/80 text-[11px] text-muted text-center font-medium">
                  Editorial Photo • Verified Dispatch from {selectedArticle.site}
                </div>
              </div>

              {/* IN-ARTICLE GOOGLE ADSENSE MONETIZATION SLOT */}
              

              {/* FULL MULTI-PARAGRAPH ARTICLE CONTENT BODY */}
              <div className="space-y-5 pt-2">
                {loadingFullStory ? (
                  <div className="py-12 text-center space-y-3">
                    <Loader2 className="mx-auto size-8 text-primary animate-spin" />
                    <p className="font-display text-sm font-bold text-primary">
                      Fetching complete story from {selectedArticle.site}...
                    </p>
                    <p className="text-xs text-muted">Formatting clean in-app reading experience</p>
                  </div>
                ) : (
                  <div className={`space-y-4 leading-relaxed text-fg/90 font-medium ${fontSizeClass}`}>
                    {fullArticleData && filterCleanParagraphs(fullArticleData.paragraphs).length > 0 ? (
                      filterCleanParagraphs(fullArticleData.paragraphs).map((p, idx) => (
                        <p
                          key={idx}
                          className={`${
                            idx === 0
                              ? "font-semibold text-fg first-letter:float-left first-letter:text-4xl first-letter:pr-2 first-letter:font-bold first-letter:text-primary"
                              : ""
                          }`}
                        >
                          {p}
                        </p>
                      ))
                    ) : (
                      <p>{filterCleanParagraphs([selectedArticle.summary])[0] || selectedArticle.summary}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Article Footer & Official Credit */}
              <div className="mt-8 rounded-2xl border border-border/80 bg-bg/70 p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-primary uppercase text-[10px] tracking-wider block">
                      Editorial Source Attribution:
                    </span>
                    <p className="text-muted">
                      Published and reported by <strong>{selectedArticle.site}</strong>. Displayed on 47 Say Ab Tak for citizen legal awareness.
                    </p>
                  </div>

                  <a
                    href={selectedArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-surface px-4 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-surface transition-all shadow-xs"
                  >
                    Original Source Link <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
