import { useState } from "react";
import { CloudRain, AlertTriangle, PhoneCall, ShieldAlert, Printer } from "lucide-react";

export function NdmaDisasterAlerts() {
  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-8 space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-600">
            <CloudRain className="size-3.5" /> PMD & NDMA National Hazard Tracker
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-primary sm:text-3xl">
            National Disaster & Smog Alert Monitor
          </h2>
          <p className="mt-1 text-xs text-muted">
            Official Pakistan Meteorological Dept weather warnings, flood alerts, and 24/7 disaster response helplines.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-surface hover:bg-primary-light shadow-xs"
        >
          <Printer className="size-4" /> Print Emergency Directory
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800">NDMA National Helpline</span>
          <div className="font-mono text-2xl font-black text-rose-950 mt-1">1129</div>
          <span className="text-[11px] text-rose-800 mt-1 block">Toll-Free 24/7 Disaster Desk</span>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Rescue 1122</span>
          <div className="font-mono text-2xl font-black text-emerald-950 mt-1">1122</div>
          <span className="text-[11px] text-emerald-800 mt-1 block">Punjab, KP, Balochistan, ICT</span>
        </div>
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800">Motorway Police (NH&MP)</span>
          <div className="font-mono text-2xl font-black text-blue-950 mt-1">130</div>
          <span className="text-[11px] text-blue-800 mt-1 block">Highway Emergency & Closures</span>
        </div>
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-800">PDMA Sindh Control</span>
          <div className="font-mono text-lg font-black text-purple-950 mt-1">021-99332003</div>
          <span className="text-[11px] text-purple-800 mt-1 block">Monsoon & Flood Control</span>
        </div>
      </div>
    </div>
  );
}
