import { useState } from "react";
import { Calculator, CheckCircle2, AlertCircle, Copy, Printer } from "lucide-react";

export function FbrAtlVerifier() {
  const [cnic, setCnic] = useState("35201-1234567-1");
  const cleanCnic = cnic.replace(/\D/g, "");

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-8 space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <Calculator className="size-3.5" /> FBR Active Taxpayer List (ATL) Gateway
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-primary sm:text-3xl">
            FBR Active Taxpayer (ATL) & NTN Verifier
          </h2>
          <p className="mt-1 text-xs text-muted">
            Check Active Taxpayer status via SMS 9966 and view withholding tax reductions under Finance Act 2025/2026.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-surface hover:bg-primary-light shadow-xs"
        >
          <Printer className="size-4" /> Print B&W Status
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
          Enter 13-Digit CNIC or 7-Digit NTN
        </label>
        <input
          type="text"
          maxLength={15}
          value={cnic}
          onChange={(e) => setCnic(e.target.value)}
          placeholder="35201-1234567-1"
          className="w-full rounded-2xl border border-border bg-bg px-4 py-3 font-mono text-sm font-bold text-fg outline-none focus:border-primary tracking-wider"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">1-Tap SMS ATL Verification</span>
          <div className="font-mono text-lg font-black text-emerald-950 mt-1">SMS "ATL {cleanCnic}" to 9966</div>
          <span className="text-[11px] text-emerald-800 mt-1 block">Official FBR Verification Number</span>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800">Active Filer Tax Reductions</span>
          <div className="font-mono text-lg font-black text-blue-950 mt-1">Save 50% - 66% on Taxes</div>
          <span className="text-[11px] text-blue-800 mt-1 block">On Property (236K), Vehicles (231B), Bank Cash</span>
        </div>
      </div>
    </div>
  );
}
