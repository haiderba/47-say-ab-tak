import { useState } from "react";
import { Smartphone } from "lucide-react";
import { LIVE_RATES } from "@/lib/live-rates";

export function PtaMobileTaxCalculator() {
  const [model, setModel] = useState(LIVE_RATES.ptaTaxSlabs[0].model);
  const device = LIVE_RATES.ptaTaxSlabs.find(d => d.model === model) || LIVE_RATES.ptaTaxSlabs[0];

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10 space-y-6">
      <h2 className="font-display text-2xl font-black text-primary">PTA Mobile Tax (DIRBS) Estimator</h2>
      <select value={model} onChange={e => setModel(e.target.value)} className="w-full rounded-xl border border-border bg-bg p-3 text-xs font-bold">
        {LIVE_RATES.ptaTaxSlabs.map(d => <option key={d.model} value={d.model}>{d.brand} - {d.model}</option>)}
      </select>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-emerald-500/10 p-5 border border-emerald-500/20">
          <span className="text-xs font-bold text-emerald-800 uppercase">Passport Rate (Within 60 Days)</span>
          <div className="font-mono text-2xl font-black text-emerald-950 mt-1">Rs {device.passportTax.toLocaleString()}</div>
        </div>
        <div className="rounded-2xl bg-purple-500/10 p-5 border border-purple-500/20">
          <span className="text-xs font-bold text-purple-800 uppercase">CNIC Standard Rate</span>
          <div className="font-mono text-2xl font-black text-purple-950 mt-1">Rs {device.cnicTax.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
