import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  Info,
  Printer,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";

type ProcedureItem = {
  id: string;
  title: string;
  department: string;
  typicalRejectionRate: string;
  guideSlug: string;
  checklist: {
    id: string;
    label: string;
    critical: boolean;
    reasonIfMissing: string;
  }[];
};

const PROCEDURES: ProcedureItem[] = [
  {
    id: "cnic_new",
    title: "New Smart CNIC (Age 18+ First Time)",
    department: "NADRA",
    typicalRejectionRate: "35% files rejected on first visit",
    guideSlug: "cnic",
    checklist: [
      { id: "bform", label: "Original NADRA Child Registration Certificate (B-Form)", critical: true, reasonIfMissing: "Mandatory proof of child birth registration." },
      { id: "parent_cnic", label: "Original CNIC of Father or Mother (must be present for live biometric attestation)", critical: true, reasonIfMissing: "Counter operator will bounce the file without a blood relative live thumbprint." },
      { id: "parent_cnic_copy", label: "Clear photocopies of both parents CNICs", critical: false, reasonIfMissing: "Required for physical dossier submission." },
      { id: "presence", label: "Physical presence of applicant for live photography & fingerprinting", critical: true, reasonIfMissing: "Biometrics cannot be done via proxy or blood relative." },
      { id: "fee_cash", label: "Official fee in cash or Debit/Credit card (PKR 750 Smart / PKR 1,500 Urgent)", critical: true, reasonIfMissing: "Payment is required at Token counter." },
    ],
  },
  {
    id: "passport_renewal",
    title: "Passport Issuance / Renewal",
    department: "DGIP",
    guideSlug: "passport",
    typicalRejectionRate: "25% bounced for payment or photos",
    checklist: [
      { id: "orig_cnic", label: "Original valid CNIC / Smart Card (+ 2 photocopies)", critical: true, reasonIfMissing: "Expired or invalid CNIC immediately blocks passport issuance." },
      { id: "old_passport", label: "Original Previous Passport (+ photocopies of first 4 pages, if renewing)", critical: true, reasonIfMissing: "Failure to produce old passport requires police lost report and duplicate penalty." },
      { id: "psid_receipt", label: "Paid Passport Challan / 1Bill PSID receipt from Passport Fee Asaan app", critical: true, reasonIfMissing: "Cash is NOT accepted inside passport offices." },
      { id: "govt_noc", label: "Departmental NOC on official letterhead (Only if Government Employee)", critical: true, reasonIfMissing: "Government servants applying without NOC face disciplinary FIRs." },
    ],
  },
  {
    id: "frc",
    title: "Family Registration Certificate (FRC)",
    department: "NADRA",
    guideSlug: "frc",
    typicalRejectionRate: "40% files stuck for marital status update",
    checklist: [
      { id: "applicant_cnic", label: "Original CNIC of Applicant", critical: true, reasonIfMissing: "Required to initialize family tree." },
      { id: "family_cnics", label: "CNIC numbers of all siblings / children", critical: true, reasonIfMissing: "Missing CNIC number prevents child inclusion in certificate." },
      { id: "marital_status", label: "Applicant & Spouse CNIC marital status updated to Married", critical: true, reasonIfMissing: "If CNIC still shows Unmarried, spouse & kids will NOT appear on FRC." },
      { id: "crc_kids", label: "B-Forms / CRC numbers for all minor children below 18", critical: true, reasonIfMissing: "Unregistered children cannot be added." },
      { id: "frc_fee", label: "PKR 1,000 official fee", critical: true, reasonIfMissing: "Required for instant print." },
    ],
  },
  {
    id: "land_mutation",
    title: "Land Mutation (Intiqal Wirasat / Bay)",
    department: "PLRA",
    guideSlug: "land-mutation",
    typicalRejectionRate: "50% rejected for missing death certificate or FRC",
    checklist: [
      { id: "comp_fard", label: "Original Computerized Fard Malkiat (issued within last 30 days)", critical: true, reasonIfMissing: "Expired or manual Patwari fards are rejected." },
      { id: "death_cert", label: "Computerized NADRA Death Certificate of deceased owner (if inheritance)", critical: true, reasonIfMissing: "Hospital or graveyard slips alone are not accepted." },
      { id: "nadra_frc", label: "Official NADRA FRC listing all legal heirs", critical: true, reasonIfMissing: "Required to verify the complete family tree." },
      { id: "estamp_challan", label: "Paid E-Stamp Paper / Challan 32-A with 16-character code", critical: true, reasonIfMissing: "Mutation fee must be deposited via Bank of Punjab or e-Pay." },
      { id: "heirs_present", label: "Physical presence of all legal heirs or registered Power of Attorney", critical: true, reasonIfMissing: "Biometric thumbprint of all heirs is mandatory at the counter." },
    ],
  },
  {
    id: "license_permanent",
    title: "Permanent Driving License (Road Test)",
    department: "Traffic Police / DLIMS",
    guideSlug: "driving-license",
    typicalRejectionRate: "30% bounced for learner 42-day waiting rule",
    checklist: [
      { id: "orig_cnic", label: "Original valid CNIC (+ 2 photocopies)", critical: true, reasonIfMissing: "Mandatory for digital token issuance." },
      { id: "orig_learner", label: "Original Learner Driving Permit valid for more than 42 days", critical: true, reasonIfMissing: "Traffic police law prohibits taking the driving test before the 42-day mandatory learning window." },
      { id: "med_form", label: "Medical Fitness Certificate (Form-B signed by doctor, for applicants 50+ or commercial)", critical: false, reasonIfMissing: "Required for commercial HTV or senior citizens." },
      { id: "road_ready", label: "Vehicle of the applicable category (Car / Bike) in good mechanical condition for road test", critical: true, reasonIfMissing: "You must perform the parallel parking and L-shape reverse test." },
    ],
  },
  {
    id: "tenant_police",
    title: "Tenant Police Registration",
    department: "Police Khidmat Markaz",
    guideSlug: "tenant-registration",
    typicalRejectionRate: "20% delayed for missing landlord CNIC",
    checklist: [
      { id: "landlord_cnic", label: "Clear copy of Landlord (Property Owner) CNIC", critical: true, reasonIfMissing: "Required to verify landlord identity." },
      { id: "tenant_cnic", label: "Original CNIC of all adult tenants living in the property", critical: true, reasonIfMissing: "Tenants must undergo live biometric scan." },
      { id: "rent_agreement", label: "Original signed Rent Agreement (Iqrar Nama Kirayadari) on Stamp Paper", critical: true, reasonIfMissing: "Verifies rental terms and tenancy duration." },
      { id: "presence", label: "Tenant physical presence at Police Khidmat Markaz", critical: true, reasonIfMissing: "Biometric thumb scan is run against criminal databases in real-time." },
    ],
  },
];

export function FileReadinessChecker() {
  const [selectedProcId, setSelectedProcId] = useState<string>("cnic_new");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const currentProc = PROCEDURES.find((p) => p.id === selectedProcId) || PROCEDURES[0];

  const handleToggle = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleSelectProcedure = (procId: string) => {
    setSelectedProcId(procId);
    setCheckedItems({});
  };

  // Calculate score
  const totalItems = currentProc.checklist.length;
  const tickedItems = currentProc.checklist.filter((item) => checkedItems[item.id]).length;
  const criticalItems = currentProc.checklist.filter((item) => item.critical);
  const criticalTicked = criticalItems.filter((item) => checkedItems[item.id]).length;
  const missingCritical = criticalItems.filter((item) => !checkedItems[item.id]);

  const scorePct = Math.round((tickedItems / totalItems) * 100);

  const getStatus = () => {
    if (missingCritical.length > 0) {
      return {
        label: "NOT READY — WILL BE REJECTED AT COUNTER",
        color: "text-danger bg-red-50 border-red-200",
        badge: "Critical Documents Missing",
      };
    }
    if (scorePct === 100) {
      return {
        label: "100% READY — SAFE TO VISIT",
        color: "text-primary bg-emerald-50 border-emerald-300",
        badge: "File Complete & Verified",
      };
    }
    return {
      label: "MOSTLY READY — MINOR ITEMS PENDING",
      color: "text-warn-fg bg-amber-50 border-amber-300",
      badge: "Minor Photocopies Pending",
    };
  };

  const status = getStatus();

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <FileCheck2 className="size-3.5" /> Pre-Visit Counter Auditor
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-primary sm:text-3xl">
            "Check My File" Readiness Score
          </h2>
          <p className="mt-1 text-xs text-muted">
            Audit your physical folder before leaving home to ensure government counter clerks never bounce your application.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-xl border border-border bg-bg px-4 py-2 text-xs font-semibold text-fg hover:bg-surface transition-colors"
        >
          <Printer className="size-3.5 text-muted" /> Print Checklist Cover
        </button>
      </div>

      {/* Procedure Selector Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 rounded-2xl border border-border bg-bg p-2">
        {PROCEDURES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleSelectProcedure(p.id)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              selectedProcId === p.id ? "bg-primary text-surface shadow-md font-bold" : "text-muted hover:text-primary"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Audit Workspace */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* CHECKLIST AUDIT COLUMN */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
              Tick Documents Currently Inside Your Folder:
            </h3>
            <span className="text-xs font-semibold text-danger">
              ⚠️ {currentProc.typicalRejectionRate}
            </span>
          </div>

          <div className="space-y-2.5">
            {currentProc.checklist.map((item) => {
              const isChecked = Boolean(checkedItems[item.id]);
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggle(item.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-150 ${
                    isChecked
                      ? "border-primary/60 bg-emerald-50/40 text-fg"
                      : "border-border bg-bg/50 hover:bg-surface"
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggle(item.id)}
                      className="mt-1 size-4 rounded accent-primary shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${isChecked ? "text-primary" : "text-fg"}`}>
                          {item.label}
                        </span>
                        {item.critical && (
                          <span className="rounded-md bg-red-100 px-1.5 py-0.5 text-[9px] font-extrabold text-red-800 uppercase">
                            Mandatory
                          </span>
                        )}
                      </div>
                      {!isChecked && (
                        <p className="mt-1 text-[11px] text-muted">
                          <strong>Clerk Rejection Reason:</strong> {item.reasonIfMissing}
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* SCORE & REJECTION RISK COLUMN */}
        <div className="flex flex-col justify-between rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-bg via-surface to-bg p-6 shadow-sm lg:col-span-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                Audit Result
              </span>
              <span className={`rounded-md border px-2 py-0.5 text-[10px] font-extrabold ${status.color}`}>
                {status.badge}
              </span>
            </div>

            {/* Score Number Gauge */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-5xl font-extrabold text-primary">
                {scorePct}%
              </span>
              <span className="text-xs font-semibold text-muted">
                ({tickedItems} of {totalItems} items ready)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className={`h-full transition-all duration-300 ${
                  missingCritical.length > 0 ? "bg-danger" : scorePct === 100 ? "bg-primary" : "bg-accent"
                }`}
                style={{ width: `${scorePct}%` }}
              />
            </div>

            {/* Status Alert */}
            <div className={`mt-5 rounded-xl border p-4 text-xs font-semibold leading-relaxed ${status.color}`}>
              {status.label}
            </div>

            {/* Missing Critical Items Warning */}
            {missingCritical.length > 0 && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50/60 p-4 space-y-2">
                <h4 className="text-xs font-bold text-red-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <XCircle className="size-4 text-danger shrink-0" />
                  Missing Critical Items ({missingCritical.length}):
                </h4>
                <ul className="space-y-1 text-xs text-red-950">
                  {missingCritical.map((item) => (
                    <li key={item.id} className="flex items-start gap-1.5">
                      <span className="text-danger">•</span>
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-border pt-4">
            <Link
              to="/guides/$slug"
              params={{ slug: currentProc.guideSlug }}
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-surface hover:bg-primary-light transition-colors"
            >
              View Complete Official Guide & Tips <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
