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
  ArrowLeft,
  ChevronRight,
  Download,
  FileDown,
  Check,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";

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
  colorClass: string;
}

const MASTER_TOOLS: ToolItem[] = [
  // 1. Solar & Energy
  { id: "solar", name: "Solar Net-Metering Calculator", nameUrdu: "سولر نیٹ میٹرنگ و یونٹ بچت", desc: "System Size, ROI & Payback", icon: Sun, category: "solar_energy", badge: "DISCO 3-Phase", colorClass: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
  { id: "electricity", name: "NEPRA Electricity Bill Slabs", nameUrdu: "بجلی بل و سلیب", desc: "NEPRA Slabs & FPA", icon: Zap, category: "solar_energy", badge: "FY 2026", colorClass: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30" },
  { id: "gas", name: "Gas Bill Estimator", nameUrdu: "گیس بل کیلکولیٹر", desc: "SNGPL & SSGC Slabs", icon: Flame, category: "solar_energy", colorClass: "bg-orange-500/15 text-orange-600 border-orange-500/30" },
  
  // 2. AI & Legal
  { id: "pak_wakil", name: "PakWakil AI Legal Assistant", nameUrdu: "پاک وکیل معاون", desc: "AI Legal & Civic Bot", icon: Bot, category: "legal_contracts", badge: "AI Smart", colorClass: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  { id: "rent_agreement", name: "Residential Rent Agreement", nameUrdu: "کرایہ نامہ برائے رہائش", desc: "Punjab Rented Premises Act", icon: Scale, category: "legal_contracts", badge: "e-Stamp", colorClass: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
  { id: "vehicle_sale", name: "Vehicle Sale Receipt", nameUrdu: "اقرار نامہ بیع گاڑی", desc: "Legal Seller Indemnity", icon: Car, category: "legal_contracts", colorClass: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30" },
  { id: "property_bayana", name: "Property Bayana Agreement", nameUrdu: "بیعانہ اقرار نامہ", desc: "Earnest Token Money", icon: Building, category: "legal_contracts", colorClass: "bg-teal-500/15 text-teal-600 border-teal-500/30" },
  { id: "shajra_nasab", name: "Shajra-e-Nasab Drafter", nameUrdu: "شجرہ نسب چارٹ", desc: "Succession Family Tree", icon: Sparkles, category: "legal_contracts", badge: "NADRA/PLRA", colorClass: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  { id: "poa", name: "Power of Attorney (مختار نامہ)", nameUrdu: "مختار نامہ عام و خاص", desc: "Property, Courts & MOFA", icon: FileCheck, category: "legal_contracts", colorClass: "bg-cyan-500/15 text-cyan-600 border-cyan-500/30" },
  { id: "affidavit", name: "Affidavit Drafter (بیان حلفی)", nameUrdu: "حلف نامہ / بیان حلفی", desc: "5 Legal E-Stamp Deeds", icon: FileCheck2, category: "legal_contracts", colorClass: "bg-sky-500/15 text-sky-600 border-sky-500/30" },
  { id: "consumer_court", name: "Consumer Court 15-Day Notice", nameUrdu: "صارف عدالت نوٹس", desc: "15-Day Statutory Notice", icon: Scale, category: "legal_contracts", colorClass: "bg-rose-500/15 text-rose-600 border-rose-500/30" },
  { id: "fia_cybercrime", name: "FIA Cybercrime Complaint", nameUrdu: "ایف آئی اے سائبر کرائم", desc: "OTP & Online Scam Report", icon: ShieldAlert, category: "legal_contracts", colorClass: "bg-red-500/15 text-red-600 border-red-500/30" },

  // 3. Tax & Finance
  { id: "salary_tax", name: "Salary Income Tax Calculator", nameUrdu: "تنخواہ انکم ٹیکس", desc: "FBR Slabs & Surcharge", icon: Calculator, category: "tax_finance", badge: "FBR 2026", colorClass: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  { id: "freelancer", name: "Freelancer 0.25% Tax Suite", nameUrdu: "فری لانسر آئی ٹی ٹیکس", desc: "PSEB & International Invoice", icon: Laptop, category: "tax_finance", badge: "0.25% IT", colorClass: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
  { id: "zakat", name: "Zakat & Ushr Calculator", nameUrdu: "زکوٰۃ و عشر کیلکولیٹر", desc: "Gold, Silver & Live Nisab", icon: Coins, category: "tax_finance", badge: "Live Nisab", colorClass: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
  { id: "vehicle_tax", name: "Vehicle Token Tax Engine", nameUrdu: "گاڑی ٹوکن و ٹرانسفر", desc: "Filer vs Non-Filer WHT", icon: Car, category: "tax_finance", colorClass: "bg-purple-500/15 text-purple-600 border-purple-500/30" },
  { id: "court_fee", name: "Court Fee Schedule", nameUrdu: "عدالتی کورٹ فیس", desc: "7.5% Ad-valorem Stamps", icon: Scale, category: "tax_finance", colorClass: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30" },
  { id: "fee", name: "Official Government Fee Guide", nameUrdu: "سرکاری فیس گائیڈ", desc: "NADRA, Passport, DLIMS", icon: Zap, category: "tax_finance", colorClass: "bg-green-500/15 text-green-600 border-green-500/30" },
  { id: "inheritance", name: "Inheritance Calculator (وراثت)", nameUrdu: "اسلامی وراثت تقسیم", desc: "Shariah Faraid Shares", icon: FileText, category: "tax_finance", colorClass: "bg-teal-500/15 text-teal-600 border-teal-500/30" },

  // 4. Property & Construction
  { id: "construction", name: "Construction Cost Estimator", nameUrdu: "گھر کی تعمیر لاگت", desc: "Grey vs Turnkey Material", icon: Hammer, category: "property_living", badge: "2026 Rates", colorClass: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
  { id: "water_boring", name: "Water Boring & Tankers", nameUrdu: "پانی کی بورنگ و ٹینکر", desc: "Depth & Official Helplines", icon: Droplet, category: "property_living", colorClass: "bg-cyan-500/15 text-cyan-600 border-cyan-500/30" },
  { id: "motorway", name: "Motorway Toll & M-Tag", nameUrdu: "موٹروے ٹول ٹیکس", desc: "M-1 to M-9 NHA Rates", icon: Compass, category: "property_living", colorClass: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },

  // 5. Identity & Security
  { id: "cnic_decoder", name: "CNIC 13-Digit Decoder", nameUrdu: "شناختی کارڈ تجزیہ", desc: "Province, Division & Origin", icon: IdCard, category: "overseas_travel", badge: "100% Private", colorClass: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
  { id: "vault", name: "Citizen Encrypted Vault", nameUrdu: "محفوظ دستاویزات والٹ", desc: "Client-Side AES-256-GCM", icon: Lock, category: "overseas_travel", badge: "Encrypted", colorClass: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  { id: "readiness", name: "Check My File Audit", nameUrdu: "فائل آڈٹ و جانچ", desc: "Document Readiness Audit", icon: FileCheck2, category: "overseas_travel", colorClass: "bg-purple-500/15 text-purple-600 border-purple-500/30" },
  { id: "tracker", name: "Expiry & Renewal Tracker", nameUrdu: "تجدید و معیاد ٹریکر", desc: "CNIC, Passport & DLIMS", icon: Calendar, category: "overseas_travel", colorClass: "bg-orange-500/15 text-orange-600 border-orange-500/30" },

  // 6. Overseas & Travel
  { id: "pta_tax", name: "PTA Mobile Tax (DIRBS)", nameUrdu: "پی ٹی اے موبائل ٹیکس", desc: "Passport vs CNIC DIRBS", icon: Smartphone, category: "overseas_travel", badge: "DIRBS", colorClass: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30" },
  { id: "protector", name: "Protector of Emigrants", nameUrdu: "پروٹیکٹر و ایئرپورٹ", desc: "State Life & Exit Rules", icon: Plane, category: "overseas_travel", colorClass: "bg-sky-500/15 text-sky-600 border-sky-500/30" },

  // 7. Jobs & Youth
  { id: "sarkari_job", name: "Sarkari Job Bio-Data Drafter", nameUrdu: "سرکاری نوکری بائیو ڈیٹا", desc: "PPSC / FPSC Print Form", icon: Briefcase, category: "jobs_youth", colorClass: "bg-teal-500/15 text-teal-600 border-teal-500/30" },
  { id: "css_age", name: "CSS & PMS Age Checker", nameUrdu: "سی ایس ایس عمر اہلیت", desc: "31st Dec Cutoff & Relaxations", icon: GraduationCap, category: "jobs_youth", colorClass: "bg-purple-500/15 text-purple-600 border-purple-500/30" },
  { id: "ibcc", name: "IBCC Equivalence Calculator", nameUrdu: "تعلیمی مساوات کیلکولیٹر", desc: "O/A Level to Matric/FSc", icon: GraduationCap, category: "jobs_youth", colorClass: "bg-blue-500/15 text-blue-600 border-blue-500/30" },

  // 8. Health & Emergency
  { id: "blood_appeal", name: "Urgent Blood Appeal Generator", nameUrdu: "ایمرجنسی خون اپیل", desc: "WhatsApp Broadcast & 1122", icon: HeartHandshake, category: "emergency_safety", badge: "Emergency", colorClass: "bg-rose-500/15 text-rose-600 border-rose-500/30" },
  { id: "sehat_card", name: "Sehat Sahulat Card Guide", nameUrdu: "صحت کارڈ علاج گائیڈ", desc: "8500 SMS & PKR 1M Limit", icon: ShieldPlus, category: "emergency_safety", colorClass: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  { id: "pocket_card", name: "Printable Emergency Card", nameUrdu: "ایمرجنسی شناختی کارڈ", desc: "Printable Wallet Card", icon: IdCard, category: "emergency_safety", colorClass: "bg-red-500/15 text-red-600 border-red-500/30" },
  { id: "district_dir", name: "District Civic Directory", nameUrdu: "ضلعی دفاتر ڈائریکٹری", desc: "DC, PLRA & Police Khidmat", icon: MapPin, category: "emergency_safety", colorClass: "bg-cyan-500/15 text-cyan-600 border-cyan-500/30" },
  { id: "centers", name: "24/7 Mega NADRA Centers", nameUrdu: "نادرا میگا سینٹرز", desc: "Executive Centers Map", icon: MapPin, category: "emergency_safety", colorClass: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  { id: "scams", name: "Agent Scam Radar", nameUrdu: "ایجنٹ فراڈ راڈار", desc: "Blacklist & Red Flags", icon: ShieldAlert, category: "emergency_safety", colorClass: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
];

function ToolsPage() {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync with URL query parameter ?tool=id if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toolParam = params.get("tool");
    if (toolParam && MASTER_TOOLS.some((t) => t.id === toolParam)) {
      setSelectedToolId(toolParam);
    }
  }, []);

  const openTool = (id: string) => {
    setSelectedToolId(id);
    const url = new URL(window.location.href);
    url.searchParams.set("tool", id);
    window.history.pushState({}, "", url.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToAllTools = () => {
    setSelectedToolId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("tool");
    window.history.pushState({}, "", url.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeToolObj = useMemo(() => {
    if (!selectedToolId) return null;
    return MASTER_TOOLS.find((t) => t.id === selectedToolId) || null;
  }, [selectedToolId]);

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
    if (!activeToolObj) return;
    const shareText = `*47 Say Ab Tak — Citizen Utility:* ${activeToolObj.name} (${activeToolObj.nameUrdu})\nOfficial Portal Link: https://47sayabtak.com/tools?tool=${activeToolObj.id}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  const handlePrintBwPdf = () => {
    window.print();
  };

  // ==========================================
  // VIEW MODE A: DEDICATED STANDALONE TOOL PAGE
  // ==========================================
  if (activeToolObj) {
    const Icon = activeToolObj.icon;
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Top Back Navigation Banner */}
        <div className="no-print rounded-2xl border border-primary/20 bg-surface p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={backToAllTools}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-surface hover:bg-primary-light transition-all shadow-xs"
            >
              <ArrowLeft className="size-4" /> Back to All 35 Citizen Tools
            </button>
            <div className="hidden sm:block text-xs font-medium text-muted">
              Tools Hub / <span className="font-bold text-primary">{activeToolObj.name}</span>
            </div>
          </div>

          {/* Quick Actions (B&W PDF Print & WhatsApp Share) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintBwPdf}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-border bg-bg px-3.5 py-2 text-xs font-bold text-fg hover:bg-surface transition-all shadow-xs"
            >
              <Printer className="size-3.5" /> Download / Print Official B&W PDF
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-xs"
            >
              <Share2 className="size-3.5" /> Copy for WhatsApp
            </button>
          </div>
        </div>

        {/* Dedicated Tool Canvas */}
        <div className="space-y-6">
          {activeToolObj.id === "solar" && <SolarNetMeteringCalculator />}
          {activeToolObj.id === "pak_wakil" && <PakWakilAi />}
          {activeToolObj.id === "electricity" && <ElectricityBillCalculator />}
          {activeToolObj.id === "gas" && <GasBillCalculator />}
          {activeToolObj.id === "freelancer" && <FreelancerTaxCalculator />}
          {activeToolObj.id === "salary_tax" && <SalaryTaxCalculator />}
          {activeToolObj.id === "zakat" && <ZakatCalculator />}
          {activeToolObj.id === "vehicle_tax" && <VehicleTaxCalculator />}
          {activeToolObj.id === "court_fee" && <CourtFeeCalculator />}
          {activeToolObj.id === "fee" && <FeeCalculator />}
          {activeToolObj.id === "inheritance" && <InheritanceCalculator />}
          
          {activeToolObj.id === "rent_agreement" && <RentAgreementGenerator />}
          {activeToolObj.id === "vehicle_sale" && <VehicleSaleAgreementGenerator />}
          {activeToolObj.id === "property_bayana" && <PropertyBayanaGenerator />}
          {activeToolObj.id === "shajra_nasab" && <ShajraNasabBuilder />}
          {activeToolObj.id === "poa" && <PowerOfAttorneyGenerator />}
          {activeToolObj.id === "affidavit" && <AffidavitGenerator />}
          {activeToolObj.id === "consumer_court" && <ConsumerCourtNoticeDrafter />}
          {activeToolObj.id === "fia_cybercrime" && <FiaCybercrimeDrafter />}

          {activeToolObj.id === "construction" && <ConstructionCostCalculator />}
          {activeToolObj.id === "water_boring" && <WaterBoringTankerGuide />}
          {activeToolObj.id === "motorway" && <MotorwayTollCalculator />}

          {activeToolObj.id === "cnic_decoder" && <CnicDecoder />}
          {activeToolObj.id === "vault" && <CitizenVault />}
          {activeToolObj.id === "readiness" && <FileReadinessChecker />}
          {activeToolObj.id === "tracker" && <DocumentExpiryTracker />}

          {activeToolObj.id === "pta_tax" && <PtaMobileTaxCalculator />}
          {activeToolObj.id === "protector" && <OverseasProtectorGuide />}

          {activeToolObj.id === "sarkari_job" && <SarkariJobBiodataGenerator />}
          {activeToolObj.id === "css_age" && <CssPmsEligibilityChecker />}
          {activeToolObj.id === "ibcc" && <IbccEquivalenceCalculator />}

          {activeToolObj.id === "blood_appeal" && <EmergencyBloodAppealGenerator />}
          {activeToolObj.id === "sehat_card" && <SehatCardGuide />}
          {activeToolObj.id === "pocket_card" && <PocketEmergencyCard />}
          {activeToolObj.id === "district_dir" && <DistrictCivicDirectory />}
          {activeToolObj.id === "centers" && <CentersMap />}
          {activeToolObj.id === "scams" && <ScamRadar />}
        </div>

        {/* Bottom Back Button */}
        <div className="no-print text-center pt-6">
          <button
            type="button"
            onClick={backToAllTools}
            className="inline-flex items-center gap-2 rounded-2xl bg-surface border border-border px-6 py-3 text-xs font-bold text-primary hover:bg-bg transition-all shadow-xs"
          >
            <ArrowLeft className="size-4" /> Explore All Other 34 Pakistani Citizen Utilities
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW MODE B: MODERN APP-ICON LAUNCHER GRID
  // ==========================================
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Hero Header */}
      <div className="rounded-3xl bg-primary text-surface p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-surface/15 px-3.5 py-1 text-xs font-bold text-accent">
              <Sparkles className="size-3.5" /> 35 Complete Citizen Utilities & Legal Apps
            </div>
            <h1 className="mt-2 font-display text-2xl sm:text-4xl font-black tracking-tight text-surface">
              Pakistan Citizen Tools Hub
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-surface/85 max-w-xl">
              Tap any tool icon below to open its dedicated full-screen calculator or legal deed generator.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 size-4 text-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all 35 citizen tools..."
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

      {/* Category Filter Chips Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
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
                "flex items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap border shrink-0 " +
                (isSelected
                  ? "bg-primary text-surface border-primary shadow-xs scale-105"
                  : "bg-surface border-border text-muted hover:text-fg hover:border-primary/40")
              }
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Modern App Icon Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {filteredTools.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => openTool(t.id)}
              className="group relative flex flex-col items-center justify-between rounded-3xl border border-border bg-surface p-4 sm:p-5 text-center shadow-card transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg focus:outline-none"
            >
              {/* Top Status Badge */}
              <div className="w-full flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-muted uppercase font-urdu truncate">{t.nameUrdu}</span>
                {t.badge && (
                  <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[8px] font-black uppercase text-primary">
                    {t.badge}
                  </span>
                )}
              </div>

              {/* Colorful Squircle App Icon */}
              <div className={`grid size-12 sm:size-14 place-items-center rounded-2xl border shadow-xs transition-transform group-hover:scale-110 ${t.colorClass}`}>
                <Icon className="size-6 sm:size-7" />
              </div>

              {/* Tool Titles */}
              <div className="mt-3 w-full">
                <span className="block text-xs sm:text-sm font-black text-fg group-hover:text-primary transition-colors line-clamp-1">
                  {t.name}
                </span>
                <span className="block text-[10px] text-muted line-clamp-1 mt-0.5">
                  {t.desc}
                </span>
              </div>

              {/* Tap to Open CTA */}
              <div className="mt-3 flex items-center justify-center gap-1 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Open Tool</span> <ChevronRight className="size-3" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
