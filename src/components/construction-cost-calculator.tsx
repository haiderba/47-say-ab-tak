import { useState } from "react";
import { Hammer, Calculator, Info, Sparkles, Building2, CheckCircle2 } from "lucide-react";
import { LIVE_RATES } from "@/lib/live-rates";

export function ConstructionCostCalculator() {
  const [plotSize, setPlotSize] = useState<"3marla" | "5marla" | "10marla" | "1kanal">("5marla");
  const [constructionQuality, setConstructionQuality] = useState<"grey" | "turnkey">("turnkey");

  let coveredAreaSqft = 1950;
  if (plotSize === "3marla") coveredAreaSqft = 1100;
  else if (plotSize === "5marla") coveredAreaSqft = 1950;
  else if (plotSize === "10marla") coveredAreaSqft = 3300;
  else if (plotSize === "1kanal") coveredAreaSqft = 5600;

  const ratePerSqft = constructionQuality === "grey" 
    ? LIVE_RATES.construction.greyStructureSqft 
    : LIVE_RATES.construction.turnkeyFinishingSqft;

  const totalCost = coveredAreaSqft * ratePerSqft;

  const bricksNeeded = Math.round(coveredAreaSqft * 32);
  const bricksCost = Math.round((bricksNeeded / 1000) * LIVE_RATES.construction.redBricks1000);

  const cementBags = Math.round(coveredAreaSqft * 0.45);
  const cementCost = cementBags * LIVE_RATES.construction.cementBag50kg;

  const steelTons = Number((coveredAreaSqft * 0.0038).toFixed(2));
  const steelCost = Math.round(steelTons * LIVE_RATES.construction.steelGrade60Ton);

  const laborCost = coveredAreaSqft * (constructionQuality === "grey" ? LIVE_RATES.construction.laborGreySqft : (LIVE_RATES.construction.laborGreySqft + LIVE_RATES.construction.laborFinishingSqft));

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-8 space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-600">
            <Hammer className="size-3.5" /> Pakistan Construction Material Index (2026)
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-primary sm:text-3xl">
            House Construction Cost & Material Estimator
          </h2>
          <p className="mt-1 text-xs text-muted">
            Estimates Grey Structure and A+ Turnkey finishing costs with live brick, cement, steel, and labor rates.
          </p>
        </div>
        <div className="rounded-2xl bg-bg p-3 border border-border text-right">
          <span className="block text-[10px] font-bold uppercase text-muted">Total Estimated Cost</span>
          <span className="font-mono text-2xl font-extrabold text-amber-900">Rs {totalCost.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Plot Size / Covered Area
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "3marla", label: "3 Marla (Double Storey)", area: "1,100 sq ft" },
              { id: "5marla", label: "5 Marla (Double Storey)", area: "1,950 sq ft" },
              { id: "10marla", label: "10 Marla (Double Storey)", area: "3,300 sq ft" },
              { id: "1kanal", label: "1 Kanal (Double Storey)", area: "5,600 sq ft" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlotSize(p.id as any)}
                className={
                  "rounded-xl p-3 text-left border text-xs font-bold transition-all " +
                  (plotSize === p.id ? "bg-primary text-surface border-primary shadow-xs" : "bg-bg text-muted border-border hover:text-fg")
                }
              >
                {p.label}
                <span className="block text-[10px] font-normal opacity-80 mt-0.5">{p.area}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Construction Scope
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setConstructionQuality("grey")}
              className={
                "rounded-xl p-3 text-left border text-xs font-bold transition-all " +
                (constructionQuality === "grey" ? "bg-primary text-surface border-primary shadow-xs" : "bg-bg text-muted border-border hover:text-fg")
              }
            >
              Grey Structure Only
              <span className="block text-[10px] font-normal opacity-80 mt-0.5">Rs {LIVE_RATES.construction.greyStructureSqft}/sq ft</span>
            </button>
            <button
              type="button"
              onClick={() => setConstructionQuality("turnkey")}
              className={
                "rounded-xl p-3 text-left border text-xs font-bold transition-all " +
                (constructionQuality === "turnkey" ? "bg-primary text-surface border-primary shadow-xs" : "bg-bg text-muted border-border hover:text-fg")
              }
            >
              Complete A+ Turnkey
              <span className="block text-[10px] font-normal opacity-80 mt-0.5">Rs {LIVE_RATES.construction.turnkeyFinishingSqft}/sq ft</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
        <div className="rounded-xl border border-border bg-surface p-4">
          <span className="text-muted block text-[10px] uppercase font-bold">Red Bricks (Awwal Eent)</span>
          <span className="font-mono text-base font-bold text-fg mt-1 block">{bricksNeeded.toLocaleString()} Bricks</span>
          <span className="text-[11px] text-muted">Rs {bricksCost.toLocaleString()} (@ Rs {LIVE_RATES.construction.redBricks1000}/1k)</span>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <span className="text-muted block text-[10px] uppercase font-bold">Cement Bags (50kg)</span>
          <span className="font-mono text-base font-bold text-fg mt-1 block">{cementBags.toLocaleString()} Bags</span>
          <span className="text-[11px] text-muted">Rs {cementCost.toLocaleString()} (@ Rs {LIVE_RATES.construction.cementBag50kg}/bag)</span>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <span className="text-muted block text-[10px] uppercase font-bold">Deformed Steel (Grade 60)</span>
          <span className="font-mono text-base font-bold text-fg mt-1 block">{steelTons} Tons</span>
          <span className="text-[11px] text-muted">Rs {steelCost.toLocaleString()} (@ Rs {LIVE_RATES.construction.steelGrade60Kg}/kg)</span>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <span className="text-muted block text-[10px] uppercase font-bold">Labor & Masonry</span>
          <span className="font-mono text-base font-bold text-fg mt-1 block">Rs {laborCost.toLocaleString()}</span>
          <span className="text-[11px] text-muted">{coveredAreaSqft} sq ft structure</span>
        </div>
      </div>
    </div>
  );
}
