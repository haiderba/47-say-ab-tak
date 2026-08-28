import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Filter, Fingerprint, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { listCategories, listGuides } from "@/lib/content";
import { AdUnit } from "@/components/ads/ad-unit";
import { searchWithRomanUrdu } from "@/lib/roman-urdu-search";

export const Route = createFileRoute("/guides/")({
  loader: async () => {
    const [categories, guides] = await Promise.all([
      listCategories(),
      listGuides(),
    ]);
    return { categories, guides };
  },
  component: GuidesIndex,
});

function GuidesIndex() {
  const data = Route.useLoaderData();
  const categories = Array.isArray(data?.categories) ? data.categories : [];
  const guides = Array.isArray(data?.guides) ? data.guides : [];
  const [q, setQ] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("all");

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!Array.isArray(guides)) return [];
    const romanUrduMatches = n ? searchWithRomanUrdu(n) : [];
    const matchedGuideSlugs = new Set(romanUrduMatches.map((r) => r.targetGuideSlug).filter(Boolean));

    return guides.filter((g) => {
      if (!g) return false;
      const matchCat = selectedCat === "all" || g.category_slug === selectedCat;
      const matchSearch =
        !n ||
        (g.title && g.title.toLowerCase().includes(n)) ||
        (g.summary && g.summary.toLowerCase().includes(n)) ||
        (g.department && g.department.toLowerCase().includes(n)) ||
        (g.category_name && g.category_name.toLowerCase().includes(n)) ||
        matchedGuideSlugs.has(g.slug);
      return matchCat && matchSearch;
    });
  }, [guides, q, selectedCat]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="size-3.5" /> Complete Directory
          </div>
          <h1 className="mt-2 font-display text-4xl font-extrabold text-primary sm:text-5xl">
            Official Citizen Guides
          </h1>
          <p className="mt-2 text-muted">
            Search 30+ official rules-wise procedures across all 12 Pakistani departments.
          </p>
        </div>
        <div className="text-xs font-semibold text-muted">
          Showing <span className="text-primary font-bold">{filtered.length}</span> of {guides.length} guides
        </div>
      </div>

      {/* Search Input */}
      <div className="mt-8 flex items-center gap-3 rounded-full border-2 border-primary/20 bg-surface px-4 py-2 shadow-card focus-within:border-primary">
        <Search className="size-5 text-primary shrink-0" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by document, department, or procedure (CNIC, Fard, FRC, Mutation, NTN, Passport)..."
          className="h-10 w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            className="text-xs font-semibold text-muted hover:text-fg"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedCat("all")}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
            selectedCat === "all"
              ? "bg-primary text-surface shadow-sm"
              : "border border-border bg-surface text-muted hover:bg-bg hover:text-primary"
          }`}
        >
          All Departments ({guides.length})
        </button>

        {categories.map((c) => {
          const count = guides.filter((g) => g && g.category_slug === c.slug).length;
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => setSelectedCat(c.slug)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                selectedCat === c.slug
                  ? "bg-primary text-surface shadow-sm"
                  : "border border-border bg-surface text-muted hover:bg-bg hover:text-primary"
              }`}
            >
              {c.name} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* 🎯 GOOGLE ADSENSE LEADERBOARD AD */}
      <div className="my-8">
        
      </div>

      {/* Guides Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((g) => (
          <Link
            key={g.slug}
            to="/guides/$slug"
            params={{ slug: g.slug }}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-bg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                  {g.category_name}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    g.difficulty === "Low"
                      ? "bg-emerald-50 text-primary"
                      : g.difficulty === "High"
                      ? "bg-red-50 text-danger"
                      : "bg-amber-50 text-warn-fg"
                  }`}
                >
                  {g.difficulty} Difficulty
                </span>
              </div>

              <h2 className="mt-3 font-display text-lg font-bold text-primary group-hover:text-primary-light">
                {g.title}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-3">
                {g.summary}
              </p>
            </div>

            <div className="mt-6 border-t border-border/80 pt-4">
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5 text-accent" /> {g.processing_time}
                </span>
                <span className="font-semibold text-primary">View Checklist →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 rounded-2xl border border-border bg-surface p-12 text-center shadow-card">
          <p className="text-base font-semibold text-primary">No guides match your search criteria.</p>
          <p className="mt-1 text-xs text-muted">Try changing the category filter or searching for another document.</p>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setSelectedCat("all");
            }}
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-2 text-xs font-semibold text-surface"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

