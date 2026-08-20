import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getGuide, listSavedChecks, toggleSavedCheck } from "@/lib/content";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AdUnit } from "@/components/ads/ad-unit";

export const Route = createFileRoute("/guides/$slug")({
  loader: async ({ params }) => {
    const guide = await getGuide({ data: params.slug });
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData }) => {
    const guide = loaderData?.guide;
    if (!guide) return {};
    const canonicalUrl = `https://47sayabtak.com/guides/${guide.slug}`;
    const pageTitle = `${guide.title} — Step-by-Step Guide & Requirements | 47 Say Ab Tak`;

    const howToSchema = {
      "@context": "https://schema.org",
      "@type": ["HowTo", "GovernmentService"],
      "name": guide.title,
      "description": guide.summary,
      "serviceType": guide.category_name,
      "provider": {
        "@type": "GovernmentOrganization",
        "name": guide.department,
      },
      "totalTime": guide.processing_time,
      "url": canonicalUrl,
      "supply": guide.documents.map((d) => ({
        "@type": "HowToSupply",
        "name": d.item,
      })),
      "step": guide.steps.map((s) => ({
        "@type": "HowToStep",
        "position": s.step_number,
        "name": s.title,
        "text": s.body,
      })),
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://47sayabtak.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Citizen Guides",
          "item": "https://47sayabtak.com/guides",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": guide.title,
          "item": canonicalUrl,
        },
      ],
    };

    return {
      meta: [
        { title: pageTitle },
        { name: "description", content: guide.summary },
        {
          name: "keywords",
          content: `${guide.title}, ${guide.department}, ${guide.category_name}, Pakistan government official procedure, required documents, processing fee 2026, 47 Say Ab Tak`,
        },
        { property: "og:title", content: pageTitle },
        { property: "og:description", content: guide.summary },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: pageTitle },
        { name: "twitter:description", content: guide.summary },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(howToSchema),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbSchema),
        },
      ],
    };
  },
  component: GuidePage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
        <span className="font-display text-2xl font-bold">404</span>
      </div>
      <h1 className="mt-4 font-display text-2xl font-bold text-primary">Guide Not Found</h1>
      <p className="mt-2 text-xs text-muted">
        The requested government process guide may have been updated or moved.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          to="/guides"
          className="rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-surface hover:bg-primary-light"
        >
          Search All 30+ Official Guides
        </Link>
        <Link
          to="/tools"
          className="rounded-full border border-border bg-surface px-5 py-2.5 text-xs font-semibold text-fg hover:bg-bg"
        >
          Open Civic Tools
        </Link>
      </div>
    </div>
  ),
});

function GuidePage() {
  const { guide } = Route.useLoaderData();
  const { user, isPending } = useCurrentUserState();
  const [checked, setChecked] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(`checklist:${guide.slug}`);
        if (saved) return new Set(JSON.parse(saved));
      } catch {
        /* fallback */
      }
    }
    return new Set();
  });

  useEffect(() => {
    if (!user) return;
    listSavedChecks({ data: guide.slug })
      .then((keys) => {
        if (keys && keys.length > 0) {
          setChecked((prev) => {
            const merged = new Set([...Array.from(prev), ...keys]);
            try {
              localStorage.setItem(`checklist:${guide.slug}`, JSON.stringify(Array.from(merged)));
            } catch {}
            return merged;
          });
        }
      })
      .catch(() => {});
  }, [user, guide.slug]);

  const onToggle = async (key: string) => {
    const next = new Set(checked);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setChecked(next);
    
    // Save to local storage for offline resilience
    try {
      localStorage.setItem(`checklist:${guide.slug}`, JSON.stringify(Array.from(next)));
    } catch {}

    if (user) {
      try {
        await toggleSavedCheck({ data: { guideSlug: guide.slug, itemKey: key, checked: next.has(key) } });
      } catch {
        /* guest/offline-safe */
      }
    }
  };

  const sections = Array.from(new Set(guide.documents.map((d) => d.section)));

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm text-muted">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        {" / "}
        <Link to="/categories/$slug" params={{ slug: guide.category_slug }} className="hover:text-primary">
          {guide.category_name}
        </Link>
      </p>
      <div className="mt-4 inline-flex rounded-full bg-surface px-3 py-1 text-xs font-medium text-primary">
        Last updated: {guide.last_updated}
      </div>
      <h1 className="mt-3 font-display text-4xl font-bold text-primary">{guide.title}</h1>
      <p className="mt-3 text-lg text-muted">{guide.summary}</p>

      <div className="mt-6 grid gap-4 rounded-xl border-l-4 border-primary bg-surface p-5 shadow-card sm:grid-cols-3">
        <Stat label="Where" value={guide.department} />
        <Stat label="Time" value={guide.processing_time} />
        <Stat label="Biometric" value={guide.biometric} />
      </div>

      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-primary">Required documents</h2>
          <button
            type="button"
            onClick={() => window.print()}
            className="text-sm font-medium text-primary"
          >
            Print checklist
          </button>
        </div>
        {!isPending && !user && (
          <p className="mt-2 text-sm text-muted">
            <Link to="/login" className="text-primary underline">
              Sign in
            </Link>{" "}
            to save ticks across devices.
          </p>
        )}
        {sections.map((sec) => (
          <div key={sec} className="mt-4 rounded-xl border border-border bg-surface p-5">
            <h3 className="font-semibold text-fg">{sec}</h3>
            <ul className="mt-3 space-y-2">
              {guide.documents
                .filter((d) => d.section === sec)
                .map((d) => {
                  const key = `${sec}:${d.item}`;
                  const on = checked.has(key);
                  return (
                    <li key={key}>
                      <label className="flex cursor-pointer items-start gap-3 text-sm">
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => void onToggle(key)}
                          className="mt-1 size-4 accent-primary"
                        />
                        <span className={on ? "text-muted line-through" : "text-fg"}>{d.item}</span>
                      </label>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </section>

      {/* 🎯 GOOGLE ADSENSE IN-GUIDE STEP AD */}
      <div className="my-8">
        
      </div>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-primary">Step by step</h2>
        <ol className="mt-4 space-y-3">
          {guide.steps.map((s) => (
            <li key={s.step_number} className="flex gap-4 rounded-xl border border-border bg-surface p-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-surface">
                {s.step_number}
              </span>
              <div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold text-primary">Common mistakes</h2>
        <ul className="mt-4 space-y-2 rounded-xl border border-border bg-surface p-5">
          {guide.mistakes.map((m) => (
            <li key={m} className="flex gap-2 text-sm text-fg">
              <span className="font-bold text-danger">×</span>
              {m}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 rounded-xl border border-accent/40 bg-warn-bg p-4 text-sm text-warn-fg">
        <strong>Disclaimer:</strong> {guide.disclaimer}
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
