import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calculator,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  ExternalLink,
  FileCheck,
  FileCheck2,
  HardDrive,
  Landmark,
  Lock,
  MapPin,
  Receipt,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { CitizenVault } from "@/components/citizen-vault";
import { FeeCalculator } from "@/components/fee-calculator";
import { InheritanceCalculator } from "@/components/inheritance-calculator";
import { AffidavitGenerator } from "@/components/affidavit-generator";
import { CentersMap } from "@/components/centers-map";
import { ScamRadar } from "@/components/scam-radar";
import { FileReadinessChecker } from "@/components/file-readiness-checker";
import { DocumentExpiryTracker } from "@/components/document-expiry-tracker";
import { AdUnit } from "@/components/ads/ad-unit";

export const Route = createFileRoute("/tools")({
  component: ToolsPage,
});

const OFFICIAL_DIRECT_SERVICES = [
  {
    name: "Pak-ID Portal (NADRA)",
    dept: "NADRA Federal",
    url: "https://id.nadra.gov.pk",
    desc: "Apply online for CNIC renewal, lost duplicate, FRC, and succession certificate without visiting centers.",
    features: ["Digital Fingerprint Mobile Capture", "International Home Delivery", "Online Fee via Card"],
  },
  {
    name: "e-Pay Punjab (1Bill PSID Generator)",
    dept: "Finance Department",
    url: "https://epay.punjab.gov.pk",
    desc: "Generate 17-digit PSID for Token Tax, Vehicle Transfer, Driving License, and E-Stamping.",
    features: ["Instant PSID Generation", "Pay via EasyPaisa / JazzCash", "Zero Bank Counter Queue"],
  },
  {
    name: "DLIMS License Verification",
    dept: "Traffic Police",
    url: "https://dlims.punjab.gov.pk",
    desc: "Verify driving license authenticity, check penalty points, and track card delivery.",
    features: ["Check by CNIC", "Track Courier Dispatch", "Learner Expiry Reminder"],
  },
  {
    name: "e-Stamping Portal (Punjab / Sindh)",
    dept: "Board of Revenue",
    url: "https://es.punjab.gov.pk",
    desc: "Generate Challan 32-A and verify the 16-character security code of judicial/non-judicial stamp papers.",
    features: ["DC Rate Property Calculator", "16-Digit QR Code Verification", "Direct Bank Payment"],
  },
  {
    name: "FBR Active Taxpayer (ATL) Inquiry",
    dept: "Federal Board of Revenue",
    url: "https://iris.fbr.gov.pk",
    desc: "Check active filer status to qualify for reduced tax rates on property and vehicle purchases.",
    features: ["Instant ATL Status via CNIC", "Online NTN Verification", "Save 50% on Withholding Tax"],
  },
  {
    name: "DGIP Passport Online Tracking",
    dept: "Passport Directorate",
    url: "https://onlinemrp.dgip.gov.pk",
    desc: "Track the printing and regional delivery progress of machine readable passports.",
    features: ["11-Digit Token Tracking", "SMS Notification Status", "Executive Center Queue Info"],
  },
];

function ToolsPage() {
  const [activeTool, setActiveTool] = useState<"vault" | "fee" | "readiness" | "tracker" | "centers" | "scams" | "inheritance" | "affidavit">("vault");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Page Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          <Sparkles className="size-3.5" /> 8 Complete Citizen Utilities & Encrypted Vault
        </div>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-primary sm:text-5xl">
          Citizen Tools & Encrypted Vault
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted">
          Upload and seal your citizen documents with AES-256-GCM encryption, audit physical files, track document expiries, locate 24/7 Mega Centers, calculate fees, and draft affidavits.
        </p>

        {/* Master Tool Switcher */}
        <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-primary/20 bg-surface p-2 shadow-card">
          <button
            type="button"
            onClick={() => setActiveTool("vault")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
              activeTool === "vault" ? "bg-primary text-surface shadow-md" : "text-muted hover:text-primary"
            }`}
          >
            <Lock className="size-4 text-accent" /> Encrypted Vault
          </button>

          <button
            type="button"
            onClick={() => setActiveTool("fee")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
              activeTool === "fee" ? "bg-primary text-surface shadow-md" : "text-muted hover:text-primary"
            }`}
          >
            <Calculator className="size-4 text-accent" /> Fee & Tax Calculator
          </button>

          <button
            type="button"
            onClick={() => setActiveTool("readiness")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
              activeTool === "readiness" ? "bg-primary text-surface shadow-md" : "text-muted hover:text-primary"
            }`}
          >
            <FileCheck2 className="size-4 text-accent" /> "Check My File"
          </button>

          <button
            type="button"
            onClick={() => setActiveTool("tracker")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
              activeTool === "tracker" ? "bg-primary text-surface shadow-md" : "text-muted hover:text-primary"
            }`}
          >
            <Calendar className="size-4 text-accent" /> Expiry Tracker
          </button>

          <button
            type="button"
            onClick={() => setActiveTool("centers")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
              activeTool === "centers" ? "bg-primary text-surface shadow-md" : "text-muted hover:text-primary"
            }`}
          >
            <MapPin className="size-4 text-accent" /> 24/7 Centers & Mouza
          </button>

          <button
            type="button"
            onClick={() => setActiveTool("scams")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
              activeTool === "scams" ? "bg-primary text-surface shadow-md" : "text-muted hover:text-primary"
            }`}
          >
            <ShieldAlert className="size-4 text-accent" /> Agent Scam Radar
          </button>

          <button
            type="button"
            onClick={() => setActiveTool("inheritance")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
              activeTool === "inheritance" ? "bg-primary text-surface shadow-md" : "text-muted hover:text-primary"
            }`}
          >
            <Scale className="size-4 text-accent" /> Inheritance (Faraid)
          </button>

          <button
            type="button"
            onClick={() => setActiveTool("affidavit")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
              activeTool === "affidavit" ? "bg-primary text-surface shadow-md" : "text-muted hover:text-primary"
            }`}
          >
            <FileCheck className="size-4 text-accent" /> Affidavit Generator
          </button>
        </div>

        {/* 🎯 GOOGLE ADSENSE LEADERBOARD AD */}
        <div className="mx-auto max-w-4xl my-8">
          <AdUnit format="leaderboard" label="Citizen Utility Sponsor / Google Ad" />
        </div>
      </div>

      {/* Active Civic Utility */}
      <div className="mt-8">
        {activeTool === "vault" && <CitizenVault />}
        {activeTool === "fee" && <FeeCalculator />}
        {activeTool === "readiness" && <FileReadinessChecker />}
        {activeTool === "tracker" && <DocumentExpiryTracker />}
        {activeTool === "centers" && <CentersMap />}
        {activeTool === "scams" && <ScamRadar />}
        {activeTool === "inheritance" && <InheritanceCalculator />}
        {activeTool === "affidavit" && <AffidavitGenerator />}
      </div>

      {/* Official Government Direct Service Endpoints */}
      <div className="mt-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="size-3.5" /> Direct Service Directory
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold text-primary">
            Official Portals & Verification APIs
          </h2>
          <p className="mt-1 text-xs text-muted">
            Direct authenticated links to official Pakistani government portals.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {OFFICIAL_DIRECT_SERVICES.map((svc) => (
            <div
              key={svc.name}
              className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-bg px-2.5 py-0.5 text-[10px] font-bold text-accent">
                    {svc.dept}
                  </span>
                  <ExternalLink className="size-4 text-muted" />
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-primary">{svc.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">{svc.desc}</p>

                <div className="mt-4 space-y-1.5 border-t border-border/80 pt-3">
                  {svc.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-fg/80">
                      <CheckCircle2 className="size-3 text-primary shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <a
                  href={svc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-bg px-4 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-surface transition-colors"
                >
                  Open Official Portal <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
