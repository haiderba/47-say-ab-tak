import { useState } from "react";
import { IdCard, Search, ExternalLink, Clock, Printer } from "lucide-react";

export function NadraTrackingGuide() {
  const [trackingId, setTrackingId] = useState("123456789012");

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-8 space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <IdCard className="size-3.5" /> NADRA Pak-ID Tracking Gateway
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-primary sm:text-3xl">
            NADRA Pak-ID Application Tracking Gateway
          </h2>
          <p className="mt-1 text-xs text-muted">
            Track 12-digit Tracking IDs for Smart CNIC, NICOP, Child Certificate (CRC), and Family Registration (FRC).
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-surface hover:bg-primary-light shadow-xs"
        >
          <Printer className="size-4" /> Print B&W Guide
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Enter 12-Digit Pak-ID Tracking ID
          </label>
          <input
            type="text"
            maxLength={12}
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="123456789012"
            className="w-full rounded-2xl border border-border bg-bg px-4 py-3 font-mono text-sm font-bold text-fg outline-none focus:border-primary tracking-widest"
          />
        </div>

        <div className="rounded-2xl border border-border bg-bg/50 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-primary text-xs">Official Pak-ID Tracking Link</span>
            <a
              href="https://id.nadra.gov.pk"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-surface hover:bg-primary-light shadow-xs"
            >
              Open Pak-ID Tracking Portal <ExternalLink className="size-3.5" />
            </a>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Standard turnaround timelines: Normal delivery takes 30 days, Urgent takes 15 days, and Executive Mega Centers take 7 working days.
          </p>
        </div>
      </div>
    </div>
  );
}
