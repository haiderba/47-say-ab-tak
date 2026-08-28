import { useState } from "react";
import { Hammer } from "lucide-react";
import { LIVE_RATES } from "@/lib/live-rates";

export function ConstructionCostCalculator() {
  const [plotSize, setPlotSize] = useState<"5marla" | "10marla" | "1kanal">("5marla");
  const coveredArea = plotSize === "5marla" ? 1950 : plotSize === "10marla" ? 3300 : 5600;
  const totalCost = coveredArea * LIVE_RATES.construction.turnkeyFinishingSqft;

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10 space-y-6">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-black text-primary">House Construction Cost Estimator</h2>
          <p className="text-xs text-muted">Live 2026 rates: Cement (Rs {LIVE_RATES.construction.cementBag50kg}), Steel (Rs {LIVE_RATES.construction.steelGrade60Kg}/kg).</p>
        </div>
        <div className="text-right font-mono text-2xl font-extrabold text-primary">
          Rs {totalCost.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
