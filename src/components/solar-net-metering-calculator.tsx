import { useState } from "react";
import { Sun, Zap, Info, ShieldCheck, CheckCircle2 } from "lucide-react";
import { LIVE_RATES } from "@/lib/live-rates";

export function SolarNetMeteringCalculator() {
  const [monthlyUnits, setMonthlyUnits] = useState<number>(850);
  const [inverterType, setInverterType] = useState<"on_grid" | "hybrid">("on_grid");
  const [structureType, setStructureType] = useState<"standard" | "elevated">("standard");

  const recommendedKw = Math.max(3, Math.ceil(monthlyUnits / LIVE_RATES.solar.genUnitsPerKwMonthly));
  const estimatedMonthlyGen = recommendedKw * LIVE_RATES.solar.genUnitsPerKwMonthly;
  const estimatedSurplusUnits = Math.max(0, estimatedMonthlyGen - monthlyUnits);

  const panelWattageTotal = recommendedKw * 1000;
  const panelCount585W = Math.ceil(panelWattageTotal / 585);
  const panelCost = panelWattageTotal * LIVE_RATES.solar.panelWattAvg;
  
  const inverterRate = inverterType === "on_grid" 
    ? LIVE_RATES.solar.inverterOnGridWattAvg 
    : LIVE_RATES.solar.inverterHybridWattAvg;
  const inverterCost = panelWattageTotal * inverterRate;

  const structureCostPerKw = structureType === "standard" ? 6500 : 12000;
  const structureCost = recommendedKw * structureCostPerKw;
  const wiringAndAccessories = recommendedKw * 8500;
  const netMeteringDiscoFee = LIVE_RATES.solar.netMeteringFeeEst;

  const totalSystemCost = panelCost + inverterCost + structureCost + wiringAndAccessories + netMeteringDiscoFee;

  const monthlySavingsPkr = Math.min(monthlyUnits, estimatedMonthlyGen) * 38 + (estimatedSurplusUnits * 21);
  const annualSavingsPkr = monthlySavingsPkr * 12;
  const paybackYears = (totalSystemCost / annualSavingsPkr).toFixed(1);

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10 space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-600">
            <Sun className="size-3.5" /> 3-Phase DISCO Net-Metering & Savings Engine
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-primary sm:text-3xl">
            Solar Net-Metering & Bill Savings Calculator
          </h2>
          <p className="mt-1 text-xs text-muted">
            Accurate ROI, live Tier-1 TopCon panel rates (Rs {LIVE_RATES.solar.panelWattAvg}/W), inverter sizing, and green meter application checklist.
          </p>
        </div>
        <div className="rounded-2xl bg-bg p-3 border border-border text-right">
          <span className="block text-[10px] font-bold text-muted uppercase">Avg Payback</span>
          <span className="font-mono text-base font-extrabold text-emerald-600">{paybackYears} Years</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Monthly Units Consumed (kWh)
          </label>
          <div className="relative">
            <input
              type="number"
              min={100}
              max={10000}
              step={50}
              value={monthlyUnits}
              onChange={(e) => setMonthlyUnits(Math.max(50, Number(e.target.value)))}
              className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm font-bold text-fg outline-none focus:border-primary"
            />
            <span className="absolute right-4 top-3 text-xs font-bold text-muted">Units / mo</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Inverter Technology
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setInverterType("on_grid")}
              className={"rounded-xl p-3 text-left border text-xs font-bold transition-all " + (inverterType === "on_grid" ? "bg-primary text-surface border-primary" : "bg-bg text-muted border-border")}
            >
              On-Grid (Grid-Tied)
            </button>
            <button
              type="button"
              onClick={() => setInverterType("hybrid")}
              className={"rounded-xl p-3 text-left border text-xs font-bold transition-all " + (inverterType === "hybrid" ? "bg-primary text-surface border-primary" : "bg-bg text-muted border-border")}
            >
              Hybrid (Battery Ready)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Mounting Structure
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setStructureType("standard")}
              className={"rounded-xl p-3 text-left border text-xs font-bold transition-all " + (structureType === "standard" ? "bg-primary text-surface border-primary" : "bg-bg text-muted border-border")}
            >
              Standard L2/L3
            </button>
            <button
              type="button"
              onClick={() => setStructureType("elevated")}
              className={"rounded-xl p-3 text-left border text-xs font-bold transition-all " + (structureType === "elevated" ? "bg-primary text-surface border-primary" : "bg-bg text-muted border-border")}
            >
              Elevated Roof
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Recommended Size</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono text-3xl font-black text-amber-900">{recommendedKw}</span>
            <span className="text-sm font-bold text-amber-800">kW System</span>
          </div>
          <span className="mt-1 block text-[11px] text-amber-700">
            {panelCount585W} × 585W N-Type Tier-1 Panels
          </span>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Est. Monthly Generation</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono text-3xl font-black text-emerald-900">{estimatedMonthlyGen}</span>
            <span className="text-sm font-bold text-emerald-800">kWh / Month</span>
          </div>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Monthly Bill Savings</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono text-2xl font-black text-primary">Rs {monthlySavingsPkr.toLocaleString()}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Total Turnkey Cost</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono text-2xl font-black text-purple-900">Rs {totalSystemCost.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
