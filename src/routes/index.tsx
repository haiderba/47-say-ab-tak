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
import { DailyCitizenIndices } from "@/components/daily-citizen-indices";
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

const ERA_TIMELINE = [
  {
    id: "1947",
    year: "1947",
    badge: "Partition & Colonial Bastas",
    title: "The Manual Paper Era",
    subtitle: "Handwritten Roznamchas, Patwari ledgers, and physical thumbprints.",
    image: "/eras/era-1947.jpg",
    description:
      "Following independence in 1947, Pakistan's administrative and civil records continued British-era paper registers. Land records relied entirely on the Patwari's basta, identity was proven through manual affidavits and local witnesses, and succession required long civil court trials.",
    highlight: "100% paper registers · Months for verification · Vulnerability to loss",
    documents: [
      { name: "Land Records", oldWay: "Handwritten Shajra & Register Haqdaran", modernWay: "PLRA Computerized Fard (Instant QR code)" },
      { name: "Citizen Identity", oldWay: "Manual local paper certificates & affidavits", modernWay: "Smart CNIC with chip & biometric verification" },
      { name: "Inheritance", oldWay: "Lengthy civil court heirship trials", modernWay: "NADRA 15-day digital Succession Certificate" },
    ],
  },
  {
    id: "1965",
    year: "1965",
    badge: "National Archival System",
    title: "Centralized Physical Documentation",
    subtitle: "Archival record centers and manual citizen verification passes.",
    image: "/eras/era-1965.jpg",
    description:
      "The state established national archival registries and municipal birth/death offices. Citizens relied on local gazettes, magistrate attestations, and regional identity passes.",
    highlight: "Municipal registers · Physical gazette attestations · District record branches",
    documents: [
      { name: "Civil Status", oldWay: "Unlinked municipal paper slips", modernWay: "Integrated Union Council CRMS online system" },
      { name: "Passports", oldWay: "Handwritten booklet issued manually", modernWay: "Machine Readable (MRP) & e-Passports" },
      { name: "Vehicle Records", oldWay: "Paper book registration files", modernWay: "Smart Card with Excise online tax portal" },
    ],
  },
  {
    id: "1973",
    year: "1973",
    badge: "First National ID System",
    title: "Constitutional Citizen Registry",
    subtitle: "Establishment of the Directorate General of Registration.",
    image: "/eras/era-1973.jpg",
    description:
      "Under the 1973 Constitution, Pakistan established the national registration system. Paper identity booklets with glued passport photos were issued nationwide for the first time.",
    highlight: "Paper booklet IDs · First centralized national numbering · Manual regional branches",
    documents: [
      { name: "National ID", oldWay: "Manual laminated paper card with ink stamp", modernWay: "Multi-biometric Smart Card with digital chip" },
      { name: "Family Trees", oldWay: "Manual affidavits and witness testimony", modernWay: "Digital Family Registration Certificate (FRC)" },
      { name: "Verification", oldWay: "Physical 17th-grade officer attestation", modernWay: "Instant biometric thumbprint & facial match" },
    ],
  },
  {
    id: "1990",
    year: "1990",
    badge: "Early Computerization",
    title: "Electromechanical Databases",
    subtitle: "Early computer mainframes at provincial registries.",
    image: "/eras/era-1990.jpg",
    description:
      "Transition from purely paper registers to early database indexing. Floppy disks and local server clusters started recording birth records and vehicle databases.",
    highlight: "First computerized regional indices · Automated driving ledger tests",
    documents: [
      { name: "Driving License", oldWay: "Paper booklet license with manual stamps", modernWay: "DLIMS smart license with national tracking" },
      { name: "Tax Challans", oldWay: "Standing in National Bank queues with 4-part challan", modernWay: "e-Pay 1-bill digital payment in 5 seconds" },
      { name: "Lost Documents", oldWay: "Newspaper ad + police report + manual redraw", modernWay: "Online reprint token via Pak-ID portal" },
    ],
  },
  {
    id: "2000",
    year: "2000",
    badge: "The NADRA Revolution",
    title: "Centralized Digital Biometrics",
    subtitle: "NADRA Ordinance 2000 transforms citizen verification.",
    image: "/eras/era-2000.jpg",
    description:
      "The establishment of NADRA replaced fragmented paper cards with Computerized National Identity Cards (CNIC). Automated Fingerprint Identification Systems (AFIS) revolutionized citizen verification.",
    highlight: "First Computerized CNIC · Central AFIS fingerprint database · Elimination of duplicate IDs",
    documents: [
      { name: "Identity Card", oldWay: "Laminated card without digital verification", modernWay: "CNIC with encrypted 13-digit national barcode" },
      { name: "Voter List", oldWay: "Manual paper voter rolls prone to ghost names", modernWay: "Biometric linked electoral database" },
      { name: "Banking Verification", oldWay: "Manual paper photocopy filing", modernWay: "Real-time NADRA e-Sahulat thumbprint match" },
    ],
  },
  {
    id: "2010",
    year: "2010",
    badge: "Automation & Land Digitization",
    title: "Smart Cards & Arazi Centers",
    subtitle: "Punjab Land Records Authority (PLRA) & DLIMS modernize state counters.",
    image: "/eras/era-2010.jpg",
    description:
      "Punjab computerized millions of rural land records through Arazi Record Centers (ARCs), stripping the monopoly of the Patwari. Traffic police deployed DLIMS for computerized driving licenses.",
    highlight: "PLRA Arazi Centers · DLIMS computerized driving system · Smart Chip CNIC",
    documents: [
      { name: "Land Mutation (Intiqal)", oldWay: "Manual Patwari endorsement taking months", modernWay: "Biometric Arazi center entry in 30 mins" },
      { name: "Driving License", oldWay: "Paper booklet license requiring multiple visits", modernWay: "DLIMS card with computerized driving test" },
      { name: "Vehicle Transfer", oldWay: "Open transfer letters prone to fraud", modernWay: "Biometric buyer-seller transfer at Excise" },
    ],
  },
  {
    id: "2026",
    year: "2026",
    badge: "Modern Citizen Cloud",
    title: "Digital Portals, e-Pay & 24/7 Mega Centers",
    subtitle: "From days of standing in lines to transparent, smartphone-first guidance.",
    image: "/eras/era-2026.jpg",
    description:
      "Today, Pak-ID mobile apps capture biometrics on smartphones, e-Pay enables online tax and fee payments, and NADRA Mega Centers operate 24/7. 47 Say Ab Tak brings complete legal clarity so you know exact documents, fees, and pitfalls before stepping out.",
    highlight: "24/7 Mega Centers · e-Pay digital fee challans · Mobile smartphone biometrics",
    documents: [
      { name: "Succession (Movable)", oldWay: "1–3 years in civil court litigation", modernWay: "15-day NADRA Succession with public notice" },
      { name: "Attestation Chain", oldWay: "Opaque manual office-hopping", modernWay: "IBCC → HEC → MOFA transparent pipeline" },
      { name: "Checklists & Rules", oldWay: "Relying on touts (agents) charging fees", modernWay: "47 Say Ab Tak free step-by-step checklists" },
    ],
  },
];

const DAILY_QUICK_SERVICES = [
  {
    id: "affidavit",
    title: "Affidavit & Undertaking Drafter",
    urdu: "قانونی بیان حلفی / ای اسٹامپ",
    category: "Legal & Stamped Paper",
    time: "Instant 1-Click",
    desc: "Draft official non-judicial e-Stamp papers with Challan 32-A preview and legal declarations.",
    link: "/tools",
    icon: FileSignature,
    badge: "E-Stamp Paper",
  },
  {
    id: "cnic-track",
    title: "NADRA Pak-ID & CNIC",
    urdu: "شناختی کارڈ اور فیملی سرٹیفکیٹ",
    category: "NADRA Services",
    time: "Same day to 15 days",
    desc: "Track token, Smart CNIC renewal, Family Registration Certificate (FRC) & 15-day Succession.",
    link: "/guides/cnic",
    icon: Fingerprint,
    badge: "Biometric Portal",
  },
  {
    id: "dlims",
    title: "DLIMS Driving License Check",
    urdu: "ڈرائیونگ لائسنس تصدیق",
    category: "Traffic Police",
    time: "Instant Online",
    desc: "Verify Pakistani computerized driving license, renew learner permits, and practice road signs.",
    link: "/guides/driving-license",
    icon: Car,
    badge: "DLIMS Punjab",
  },
  {
    id: "plra-fard",
    title: "PLRA Land Records & Fard",
    urdu: "اراضی ریکارڈ / فرد ملکیت",
    category: "Land & Property",
    time: "Instant QR Fard",
    desc: "Check online land registry, download digital QR Fard, and verify Intiqal (mutation) records.",
    link: "/guides/land-mutation",
    icon: Landmark,
    badge: "PLRA Portal",
  },
  {
    id: "epay",
    title: "e-Pay Punjab Digital Challan",
    urdu: "ای پے پنجاب آن لائن فیس",
    category: "Govt Payments",
    time: "Instant 1-Bill",
    desc: "Generate 1-Bill PSID numbers for token tax, property tax, driving test fees, and court fees.",
    link: "/tools",
    icon: CreditCard,
    badge: "e-Pay 1-Bill",
  },
  {
    id: "passport",
    title: "DGIP Passport Issuance & Fees",
    urdu: "پاسپورٹ اجرا و آن لائن تجدید",
    category: "DGIP Passports",
    time: "4 to 14 days",
    desc: "Official fee calculator for 36/72/100-page Ordinary, Urgent, and Fast-Track e-Passports.",
    link: "/guides/passport",
    icon: FileText,
    badge: "Online DGIP",
  },
];

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
  if (s.includes("dawn")) return "bg-[#01411c]/15 text-[#01411c] border-[#01411c]/30";
  if (s.includes("tribune")) return "bg-red-500/15 text-red-700 border-red-500/30";
  if (s.includes("the news")) return "bg-blue-600/15 text-blue-700 border-blue-600/30";
  return "bg-primary/10 text-primary border-primary/20";
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

function Home() {
  const data = Route.useLoaderData();
  const categories = Array.isArray(data?.categories) ? data.categories : [];
  const guides = Array.isArray(data?.guides) ? data.guides : [];
  const liveNews = Array.isArray(data?.liveNews) ? data.liveNews : [];

  const [activeEra, setActiveEra] = useState("2026");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [fullArticleData, setFullArticleData] = useState<FullArticleData | null>(null);
  const [loadingFullStory, setLoadingFullStory] = useState(false);
  const navigate = useNavigate();

  const currentEra = ERA_TIMELINE.find((e) => e.id === activeEra) || ERA_TIMELINE[6];

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

  const topLeadArticle = liveNews[0];
  const hotDevelopingStories = liveNews.slice(1, 4);

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* 🌦️ 1. DAILY SMART PAKISTANI CITIZEN BAR (LIVE GPS WEATHER & DUAL HIJRI/GREGORIAN DATES) */}
      <DailyWeatherBar />

      {/* ⛽ 2. DAILY CITIZEN RATES & 24/7 EMERGENCY HELPLINES TICKER */}
      <DailyCitizenIndices />

      {/* 🌟 3. MAIN DAILY HERO & SEARCH HUB */}
      <section className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-surface via-bg to-surface py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary shadow-xs">
              <Sparkles className="size-3.5 text-accent" />
              <span>Pakistan Citizen Legal & Digital Command Center</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-primary leading-tight">
              47 Say Ab Tak: Daily Citizen Hub
            </h1>
            <p className="font-serif text-lg sm:text-xl text-accent font-bold">
              پاکستان کے تمام سرکاری قواعد، تصدیق، اور روزمرہ سہولیات کی شفاف رہنمائی
            </p>
            <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto">
              Clear document checklists, live weather, verified daily news, legal drafting tools, and 79-year documentation archives.
            </p>

            {/* Instant Citizen Guide Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mt-6 mx-auto max-w-xl">
              <div className="relative flex items-center rounded-2xl border-2 border-primary/30 bg-surface shadow-xl hover:border-primary transition-all p-1.5">
                <Search className="size-5 text-primary ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 50+ guides (e.g. Smart CNIC, Fard, Succession, Passport, DLIMS)..."
                  className="w-full bg-transparent px-3 py-2 text-sm text-fg outline-none placeholder:text-muted/70 font-medium"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-surface hover:bg-primary-light transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>Search</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ⚡ 4. DAILY CITIZEN ESSENTIAL QUICK TOOLS (EVERYDAY PUBLIC UTILITIES) */}
      <section className="py-12 bg-surface/50 border-b border-border/70">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
                <Zap className="size-3.5" /> Everyday Public Utilities
              </div>
              <h2 className="font-display text-2xl font-black text-primary">
                1-Tap Daily Citizen Quick Tools
              </h2>
            </div>
            <Link
              to="/tools"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline self-start sm:self-auto"
            >
              Open All 8 Citizen Drafters & Tools <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DAILY_QUICK_SERVICES.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  to={tool.link}
                  className="group rounded-2xl border border-border bg-surface p-5 shadow-xs hover:border-primary hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-surface transition-colors shadow-2xs">
                        <Icon className="size-5" />
                      </div>
                      <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold text-warn-fg border border-accent/20">
                        {tool.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-base font-bold text-primary group-hover:text-primary-light transition-colors">
                        {tool.title}
                      </h3>
                      <p className="font-serif text-xs text-accent font-semibold">{tool.urdu}</p>
                    </div>

                    <p className="text-xs text-muted leading-relaxed line-clamp-2">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary">
                    <span className="text-[11px] text-muted font-mono">{tool.time}</span>
                    <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Open Tool <ChevronRight className="size-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 📰 5. TODAY'S TOP BREAKING NATIONAL NEWS (LIVE RSS FROM VERIFIED PRESS) */}
      <section className="py-12 bg-bg border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600">
                <Flame className="size-3.5 animate-pulse" /> Live Editorial Wire
              </div>
              <h2 className="font-display text-2xl font-black text-primary flex items-center gap-2">
                <Newspaper className="size-6 text-primary" /> Today's Top National & Civic News
              </h2>
            </div>
            <Link
              to="/news"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline self-start sm:self-auto"
            >
              Browse Complete News Feed <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {liveNews.length > 0 && (
            <div className="mt-6 grid gap-6 lg:grid-cols-12 items-start">
              {/* Lead Article Card (7 Cols) */}
              {topLeadArticle && (
                <div
                  onClick={() => setSelectedArticle(topLeadArticle)}
                  className="group cursor-pointer rounded-3xl border border-border bg-surface overflow-hidden shadow-sm hover:border-primary hover:shadow-xl transition-all duration-300 lg:col-span-7 flex flex-col justify-between"
                >
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-primary/5">
                    <img
                      src={topLeadArticle.image || getCategoryFallbackImage(topLeadArticle.category)}
                      alt={topLeadArticle.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = getCategoryFallbackImage(topLeadArticle.category);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-surface space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border backdrop-blur-md ${getSiteBadgeColor(topLeadArticle.site)}`}>
                          {topLeadArticle.site}
                        </span>
                        <span className="text-[11px] text-surface/80 font-mono">
                          {formatNewsDate(topLeadArticle.published)}
                        </span>
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-extrabold text-surface leading-snug group-hover:text-accent transition-colors">
                        {topLeadArticle.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs sm:text-sm text-muted leading-relaxed line-clamp-3">
                      {formatArticleSummary(topLeadArticle.summary, topLeadArticle.title, topLeadArticle.site)}
                    </p>
                    <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-bold text-primary">
                      <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Story In-App <ChevronRight className="size-3.5" />
                      </span>
                      <span className="text-muted text-[11px] font-normal">Verified Legal Dispatch</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Hot Developing Stories Column (5 Cols) */}
              <div className="space-y-3.5 lg:col-span-5">
                {hotDevelopingStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => setSelectedArticle(story)}
                    className="group cursor-pointer rounded-2xl border border-border bg-surface p-4 shadow-xs hover:border-primary hover:shadow-md transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] text-muted">
                      <span className={`font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${getSiteBadgeColor(story.site)}`}>
                        {story.site}
                      </span>
                      <span className="font-mono text-[10px]">{formatNewsDate(story.published)}</span>
                    </div>

                    <h4 className="font-display text-sm font-bold text-primary group-hover:text-primary-light transition-colors line-clamp-2 leading-snug">
                      {story.title}
                    </h4>

                    <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                      {formatArticleSummary(story.summary, story.title, story.site)}
                    </p>

                    <span className="text-[11px] font-bold text-primary inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform pt-1">
                      Read in-app <ChevronRight className="size-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 🏛️ 6. "TODAY IN PAKISTAN HISTORY (1947 → 2026)" SPOTLIGHT & EVOLUTION CARD */}
      <section className="py-14 bg-surface border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <History className="size-3.5 text-accent" /> 79-Year Evolution Spotlight
            </div>
            <h2 className="mt-2 font-display text-3xl font-black text-primary sm:text-4xl">
              1947 → 2026: How Documentation Evolved
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              Tap any floating year below to inspect the transformation, or visit the dedicated history archive.
            </p>
          </div>

          {/* Interactive Floating Year Capsules */}
          <div className="mt-8 flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {ERA_TIMELINE.map((era) => (
              <button
                key={era.id}
                type="button"
                onClick={() => setActiveEra(era.id)}
                className={`flex items-center gap-1.5 shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all shadow-xs ${
                  activeEra === era.id
                    ? "bg-primary text-surface ring-2 ring-primary ring-offset-2 shadow-md scale-105"
                    : "border border-border bg-bg text-muted hover:border-primary hover:text-primary"
                }`}
              >
                <span>{era.year}</span>
                <span className="hidden md:inline text-[10px] opacity-80">({era.badge.split(" ")[0]})</span>
              </button>
            ))}
          </div>

          {/* Active Era Transformation Card */}
          <div className="mt-6 rounded-3xl border border-border bg-gradient-to-br from-bg via-surface to-bg p-6 shadow-card md:p-8">
            <div className="grid gap-6 lg:grid-cols-12 items-center">
              {/* Archival Visual Frame */}
              <div className="lg:col-span-5 overflow-hidden rounded-2xl border border-border shadow-md bg-primary/5 aspect-video sm:aspect-4/3 relative">
                <img
                  src={currentEra.image}
                  alt={currentEra.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-surface">
                  <span className="rounded-md bg-accent/90 px-2 py-0.5 text-[10px] font-black text-primary uppercase">
                    Era {currentEra.year} Frame
                  </span>
                  <div className="font-display text-sm font-bold mt-1 text-surface">{currentEra.title}</div>
                </div>
              </div>

              {/* Era Details & Then vs Now Comparison */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <span className="inline-block rounded-full bg-accent/20 px-3 py-0.5 text-xs font-bold text-warn-fg">
                    {currentEra.badge}
                  </span>
                  <h3 className="mt-1.5 font-display text-2xl font-black text-primary">
                    {currentEra.title}
                  </h3>
                  <p className="text-xs font-semibold text-accent">{currentEra.subtitle}</p>
                  <p className="mt-2 text-xs sm:text-sm text-fg/80 leading-relaxed">
                    {currentEra.description}
                  </p>
                </div>

                {/* Side-by-side Then vs Now */}
                <div className="space-y-2 pt-2 border-t border-border/70">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <FileCheck className="size-4 text-accent" /> What Improved (کیا بہتری آئی):
                  </span>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {currentEra.documents.map((doc, idx) => (
                      <div key={idx} className="rounded-xl border border-border bg-surface p-2.5 shadow-2xs text-[11px] space-y-1">
                        <div className="font-bold text-primary">{doc.name}</div>
                        <div className="text-danger bg-red-50/80 dark:bg-red-950/40 p-1 rounded">
                          <span className="font-bold uppercase text-[9px]">Then:</span> {doc.oldWay}
                        </div>
                        <div className="text-primary bg-emerald-50/80 dark:bg-emerald-950/40 p-1 rounded font-medium">
                          <span className="font-bold uppercase text-[9px]">Now:</span> {doc.modernWay}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to Action Button to Dedicated History Page */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-muted font-medium">
                    ⚡ {currentEra.highlight}
                  </div>
                  <Link
                    to="/timeline"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-surface hover:bg-primary-light transition-all shadow-md"
                  >
                    <span>🏛️ Open Full 79-Year Interactive History Timeline</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📚 7. MOST REQUESTED PROCEDURAL GUIDES (CATEGORIES) */}
      <section className="py-14 bg-bg">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <ShieldCheck className="size-3.5 text-accent" /> Complete Civic Database
              </div>
              <h2 className="font-display text-2xl font-black text-primary">
                Explore Legal & Citizen Procedures
              </h2>
            </div>
            <Link
              to="/guides"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              Browse All 50+ Guides <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to="/categories/$slug"
                params={{ slug: cat.slug }}
                className="group rounded-2xl border border-border bg-surface p-5 shadow-xs hover:border-primary hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-surface transition-colors">
                    <CategoryIcon name={cat.icon || "file-text"} className="size-5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-primary group-hover:text-primary-light transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted line-clamp-2">{cat.description}</p>
                </div>
                <div className="text-xs font-bold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-2 border-t border-border/60">
                  <span>View Guides</span> <ChevronRight className="size-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
                <span className={`font-mono text-xs font-bold uppercase px-2.5 py-1 rounded-md border ${getSiteBadgeColor(selectedArticle.site)}`}>
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
