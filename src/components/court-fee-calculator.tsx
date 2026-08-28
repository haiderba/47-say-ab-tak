import { useState } from "react";
import { Scale, Calculator, Info } from "lucide-react";

export function CourtFeeCalculator() {
  const [suitType, setSuitType] = useState<"declaration" | "recovery" | "partition" | "damages">("recovery");
  const [suitValue, setSuitValue] = useState<number>(1500000);

  let courtFeePkr = 500;
  let calculationNote = "";

  if (suitType === "recovery" || suitType === "damages") {
    const rawVal = suitValue * 0.075;
    courtFeePkr = Math.min(15000, Math.round(rawVal));
    calculationNote = "7.5% Ad-valorem fee capped at maximum statutory limit of Rs 15,000/-.";
  } else if (suitType === "declaration") {
    courtFeePkr = 500;
    calculationNote = "Fixed statutory court fee stamp of Rs 500/- for Suit for Declaration with Injunction.";
  } else if (suitType === "partition") {
    courtFeePkr = 500;
    calculationNote = "Fixed court fee stamp of Rs 500/- for suit for partition of joint family property.";
  }

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-8 space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <Scale className="size-3.5" /> Court Fees Act 1870 & Stamp Duty Schedule
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-primary sm:text-3xl">
            Judicial Court Fee & Stamp Calculator
          </h2>
          <p className="mt-1 text-xs text-muted">
            Calculates exact court fees for recovery of money, declaration, partition, damages, and civil suits.
          </p>
        </div>
        <div className="rounded-2xl bg-bg p-3 border border-border text-right">
          <span className="block text-[10px] font-bold uppercase text-muted">Statutory Court Fee</span>
          <span className="font-mono text-2xl font-extrabold text-primary">Rs {courtFeePkr.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Nature of Civil Suit
          </label>
          <select
            value={suitType}
            onChange={(e) => setSuitType(e.target.value as any)}
            className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-xs font-bold text-fg outline-none focus:border-primary"
          >
            <option value="recovery">Suit for Recovery of Money (دعوٰی وصولی رقم)</option>
            <option value="declaration">Suit for Declaration & Injunction (دعوٰی استقرارِ حق)</option>
            <option value="partition">Suit for Partition of Property (دعوٰی تقسیم جائیداد)</option>
            <option value="damages">Suit for Damages / Defamation (دعوٰی ہرجانہ)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Suit Valuation in Plaint (PKR)
          </label>
          <input
            type="number"
            value={suitValue}
            onChange={(e) => setSuitValue(Math.max(1000, Number(e.target.value)))}
            className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm font-bold text-fg outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-bg/50 p-5 space-y-2 text-xs">
        <span className="font-bold text-primary block">Statutory Legal Rule:</span>
        <p className="text-muted leading-relaxed">{calculationNote}</p>
      </div>
    </div>
  );
}
