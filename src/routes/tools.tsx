import { createFileRoute } from "@tanstack/react-router";
import {
  Calculator,
  Calendar,
  Car,
  CheckCircle2,
  Coins,
  Compass,
  ExternalLink,
  FileCheck,
  FileCheck2,
  FileText,
  IdCard,
  Lock,
  MapPin,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState, useMemo } from "react";
import { CitizenVault } from "@/components/citizen-vault";
import { FeeCalculator } from "@/components/fee-calculator";
import { InheritanceCalculator } from "@/components/inheritance-calculator";
import { AffidavitGenerator } from "@/components/affidavit-generator";
import { CentersMap } from "@/components/centers-map";
import { ScamRadar } from "@/components/scam-radar";
import { FileReadinessChecker } from "@/components/file-readiness-checker";
import { DocumentExpiryTracker } from "@/components/document-expiry-tracker";
import { SalaryTaxCalculator } from "@/components/salary-tax-calculator";
import { CnicDecoder } from "@/components/cnic-decoder";
import { ZakatCalculator } from "@/components/zakat-calculator";
import { PowerOfAttorneyGenerator } from "@/components/power-of-attorney-generator";
import { VehicleTaxCalculator } from "@/components/vehicle-tax-calculator";

export const Route = createFileRoute("/tools")({
  component: ToolsPage,
});

type ToolCategory = "all" | "finance" | "legal" | "identity" | "verification";

interface ToolItem {
  id: string;
  name: string;
  nameUrdu: string;
  desc: string;
  icon: any;
  category: ToolCategory;
  badge?: string;
}

const MASTER_TOOLS: ToolItem[] = [
  {
    id: "salary_tax",
    name: "Salary Income Tax",
    nameUrdu: "تنخواہ انکم ٹیکس",
    desc: "FY 2025–2026 FBR Slabs",
    icon: Calculator,
    category: "finance",
    badge: "FBR 2026",
  },
  {
    id: "cnic_decoder",
    name: "CNIC 13-Digit Decoder",
    nameUrdu: "شناختی کارڈ تجزیہ",
    desc: "Province, Division & Origin",
    icon: IdCard,
    category: "identity",
    badge: "100% Private",
  },
  {
    id: "zakat",
    name: "Zakat & Ushr",
    nameUrdu: "زکوٰۃ و عشر کیلکولیٹر",
    desc: "Gold, Silver & Live Nisab",
    icon: Coins,
    category: "finance",
    badge: "Live Nisab",
  },
  {
    id: "poa",
    name: "Power of Attorney",
    nameUrdu: "مختار نامہ عام و خاص",
    desc: "Property, Courts & MOFA",
    icon: Scale,
    category: "legal",
    badge: "e-Stamp Deed",
  },
  {
    id: "vehicle_tax",
    name: "Vehicle Transfer & Token",
    nameUrdu: "گاڑی ٹرانسفر و ٹوکن ٹیکس",
    desc: "Filer vs Non-Filer WHT PSID",
    icon: Car,
    category: "finance",
    badge: "e-Pay 1Bill",
  },
  {
    id: "vault",
    name: "Encrypted Vault",
    nameUrdu: "محفوظ دستاویزات والٹ",
    desc: "Client-Side AES-256-GCM",
    icon: Lock,
    category: "identity",
    badge: "Encrypted",
  },
  {
    id: "affidavit",
    name: "Affidavit Drafter",
    nameUrdu: "حلف نامہ / بیان حلفی",
    desc: "5 Legal E-Stamp Templates",
    icon: FileCheck,
    category: "legal",
    badge: "Judicial",
  },
  {
    id: "fee",
    name: "Fee Calculator",
    nameUrdu: "سرکاری فیس کیلکولیٹر",
    desc: "NADRA, Passport, DLIMS, Land",
    icon: Zap,
    category: "finance",
  },
  {
    id: "readiness",
    name: "Check My File",
    nameUrdu: "فائل آڈٹ و جانچ",
    desc: "Interactive Document Checklist",
    icon: FileCheck2,
    category: "identity",
  },
  {
    id: "tracker",
    name: "Expiry Tracker",
    nameUrdu: "تجدید و معیاد ٹریکر",
    desc: "CNIC, Passport & License Renewal",
    icon: Calendar,
    category: "identity",
  },
  {
    id: "centers",
    name: "24/7 Mega Centers",
    nameUrdu: "نادرا میگا سینٹرز",
    desc: "Executive Centers & Timings",
    icon: MapPin,
    category: "verification",
  },
  {
    id: "scams",
    name: "Scam Radar",
    nameUrdu: "ایجنٹ فراڈ راڈار",
    desc: "Agent Blacklist & Red Flags",
    icon: ShieldAlert,
    category: "verification",
  },
  {
    id: "inheritance",
    name: "Inheritance Calculator",
    nameUrdu: "اسلامی وراثت تقسیم",
    desc: "Shariah Faraid Shares",
    icon: FileText,
    category: "legal",
  },
];

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
  const [activeTool, setActiveTool] = useState<string>("salary_tax");
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    return MASTER_TOOLS.filter((t) => {
      const matchCat = activeCategory === "all" || t.category === activeCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.nameUrdu.includes(searchQuery) ||
        t.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          <Sparkles className="size-3.5" /> 13 Complete Citizen Utilities & Legal Command Center
        </div>
        <h1 className="font-display text-3xl font-black text-primary sm:text-5xl tracking-tight">
          Citizen Civic Tools & Encrypted Vault
        </h1>
        <p className="mx-auto max-w-2xl text-xs sm:text-sm text-muted leading-relaxed font-medium">
          Calculate FBR income tax deductions, decode CNIC jurisdictions, calculate Zakat & Ushr against live Nisab, draft Power of Attorney deeds, calculate vehicle token tax, and seal sensitive documents with AES-256 encryption.
        </p>

        {/* Search & Category Filter Header Bar */}
        <div className="mx-auto mt-6 max-w-3xl space-y-3">
          {/* Search Input */}
          <div className="relative flex items-center">
            <Search className="absolute left-4 size-4 text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 13 tools (e.g. Salary tax, CNIC decoder, Zakat, Power of Attorney, Vehicle tax, NADRA)..."
              className="w-full rounded-2xl border border-primary/30 bg-surface pl-11 pr-4 py-3 text-xs sm:text-sm font-medium text-fg shadow-sm outline-none focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 rounded-lg bg-bg px-2 py-1 text-[11px] font-bold text-muted hover:text-fg"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {[
              { id: "all", label: "All Utilities (13)" },
              { id: "finance", label: "💰 Taxes & Financial" },
              { id: "legal", label: "📄 Legal & Affidavits" },
              { id: "identity", label: "🪪 Identity & Security" },
              { id: "verification", label: "🏛️ Centers & Scam Radar" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as any)}
                className={
                  "rounded-xl px-3 py-1.5 text-xs font-bold transition-all " +
                  (activeCategory === cat.id
                    ? "bg-primary text-surface shadow-xs scale-105"
                    : "bg-surface border border-border text-muted hover:text-fg hover:border-primary/40")
                }
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Master Tool Switcher Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 rounded-3xl border-2 border-primary/20 bg-surface p-2.5 sm:p-3 shadow-card">
          {filteredTools.map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActiveTool(t.id);
                  const el = document.getElementById("active-utility-section");
                  if (el && window.innerWidth < 768) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className={
                  "flex flex-col sm:flex-row items-start sm:items-center gap-2.5 rounded-2xl p-3 text-left transition-all border relative overflow-hidden " +
                  (isActive
                    ? "bg-primary text-surface border-primary shadow-md scale-[1.02]"
                    : "bg-bg/40 hover:bg-bg border-border text-fg hover:border-primary/40")
                }
              >
                <div
                  className={
                    "grid size-8 sm:size-9 place-items-center rounded-xl shrink-0 " +
                    (isActive ? "bg-white/20 text-accent" : "bg-primary/10 text-primary")
                  }
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="block text-xs font-black truncate">{t.name}</span>
                    {t.badge && (
                      <span
                        className={
                          "hidden xl:inline-block rounded-md px-1.5 py-0.2 text-[9px] font-black uppercase " +
                          (isActive ? "bg-accent text-[#01411c]" : "bg-primary/10 text-primary")
                        }
                      >
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={
                      "block text-[10px] font-medium truncate " +
                      (isActive ? "text-white/80" : "text-muted")
                    }
                  >
                    {t.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Civic Utility Panel */}
      <div id="active-utility-section" className="mt-8 scroll-mt-20">
        {activeTool === "salary_tax" && <SalaryTaxCalculator />}
        {activeTool === "cnic_decoder" && <CnicDecoder />}
        {activeTool === "zakat" && <ZakatCalculator />}
        {activeTool === "poa" && <PowerOfAttorneyGenerator />}
        {activeTool === "vehicle_tax" && <VehicleTaxCalculator />}
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
      <div className="mt-20 border-t border-border/80 pt-12">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="size-3.5" /> Direct Service Directory
          </div>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-primary">
            Official Portals & Verification APIs
          </h2>
          <p className="mt-1 text-xs text-muted">
            Direct authenticated links to official Pakistani government portals.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
