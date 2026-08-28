import { useState } from "react";
import {
  Globe,
  FileCheck2,
  Stamp,
  ShieldCheck,
  Building,
  Plane,
  CreditCard,
  Printer,
  Copy,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Coins,
  MapPin,
  Sparkles,
  Search,
  BadgeCheck,
} from "lucide-react";

export function OverseasMofaPortal() {
  const [activeTab, setActiveTab] = useState<"mofa_attestation" | "digital_poa" | "nicop_poc" | "rda_tax">("mofa_attestation");
  const [copied, setCopied] = useState(false);

  // NICOP vs POC Decision Tree State
  const [applicantType, setApplicantType] = useState<"pakistani_passport" | "dual_national" | "foreign_spouse" | "foreign_born_child">("pakistani_passport");

  const handleCopyDossier = (title: string, content: string) => {
    const fullText = `*${title} — 47 SAY AB TAK OVERSEAS PORTAL*\n\n${content}\n\nVerified via: https://47sayabtak.com/tools?tool=overseas_mofa`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
            <Globe className="size-3.5" /> Ministry of Foreign Affairs (MOFA) &amp; Diaspora Gateway
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-primary sm:text-3xl">
            Overseas Pakistani &amp; MOFA Attestation Portal
          </h2>
          <p className="mt-1 text-xs text-muted">
            MOFA QR document attestation, Embassy Digital Power of Attorney, NICOP vs POC eligibility, and Roshan Digital Account (RDA) perks.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-surface hover:bg-primary-light shadow-xs shrink-0"
        >
          <Printer className="size-4" /> Print B&amp;W Official Dossier
        </button>
      </div>

      {/* 4 Interactive Modules Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("mofa_attestation")}
          className={
            "flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap border shrink-0 " +
            (activeTab === "mofa_attestation"
              ? "bg-primary text-surface border-primary shadow-xs"
              : "bg-surface border-border text-muted hover:text-fg hover:border-primary/40")
          }
        >
          <Stamp className="size-4" /> MOFA QR Attestation Roadmap
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("digital_poa")}
          className={
            "flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap border shrink-0 " +
            (activeTab === "digital_poa"
              ? "bg-primary text-surface border-primary shadow-xs"
              : "bg-surface border-border text-muted hover:text-fg hover:border-primary/40")
          }
        >
          <FileCheck2 className="size-4" /> Digital Power of Attorney (PoA)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("nicop_poc")}
          className={
            "flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap border shrink-0 " +
            (activeTab === "nicop_poc"
              ? "bg-primary text-surface border-primary shadow-xs"
              : "bg-surface border-border text-muted hover:text-fg hover:border-primary/40")
          }
        >
          <CreditCard className="size-4" /> NICOP vs POC Eligibility Engine
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rda_tax")}
          className={
            "flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap border shrink-0 " +
            (activeTab === "rda_tax"
              ? "bg-primary text-surface border-primary shadow-xs"
              : "bg-surface border-border text-muted hover:text-fg hover:border-primary/40")
          }
        >
          <Coins className="size-4" /> Roshan Digital (RDA) &amp; Tax Perks
        </button>
      </div>

      {/* MODULE 1: MOFA QR Attestation Roadmap */}
      {activeTab === "mofa_attestation" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <Stamp className="size-5 text-blue-600" />
                <h3 className="font-display text-base font-black text-blue-950">
                  MOFA Document Attestation Protocol (Apostille / QR Code)
                </h3>
              </div>
              <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-[10px] font-black uppercase text-white">
                Official MOFA SOPs
              </span>
            </div>
            <p className="text-xs text-blue-900 leading-relaxed">
              Under Ministry of Foreign Affairs regulations, Pakistani educational degrees, marriage contracts (Nikahnama), birth certificates, and police clearance certificates must be pre-attested by their parent departments before MOFA stamps the official QR verification seal.
            </p>
          </div>

          {/* Department Pre-Requisite Matrix */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
              Step 1: Mandatory Departmental Pre-Attestations
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
              <div className="rounded-2xl border border-border bg-surface p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <BadgeCheck className="size-4 text-emerald-600" /> Matric / Inter Sanad
                </div>
                <p className="text-muted text-[11px]">
                  Must be verified and sealed by the <strong>Inter Board Coordination Commission (IBCC)</strong> before MOFA submission.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <BadgeCheck className="size-4 text-emerald-600" /> University Degrees
                </div>
                <p className="text-muted text-[11px]">
                  Must be verified online and embossed by the <strong>Higher Education Commission (HEC)</strong> with electronic QR slip.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <BadgeCheck className="size-4 text-emerald-600" /> Nikahnama / Marriage
                </div>
                <p className="text-muted text-[11px]">
                  Must be computerized Union Council Marriage Registration Certificate (MRC) translated into English on official letterhead.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <BadgeCheck className="size-4 text-emerald-600" /> Police Clearance (Character)
                </div>
                <p className="text-muted text-[11px]">
                  Issued by Police Khidmat Markaz (PKM) with SSP / DPO signature seal.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <BadgeCheck className="size-4 text-emerald-600" /> Commercial Power of Attorney
                </div>
                <p className="text-muted text-[11px]">
                  Executed on non-judicial E-Stamp Paper and registered with Sub-Registrar / Registrar of Deeds.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <BadgeCheck className="size-4 text-emerald-600" /> Medical Fitness Certificate
                </div>
                <p className="text-muted text-[11px]">
                  Signed by MS of Government DHQ Hospital or authorized GAMCA medical clinic for Gulf work visas.
                </p>
              </div>
            </div>
          </div>

          {/* MOFA Counter & Courier Modes */}
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Clock className="size-4" /> Official Submission Modes &amp; Fees
            </div>
            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
                <div className="font-bold text-emerald-950">Option A: TCS / Gerry's Courier Service (Recommended)</div>
                <p className="text-emerald-900 text-[11px] leading-relaxed">
                  Drop documents at any authorized TCS, Gerry's, or Leopards Express Centers. Returned to your doorstep with MOFA QR sticker within <strong>3–5 working days</strong>.
                </p>
                <div className="font-mono text-xs font-black text-emerald-950">Fee: Rs 300 - Rs 500 per document</div>
              </div>

              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-2">
                <div className="font-bold text-purple-950">Option B: Same-Day Walk-In Counters</div>
                <p className="text-purple-900 text-[11px] leading-relaxed">
                  Available at MOFA Camp Offices in <strong>Islamabad (Headquarters), Lahore, Karachi, Peshawar, and Quetta</strong>. Requires online appointment token via mofa.gov.pk.
                </p>
                <div className="font-mono text-xs font-black text-purple-950">Same-Day Collection (Morning Token)</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="https://attest.mofa.gov.pk"
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-xs font-bold text-surface hover:bg-primary-light transition-all shadow-sm"
            >
              <ExternalLink className="size-4" /> Open MOFA Online Attestation Portal (attest.mofa.gov.pk)
            </a>
            <button
              type="button"
              onClick={() => handleCopyDossier("MOFA QR Attestation Roadmap", "Matric/Inter: IBCC pre-attestation required\nDegrees: HEC verification required\nNikahnama: Union Council MRC English translation\nPolice Clearance: PKM SSP stamped\nSubmission: TCS Courier (3-5 days) or MOFA Camp Offices (LHE, KHI, ISB, PEW, UET)\nOfficial Portal: https://attest.mofa.gov.pk")}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-sm"
            >
              <Copy className="size-4" /> {copied ? "Copied Protocol to Clipboard!" : "Copy Full Protocol for WhatsApp"}
            </button>
          </div>
        </div>
      )}

      {/* MODULE 2: Digital Power of Attorney (PoA) */}
      {activeTab === "digital_poa" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="size-5 text-emerald-600" />
                <h3 className="font-display text-base font-black text-emerald-950">
                  NADRA Digital Power of Attorney (Overseas to Pakistan)
                </h3>
              </div>
              <span className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-black uppercase text-white">
                100% Online via poa.nadra.gov.pk
              </span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Overseas Pakistanis no longer need to physically visit the Pakistani Embassy or travel to Pakistan to execute a Power of Attorney (مختار نامہ). You can create, biometrically sign, and conduct a live video interview online from your phone or laptop.
            </p>
          </div>

          {/* 4-Step Digital Execution Flow */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
            <div className="rounded-2xl border border-border bg-surface p-4 space-y-2">
              <div className="grid size-8 place-items-center rounded-xl bg-primary text-accent font-bold text-xs">1</div>
              <div className="font-bold text-primary">Draft &amp; Upload Deed</div>
              <p className="text-muted text-[11px]">
                Draft the General or Special Power of Attorney specifying plot/bank details and upload the PDF on <strong>poa.nadra.gov.pk</strong>.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-4 space-y-2">
              <div className="grid size-8 place-items-center rounded-xl bg-primary text-accent font-bold text-xs">2</div>
              <div className="font-bold text-primary">Biometrics &amp; Witnesses</div>
              <p className="text-muted text-[11px]">
                Executant and 2 Pakistani witnesses verify fingerprints via the <strong>NADRA Pak-ID app</strong> using smartphone camera.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-4 space-y-2">
              <div className="grid size-8 place-items-center rounded-xl bg-primary text-accent font-bold text-xs">3</div>
              <div className="font-bold text-primary">Online Video Interview</div>
              <p className="text-muted text-[11px]">
                Pakistani Consular Officer conducts a 3-minute scheduled video call to verify executant's free will and ID credentials.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-4 space-y-2">
              <div className="grid size-8 place-items-center rounded-xl bg-primary text-accent font-bold text-xs">4</div>
              <div className="font-bold text-primary">Pakistan Redemption</div>
              <p className="text-muted text-[11px]">
                The digital PoA is recorded on the national central database and immediately accepted by Sub-Registrars, Banks, and Courts in Pakistan.
              </p>
            </div>
          </div>

          {/* Consular Missions & Fee */}
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-card space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2 text-xs">
              <span className="font-bold text-primary uppercase">Supported Embassies &amp; Consulates</span>
              <span className="font-mono font-bold text-emerald-600">Official Fee: $36 USD / £30 GBP / 140 AED</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Available across all Pakistani Diplomatic Missions in the <strong>United States (Washington, NY, Chicago, Houston, LA), United Kingdom (London, Manchester, Birmingham, Bradford, Glasgow), UAE (Abu Dhabi, Dubai), Saudi Arabia (Riyadh, Jeddah), Canada (Ottawa, Toronto, Vancouver, Montreal), Australia, and EU</strong>.
            </p>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="https://poa.nadra.gov.pk"
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-xs font-bold text-surface hover:bg-primary-light transition-all shadow-sm"
            >
              <ExternalLink className="size-4" /> Start Digital PoA Application (poa.nadra.gov.pk)
            </a>
            <button
              type="button"
              onClick={() => handleCopyDossier("NADRA Digital Power of Attorney Guide", "Step 1: Draft PoA on poa.nadra.gov.pk\nStep 2: Upload CNIC/NICOP of Executant, Attorney & 2 Witnesses\nStep 3: Smartphone camera biometric verification via Pak-ID\nStep 4: 3-minute video interview with Pakistan Embassy Consular Officer\nFee: $36 USD | No physical embassy travel required\nOfficial Portal: https://poa.nadra.gov.pk")}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-sm"
            >
              <Copy className="size-4" /> {copied ? "Copied Guide to Clipboard!" : "Copy Full Guide for WhatsApp"}
            </button>
          </div>
        </div>
      )}

      {/* MODULE 3: NICOP vs POC Eligibility Engine */}
      {activeTab === "nicop_poc" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-3xl border border-purple-500/20 bg-purple-500/5 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <CreditCard className="size-5 text-purple-600" />
                <h3 className="font-display text-base font-black text-purple-950">
                  NICOP vs POC Interactive Eligibility Engine
                </h3>
              </div>
              <span className="rounded-lg bg-purple-600 px-2.5 py-1 text-[10px] font-black uppercase text-white">
                NADRA Pak-ID Slabs
              </span>
            </div>
            <p className="text-xs text-purple-900 leading-relaxed">
              Select your citizenship status below to determine whether you or your family members are legally entitled to a <strong>NICOP (National Identity Card for Overseas Pakistanis)</strong> or a <strong>POC (Pakistan Origin Card)</strong>.
            </p>
          </div>

          {/* Interactive Applicant Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted">
              Select Your Exact Citizenship &amp; Lineage Status:
            </label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { id: "pakistani_passport", label: "Pakistani Citizen Living Abroad (Work / Study Visa)" },
                { id: "dual_national", label: "Dual National (Foreign Passport + Pakistani Roots)" },
                { id: "foreign_spouse", label: "Foreign Spouse of Pakistani Citizen (No Pak Blood)" },
                { id: "foreign_born_child", label: "Child Born Abroad to Pakistani Parents" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setApplicantType(opt.id as any)}
                  className={
                    "rounded-2xl border p-3.5 text-left text-xs font-bold transition-all " +
                    (applicantType === opt.id
                      ? "border-primary bg-primary text-surface shadow-xs scale-102"
                      : "border-border bg-surface text-fg hover:border-primary/40")
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resolved Card Recommendation Card */}
          <div className="rounded-3xl border-2 border-primary/30 bg-surface p-6 shadow-card space-y-4">
            {applicantType === "pakistani_passport" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-emerald-600" />
                    <h4 className="font-display text-base font-black text-primary">
                      You Need: Smart NICOP (National Identity Card for Overseas Pakistanis)
                    </h4>
                  </div>
                  <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    Visa-Free Entry &amp; Full Property Rights
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 text-xs">
                  <div className="rounded-2xl border border-border bg-bg/50 p-3 space-y-1">
                    <span className="text-muted block text-[10px] font-bold uppercase">Rights in Pakistan</span>
                    <span className="font-bold text-fg block">100% Full Citizen Rights, Vote, Land Purchase</span>
                  </div>
                  <div className="rounded-2xl border border-border bg-bg/50 p-3 space-y-1">
                    <span className="text-muted block text-[10px] font-bold uppercase">NADRA Official Fee</span>
                    <span className="font-bold text-emerald-700 block">Zone A: $39 (Normal) | $57 (Urgent) | $75 (Exec)</span>
                  </div>
                  <div className="rounded-2xl border border-border bg-bg/50 p-3 space-y-1">
                    <span className="text-muted block text-[10px] font-bold uppercase">Validity</span>
                    <span className="font-bold text-fg block">10 Years Validity (Chip Enabled)</span>
                  </div>
                </div>
              </div>
            )}

            {applicantType === "dual_national" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-emerald-600" />
                    <h4 className="font-display text-base font-black text-primary">
                      You Need: Smart NICOP (Dual National Edition)
                    </h4>
                  </div>
                  <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    Visa-Free Travel on Foreign Passport
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 text-xs">
                  <div className="rounded-2xl border border-border bg-bg/50 p-3 space-y-1">
                    <span className="text-muted block text-[10px] font-bold uppercase">Dual Nationality Treaties</span>
                    <span className="font-bold text-fg block">Allowed with 21 Countries (UK, USA, Canada, Australia, etc.)</span>
                  </div>
                  <div className="rounded-2xl border border-border bg-bg/50 p-3 space-y-1">
                    <span className="text-muted block text-[10px] font-bold uppercase">NADRA Official Fee</span>
                    <span className="font-bold text-emerald-700 block">Zone A: $39 (Normal) | $75 (Executive)</span>
                  </div>
                  <div className="rounded-2xl border border-border bg-bg/50 p-3 space-y-1">
                    <span className="text-muted block text-[10px] font-bold uppercase">Travel Benefit</span>
                    <span className="font-bold text-fg block">No Pakistani Visa required on foreign passport</span>
                  </div>
                </div>
              </div>
            )}

            {applicantType === "foreign_spouse" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-purple-600" />
                    <h4 className="font-display text-base font-black text-primary">
                      You Need: POC (Pakistan Origin Card)
                    </h4>
                  </div>
                  <span className="rounded-md bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-700">
                    5-Year Visa-Free Stay &amp; Work Permit
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 text-xs">
                  <div className="rounded-2xl border border-border bg-bg/50 p-3 space-y-1">
                    <span className="text-muted block text-[10px] font-bold uppercase">Rights in Pakistan</span>
                    <span className="font-bold text-fg block">Visa-free stay, open bank accounts, employment allowed</span>
                  </div>
                  <div className="rounded-2xl border border-border bg-bg/50 p-3 space-y-1">
                    <span className="text-muted block text-[10px] font-bold uppercase">Official POC Fee</span>
                    <span className="font-bold text-purple-700 block">$150 USD (Initial 5-Year Card)</span>
                  </div>
                  <div className="rounded-2xl border border-border bg-bg/50 p-3 space-y-1">
                    <span className="text-muted block text-[10px] font-bold uppercase">Mandatory Proof</span>
                    <span className="font-bold text-fg block">Computerized MRC + Spouse CNIC/NICOP</span>
                  </div>
                </div>
              </div>
            )}

            {applicantType === "foreign_born_child" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-teal-600" />
                    <h4 className="font-display text-base font-black text-primary">
                      You Need: Smart NICOP by Descent (Born Abroad)
                    </h4>
                  </div>
                  <span className="rounded-md bg-teal-500/10 px-2.5 py-1 text-xs font-bold text-teal-700">
                    Pakistani Citizenship by Descent
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 text-xs">
                  <div className="rounded-2xl border border-border bg-bg/50 p-3 space-y-1">
                    <span className="text-muted block text-[10px] font-bold uppercase">Required Document</span>
                    <span className="font-bold text-fg block">Foreign Birth Certificate + Father/Mother CNIC</span>
                  </div>
                  <div className="rounded-2xl border border-border bg-bg/50 p-3 space-y-1">
                    <span className="text-muted block text-[10px] font-bold uppercase">NADRA Official Fee</span>
                    <span className="font-bold text-teal-700 block">Zone A: $39 (Normal) | $75 (Executive)</span>
                  </div>
                  <div className="rounded-2xl border border-border bg-bg/50 p-3 space-y-1">
                    <span className="text-muted block text-[10px] font-bold uppercase">Lifelong Benefit</span>
                    <span className="font-bold text-fg block">Establishes unchallengeable Pakistani lineage</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="https://id.nadra.gov.pk"
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-xs font-bold text-surface hover:bg-primary-light transition-all shadow-sm"
            >
              <ExternalLink className="size-4" /> Apply for NICOP / POC on Pak-ID (id.nadra.gov.pk)
            </a>
          </div>
        </div>
      )}

      {/* MODULE 4: Roshan Digital Account & Tax Perks */}
      {activeTab === "rda_tax" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <Coins className="size-5 text-amber-600" />
                <h3 className="font-display text-base font-black text-amber-950">
                  Roshan Digital Account (RDA) Statutory Tax Perks
                </h3>
              </div>
              <span className="rounded-lg bg-amber-600 px-2.5 py-1 text-[10px] font-black uppercase text-white">
                State Bank &amp; FBR SRO Exemptions
              </span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Under State Bank of Pakistan and FBR Finance Act provisions, Non-Resident Pakistanis (NRPs) operating a Roshan Digital Account enjoy statutory exemptions from non-filer withholding taxes and full repatriation of principal and profit.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            <div className="rounded-2xl border border-border bg-surface p-4 space-y-1.5">
              <div className="font-bold text-primary text-xs">Zero Withholding Tax on Bank Cash</div>
              <p className="text-muted text-[11px]">
                Section 231AB cash withdrawal tax is <strong>0.0% exempt</strong> regardless of active taxpayer status.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-4 space-y-1.5">
              <div className="font-bold text-primary text-xs">Full Funds Repatriation</div>
              <p className="text-muted text-[11px]">
                Transfer money back to your foreign bank in USD, GBP, EUR, AED, or SAR with zero SBP approvals.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-4 space-y-1.5">
              <div className="font-bold text-primary text-xs">Roshan Apna Ghar (Property)</div>
              <p className="text-muted text-[11px]">
                Purchase property in Pakistan through verified escrow accounts with automated title deed verification.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-4 space-y-1.5">
              <div className="font-bold text-primary text-xs">Naya Pakistan Certificates (NPC)</div>
              <p className="text-muted text-[11px]">
                Earn sovereign government yields up to 8.5% in USD and 17.5% in PKR with flat 10% final withholding tax.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-4 space-y-1.5">
              <div className="font-bold text-primary text-xs">No FBR Return Filing Compulsion</div>
              <p className="text-muted text-[11px]">
                NRPs investing exclusively through RDA are not required to file annual Pakistani income tax returns.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-4 space-y-1.5">
              <div className="font-bold text-primary text-xs">Roshan Apni Car (Vehicle)</div>
              <p className="text-muted text-[11px]">
                Priority delivery of locally assembled brand-new cars for your family in Pakistan with subsidized insurance.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="https://www.sbp.org.pk/RDA/index.html"
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-xs font-bold text-surface hover:bg-primary-light transition-all shadow-sm"
            >
              <ExternalLink className="size-4" /> State Bank of Pakistan Official RDA Portal
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
