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
  Sun,
  Flame,
  Laptop,
  Hammer,
  Droplet,
  Smartphone,
  Plane,
  HeartHandshake,
  ShieldPlus,
  Briefcase,
  GraduationCap,
  Bot,
  Building,
  Printer,
  Share2,
  Copy,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { useState, useMemo } from "react";

// Existing Components
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

// New Suite Components
import { SolarNetMeteringCalculator } from "@/components/solar-net-metering-calculator";
import { ElectricityBillCalculator } from "@/components/electricity-bill-calculator";
import { GasBillCalculator } from "@/components/gas-bill-calculator";
import { FreelancerTaxCalculator } from "@/components/freelancer-tax-calculator";
import { MotorwayTollCalculator } from "@/components/motorway-toll-calculator";
import { RentAgreementGenerator } from "@/components/rent-agreement-generator";
import { VehicleSaleAgreementGenerator } from "@/components/vehicle-sale-agreement-generator";
import { PropertyBayanaGenerator } from "@/components/property-bayana-generator";
import { ShajraNasabBuilder } from "@/components/shajra-nasab-builder";
import { CourtFeeCalculator } from "@/components/court-fee-calculator";
import { ConstructionCostCalculator } from "@/components/construction-cost-calculator";
import { WaterBoringTankerGuide } from "@/components/water-boring-tanker-guide";
import { PtaMobileTaxCalculator } from "@/components/pta-mobile-tax-calculator";
import { OverseasProtectorGuide } from "@/components/overseas-protector-guide";
import { EmergencyBloodAppealGenerator } from "@/components/emergency-blood-appeal-generator";
import { SehatCardGuide } from "@/components/sehat-card-guide";
import { PocketEmergencyCard } from "@/components/pocket-emergency-card";
import { SarkariJobBiodataGenerator } from "@/components/sarkari-job-biodata-generator";
import { CssPmsEligibilityChecker } from "@/components/css-pms-eligibility-checker";
import { IbccEquivalenceCalculator } from "@/components/ibcc-equivalence-calculator";
import { PakWakilAi } from "@/components/pak-wakil-ai";
import { ConsumerCourtNoticeDrafter } from "@/components/consumer-court-notice-drafter";
import { FiaCybercrimeDrafter } from "@/components/fia-cybercrime-drafter";
import { DistrictCivicDirectory } from "@/components/district-civic-directory";

export const Route = createFileRoute("/tools")({
  component: ToolsPage,
});

type ToolCategory = "all" | "solar_energy" | "tax_finance" | "legal_contracts" | "property_living" | "overseas_travel" | "jobs_youth" | "emergency_safety";

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
  // 1. AI & Core Legal
  { id: "solar", name: "Solar Net-Metering & Slab Calculator", nameUrdu: "سولر نیٹ میٹرنگ و یونٹ بچت", desc: "System Size, ROI & Payback", icon: Sun, category: "solar_energy", badge: "Live" },
  { id: "pak_wakil", name: "PakWakil AI Legal Assistant", nameUrdu: "پاک وکیل معاون", desc: "AI Legal & Civic Bot", icon: Bot, category: "legal_contracts", badge: "AI Smart" },
  { id: "electricity", name: "Electricity Bill & Slabs", nameUrdu: "بجلی بل و سلیب", desc: "NEPRA Slabs & FPA", icon: Zap, category: "solar_energy", badge: "Live" },
  { id: "gas", name: "Gas Bill Estimator", nameUrdu: "گیس بل کیلکولیٹر", desc: "SNGPL & SSGC Slabs", icon: Flame, category: "solar_energy", badge: "Live" },
  
  // 2. Tax & Finance
  { id: "salary_tax", name: "Salary Income Tax", nameUrdu: "تنخواہ انکم ٹیکس", desc: "FBR Slabs & Surcharge", icon: Calculator, category: "tax_finance", badge: "FBR 2026" },
  { id: "freelancer", name: "Freelancer 0.25% Tax", nameUrdu: "فری لانسر آئی ٹی ٹیکس", desc: "PSEB & International Invoice", icon: Laptop, category: "tax_finance", badge: "0.25% IT" },
  { id: "zakat", name: "Zakat & Ushr Calculator", nameUrdu: "زکوٰۃ و عشر کیلکولیٹر", desc: "Gold, Silver & Live Nisab", icon: Coins, category: "tax_finance", badge: "Live" },
  { id: "vehicle_tax", name: "Vehicle Token Tax", nameUrdu: "گاڑی ٹوکن و ٹرانسفر", desc: "Filer vs Non-Filer WHT", icon: Car, category: "tax_finance", badge: "Updated" },
  { id: "court_fee", name: "Court Fee Schedule", nameUrdu: "عدالتی کورٹ فیس", desc: "7.5% Ad-valorem Stamps", icon: Scale, category: "tax_finance", badge: "Live" },
  { id: "fee", name: "Official Fee Guide", nameUrdu: "سرکاری فیس گائیڈ", desc: "NADRA, Passport, DLIMS", icon: Zap, category: "tax_finance", badge: "Live" },
  { id: "inheritance", name: "Inheritance Calculator", nameUrdu: "اسلامی وراثت تقسیم", desc: "Shariah Faraid Shares", icon: FileText, category: "tax_finance", badge: "Live" },

  // 3. Legal Contracts & Deeds
  { id: "rent_agreement", name: "Rent Agreement Drafter", nameUrdu: "کرایہ نامہ برائے رہائش", desc: "Punjab Rented Premises Act", icon: Scale, category: "legal_contracts", badge: "e-Stamp" },
  { id: "vehicle_sale", name: "Vehicle Sale Receipt", nameUrdu: "اقرار نامہ بیع گاڑی", desc: "Legal Seller Indemnity", icon: Car, category: "legal_contracts", badge: "Live" },
  { id: "property_bayana", name: "Property Bayana", nameUrdu: "بیعانہ اقرار نامہ", desc: "Earnest Token Money", icon: Building, category: "legal_contracts", badge: "Live" },
  { id: "shajra_nasab", name: "Shajra-e-Nasab Drafter", nameUrdu: "شجرہ نسب چارٹ", desc: "Succession Family Tree", icon: Sparkles, category: "legal_contracts", badge: "Live" },
  { id: "poa", name: "Power of Attorney", nameUrdu: "مختار نامہ عام و خاص", desc: "Property, Courts & MOFA", icon: FileCheck, category: "legal_contracts", badge: "Live" },
  { id: "affidavit", name: "Affidavit Drafter", nameUrdu: "حلف نامہ / بیان حلفی", desc: "5 Legal E-Stamp Deeds", icon: FileCheck2, category: "legal_contracts", badge: "Live" },
  { id: "consumer_court", name: "Consumer Court Notice", nameUrdu: "صارف عدالت نوٹس", desc: "15-Day Statutory Notice", icon: Scale, category: "legal_contracts", badge: "Live" },
  { id: "fia_cybercrime", name: "FIA Cybercrime Drafter", nameUrdu: "ایف آئی اے سائبر کرائم", desc: "OTP & Online Scam Report", icon: ShieldAlert, category: "legal_contracts", badge: "Live" },

  // 4. Property & Living
  { id: "construction", name: "Construction Cost", nameUrdu: "گھر کی تعمیر لاگت", desc: "Grey vs Turnkey Material", icon: Hammer, category: "property_living", badge: "2026 Rates" },
  { id: "water_boring", name: "Water Boring & Tankers", nameUrdu: "پانی کی بورنگ و ٹینکر", desc: "Depth & Official Helplines", icon: Droplet, category: "property_living", badge: "Live" },
  { id: "motorway", name: "Motorway Toll & M-Tag", nameUrdu: "موٹروے ٹول ٹیکس", desc: "M-1 to M-9 NHA Rates", icon: Compass, category: "property_living", badge: "Live" },

  // 5. Identity & Security
  { id: "cnic_decoder", name: "CNIC 13-Digit Decoder", nameUrdu: "شناختی کارڈ تجزیہ", desc: "Province, Division & Origin", icon: IdCard, category: "overseas_travel", badge: "Private" },
  { id: "vault", name: "Encrypted Vault", nameUrdu: "محفوظ دستاویزات والٹ", desc: "Client-Side AES-256-GCM", icon: Lock, category: "overseas_travel", badge: "Encrypted" },
  { id: "readiness", name: "Check My File", nameUrdu: "فائل آڈٹ و جانچ", desc: "Document Readiness Audit", icon: FileCheck2, category: "overseas_travel", badge: "Live" },
  { id: "tracker", name: "Expiry Tracker", nameUrdu: "تجدید و معیاد ٹریکر", desc: "CNIC, Passport & DLIMS", icon: Calendar, category: "overseas_travel", badge: "Live" },

  // 6. Overseas & Travel
  { id: "pta_tax", name: "PTA Mobile Tax", nameUrdu: "پی ٹی اے موبائل ٹیکس", desc: "Passport vs CNIC DIRBS", icon: Smartphone, category: "overseas_travel", badge: "DIRBS" },
  { id: "protector", name: "Overseas Protector", nameUrdu: "پروٹیکٹر و ایئرپورٹ", desc: "State Life & Exit Rules", icon: Plane, category: "overseas_travel", badge: "Live" },

  // 7. Jobs & Youth
  { id: "sarkari_job", name: "Sarkari Job Bio-Data", nameUrdu: "سرکاری نوکری بائیو ڈیٹا", desc: "PPSC / FPSC Print Form", icon: Briefcase, category: "jobs_youth", badge: "Live" },
  { id: "css_age", name: "CSS & PMS Eligibility", nameUrdu: "سی ایس ایس عمر اہلیت", desc: "31st Dec Cutoff & Relaxations", icon: GraduationCap, category: "jobs_youth", badge: "Live" },
  { id: "ibcc", name: "IBCC Equivalence", nameUrdu: "تعلیمی مساوات کیلکولیٹر", desc: "O/A Level to Matric/FSc", icon: GraduationCap, category: "jobs_youth", badge: "Live" },

  // 8. Health & Safety
  { id: "blood_appeal", name: "Urgent Blood Appeal", nameUrdu: "ایمرجنسی خون اپیل", desc: "WhatsApp Broadcast & 1122", icon: HeartHandshake, category: "emergency_safety", badge: "Emergency" },
  { id: "sehat_card", name: "Sehat Sahulat Card", nameUrdu: "صحت کارڈ علاج گائیڈ", desc: "8500 SMS & PKR 1M Limit", icon: ShieldPlus, category: "emergency_safety", badge: "Live" },
  { id: "pocket_card", name: "Emergency Citizen Card", nameUrdu: "ایمرجنسی شناختی کارڈ", desc: "Printable Wallet Card", icon: IdCard, category: "emergency_safety", badge: "Live" },
  { id: "district_dir", name: "District Directory", nameUrdu: "ضلعی دفاتر ڈائریکٹری", desc: "DC, PLRA & Police Khidmat", icon: MapPin, category: "emergency_safety", badge: "Live" },
  { id: "centers", name: "24/7 Mega Centers", nameUrdu: "نادرا میگا سینٹرز", desc: "Executive Centers Map", icon: MapPin, category: "emergency_safety", badge: "Live" },
  { id: "scams", name: "Agent Scam Radar", nameUrdu: "ایجنٹ فراڈ راڈار", desc: "Blacklist & Red Flags", icon: ShieldAlert, category: "emergency_safety", badge: "Live" },
];

function ToolsPage() {
  const [activeTool, setActiveTool] = useState<string>("solar");
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedShare, setCopiedShare] = useState(false);

  const activeToolObj = useMemo(() => {
    return MASTER_TOOLS.find((t) => t.id === activeTool) || MASTER_TOOLS[0];
  }, [activeTool]);

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

  const handleShareWhatsApp = () => {
    const shareText = `Check out this Pakistani Citizen Tool on 47 Say Ab Tak: ${activeToolObj.name} (${activeToolObj.nameUrdu}) - https://47sayabtak.com/tools?tool=${activeTool}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      {/* Top Header & Economic Ticker */}
      <div className="rounded-3xl bg-primary text-surface p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-surface/15 px-3.5 py-1 text-xs font-bold text-accent">
              <Sparkles className="size-3.5" /> 35 Complete Citizen Utilities & Legal Hub
            </div>
            <h1 className="mt-2 font-display text-2xl sm:text-4xl font-black tracking-tight text-surface">
              47 Say Ab Tak — Citizen Tools Hub
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-surface/85 max-w-xl">
              Real-time calculations for Solar Net-Metering, Electricity Slabs, Rent Agreements, Taxes, and Legal Deeds.
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-80">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 size-4 text-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 35 citizen tools..."
                className="w-full rounded-2xl bg-surface text-fg pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold outline-none shadow-md placeholder:text-muted focus:ring-2 focus:ring-accent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 rounded-lg bg-bg px-2 py-1 text-[10px] font-bold text-muted"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Super-Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Category Tabs & 35-Tool Navigator */}
        <div className="lg:col-span-4 space-y-4">
          {/* Category Filter Pills (Horizontal Scroll on Mobile, Vertical Stack on Desktop) */}
          <div className="rounded-3xl border border-border bg-surface p-4 shadow-card space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">Categories</span>
            <div className="flex flex-wrap lg:flex-col gap-1.5">
              {[
                { id: "all", label: "All Utilities (35)", icon: Sparkles },
                { id: "solar_energy", label: "☀️ Solar & Energy", icon: Sun },
                { id: "tax_finance", label: "💰 Taxes & Finance", icon: Calculator },
                { id: "legal_contracts", label: "📜 Legal Agreements", icon: Scale },
                { id: "property_living", label: "🏗️ Property & Living", icon: Building },
                { id: "overseas_travel", label: "📱 Overseas & Travel", icon: Smartphone },
                { id: "jobs_youth", label: "🎓 Jobs & Youth", icon: GraduationCap },
                { id: "emergency_safety", label: "🏥 Emergency & Safety", icon: HeartHandshake },
              ].map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={
                      "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all text-left " +
                      (isSelected
                        ? "bg-primary text-surface shadow-sm font-black"
                        : "bg-bg/60 text-muted hover:text-fg hover:bg-bg")
                    }
                  >
                    <span>{cat.label}</span>
                    {isSelected && <ChevronRight className="size-3.5 shrink-0 hidden lg:block" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Available Citizen Tools List */}
          <div className="rounded-3xl border border-border bg-surface p-4 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                Available Tools ({filteredTools.length})
              </span>
            </div>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredTools.map((t) => {
                const Icon = t.icon;
                const isActive = activeTool === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setActiveTool(t.id);
                      const el = document.getElementById("active-workbench-canvas");
                      if (el && window.innerWidth < 1024) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                    className={
                      "w-full flex items-center justify-between gap-3 rounded-2xl p-2.5 text-left transition-all border " +
                      (isActive
                        ? "bg-primary text-surface border-primary shadow-md scale-[1.01]"
                        : "bg-bg/40 hover:bg-bg border-border text-fg hover:border-primary/40")
                    }
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={
                          "grid size-8 place-items-center rounded-xl shrink-0 " +
                          (isActive ? "bg-white/20 text-accent" : "bg-primary/10 text-primary")
                        }
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold truncate">{t.name}</span>
                        <span
                          className={
                            "block text-[10px] truncate " +
                            (isActive ? "text-white/80" : "text-muted")
                          }
                        >
                          {t.desc}
                        </span>
                      </div>
                    </div>
                    {t.badge && (
                      <span
                        className={
                          "rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase shrink-0 " +
                          (isActive ? "bg-accent text-[#01411c]" : "bg-primary/10 text-primary")
                        }
                      >
                        {t.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Tool Canvas & Action Toolbar */}
        <div id="active-workbench-canvas" className="lg:col-span-8 space-y-4 scroll-mt-20">
          {/* Action Toolbar Header */}
          <div className="rounded-3xl border border-border bg-surface p-4 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="rounded-xl bg-primary/10 px-2.5 py-1 text-xs font-black text-primary uppercase">
                {activeToolObj.category.replace("_", " ")}
              </span>
              <span className="text-xs text-muted font-medium font-urdu">
                {activeToolObj.nameUrdu}
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-sm"
              >
                <Share2 className="size-3.5" /> Share on WhatsApp
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-border bg-bg px-3.5 py-2 text-xs font-bold text-fg hover:bg-surface transition-all"
              >
                <Printer className="size-3.5" /> Print / Save Report
              </button>
            </div>
          </div>

          {/* Active Utility Canvas Component */}
          <div>
            {activeTool === "solar" && <SolarNetMeteringCalculator />}
            {activeTool === "pak_wakil" && <PakWakilAi />}
            {activeTool === "electricity" && <ElectricityBillCalculator />}
            {activeTool === "gas" && <GasBillCalculator />}
            {activeTool === "freelancer" && <FreelancerTaxCalculator />}
            {activeTool === "salary_tax" && <SalaryTaxCalculator />}
            {activeTool === "zakat" && <ZakatCalculator />}
            {activeTool === "vehicle_tax" && <VehicleTaxCalculator />}
            {activeTool === "court_fee" && <CourtFeeCalculator />}
            {activeTool === "fee" && <FeeCalculator />}
            {activeTool === "inheritance" && <InheritanceCalculator />}
            
            {activeTool === "rent_agreement" && <RentAgreementGenerator />}
            {activeTool === "vehicle_sale" && <VehicleSaleAgreementGenerator />}
            {activeTool === "property_bayana" && <PropertyBayanaGenerator />}
            {activeTool === "shajra_nasab" && <ShajraNasabBuilder />}
            {activeTool === "poa" && <PowerOfAttorneyGenerator />}
            {activeTool === "affidavit" && <AffidavitGenerator />}
            {activeTool === "consumer_court" && <ConsumerCourtNoticeDrafter />}
            {activeTool === "fia_cybercrime" && <FiaCybercrimeDrafter />}

            {activeTool === "construction" && <ConstructionCostCalculator />}
            {activeTool === "water_boring" && <WaterBoringTankerGuide />}
            {activeTool === "motorway" && <MotorwayTollCalculator />}

            {activeTool === "cnic_decoder" && <CnicDecoder />}
            {activeTool === "vault" && <CitizenVault />}
            {activeTool === "readiness" && <FileReadinessChecker />}
            {activeTool === "tracker" && <DocumentExpiryTracker />}

            {activeTool === "pta_tax" && <PtaMobileTaxCalculator />}
            {activeTool === "protector" && <OverseasProtectorGuide />}

            {activeTool === "sarkari_job" && <SarkariJobBiodataGenerator />}
            {activeTool === "css_age" && <CssPmsEligibilityChecker />}
            {activeTool === "ibcc" && <IbccEquivalenceCalculator />}

            {activeTool === "blood_appeal" && <EmergencyBloodAppealGenerator />}
            {activeTool === "sehat_card" && <SehatCardGuide />}
            {activeTool === "pocket_card" && <PocketEmergencyCard />}
            {activeTool === "district_dir" && <DistrictCivicDirectory />}
            {activeTool === "centers" && <CentersMap />}
            {activeTool === "scams" && <ScamRadar />}
          </div>
        </div>
      </div>
    </div>
  );
}
