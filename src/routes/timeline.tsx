import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Eye,
  EyeOff,
  FileCheck,
  FileText,
  Filter,
  Fingerprint,
  HardDrive,
  Info,
  KeyRound,
  Layers,
  Lock,
  Milestone,
  RotateCcw,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { PakistanFlagThree } from "@/components/pakistan-flag-three";
import { MarblePlaque } from "@/components/marble-plaque";
import { AdUnit } from "@/components/ads/ad-unit";

export const Route = createFileRoute("/timeline")({
  component: TimelinePage,
});

interface MilestoneItem {
  id: string;
  year: number;
  yearLabel: string;
  title: string;
  category: "Constitution & Law" | "Identity & NADRA" | "Passports & Travel" | "Land & Revenue" | "Digital Governance";
  badge: string;
  summary: string;
  keyInnovations: string[];
  historicalContext: string;
  citizenImpact: string;
  documentType: string;
}

const MILESTONES: MilestoneItem[] = [
  {
    id: "1947-partition",
    year: 1947,
    yearLabel: "1947",
    title: "Birth of the Nation & Manual Paper Registries",
    category: "Constitution & Law",
    badge: "National Independence",
    summary:
      "Upon partition on August 14, 1947, Pakistan adopted the Government of India Act 1935 as its provisional constitutional framework. All citizenship records, land ownership, and affidavits were maintained in handwritten Urdu and English paper registers in Karachi and provincial secretariats.",
    keyInnovations: [
      "Adoption of the Indian Independence Act 1947 and Government of India Act 1935",
      "Manual bound ledger registers for refugee claims and evacuee property distribution",
      "Stamped paper (non-judicial) for sale deeds, affidavits, and power of attorney",
    ],
    historicalContext:
      "Millions of migrating families registered their claims through rehabilitation commissioners. Records were hand-inked on brittle parchment papers that formed the foundation of Pakistan's legal archives.",
    citizenImpact:
      "Citizens proved legal identity via local Patwari endorsements, village lumberdar verification, and district magistrate stamped paper.",
    documentType: "Handwritten Parchment / Refugee Claim Registers",
  },
  {
    id: "1951-citizenship-act",
    year: 1951,
    yearLabel: "1951",
    title: "Pakistan Citizenship Act & First National Census",
    category: "Identity & NADRA",
    badge: "Legislative Foundation",
    summary:
      "The enactment of the Pakistan Citizenship Act 1951 formally defined the status of Pakistani citizens, naturalization, and overseas domicile certificates. Pakistan conducted its first national population census, enumerating 75.8 million citizens across West and East Pakistan.",
    keyInnovations: [
      "Statutory definition of citizenship by birth, descent, and migration",
      "Issuance of manual District Domicile Certificates (Form-A & Form-B)",
      "Centralized Census Commission registers in Karachi",
    ],
    historicalContext:
      "Before this act, nationality was governed by British subject rules. The 1951 act created the first legal basis for Pakistani passports and civil documentation.",
    citizenImpact:
      "Domicile certificates became the mandatory gold standard for government employment, educational admissions, and property acquisition.",
    documentType: "Manual Domicile Certificate / Form-A",
  },
  {
    id: "1956-constitution",
    year: 1956,
    yearLabel: "1956",
    title: "First Constitution of the Islamic Republic of Pakistan",
    category: "Constitution & Law",
    badge: "Constitutional Milestone",
    summary:
      "Passed on March 23, 1956, Pakistan officially proclaimed itself the Islamic Republic of Pakistan. The constitution codified fundamental citizen rights, freedom of speech, movement, property ownership, and the independence of the judiciary under the High Courts and Supreme Court.",
    keyInnovations: [
      "Codification of Chapter 1 Fundamental Rights and Directive Principles",
      "Establishment of the Supreme Court of Pakistan and provincial high courts",
      "Standardization of legal court gazettes and judicial stamp formats",
    ],
    historicalContext:
      "Replaced the British Dominion status with sovereign republican governance, establishing the citizen-state social contract.",
    citizenImpact:
      "Citizens gained constitutional writs (Habeas Corpus, Mandamus, Quo Warranto) to challenge unlawful administrative actions.",
    documentType: "Gazette of Pakistan Extraordinary / Constitutional Writ",
  },
  {
    id: "1960-capital-shift",
    year: 1960,
    yearLabel: "1960",
    title: "Federal Capital Transfer to Islamabad & Secretariat Modernization",
    category: "Digital Governance",
    badge: "Administrative Reform",
    summary:
      "Under the master plan designed by Constantinos Doxiadis, the federal government began relocating its central ministries and archives from Karachi to Islamabad. The federal bureaucracy introduced standardized typed file jackets, docket sheets, and central dispatch registers.",
    keyInnovations: [
      "Secretariat Instructions manual for file archiving and tracking",
      "Establishment of National Archives of Pakistan in Islamabad",
      "Standardized departmental gazette notifications and embossed revenue stamps",
    ],
    historicalContext:
      "The modernization of civil administration aimed to create an efficient, non-partisan civil service capable of planning mega infrastructure like Tarbela and Mangla dams.",
    citizenImpact:
      "Standardized gazetted verification for civil servants, land allocations, and industrial permits.",
    documentType: "Secretariat File Docket / Official Gazette",
  },
  {
    id: "1973-constitution-nrd",
    year: 1973,
    yearLabel: "1973",
    title: "1973 Constitution & National Registration Department (Shanakhti Card)",
    category: "Identity & NADRA",
    badge: "Universal Identity",
    summary:
      "The historic 1973 Constitution was unanimously adopted, guaranteeing inalienable citizen rights under Articles 9 to 28. In the same year, the National Registration Act 1973 created the National Registration Department (NRD), issuing Pakistan's first manual laminated paper National Identity Cards (Shanakhti Card).",
    keyInnovations: [
      "Article 9 (Right to Life), Article 10A (Fair Trial), and Article 25 (Equality of Citizens)",
      "Creation of the National Registration Department (NRD)",
      "First universal paper laminated National Identity Card (NIC) with thumb impression and black & white photo",
    ],
    historicalContext:
      "Post-1971 war, establishing a definitive universal civil identity registry was vital for democratic balloting, census accuracy, and citizen authentication.",
    citizenImpact:
      "Every adult Pakistani gained a unique national identity card required for voting, buying property, opening bank accounts, and traveling.",
    documentType: "Manual Laminated Paper National Identity Card (NIC)",
  },
  {
    id: "1979-passports-act",
    year: 1979,
    yearLabel: "1979",
    title: "Passports Act & Directorate General of Immigration & Passports",
    category: "Passports & Travel",
    badge: "Global Migration",
    summary:
      "The Passports Act 1974 and Emigration Ordinance 1979 regulated overseas Pakistani workforce migration to the Middle East and the West. Hand-written dark green international passports were issued through central regional passport offices.",
    keyInnovations: [
      "Standardized 32-page and 72-page handwritten booklet passports",
      "Establishment of Protectorate of Emigrants for overseas labor contracts",
      "Embossed dry seal and security watermarked visa endorsement pages",
    ],
    historicalContext:
      "The oil boom in the Arabian Gulf created massive demand for Pakistani engineers, doctors, and labor, transforming the national economy through foreign remittances.",
    citizenImpact:
      "Millions of Pakistani workers obtained official travel documents to build international livelihoods and support their families at home.",
    documentType: "Handwritten 32-Page Green International Passport",
  },
  {
    id: "1990-tax-automation",
    year: 1990,
    yearLabel: "1990",
    title: "Central Board of Revenue (CBR) Automation & National Tax Numbers (NTN)",
    category: "Land & Revenue",
    badge: "Fiscal Registry",
    summary:
      "The Central Board of Revenue (later Federal Board of Revenue - FBR) initiated mainframe computerized tax registries and introduced the 7-digit National Tax Number (NTN) to document formal commerce, customs tariffs, and income tax filing.",
    keyInnovations: [
      "Transition from ledger tax registers to mainframe digital indexing",
      "Issuance of computerized National Tax Number (NTN) certificates",
      "Computerized customs clearance manifests at Karachi Port",
    ],
    historicalContext:
      "Structural economic adjustments required modernization of domestic tax mobilization, replacing manual inspector ledgers with indexed computerized registers.",
    citizenImpact:
      "Businesses and salaried professionals gained distinct tax identities for corporate banking, import-export licenses, and commercial contracts.",
    documentType: "Computerized NTN Certificate / Income Tax Return Form",
  },
  {
    id: "2000-nadra-birth",
    year: 2000,
    yearLabel: "2000",
    title: "Birth of NADRA & 13-Digit Computerized National ID (CNIC)",
    category: "Identity & NADRA",
    badge: "Digital Revolution",
    summary:
      "Under the NADRA Ordinance 2000, the National Database and Registration Authority (NADRA) was established, revolutionizing Pakistan's public infrastructure. Pakistan replaced old manual paper cards with the 13-digit Computerized National Identity Card (CNIC) with optical security hologram and biometric fingerprint database.",
    keyInnovations: [
      "13-Digit unique citizen identifier format: [Province Code]-[Family Tree / Birth Code]-[Gender Checksum]",
      "High-speed automated fingerprint identification system (AFIS)",
      "Nationwide network of NADRA Registration Centers (NRCs) and mobile registration vans",
    ],
    historicalContext:
      "NADRA unified multiple fragmented district registries into a single, centralized relational database, becoming a global benchmark for developing world digital identity.",
    citizenImpact:
      "Eliminated ghost voters, duplicate identity fraud, and established instant digital authentication across all financial and government services.",
    documentType: "Laminated Optical Security CNIC (13 Digits)",
  },
  {
    id: "2004-mrp-passports",
    year: 2004,
    yearLabel: "2004",
    title: "First Machine Readable Passport (MRP) & ICAO Compliance",
    category: "Passports & Travel",
    badge: "International Standard",
    summary:
      "Pakistan became one of the first countries in South Asia to introduce ICAO 9303-compliant Machine Readable Passports (MRP) and Machine Readable Visas (MRV), eliminating handwritten travel documents and international border forgery.",
    keyInnovations: [
      "2-Line OCR-B Machine Readable Zone (MRZ) encoding passport details and checksums",
      "Direct integration between DGIP and NADRA citizen database for instant biometric verification",
      "Digital facial photography and live electronic signature capture",
    ],
    historicalContext:
      "Post-9/11 international aviation security mandated machine-readable travel documents. Pakistan deployed MRP printing systems in Islamabad and consulates worldwide.",
    citizenImpact:
      "Passports were processed in 5 working days instead of months, with automated global electronic border clearance.",
    documentType: "ICAO Machine Readable Passport (MRP) with MRZ",
  },
  {
    id: "2009-land-records",
    year: 2009,
    yearLabel: "2009",
    title: "Land Records Management Information System (LRMIS / PLRA)",
    category: "Land & Revenue",
    badge: "Agrarian Modernization",
    summary:
      "Supported by the World Bank, Punjab established the Land Records Management Information System (LRMIS, later PLRA). Centuries of handwritten Patwari cloth maps (Shajra Kishtwar) and village ledgers (Jamabandi) were scanned, digitized, and GIS-mapped.",
    keyInnovations: [
      "Digitization of over 55 million rural and urban parcel records across 36 districts",
      "Establishment of Arazi Record Centers (ARCs) with biometric thumb verification",
      "Issuance of computerized Fard Malkiat in 30 minutes instead of weeks of bribery",
    ],
    historicalContext:
      "Land disputes constituted over 70% of pending litigation in Pakistani civil courts. Computerization broke the monopoly of traditional village Patwaris.",
    citizenImpact:
      "Farmers and urban property buyers could obtain tamper-proof, barcode-authenticated ownership proofs and execute registered transfers cleanly.",
    documentType: "Computerized Fard Malkiat (PLRA / LRMIS Barcode)",
  },
  {
    id: "2012-smart-cnic",
    year: 2012,
    yearLabel: "2012",
    title: "Smart National ID Card (SNIC) & Match-on-Card Cryptography",
    category: "Identity & NADRA",
    badge: "Smart Card Era",
    summary:
      "NADRA launched the Smart National Identity Card (SNIC) containing a secure contact/contactless smart chip, 36 physical security features, and match-on-card cryptographic biometrics conforming to ISO/IEC 7816 international standards.",
    keyInnovations: [
      "Embedded 64KB cryptographic microcontroller chip",
      "Match-on-Card (MOC) biometric verification preserving citizen privacy",
      "Urdu and English bilingual laser engraving with microtext security printing",
    ],
    historicalContext:
      "Enabled secure electronic direct benefit transfers for post-flood relief, BISP cash grants, and secure branchless banking.",
    citizenImpact:
      "Citizens could authenticate government welfare, international health insurance (Sehat Sahulat Card), and telecommunication SIM registration biometrically.",
    documentType: "Smart National Identity Card (SNIC with Embedded Microchip)",
  },
  {
    id: "2015-dlims",
    year: 2015,
    yearLabel: "2015",
    title: "Driving License Issuance & Management System (DLIMS)",
    category: "Digital Governance",
    badge: "Transport Modernization",
    summary:
      "Provincial traffic police launched centralized Driving License Issuance & Management Systems (DLIMS), integrating biometric test tracking, electronic point demerit systems, automated printing, and home courier delivery.",
    keyInnovations: [
      "Centralized provincial driver license databases with electronic photo ID",
      "Online license validity verification via CNIC search and SMS query",
      "Integration with automated computerized driving test tracks",
    ],
    historicalContext:
      "Replaced counterfeit-prone paper booklet licenses and fragmented district police records with a unified smart driving permit.",
    citizenImpact:
      "Drivers obtain legitimate licenses recognized nationwide and internationally, with real-time online validation.",
    documentType: "Computerized PVC Driving License with QR / Barcode",
  },
  {
    id: "2018-e-stamping",
    year: 2018,
    yearLabel: "2018",
    title: "E-Stamping System (e-Stamp) & Digital Revenue Modernization",
    category: "Land & Revenue",
    badge: "Anti-Fraud Reform",
    summary:
      "The Punjab Board of Revenue in collaboration with PITB replaced century-old physical judicial and non-judicial stamp papers with 100% online, 16-digit e-Stamp papers generated through public web portals and Bank of Punjab branches.",
    keyInnovations: [
      "16-Digit unique e-Stamp barcode verification code (BOP / e-Stamping portal)",
      "Automated DC valuation table integration calculating stamp duty, CVT, and registration fee",
      "Instant SMS and web verification preventing backdated stamp paper forgery",
    ],
    historicalContext:
      "Physical stamp papers were routinely forged or backdated by property mafias to claim bogus court contracts. E-Stamping completely eradicated backdated document fraud.",
    citizenImpact:
      "Citizens calculate property transfer fees transparently from home and print verifiable e-Stamp certificates at any bank counter.",
    documentType: "Digitally Generated Barcode e-Stamp Certificate",
  },
  {
    id: "2020-pak-id-mobile",
    year: 2020,
    yearLabel: "2020",
    title: "Pak-ID Mobile App & Remote Smartphone Biometrics",
    category: "Identity & NADRA",
    badge: "Contactless AI Biometrics",
    summary:
      "NADRA deployed the world-first indigenous Pak-ID Mobile Application, allowing citizens to renew CNICs, modify family trees, and capture 10-finger biometrics using their smartphone camera without visiting any physical office.",
    keyInnovations: [
      "AI-powered contactless optical fingerprint capture via smartphone rear camera",
      "Digital ICAO compliant facial liveness detection and portrait verification",
      "End-to-end doorstep international and domestic courier delivery tracking",
    ],
    historicalContext:
      "Accelerated during the COVID-19 pandemic, this breakthrough eliminated queues for overseas Pakistanis and disabled citizens.",
    citizenImpact:
      "Overseas and local citizens can complete complex identity renewals from their living room in under 10 minutes.",
    documentType: "Remote Mobile Biometric Pak-ID Application",
  },
  {
    id: "2023-e-passports",
    year: 2023,
    yearLabel: "2023",
    title: "Microchip Electronic Passports (e-Passport) & E-Gates",
    category: "Passports & Travel",
    badge: "Next-Gen Travel",
    summary:
      "The Directorate General of Immigration & Passports launched Pakistan's Next-Generation Electronic Passport (e-Passport) equipped with an embedded RFID microchip storing cryptographic biometric templates conforming to ICAO Public Key Infrastructure (PKI).",
    keyInnovations: [
      "RFID contactless microchip in passport cover with laser-engraved polycarbonate data page",
      "Cryptographic digital signature verified against the ICAO Public Key Directory (PKD)",
      "Automated e-Gate airport border crossing deployment in Islamabad, Lahore, and Karachi",
    ],
    historicalContext:
      "Elevated Pakistan's passport security rating to the top tier of international standards, enabling automated e-gate transit globally.",
    citizenImpact:
      "Pakistani travelers enjoy expedited automated border clearance and complete protection against identity theft.",
    documentType: "Biometric e-Passport with Embedded RFID Microchip",
  },
  {
    id: "2026-sovereign-vault",
    year: 2026,
    yearLabel: "2026",
    title: "47 Say Ab Tak & Sovereign Encrypted Citizen Document Ecosystem",
    category: "Digital Governance",
    badge: "Unified Future",
    summary:
      "47 Say Ab Tak consolidates 79 years of national evolution into a unified, zero-trust citizen empowerment ecosystem. Features hardware-grade AES-256-GCM encrypted document vaults, intelligent expiry & penalty warning trackers, AI legal readiness scoring, and automated compliance workflows.",
    keyInnovations: [
      "Zero-Trust & Anti-Exfiltration AES-256-GCM Document Vault with hardware cryptographic sealing",
      "Document Expiry & Penalty Warning Tracker with automatic countdowns for CNIC, Passports, DLIMS, and Token Tax",
      "Instant Legal Readiness scoring & automated step-by-step citizen process mapping",
    ],
    historicalContext:
      "Bridging the historical gap between citizens and state administrative machinery through transparent, sovereign, user-controlled digital legal empowerment.",
    citizenImpact:
      "Every Pakistani citizen holds full cryptographic custody of their legal identity, documents, and compliance records on any device.",
    documentType: "AES-256 Encrypted Sovereign Citizen Vault",
  },
];

const CATEGORIES = [
  "All Eras",
  "Constitution & Law",
  "Identity & NADRA",
  "Passports & Travel",
  "Land & Revenue",
  "Digital Governance",
] as const;

function TimelinePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Eras");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);

  const plaqueRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Filtered milestones
  const filteredMilestones = MILESTONES.filter((m) => {
    const matchesCat = selectedCategory === "All Eras" || m.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.yearLabel.includes(searchQuery) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.documentType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Scroll listener: activates the marble plaque in view to trigger the 3D cloth flag unveiling ceremony
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const viewportCenter = windowHeight / 2;
      let closestIdx = 0;
      let minDistance = Infinity;

      plaqueRefs.current.forEach((el, index) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cardCenter = r.top + r.height / 2;
        const dist = Math.abs(cardCenter - viewportCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = index;
        }
      });

      if (closestIdx !== activeMilestoneIndex && closestIdx < filteredMilestones.length) {
        setActiveMilestoneIndex(closestIdx);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeMilestoneIndex, filteredMilestones.length]);

  const scrollToMilestone = (index: number) => {
    setActiveMilestoneIndex(index);
    const targetEl = plaqueRefs.current[index];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f7f9f7] pb-32">
      {/* Subtle Classical Architectural Backdrops */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-b from-primary/10 via-[#c9a227]/5 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-600/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-40 h-[500px] w-[500px] rounded-full bg-[#c9a227]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pt-12">
        {/* Grand Hero Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/40 bg-surface/90 px-5 py-2 text-xs font-bold text-primary shadow-sm backdrop-blur-md">
            <Sparkles className="size-4 text-[#c9a227] animate-spin" style={{ animationDuration: "6s" }} />
            <span>National Monument Timeline • 1947 → 2026</span>
          </div>

          <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-primary">
            79 Years of Citizen History
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-[#3d5945] leading-relaxed font-medium">
            Each historical era is preserved on a 3D engraved White Marble Monument Plaque. Scroll down to watch the 3D ceremonial Pakistani flag veil lift and unveil each milestone.
          </p>

          {/* Quick Leap Year Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {filteredMilestones.map((m, idx) => {
              const isActive = activeMilestoneIndex === idx;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => scrollToMilestone(idx)}
                  className={`rounded-full px-4 py-1.5 text-xs font-black transition-all shadow-sm ${
                    isActive
                      ? "bg-primary text-[#ffe066] scale-110 ring-2 ring-[#c9a227]/60 shadow-md"
                      : "border border-[#d5ded7] bg-surface text-[#4a6352] hover:border-primary/40 hover:text-primary hover:bg-surface"
                  }`}
                >
                  {m.yearLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* 🎯 GOOGLE ADSENSE LEADERBOARD AD */}
        <div className="my-8">
          <AdUnit format="leaderboard" label="National Heritage Sponsor / Google Ad" />
        </div>

        {/* 3D WEBGL PAKISTANI FLAG VIEWER */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#d5ded7] pb-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-[#d5ded7] bg-surface p-1.5 shadow-sm">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveMilestoneIndex(0);
                }}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-surface shadow-sm"
                    : "text-muted hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-2.5 size-4 text-muted" />
            <input
              type="text"
              placeholder="Search years, NADRA, Fard..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveMilestoneIndex(0);
              }}
              className="w-full rounded-2xl border border-[#d5ded7] bg-surface pl-10 pr-4 py-2 text-xs font-semibold text-fg outline-none focus:border-primary shadow-sm"
            />
          </div>
        </div>

        {/* CHRONOLOGICAL 3D MARBLE MONUMENT TIMELINE (2 CARDS PER ROW) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {filteredMilestones.map((m, idx) => {
            const isActive = activeMilestoneIndex === idx;

            return (
              <div
                key={m.id}
                ref={(el) => {
                  plaqueRefs.current[idx] = el;
                }}
                className="relative flex flex-col h-full"
              >
                {/* Gold Year Medallion Above Plaque */}
                <div
                  onClick={() => scrollToMilestone(idx)}
                  className={`relative z-10 mb-3 flex items-center justify-between gap-2 rounded-2xl border-2 border-[#ffe066] px-4 py-2 shadow-md transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-primary via-primary-light to-primary text-[#ffe066] ring-2 ring-[#c9a227]/40"
                      : "bg-surface text-primary hover:border-[#c9a227]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Award className="size-4 text-[#c9a227]" />
                    <span className="font-display text-sm font-extrabold tracking-wide">
                      {m.yearLabel}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#9e7d17]">
                    {m.badge}
                  </span>
                </div>

                {/* 3D MARBLE MONUMENT PLAQUE WITH CEREMONIAL 3D FLAG VEIL */}
                <MarblePlaque
                  milestone={m}
                  isActive={isActive}
                  onActivate={() => scrollToMilestone(idx)}
                  index={idx}
                />
              </div>
            );
          })}
        </div>

        {/* Grand Sovereign Vault Bottom Banner */}
        <div className="mt-24 rounded-3xl border-2 border-[#c9a227]/40 bg-gradient-to-br from-primary via-primary-light to-primary p-8 sm:p-14 text-center text-surface shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffe066]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-block rounded-full bg-[#ffe066] px-4 py-1 text-xs font-black text-primary uppercase tracking-wider mb-4 shadow-sm">
            Protect Your 2026 Legal Identity
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#ffe066]">
            Store Your Documents in the Sovereign Vault
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-surface/90 leading-relaxed font-medium">
            From 1947 paper registries to 2026 AES-256 encrypted storage, safeguard your CNIC, Passport, Land records, and licenses with zero exfiltration risk.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/tools"
              className="rounded-full bg-[#ffe066] px-8 py-3.5 text-xs font-black text-primary hover:bg-[#ffd633] transition-colors shadow-xl"
            >
              Open Encrypted Document Vault →
            </Link>
            <Link
              to="/guides"
              className="rounded-full border border-surface/40 bg-surface/10 px-8 py-3.5 text-xs font-bold text-surface hover:bg-surface/20 transition-colors backdrop-blur-md"
            >
              Explore Citizen Guides
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
