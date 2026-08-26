import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  Fingerprint,
  History,
  Info,
  Landmark,
  Search,
  ShieldCheck,
  Sparkles,
  Flame,
  Newspaper,
  Compass,
  Zap,
  Bookmark,
  Share2,
  X,
  Loader2,
  FileSignature,
  CreditCard,
  Car,
  MapPin,
} from "lucide-react";
import { useState, useEffect } from "react";
import { DailyWeatherBar } from "@/components/daily-weather-bar";
import { CategoryIcon } from "@/components/icons";
import { AdUnit } from "@/components/ads/ad-unit";
import { listCategories, listGuides } from "@/lib/content";
import { getAggregatedNews } from "@/lib/news/get-news";
import { NewsArticle, getCategoryFallbackImage } from "@/lib/news/news-helpers";
import { getFullArticleContent, FullArticleData } from "@/lib/news/get-full-article";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [categories, guides, newsResult] = await Promise.all([
      listCategories(),
      listGuides(),
      getAggregatedNews({ data: "all" }),
    ]);
    return {
      categories,
      guides,
      liveNews: Array.isArray(newsResult?.articles) ? newsResult.articles : [],
    };
  },
  component: Home,
});

function formatNewsDate(dateStr?: string | null): string {
  if (!dateStr) return "Just now";
  try {
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return dateStr;
    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Today";
  }
}

function getSiteBadgeColor(site: string) {
  const s = site.toLowerCase();
  if (s.includes("dawn")) return "text-[#01411c] font-black";
  if (s.includes("tribune")) return "text-red-700 font-black";
  if (s.includes("the news")) return "text-blue-700 font-black";
  return "text-primary font-black";
}

function formatArticleSummary(summary?: string | null, title?: string, site?: string): string {
  if (!summary) return `Verified editorial dispatch on "${title || 'this development'}" reported by ${site || 'national press'}.`;
  const clean = summary
    .replace(/<!\[CDATA\[/gi, "")
    .replace(/\]\]>/gi, "")
    .replace(/\]+>/g, "")
    .trim();
  if (clean.length < 15 || clean.includes("]]>") || /^[\s.,;:\-_[\]<>]+$/.test(clean)) {
    return `Verified editorial dispatch on "${title || 'this development'}" reported by ${site || 'national press'}.`;
  }
  return clean;
}

function Home() {
  const data = Route.useLoaderData();
  const categories = Array.isArray(data?.categories) ? data.categories : [];
  const liveNews = Array.isArray(data?.liveNews) ? data.liveNews : [];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [fullArticleData, setFullArticleData] = useState<FullArticleData | null>(null);
  const [loadingFullStory, setLoadingFullStory] = useState(false);
  const navigate = useNavigate();

  // Load full article content when selected
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
              author: undefined,
              published: selectedArticle.published,
              site: selectedArticle.site,
              image: selectedArticle.image,
              paragraphs: [formatArticleSummary(selectedArticle.summary, selectedArticle.title, selectedArticle.site)],
              readingTimeMinutes: 1,
            });
          }
          setLoadingFullStory(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setFullArticleData({
            title: selectedArticle.title,
            author: undefined,
            published: selectedArticle.published,
            site: selectedArticle.site,
            image: selectedArticle.image,
            paragraphs: [formatArticleSummary(selectedArticle.summary, selectedArticle.title, selectedArticle.site)],
            readingTimeMinutes: 1,
          });
          setLoadingFullStory(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedArticle]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/guides" });
    }
  };

  const breakingNewsList = liveNews.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7f4] dark:bg-bg text-fg">
      {/* 🌦️ 1. SLEEK TOP SMART BAR (WEATHER + DATE + LIVE ECONOMIC TICKER IN ONE ROW) */}
      <DailyWeatherBar />

      {/* 🏛️ 2. MAIN DASHBOARD CONTENT (EXACT MATCH TO DAILY CITIZEN HUB CONCEPT) */}
      <main className="mx-auto max-w-7xl w-full px-4 py-6 sm:py-8 space-y-8 flex-1">
        {/* TOP SEARCH INTEGRATION */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-primary tracking-tight">
              47 Say Ab Tak: Daily Citizen Hub
            </h1>
            <p className="text-xs sm:text-sm text-muted font-medium">
              Daily government verification, live news, civic tools, and 79-year historical archives.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="w-full sm:w-auto sm:min-w-[340px]">
            <div className="relative flex items-center rounded-xl border border-primary/30 bg-surface shadow-xs hover:border-primary transition-all p-1">
              <Search className="size-4 text-primary ml-2.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search CNIC, Fard, Passport, DLIMS..."
                className="w-full bg-transparent px-2.5 py-1 text-xs text-fg outline-none placeholder:text-muted/70 font-medium"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-surface hover:bg-primary-light transition-all shadow-xs"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* 🌟 2-COLUMN MAIN DASHBOARD DECK (MATCHING CONCEPT CARD LAYOUT) */}
        <div className="grid gap-6 lg:grid-cols-12 items-stretch">
          {/* LEFT 7 COLUMNS: TOP BREAKING NEWS CARD */}
          <div className="lg:col-span-7 rounded-3xl border border-border/90 bg-surface p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <h2 className="font-display text-xl font-black text-primary flex items-center gap-2">
                  <Flame className="size-5 text-red-600 animate-pulse" /> Top Breaking News
                </h2>
                <Link
                  to="/news"
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  All News <ChevronRight className="size-3.5" />
                </Link>
              </div>

              {/* News Articles List */}
              <div className="divide-y divide-border/60">
                {breakingNewsList.length === 0 ? (
                  <p className="py-6 text-center text-xs text-muted">Loading live breaking news...</p>
                ) : (
                  breakingNewsList.map((story) => (
                    <div
                      key={story.id}
                      onClick={() => setSelectedArticle(story)}
                      className="group cursor-pointer py-3.5 first:pt-1 last:pb-1 space-y-1.5 hover:bg-bg/50 rounded-xl px-2.5 -mx-2.5 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`font-display uppercase tracking-wider text-xs ${getSiteBadgeColor(story.site)}`}>
                          {story.site.replace(" Pakistan", "")}
                        </span>
                        <span className="text-[10px] text-muted font-mono">
                          {formatNewsDate(story.published)}
                        </span>
                      </div>

                      <h3 className="font-display text-sm font-bold text-fg group-hover:text-primary transition-colors leading-snug">
                        {story.title}
                      </h3>

                      <p className="text-xs text-muted line-clamp-2 leading-relaxed font-normal">
                        {formatArticleSummary(story.summary, story.title, story.site)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Controls / Pagination Dot styling */}
            <div className="pt-4 mt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                <span className="font-medium text-[11px]">Live Editorial Wire</span>
              </div>
              <Link to="/news" className="text-primary font-bold text-xs hover:underline">
                Read Full Wire →
              </Link>
            </div>
          </div>

          {/* RIGHT 5 COLUMNS: STACKED 1-TAP QUICK TOOLS + TODAY IN PAKISTAN HISTORY CARD */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            {/* 1-TAP DAILY CITIZEN QUICK TOOLS CARD */}
            <div className="rounded-3xl border border-border/90 bg-surface p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <h2 className="font-display text-lg font-black text-primary flex items-center gap-2">
                  <Zap className="size-4.5 text-accent" /> 1-Tap Daily Citizen Quick Tools
                </h2>
                <Link to="/tools" className="text-xs font-bold text-primary hover:underline">
                  More Tools
                </Link>
              </div>

              {/* 2x2 Grid of Quick Citizen Action Tiles */}
              <div className="grid grid-cols-2 gap-3">
                {/* 1. Affidavit Drafter */}
                <Link
                  to="/tools"
                  className="group flex items-center gap-3 rounded-2xl border border-primary/20 bg-[#eef7f0] dark:bg-primary/10 p-3.5 hover:border-primary hover:bg-primary/20 transition-all shadow-2xs"
                >
                  <div className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary group-hover:scale-105 transition-transform shrink-0">
                    <FileSignature className="size-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-xs font-bold text-primary truncate">
                      Affidavit drafter
                    </div>
                    <div className="text-[10px] text-muted truncate">e-Stamp Paper</div>
                  </div>
                </Link>

                {/* 2. Pak-ID & CNIC */}
                <Link
                  to="/guides/$slug"
                  params={{ slug: "cnic" }}
                  className="group flex items-center gap-3 rounded-2xl border border-primary/20 bg-[#eef7f0] dark:bg-primary/10 p-3.5 hover:border-primary hover:bg-primary/20 transition-all shadow-2xs"
                >
                  <div className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary group-hover:scale-105 transition-transform shrink-0">
                    <Fingerprint className="size-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-xs font-bold text-primary truncate">
                      Pak-ID
                    </div>
                    <div className="text-[10px] text-muted truncate">CNIC & FRC</div>
                  </div>
                </Link>

                {/* 3. DLIMS License */}
                <Link
                  to="/guides/$slug"
                  params={{ slug: "driving-license" }}
                  className="group flex items-center gap-3 rounded-2xl border border-primary/20 bg-[#eef7f0] dark:bg-primary/10 p-3.5 hover:border-primary hover:bg-primary/20 transition-all shadow-2xs"
                >
                  <div className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary group-hover:scale-105 transition-transform shrink-0">
                    <Car className="size-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-xs font-bold text-primary truncate">
                      DLIMS license
                    </div>
                    <div className="text-[10px] text-muted truncate">Driving Verification</div>
                  </div>
                </Link>

                {/* 4. Land Fard */}
                <Link
                  to="/guides/$slug"
                  params={{ slug: "land-mutation" }}
                  className="group flex items-center gap-3 rounded-2xl border border-primary/20 bg-[#eef7f0] dark:bg-primary/10 p-3.5 hover:border-primary hover:bg-primary/20 transition-all shadow-2xs"
                >
                  <div className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary group-hover:scale-105 transition-transform shrink-0">
                    <Landmark className="size-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-xs font-bold text-primary truncate">
                      Land Fard
                    </div>
                    <div className="text-[10px] text-muted truncate">PLRA Records</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* TODAY IN PAKISTAN HISTORY (1947 TO 2026) CARD (DARK EMERALD LUXURY THEME) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#063318] via-[#0b4723] to-[#042411] p-6 text-surface shadow-md space-y-4 border border-emerald-800/40">
              <div className="space-y-1.5 relative z-10">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-bold text-accent">
                  <History className="size-3 text-accent" /> 1947 → 2026
                </div>
                <h3 className="font-display text-lg font-black text-surface">
                  Today in Pakistan History (1947 to 2026)
                </h3>
                <p className="text-xs text-surface/80 leading-relaxed font-medium">
                  Evolution spotlight of accomplished historical moments, document transitions, and legislative milestones.
                </p>
              </div>

              <div className="pt-2 relative z-10">
                <Link
                  to="/timeline"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#c99f2b] px-5 py-3 text-xs font-black text-[#1a281e] shadow-lg hover:brightness-110 transition-all duration-200"
                >
                  <span>Explore Full 79-Yr History Timeline</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              {/* Decorative Subtle Geometry */}
              <div className="absolute -right-8 -bottom-8 size-36 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 📚 3. COMPLETE CIVIC DATABASE CATEGORY TILES */}
        <section className="pt-4 border-t border-border/70 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-black text-primary flex items-center gap-2">
              <ShieldCheck className="size-5 text-accent" /> Complete Civic Database
            </h2>
            <Link to="/guides" className="text-xs font-bold text-primary hover:underline">
              View All 50+ Guides →
            </Link>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to="/categories/$slug"
                params={{ slug: cat.slug }}
                className="group rounded-2xl border border-border bg-surface p-4 shadow-2xs hover:border-primary hover:shadow-md transition-all flex flex-col justify-between space-y-2"
              >
                <div className="space-y-1.5">
                  <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-surface transition-colors">
                    <CategoryIcon name={cat.icon || "file-text"} className="size-4" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-primary group-hover:text-primary-light transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-muted line-clamp-2">{cat.description}</p>
                </div>
                <div className="text-[11px] font-bold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-2 border-t border-border/50">
                  <span>View Guides</span> <ChevronRight className="size-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* 📖 IN-APP STORY READER MODAL (WHEN A NEWS ARTICLE IS CLICKED) */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <span className={`font-mono text-xs font-bold uppercase px-2.5 py-1 rounded-md border bg-primary/10 text-primary`}>
                  {selectedArticle.site}
                </span>
                <span className="text-xs text-muted font-mono">{formatNewsDate(selectedArticle.published)}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="grid size-8 place-items-center rounded-full border border-border bg-bg text-muted hover:text-primary transition-all"
              >
                <X className="size-4" />
              </button>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary leading-tight">
              {selectedArticle.title}
            </h2>

            {selectedArticle.image && (
              <div className="overflow-hidden rounded-2xl border border-border shadow-md">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full max-h-80 object-cover"
                />
              </div>
            )}

            <div className="space-y-4 text-fg/90 text-sm leading-relaxed font-medium">
              {loadingFullStory ? (
                <div className="py-8 text-center space-y-2">
                  <Loader2 className="mx-auto size-6 text-primary animate-spin" />
                  <p className="text-xs font-bold text-primary">Fetching complete dispatch...</p>
                </div>
              ) : (
                fullArticleData?.paragraphs.map((p, idx) => (
                  <p key={idx} className={idx === 0 ? "font-semibold text-fg" : ""}>
                    {p}
                  </p>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted font-medium">
                Reported by <strong>{selectedArticle.site}</strong>
              </span>
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                Original Source <ExternalLink className="size-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
