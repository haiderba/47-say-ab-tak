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
} from "lucide-react";
import { useState } from "react";
import { HistoricalHero } from "@/components/historical-hero";
import { CategoryIcon } from "@/components/icons";
import { AdUnit } from "@/components/ads/ad-unit";
import { listCategories, listGuides, listNews } from "@/lib/content";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [categories, guides, news] = await Promise.all([
      listCategories(),
      listGuides(),
      listNews(),
    ]);
    return { categories, guides, news };
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
    description:
      "Following independence in 1947, Pakistan's administrative and civil records continued British-era paper registers. Land records relied entirely on the Patwari's basta, identity was proven through manual affidavits and local witnesses, and succession required long civil court trials.",
    highlight: "100% paper registers · Months for verification · Extreme vulnerability to record loss",
    documents: [
      { name: "Land Records", oldWay: "Handwritten Shajra & Register Haqdaran Zameen", modernWay: "PLRA Computerized Fard (Instant QR code)" },
      { name: "Citizen Identity", oldWay: "Manual local paper certificates & affidavits", modernWay: "Smart CNIC with chip & biometric verification" },
      { name: "Inheritance", oldWay: "Lengthy civil court heirship trials", modernWay: "NADRA 15-day digital Succession Certificate" },
    ],
  },
  {
    id: "1973",
    year: "1973",
    badge: "First National ID System",
    title: "Constitutional Citizen Registry",
    subtitle: "Establishment of the Directorate General of Registration.",
    description:
      "Under the 1973 Constitution, Pakistan established the national registration system. Paper identity booklets with glued passport photos were issued to citizens for the first time nationwide, laying the groundwork for central citizen accounting.",
    highlight: "Paper booklet IDs · First centralized national numbering · Manual regional branches",
    documents: [
      { name: "National ID", oldWay: "Manual laminated paper card with ink stamp", modernWay: "Multi-biometric Smart Card with digital chip" },
      { name: "Passports", oldWay: "Handwritten blue passport booklet", modernWay: "Machine Readable (MRP) & e-Passports" },
      { name: "Birth / Death", oldWay: "Uncoordinated municipal registers", modernWay: "Integrated Union Council & NADRA registration" },
    ],
  },
  {
    id: "2000",
    year: "2000",
    badge: "The NADRA Revolution",
    title: "Centralized Digital Biometrics",
    subtitle: "NADRA Ordinance 2000 transforms citizen verification.",
    description:
      "The establishment of NADRA replaced fragmented paper cards with the Computerized National Identity Card (CNIC). Automated Fingerprint Identification Systems (AFIS) and central databases revolutionized voting, banking, and citizen verification.",
    highlight: "First Computerized CNIC · Central AFIS fingerprint database · Elimination of duplicate identities",
    documents: [
      { name: "Family Tree", oldWay: "Manual affidavits and witness testimonies", modernWay: "Digital Family Registration Certificate (FRC)" },
      { name: "Verification", oldWay: "Physical gazetted officer attestation", modernWay: "Instant biometric thumbprint & facial match" },
      { name: "Lost Card", oldWay: "Police gazette notification and manual redraw", modernWay: "Online reprint token via Pak-ID" },
    ],
  },
  {
    id: "2010s",
    year: "2010s",
    badge: "Automation & Land Digitization",
    title: "Smart Cards & Arazi Centers",
    subtitle: "Punjab Land Records Authority (PLRA) & DLIMS modernise state counters.",
    description:
      "Punjab computerized millions of rural land records through Arazi Record Centers (ARCs), stripping the monopoly of the Patwari. Traffic police deployed DLIMS for computerized driving licenses, and NADRA introduced Smart Chip CNICs.",
    highlight: "PLRA Arazi Centers · DLIMS computerized driving system · Smart Chip CNIC with encrypted biometrics",
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
    description:
      "Today, Pak-ID mobile apps capture biometrics on smartphones, e-Pay enables online tax and fee payments, and NADRA Mega Centers operate 24/7. 47 Say Ab Tak brings complete clarity so you know exact documents, fees, and pitfalls before stepping out.",
    highlight: "24/7 Mega Centers · e-Pay digital fee challans · Mobile smartphone biometrics · Clear citizen guidance",
    documents: [
      { name: "Succession (Movable)", oldWay: "1–3 years in civil court litigation", modernWay: "15-day NADRA Succession with public notice" },
      { name: "Attestation Chain", oldWay: "Opaque manual office-hopping", modernWay: "IBCC → HEC → MOFA transparent pipeline" },
      { name: "Checklists & Rules", oldWay: "Relying on touts (agents) charging fees", modernWay: "47 Say Ab Tak free step-by-step checklists" },
    ],
  },
];

const QUICK_ACTIONS = [
  {
    slug: "cnic",
    icon: "id-card",
    title: "CNIC & Smart Card",
    category: "NADRA",
    time: "Same day to 15 days",
    biometric: "Mandatory",
    desc: "First time, renewal, lost duplicate, or data correction.",
  },
  {
    slug: "succession",
    icon: "scale",
    title: "Succession Certificate",
    category: "NADRA",
    time: "15–30 days",
    biometric: "All Heirs",
    desc: "Fast-track legal route for bank accounts, vehicles, and shares after a death.",
  },
  {
    slug: "land-mutation",
    icon: "scroll-text",
    title: "Land Mutation (Intiqal)",
    category: "PLRA / Land",
    time: "Same day to a few days",
    biometric: "Buyer + Seller",
    desc: "Transfer of property ownership after sale deed, gift, or inheritance.",
  },
  {
    slug: "passport",
    icon: "book-open",
    title: "Passport Issuance",
    category: "DGIP",
    time: "4 to 14 days",
    biometric: "Required",
    desc: "Ordinary, urgent, and executive new passports or renewals.",
  },
  {
    slug: "driving-license",
    icon: "car",
    title: "Driving License",
    category: "Traffic Police",
    time: "Learner same day",
    biometric: "Required",
    desc: "Learner license, regular road test, and international permit via DLIMS.",
  },
  {
    slug: "document-attestation",
    icon: "stamp",
    title: "Document Attestation",
    category: "IBCC / HEC / MOFA",
    time: "1 to 3 weeks",
    biometric: "Not typical",
    desc: "Matric, Inter, Degree, and MOFA legalizations for overseas use.",
  },
];

const OFFICIAL_PORTALS = [
  { name: "Pak-ID (NADRA)", url: "https://id.nadra.gov.pk", desc: "Online CNIC, FRC & Succession" },
  { name: "DLIMS Punjab", url: "https://dlims.punjab.gov.pk", desc: "Driving license verification & renewal" },
  { name: "e-Pay Punjab", url: "https://epay.punjab.gov.pk", desc: "Digital government fee challans" },
  { name: "PLRA Land Portal", url: "https://punjab-zameen.gov.pk", desc: "Online Fard & Arazi records" },
  { name: "DGIP Passports", url: "https://onlinemrp.dgip.gov.pk", desc: "Online passport renewal tracking" },
  { name: "MOFA Attestation", url: "https://mofa.gov.pk", desc: "Ministry of Foreign Affairs attestation" },
];

function Home() {
  const data = Route.useLoaderData();
  const categories = Array.isArray(data?.categories) ? data.categories : [];
  const guides = Array.isArray(data?.guides) ? data.guides : [];
  const news = Array.isArray(data?.news) ? data.news : [];
  const [activeEra, setActiveEra] = useState("1947");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const currentEra = ERA_TIMELINE.find((e) => e.id === activeEra) || ERA_TIMELINE[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/guides" });
    }
  };

  return (
    <div className="flex flex-col">
      {/* 🌟 1947 → 2026 INTERACTIVE 3D HISTORICAL HERO */}
      <HistoricalHero onSearch={() => navigate({ to: "/guides" })} />

      {/* 🏛️ 1947 TO 2026 ERA TRANSITION SHOWCASE */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <History className="size-3.5" /> Historical Evolution
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              1947 → 2026: How Documentation Evolved
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted">
              From colonial handwritten bastas to centralized biometric databases and modern citizen cloud apps.
            </p>
          </div>

          {/* Interactive Era Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-bg p-2 shadow-inner">
            {ERA_TIMELINE.map((era) => (
              <button
                key={era.id}
                type="button"
                onClick={() => setActiveEra(era.id)}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                  activeEra === era.id
                    ? "bg-primary text-surface shadow-md"
                    : "text-muted hover:bg-surface hover:text-primary"
                }`}
              >
                <span className="font-display font-bold">{era.year}</span>
                <span className="hidden text-xs opacity-80 sm:inline">({era.badge})</span>
              </button>
            ))}
          </div>

          {/* Active Era Showcase Card */}
          <div className="mt-8 rounded-3xl border border-border bg-gradient-to-br from-bg via-surface to-bg p-6 shadow-card md:p-10">
            <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
              <div>
                <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-warn-fg">
                  Era {currentEra.year} Milestone
                </span>
                <h3 className="mt-2 font-display text-2xl font-bold text-primary sm:text-3xl">
                  {currentEra.title}
                </h3>
                <p className="mt-1 font-medium text-accent">{currentEra.subtitle}</p>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-4 text-xs font-medium text-muted shadow-sm md:max-w-xs">
                <span className="font-bold text-primary">Era Characteristics:</span>
                <p className="mt-1 leading-relaxed text-fg">{currentEra.highlight}</p>
              </div>
            </div>

            <p className="mt-6 text-base leading-relaxed text-fg/90">
              {currentEra.description}
            </p>

            {/* Document Evolution Comparison */}
            <div className="mt-8">
              <h4 className="flex items-center gap-2 font-display text-lg font-bold text-primary">
                <FileCheck className="size-5 text-accent" /> How Citizen Documents Changed:
              </h4>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {currentEra.documents.map((doc, idx) => (
                  <div key={idx} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                    <div className="font-semibold text-primary">{doc.name}</div>
                    <div className="mt-3 space-y-2 text-xs">
                      <div className="rounded-lg bg-red-50/80 p-2 text-danger">
                        <span className="font-bold uppercase tracking-wider text-[10px]">Then:</span>
                        <p className="mt-0.5">{doc.oldWay}</p>
                      </div>
                      <div className="rounded-lg bg-emerald-50/80 p-2 text-primary">
                        <span className="font-bold uppercase tracking-wider text-[10px]">Now:</span>
                        <p className="mt-0.5">{doc.modernWay}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Link
                to="/timeline"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-light"
              >
                Explore Full 1947–2026 Historical Timeline <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ⚡ FAST PROCESS FINDER / MOST REQUESTED PROCEDURES */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-warn-fg">
                <Sparkles className="size-3.5" /> Most Needed
              </div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                Quick Process Directory
              </h2>
              <p className="mt-1 text-muted">
                Step straight into the official requirements for Pakistan’s most common documentation needs.
              </p>
            </div>
            <Link
              to="/guides"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              View all 11 guides <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_ACTIONS.map((item) => (
              <Link
                key={item.slug}
                to="/guides/$slug"
                params={{ slug: item.slug }}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-surface">
                      <CategoryIcon name={item.icon} className="size-6" />
                    </div>
                    <span className="rounded-full bg-bg px-2.5 py-1 text-[11px] font-semibold text-muted">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-primary group-hover:text-primary-light">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{item.desc}</p>
                </div>

                <div className="mt-6 border-t border-border/80 pt-4">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5 text-accent" /> {item.time}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-primary">
                      <Fingerprint className="size-3.5" /> {item.biometric}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 🏢 BROWSE BY DEPARTMENT & CATEGORY */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
              Browse by Department
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-muted">
              Organized department-wise so you know which authority holds jurisdiction over your case.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/categories/$slug"
                params={{ slug: c.slug }}
                className="group flex flex-col rounded-2xl border border-border bg-bg p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:bg-surface"
              >
                <div className="mb-4 grid size-12 place-items-center rounded-xl bg-surface text-primary shadow-sm transition-colors group-hover:bg-primary group-hover:text-accent">
                  <CategoryIcon name={c.icon} className="size-6" />
                </div>
                <h3 className="font-semibold text-primary group-hover:text-primary-light">{c.name}</h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted">{c.description}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary">
                  View guides <ChevronRight className="size-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 🎯 GOOGLE ADSENSE MID-PAGE LEADERBOARD UNIT */}
      <div className="mx-auto max-w-5xl px-4 my-6">
        <AdUnit format="leaderboard" label="Sponsored Citizen Resources / Google Ad" />
      </div>

      {/* 🗺️ INHERITANCE PROCESS MAP CALLOUT */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl rounded-3xl border-2 border-primary/20 bg-gradient-to-r from-primary via-primary-light to-primary p-8 text-surface shadow-xl md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface/20 px-3 py-1 text-xs font-semibold text-accent">
                <Landmark className="size-3.5" /> The Family Inheritance Chain
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-surface sm:text-4xl">
                Navigating succession & land mutation without bounced files
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-surface/85">
                The death of a family member requires navigating Union Council, NADRA, and Arazi Record Centers in a specific chronological sequence. Skipping a step is why families face months of rejection.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-lg bg-surface/15 px-3 py-1.5">1. Death Certificate</span>
                <span className="text-accent">→</span>
                <span className="rounded-lg bg-surface/15 px-3 py-1.5">2. FRC (Family Tree)</span>
                <span className="text-accent">→</span>
                <span className="rounded-lg bg-surface/15 px-3 py-1.5">3. Succession Certificate</span>
                <span className="text-accent">→</span>
                <span className="rounded-lg bg-surface/15 px-3 py-1.5">4. Land Mutation</span>
              </div>
            </div>
            <div className="flex justify-start md:col-span-4 md:justify-end">
              <Link
                to="/flow"
                className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 font-bold text-fg shadow-lg transition-transform hover:scale-105"
              >
                Open Full Process Map
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🔗 DIRECT OFFICIAL GOVERNMENT PORTALS DIRECTORY */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <ShieldCheck className="size-3.5" /> Verified Official Portals
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold text-primary sm:text-3xl">
              Direct Access to Government Services
            </h2>
            <p className="mt-1 text-xs text-muted">
              Always submit online applications through authorized government URLs.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OFFICIAL_PORTALS.map((portal) => (
              <a
                key={portal.name}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl border border-border bg-bg p-4 transition-all hover:border-primary/40 hover:bg-surface"
              >
                <div>
                  <h3 className="font-semibold text-primary group-hover:text-primary-light">
                    {portal.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted">{portal.desc}</p>
                </div>
                <ExternalLink className="size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 📰 LATEST NEWS & REGULATORY UPDATES */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-primary sm:text-3xl">
                Recent Regulatory Updates
              </h2>
              <p className="mt-1 text-xs text-muted">Rules, token system updates, and citizen advisories.</p>
            </div>
            <Link to="/news" className="text-xs font-semibold text-primary hover:underline">
              All updates →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {news.slice(0, 3).map((item) => (
              <Link
                key={item.slug}
                to="/news/$slug"
                params={{ slug: item.slug }}
                className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-card transition-transform hover:-translate-y-1"
              >
                <div>
                  <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-bold text-warn-fg">
                    {item.tag}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold text-primary">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-3">{item.excerpt}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-[11px] text-muted">
                  <span>{item.published_at}</span>
                  <span className="font-semibold text-primary">Read guide update →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

