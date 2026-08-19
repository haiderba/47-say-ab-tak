import { useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";

export function ScamRadar() {
  const [selectedScenario, setSelectedScenario] = useState("open_letter");

  const SCENARIOS = [
    {
      id: "open_letter",
      title: "🚗 Buying Vehicle on Open Transfer Letter",
      riskLevel: "CRITICAL FRAUD RISK",
      riskColor: "text-red-700 bg-red-100 border-red-300",
      description:
        "The seller or showroom gives you the original file, book, and a signed blank stamp paper without completing biometric transfer in Excise.",
      legalConsequence:
        "The vehicle remains legally registered in the original owner name. If the previous owner dies, gets an FIR, or disputes ownership, the police will seize your car. Furthermore, you cannot sell or transfer it later without the previous owner live thumbprint.",
      safeAction:
        "NEVER pay full payment without both seller and buyer biometric verification done in e-Pay / Excise or NADRA e-Sahulat. Always demand biometric transfer receipt.",
      officialPortal: "https://epay.punjab.gov.pk",
    },
    {
      id: "patwari_cash",
      title: "📜 Patwari Demanding Cash for Katchi Mutation",
      riskLevel: "EXTREME FRAUD RISK",
      riskColor: "text-red-700 bg-red-100 border-red-300",
      description:
        "An agent or Patwari claims they can write your land transfer in their manual basta register without you visiting the Arazi Record Center (PLRA).",
      legalConsequence:
        "Manual entries carry zero legal validity in all digitized urban and rural revenue estates. Without digital biometric verification and photo at the ARC, the land is legally not in your name.",
      safeAction:
        "All land mutations (Intiqal) MUST be done in person at the official Arazi Record Center (PLRA) with computerized biometric scans and Challan 32-A payment.",
      officialPortal: "https://es.punjab.gov.pk",
    },
    {
      id: "fake_protector",
      title: "✈️ Travel Agent Promising Protector Without Biometric",
      riskLevel: "CRITICAL CRIME",
      riskColor: "text-red-700 bg-red-100 border-red-300",
      description:
        "An agent promises to provide a Protector of Emigrants passport stamp through internal contacts without requiring you to appear at the Protectorate office.",
      legalConsequence:
        "FIA Immigration scans every protector QR code at the airport against the Bureau of Emigration database. If the digital record is missing, FIA offloads passengers immediately and registers an FIR.",
      safeAction:
        "Visit the official Bureau of Emigration Protector Office yourself. The official government fee is only PKR 2,500 for State Life Insurance + PKR 2,000 welfare fund. Process takes only 2 hours.",
      officialPortal: "https://beoe.gov.pk",
    },
    {
      id: "otp_phishing",
      title: "🪪 Fake NADRA / BISP Verification Calls",
      riskLevel: "IDENTITY THEFT",
      riskColor: "text-red-700 bg-red-100 border-red-300",
      description:
        "You receive an SMS or WhatsApp call claiming to be from NADRA Headquarters or Pak-ID Security asking for your 6-digit OTP to unlock your CNIC.",
      legalConsequence:
        "Sharing the OTP grants hackers access to your Pak-ID account, allowing them to issue duplicate CNICs, alter family records, or execute illegal SIM transfers in your name.",
      safeAction:
        "NADRA and government agencies NEVER ask for OTPs or passwords over the phone. Immediately report the phone number to FIA Cyber Crime Wing (Helpline: 1991).",
      officialPortal: "https://complaint.fia.gov.pk",
    },
    {
      id: "fake_estamp",
      title: "📑 Non-Computerized White Stamp Paper",
      riskLevel: "INVALID INSTRUMENT",
      riskColor: "text-amber-800 bg-amber-100 border-amber-300",
      description:
        "A deed-writer prints an affidavit or property agreement on an old white paper stamp without the 16-character digital barcode.",
      legalConsequence:
        "Physical white stamp papers were officially abolished across Punjab, Sindh, and ICT. Courts, sub-registrars, and NADRA reject white stamps as counterfeit.",
      safeAction:
        "Always demand digital E-Stamp paper generated via Challan 32-A. Verify the 16-character code online on the provincial E-Stamping portal before signing.",
      officialPortal: "https://es.punjab.gov.pk",
    },
  ];

  const current = SCENARIOS.find((s) => s.id === selectedScenario) || SCENARIOS[0];

  const COMPLAINT_HOTLINES = [
    {
      name: "Pakistan Citizen Portal (PMDU)",
      desc: "Direct complaint escalation to Deputy Commissioners and Ministry DGs.",
      contact: "PMDU (PCP Mobile App)",
      actionText: "Open Portal",
      link: "https://web.citizenportal.gov.pk",
    },
    {
      name: "FIA Cyber Crime Wing",
      desc: "Identity theft, SIM fraud, OTP scams, and unauthorized biometric use.",
      contact: "Toll-Free Helpline: 1991",
      actionText: "File Complaint",
      link: "https://complaint.fia.gov.pk",
    },
    {
      name: "Anti-Corruption Establishment (ACE)",
      desc: "Bribery demands by Patwaris, Sub-Registrars, and Excise officials.",
      contact: "Punjab Helpline: 1350",
      actionText: "Report Corruption",
      link: "https://ace.punjab.gov.pk",
    },
    {
      name: "Federal Ombudsman (Wafaqi Mohtasib)",
      desc: "Free judicial relief within 60 days against NADRA, Passports, or FBR delays.",
      contact: "Helpline: 1055",
      actionText: "Lodge Grievance",
      link: "https://mohtasib.gov.pk",
    },
  ];

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-danger">
            <ShieldAlert className="size-3.5" /> Citizen Fraud Radar & Legal Protection
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-primary sm:text-3xl">
            Scam Radar & Anti-Corruption Center
          </h2>
          <p className="mt-1 text-xs text-muted">
            Exposing tout mafia traps, fake document scams, and official direct reporting hotlines.
          </p>
        </div>
      </div>

      {/* INTERACTIVE SCENARIO SELECTOR */}
      <div className="mt-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
          Select Common Situation to Run Fraud Diagnostic:
        </h3>

        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedScenario(s.id)}
              className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                selectedScenario === s.id
                  ? "border-danger bg-red-50/50 shadow-md ring-2 ring-danger/20"
                  : "border-border bg-bg hover:border-danger/40 hover:bg-surface"
              }`}
            >
              <span className="font-display text-xs font-bold text-fg">{s.title}</span>
              <span className="mt-1 text-[11px] text-muted line-clamp-1">{s.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DIAGNOSTIC CARD */}
      <div className="mt-8 rounded-2xl border-2 border-danger/30 bg-gradient-to-br from-red-50/30 via-surface to-bg p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
          <h3 className="font-display text-xl font-bold text-primary">{current.title}</h3>
          <span className={`rounded-full border px-3 py-1 text-xs font-extrabold ${current.riskColor}`}>
            ⚠️ {current.riskLevel}
          </span>
        </div>

        <div className="mt-5 grid gap-6 md:grid-cols-2">
          {/* Risk Detail */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-danger flex items-center gap-1.5">
              <XCircle className="size-4" /> What Happens If You Fall In This Trap:
            </h4>
            <p className="text-xs leading-relaxed text-fg/90 bg-surface rounded-xl p-4 border border-border">
              {current.legalConsequence}
            </p>
          </div>

          {/* Safe Official Action */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-primary" /> The 100% Legal & Safe Procedure:
            </h4>
            <p className="text-xs leading-relaxed text-primary bg-emerald-50/70 rounded-xl p-4 border border-emerald-200 font-semibold">
              {current.safeAction}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-border pt-4">
          <a
            href={current.officialPortal}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-bold text-surface hover:bg-primary-light transition-colors"
          >
            Open Official Government Verification Portal <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      {/* OFFICIAL ANTI-CORRUPTION & COMPLAINT DIRECTORY */}
      <div className="mt-14">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="size-3.5" /> Official Whistleblower & Redressal
          </div>
          <h3 className="mt-2 font-display text-2xl font-bold text-primary">
            Official Anti-Corruption & Complaint Hotlines
          </h3>
          <p className="mt-1 text-xs text-muted">
            If any official or agent demands a bribe, refusal of service, or illegal charges, report directly to these authorities:
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COMPLAINT_HOTLINES.map((h) => (
            <div
              key={h.name}
              className="flex flex-col justify-between rounded-2xl border border-border bg-bg/60 p-5 shadow-sm transition-all hover:border-primary/40 hover:bg-surface"
            >
              <div>
                <span className="font-display text-sm font-bold text-primary">{h.name}</span>
                <p className="mt-1.5 text-xs text-muted leading-relaxed">{h.desc}</p>
                <div className="mt-3 rounded-lg bg-surface border border-border px-2.5 py-1.5 text-[11px] font-bold text-danger">
                  📞 {h.contact}
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-3">
                <a
                  href={h.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  {h.actionText} <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
