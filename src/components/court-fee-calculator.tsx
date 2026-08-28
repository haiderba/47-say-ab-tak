import { useState } from "react";
import { Scale } from "lucide-react";

export function CourtFeeCalculator() {
  const [suitValue, setSuitValue] = useState(1500000);
  const courtFee = Math.min(15000, Math.round(suitValue * 0.075));

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10 space-y-6">
      <div>
        <h2 className="font-display text-2xl font-black text-primary">Court Fee & Stamp Duty Finder</h2>
        <p className="text-xs text-muted">Court Fees Act 1870 Ad-valorem (7.5% capped at Rs 15,000).</p>
      </div>
      <div className="rounded-2xl bg-bg p-5 border border-border flex justify-between items-center">
        <span className="text-xs font-bold uppercase text-muted">Statutory Court Fee:</span>
        <span className="font-mono text-2xl font-black text-primary">Rs {courtFee.toLocaleString()}</span>
      </div>
    </div>
  );
}
