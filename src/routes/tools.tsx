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
  { id: "pak_wakil", name: "PakWakil AI", nameUrdu: "پاک وکیل معاون", desc: "AI Legal & Civic Bot", icon: Bot, category: "legal_contracts", badge: "AI Smart" },
  
  // 2. Solar & Energy
  { id: "solar", name: "Solar Net-Metering", nameUrdu: "سولر نیٹ میٹرنگ", desc: "System Size & ROI", icon: Sun, category: "solar_energy", badge: "DISCO 3-Phase" },
  { id: "electricity", name: "Electricity Bill", nameUrdu: "بجلی بل و سلیب", desc: "NEPRA Slabs & FPA", icon: Zap, category: "solar_energy", badge: "FY 2026" },
  { id: "gas", name: "Gas Bill Estimator", nameUrdu: "گیس بل کیلکولیٹر", desc: "SNGPL & SSGC Slabs", icon: Flame, category: "solar_energy" },
  
  // 3. Tax & Finance
  { id: "salary_tax", name: "Salary Income Tax", nameUrdu: "تنخواہ انکم ٹیکس", desc: "FBR Slabs & Surcharge", icon: Calculator, category: "tax_finance", badge: "FBR 2026" },
  { id: "freelancer", name: "Freelancer 0.25% Tax", nameUrdu: "فری لانسر آئی ٹی ٹیکس", desc: "PSEB & International Invoice", icon: Laptop, category: "tax_finance", badge: "0.25% IT" },
  { id: "zakat", name: "Zakat & Ushr", nameUrdu: "زکوٰۃ و عشر کیلکولیٹر", desc: "Gold, Silver & Live Nisab", icon: Coins, category: "tax_finance", badge: "Live Nisab" },
  { id: "vehicle_tax", name: "Vehicle Token Tax", nameUrdu: "گاڑی ٹوکن و ٹرانسفر", desc: "Filer vs Non-Filer WHT", icon: Car, category: "tax_finance" },
  { id: "court_fee", name: "Court Fee Schedule", nameUrdu: "عدالتی کورٹ فیس", desc: "7.5% Ad-valorem Stamps", icon: Scale, category: "tax_finance" },
  { id: "fee", name: "Official Fee Guide", nameUrdu: "سرکاری فیس گائیڈ", desc: "NADRA, Passport, DLIMS", icon: Zap, category: "tax_finance" },
  { id: "inheritance", name: "Inheritance Calculator", nameUrdu: "اسلامی وراثت تقسیم", desc: "Shariah Faraid Shares", icon: FileText, category: "tax_finance" },

  // 4. Legal Contracts & Deeds
  { id: "rent_agreement", name: "Rent Agreement", nameUrdu: "کرایہ نامہ برائے رہائش", desc: "Punjab Rented Premises Act", icon: Scale, category: "legal_contracts", badge: "e-Stamp" },
  { id: "vehicle_sale", name: "Vehicle Sale Receipt", nameUrdu: "اقرار نامہ بیع گاڑی", desc: "Legal Seller Indemnity", icon: Car, category: "legal_contracts" },
  { id: "property_bayana", name: "Property Bayana", nameUrdu: "بیعانہ اقرار نامہ", desc: "Earnest Token Money", icon: Building, category: "legal_contracts" },
  { id: "shajra_nasab", name: "Shajra-e-Nasab", nameUrdu: "شجرہ نسب چارٹ", desc: "Succession Family Tree", icon: Sparkles, category: "legal_contracts" },
  { id: "poa", name: "Power of Attorney", nameUrdu: "مختار نامہ عام و خاص", desc: "Property, Courts & MOFA", icon: FileCheck, category: "legal_contracts" },
  { id: "affidavit", name: "Affidavit Drafter", nameUrdu: "حلف نامہ / بیان حلفی", desc: "5 Legal E-Stamp Deeds", icon: FileCheck2, category: "legal_contracts" },
  { id: "consumer_court", name: "Consumer Court Notice", nameUrdu: "صارف عدالت نوٹس", desc: "15-Day Statutory Notice", icon: Scale, category: "legal_contracts" },
  { id: "fia_cybercrime", name: "FIA Cybercrime Drafter", nameUrdu: "ایف آئی اے سائبر کرائم", desc: "OTP & Online Scam Report", icon: ShieldAlert, category: "legal_contracts" },

  // 5. Property & Living
  { id: "construction", name: "Construction Cost", nameUrdu: "گھر کی تعمیر لاگت", desc: "Grey vs Turnkey Material", icon: Hammer, category: "property_living", badge: "2026 Rates" },
  { id: "water_boring", name: "Water Boring & Tankers", nameUrdu: "پانی کی بورنگ و ٹینکر", desc: "Depth & Official Helplines", icon: Droplet, category: "property_living" },
  { id: "motorway", name: "Motorway Toll & M-Tag", nameUrdu: "موٹروے ٹول ٹیکس", desc: "M-1 to M-9 NHA Rates", icon: Compass, category: "property_living" },

  // 6. Identity & Security
  { id: "cnic_decoder", name: "CNIC 13-Digit Decoder", nameUrdu: "شناختی کارڈ تجزیہ", desc: "Province, Division & Origin", icon: IdCard, category: "overseas_travel", badge: "Private" },
  { id: "vault", name: "Encrypted Vault", nameUrdu: "محفوظ دستاویزات والٹ", desc: "Client-Side AES-256-GCM", icon: Lock, category: "overseas_travel", badge: "Encrypted" },
  { id: "readiness", name: "Check My File", nameUrdu: "فائل آڈٹ و جانچ", desc: "Document Readiness Audit", icon: FileCheck2, category: "overseas_travel" },
  { id: "tracker", name: "Expiry Tracker", nameUrdu: "تجدید و معیاد ٹریکر", desc: "CNIC, Passport & DLIMS", icon: Calendar, category: "overseas_travel" },

  // 7. Overseas & Travel
  { id: "pta_tax", name: "PTA Mobile Tax", nameUrdu: "پی ٹی اے موبائل ٹیکس", desc: "Passport vs CNIC DIRBS", icon: Smartphone, category: "overseas_travel", badge: "DIRBS" },
  { id: "protector", name: "Overseas Protector", nameUrdu: "پروٹیکٹر و ایئرپورٹ", desc: "State Life & Exit Rules", icon: Plane, category: "overseas_travel" },

  // 8. Jobs & Youth
  { id: "sarkari_job", name: "Sarkari Job Bio-Data", nameUrdu: "سرکاری نوکری بائیو ڈیٹا", desc: "PPSC / FPSC Print Form", icon: Briefcase, category: "jobs_youth" },
  { id: "css_age", name: "CSS & PMS Eligibility", nameUrdu: "سی ایس ایس عمر اہلیت", desc: "31st Dec Cutoff & Relaxations", icon: GraduationCap, category: "jobs_youth" },
  { id: "ibcc", name: "IBCC Equivalence", nameUrdu: "تعلیمی مساوات کیلکولیٹر", desc: "O/A Level to Matric/FSc", icon: GraduationCap, category: "jobs_youth" },

  // 9. Health & Safety
  { id: "blood_appeal", name: "Urgent Blood Appeal", nameUrdu: "ایمرجنسی خون اپیل", desc: "WhatsApp Broadcast & 1122", icon: HeartHandshake, category: "emergency_safety", badge: "Emergency" },
  { id: "sehat_card", name: "Sehat Sahulat Card", nameUrdu: "صحت کارڈ علاج گائیڈ", desc: "8500 SMS & PKR 1M Limit", icon: ShieldPlus, category: "emergency_safety" },
  { id: "pocket_card", name: "Emergency Citizen Card", nameUrdu: "ایمرجنسی شناختی کارڈ", desc: "Printable Wallet Card", icon: IdCard, category: "emergency_safety" },
  { id: "district_dir", name: "District Directory", nameUrdu: "ضلعی دفاتر ڈائریکٹری", desc: "DC, PLRA & Police Khidmat", icon: MapPin, category: "emergency_safety" },
  { id: "centers", name: "24/7 Mega Centers", nameUrdu: "نادرا میگا سینٹرز", desc: "Executive Centers Map", icon: MapPin, category: "emergency_safety" },
  { id: "scams", name: "Agent Scam Radar", nameUrdu: "ایجنٹ فراڈ راڈار", desc: "Blacklist & Red Flags", icon: ShieldAlert, category: "emergency_safety" },
];

function ToolsPage() {
  const [activeTool, setActiveTool] = useState<string>("pak_wakil");
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
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          <Sparkles className="size-3.5" /> 35 Complete Citizen Utilities & Legal Command Center
        </div>
        <h1 className="font-display text-3xl font-black text-primary sm:text-5xl tracking-tight">
          Pakistan Citizen Utilities & Legal Hub
        </h1>
        <p className="mx-auto max-w-3xl text-xs sm:text-sm text-muted leading-relaxed font-medium">
          Accurate real-time calculators for Solar Net-Metering, Electricity & Gas Slabs, Salary Tax, Legal Agreements, Construction Costs, PTA Mobile Tax, Court Fees, and Shajra-e-Nasab.
        </p>

        {/* Search & Category Pills */}
        <div className="mx-auto mt-6 max-w-3xl space-y-3">
          <div className="relative flex items-center">
            <Search className="absolute left-4 size-4 text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 35 citizen tools (e.g. Solar, Electricity bill, Rent agreement, Salary tax, PTA tax, Blood appeal)..."
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

          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {[
              { id: "all", label: "All Utilities (35)" },
              { id: "solar_energy", label: "☀️ Solar & Energy" },
              { id: "tax_finance", label: "💰 Taxes & Finance" },
              { id: "legal_contracts", label: "📜 Legal Agreements" },
              { id: "property_living", label: "🏗️ Property & Living" },
              { id: "overseas_travel", label: "📱 Overseas & Travel" },
              { id: "jobs_youth", label: "🎓 Jobs & Youth" },
              { id: "emergency_safety", label: "🏥 Emergency & Safety" },
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
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 rounded-3xl border-2 border-primary/20 bg-surface p-2.5 sm:p-3 shadow-card max-h-[420px] overflow-y-auto">
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
        {activeTool === "pak_wakil" && <PakWakilAi />}
        {activeTool === "solar" && <SolarNetMeteringCalculator />}
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
  );
}
