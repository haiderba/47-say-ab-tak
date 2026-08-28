import { useState } from "react";
import { Flame, Info } from "lucide-react";
import { LIVE_RATES } from "@/lib/live-rates";

export function GasBillCalculator() {
  const [hm3Consumed, setHm3Consumed] = useState<number>(1.2);
  const [isProtected, setIsProtected] = useState<boolean>(true);

  const slabs = isProtected ? LIVE_RATES.gasSngpl.protectedSlabs : LIVE_RATES.gasSngpl.unprotectedSlabs;
  let activeSlab = slabs[0];
  for (const s of slabs) {
    if (hm3Consumed <= s.maxHm3) {
      activeSlab = s;
      break;
    }
  }

  const gasCost = hm3Consumed * activeSlab.ratePerHm3;
  const fixedCharge = activeSlab.fixedCharge;
  const meterRent = LIVE_RATES.gasSngpl.meterRent;
  const gst = ((gasCost + fixedCharge + meterRent) * 0.18);
  const totalGasBill = Math.round(gasCost + fixedCharge + meterRent + gst);

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10 space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-600">
            <Flame className="size-3.5" /> OGRA Domestic Gas Slabs & Tariff Engine
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-primary sm:text-3xl">
            SNGPL & SSGC Gas Bill Estimator
          </h2>
          <p className="mt-1 text-xs text-muted">
            Calculates HM³ volume consumption, fixed monthly charges, meter rent, and 18% GST.
          </p>
        </div>
        <div className="rounded-2xl bg-bg p-3 border border-border text-right">
          <span className="block text-[10px] font-bold uppercase text-muted">Est. Gas Bill</span>
          <span className="font-mono text-2xl font-extrabold text-orange-600">Rs {totalGasBill.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Gas Volume (HM³ / Hundred Cubic Meters)
          </label>
          <input
            type="number"
            min={0.1}
            max={10}
            step={0.1}
            value={hm3Consumed}
            onChange={(e) => setHm3Consumed(Math.max(0.1, Number(e.target.value)))}
            className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm font-bold text-fg outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Consumer Category
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsProtected(true)}
              className={"rounded-xl p-2.5 text-left border text-xs font-bold transition-all " + (isProtected ? "bg-primary text-surface border-primary" : "bg-bg text-muted border-border")}
            >
              Protected (&le;0.9 HM³)
            </button>
            <button
              type="button"
              onClick={() => setIsProtected(false)}
              className={"rounded-xl p-2.5 text-left border text-xs font-bold transition-all " + (!isProtected ? "bg-primary text-surface border-primary" : "bg-bg text-muted border-border")}
            >
              Unprotected (&gt;0.9 HM³)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
