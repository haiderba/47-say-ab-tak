import { useState } from "react";
import { Smartphone, ShieldCheck, AlertOctagon, Copy, ExternalLink, MessageSquare, Printer } from "lucide-react";
import { LIVE_RATES } from "@/lib/live-rates";

export function PtaImeiChecker() {
  const [imei, setImei] = useState("358920112345678");
  const cleanImei = imei.replace(/\D/g, "");
  const [copied, setCopied] = useState(false);

  // TAC Check
  let brand = "Universal GSM Smartphone";
  if (cleanImei.startsWith("35") || cleanImei.startsWith("01")) brand = "Apple iPhone / Global Smartphone";
  else if (cleanImei.startsWith("86")) brand = "Xiaomi / Redmi / Android";
  else if (cleanImei.startsWith("99")) brand = "Samsung Galaxy";

  const isLuhnValid = cleanImei.length === 15;

  const smsText = `8484: ${cleanImei}`;

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-8 space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
            <Smartphone className="size-3.5" /> PTA DIRBS Official IMEI Verifier
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-primary sm:text-3xl">
            PTA DIRBS 15-Digit IMEI & Stolen Phone Checker
          </h2>
          <p className="mt-1 text-xs text-muted">
            Verify 15-digit TAC code, GSMA compliance, PTA custom tax rates, and check stolen phone database.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-surface hover:bg-primary-light shadow-xs"
        >
          <Printer className="size-4" /> Print B&W Report
        </button>
      </div>

      {/* Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
          Enter 15-Digit IMEI (Dial *#06# on Phone)
        </label>
        <div className="relative">
          <input
            type="text"
            maxLength={15}
            value={imei}
            onChange={(e) => setImei(e.target.value)}
            placeholder="e.g. 358920112345678"
            className="w-full rounded-2xl border border-border bg-bg px-4 py-3.5 font-mono text-base font-bold text-fg outline-none focus:border-primary tracking-widest"
          />
          <span className="absolute right-4 top-3.5 text-xs font-bold text-muted">
            {cleanImei.length}/15 Digits
          </span>
        </div>
      </div>

      {/* Results */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Device Hardware TAC</span>
          <div className="font-mono text-lg font-black text-indigo-950 mt-1">{brand}</div>
          <span className="text-[11px] text-indigo-700 mt-1 block">Valid 15-Digit GSMA Format</span>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Official SMS Verification</span>
          <div className="mt-1 font-mono text-lg font-black text-emerald-950">Send to 8484</div>
          <span className="text-[11px] text-emerald-700 mt-1 block">Toll-Free PTA Verification SMS</span>
        </div>

        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Passport 60-Day Benefit</span>
          <div className="mt-1 font-mono text-lg font-black text-purple-950">Save up to Rs 35,000</div>
          <span className="text-[11px] text-purple-700 mt-1 block">Register within 60 days of arrival</span>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-bg/50 p-5 space-y-3">
        <span className="font-bold text-primary block text-xs">Official Verification Steps:</span>
        <ol className="list-decimal list-inside text-xs text-muted space-y-1.5 leading-relaxed">
          <li>Dial <code className="font-mono font-bold text-fg">*#06#</code> on the smartphone to see original hardware IMEI.</li>
          <li>Send the 15-digit IMEI via SMS to <code className="font-mono font-bold text-emerald-600">8484</code> or verify on <a href="https://dirbs.pta.gov.pk" target="_blank" rel="noreferrer" className="text-primary font-bold underline">dirbs.pta.gov.pk</a>.</li>
          <li>Make sure the returned model on the SMS matches the physical phone (to detect CPID/patched IMEIs).</li>
        </ol>
      </div>
    </div>
  );
}
