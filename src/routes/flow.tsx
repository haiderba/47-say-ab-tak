import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { AdUnit } from "@/components/ads/ad-unit";

export const Route = createFileRoute("/flow")({ component: FlowPage });

const CHAIN = [
  {
    slug: "death-certificate",
    title: "Death Certificate",
    note: "Union Council — start here after a death",
  },
  {
    slug: "cnic",
    title: "FRC (via NADRA / CNIC family)",
    note: "Family Registration Certificate of the deceased",
  },
  {
    slug: "succession",
    title: "Succession Certificate",
    note: "Movable assets — banks, vehicles (NADRA if undisputed)",
  },
  {
    slug: "land-mutation",
    title: "Land Mutation (Intiqal)",
    note: "Immovable property — Arazi Record Center",
  },
];

function FlowPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold text-primary">Inheritance process map</h1>
      <p className="mt-3 text-muted">
        The chain families actually walk. Skipping a step is why files bounce.
      </p>
      <ol className="mt-10">
        {CHAIN.map((step, i) => (
          <li key={step.slug} className="flex flex-col items-center">
            <Link
              to="/guides/$slug"
              params={{ slug: step.slug }}
              className="w-full rounded-2xl border border-border bg-surface p-5 text-center shadow-card transition-all hover:-translate-y-1 hover:border-primary/40"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-accent">
                Step {i + 1}
              </p>
              <h2 className="mt-1 font-display text-lg font-bold text-primary">{step.title}</h2>
              <p className="mt-1 text-xs text-muted">{step.note}</p>
            </Link>
            {i < CHAIN.length - 1 && (
              <ArrowDown className="my-3 size-5 text-primary" aria-hidden />
            )}
          </li>
        ))}
      </ol>

      {/* 🎯 GOOGLE ADSENSE IN-ARTICLE AD */}
      <div className="mt-8">
        
      </div>

      {/* Interactive Succession Engines Callout */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <Link
          to="/tools"
          className="flex flex-col justify-between rounded-2xl border border-primary/20 bg-primary/5 p-5 transition-all hover:bg-primary/10"
        >
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">⚡ Legal Shares</span>
            <h3 className="mt-1 font-display text-base font-bold text-primary">Inheritance (Faraid) Calculator</h3>
            <p className="mt-1 text-xs text-muted">Compute exact Quranic shares and PKR cash/land distributions for all heirs.</p>
          </div>
          <span className="mt-4 text-xs font-bold text-primary">Open Calculator →</span>
        </Link>

        <Link
          to="/tools"
          className="flex flex-col justify-between rounded-2xl border border-primary/20 bg-primary/5 p-5 transition-all hover:bg-primary/10"
        >
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">📝 Stamp Paper</span>
            <h3 className="mt-1 font-display text-base font-bold text-primary">Succession NOC Generator</h3>
            <p className="mt-1 text-xs text-muted">Generate instant No-Objection & Dastbardari affidavits ready for E-Stamp printing.</p>
          </div>
          <span className="mt-4 text-xs font-bold text-primary">Generate Affidavit →</span>
        </Link>
      </div>
    </div>
  );
}
