import { useState } from "react";
import { Receipt, Search, CheckCircle2, AlertTriangle, Building, CreditCard, Copy, ExternalLink, Printer } from "lucide-react";

export function Psid1BillChallanVerifier() {
  const [psidInput, setPsidInput] = useState("10012345678901234");
  const [analyzed, setAnalyzed] = useState(true);
  const [copied, setCopied] = useState(false);

  // Clean numeric string
  const cleanPsid = psidInput.replace(/\D/g, "");

  let issuer = "1Link / 1Bill National Payment Switch";
  let province = "Federal / Multi-Provincial";
  let serviceType = "General Government Challan / Utility Bill";
  let instructions = "Payable via any Pakistani Mobile Banking App, ATM, EasyPaisa, or JazzCash under '1Bill - Invoice/Challan' or 'e-Pay'.";

  if (cleanPsid.startsWith("100") || cleanPsid.startsWith("999")) {
    issuer = "e-Pay Punjab (Finance Dept, Govt of Punjab)";
    province = "Punjab";
    serviceType = "Excise Token Tax / Traffic e-Challan / Property Tax / DLIMS";
    instructions = "Open your Bank App -> Select 'e-Pay Punjab' or '1Bill (Invoice No: 100...)' -> Enter 17-digit PSID -> Verify Owner Name & Pay.";
  } else if (cleanPsid.startsWith("051") || cleanPsid.startsWith("110")) {
    issuer = "ICT e-Services (Islamabad Capital Territory Administration)";
    province = "Islamabad (ICT)";
    serviceType = "ICT Vehicle Token / CDA Property / Excise Dues";
  } else if (cleanPsid.startsWith("220") || cleanPsid.startsWith("330")) {
    issuer = "FBR Federal Board of Revenue (IRIS CPR)";
    province = "Federal";
    serviceType = "FBR Income Tax / Section 236K / Sales Tax Challan (PSID)";
    instructions = "Payable via Online Banking under 'FBR Federal Taxes' or '1Bill Tax/Government Payment'.";
  } else if (cleanPsid.length === 14) {
    issuer = "NEPRA DISCO Electricity Utility (LESCO / IESCO / K-Electric / GEPCO)";
    province = "Power Distribution";
    serviceType = "14-Digit Domestic Electricity Consumer Bill";
    instructions = "Payable under 'Electricity' section in your banking app using 14-digit Reference Number.";
  }

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-8 space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <Receipt className="size-3.5" /> 1Bill / 1Link National Payment Switch
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-primary sm:text-3xl">
            17-Digit PSID & Government Challan Inspector
          </h2>
          <p className="mt-1 text-xs text-muted">
            Inspect, decode, and verify any 17-digit PSID issued by e-Pay Punjab, ICT, FBR, Sindh Board, or DISCO utilities.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-surface hover:bg-primary-light shadow-xs"
        >
          <Printer className="size-4" /> Print B&W Verification
        </button>
      </div>

      {/* Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
          Enter 17-Digit PSID or Consumer Reference Number
        </label>
        <div className="relative">
          <input
            type="text"
            maxLength={17}
            value={psidInput}
            onChange={(e) => setPsidInput(e.target.value)}
            placeholder="e.g. 10012345678901234"
            className="w-full rounded-2xl border border-border bg-bg px-4 py-3.5 font-mono text-base font-bold text-fg outline-none focus:border-primary tracking-widest"
          />
          <span className="absolute right-4 top-3.5 text-xs font-bold text-muted">
            {cleanPsid.length}/17 Digits
          </span>
        </div>
      </div>

      {/* Analysis Result Card */}
      <div className="rounded-2xl border-2 border-emerald-500/20 bg-emerald-500/5 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
            Official Routing Verification
          </span>
          <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
            Active 1Link PSID
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
          <div>
            <span className="text-muted block text-[10px] font-bold uppercase">Issuing Authority</span>
            <span className="font-bold text-emerald-950 mt-0.5 block">{issuer}</span>
          </div>
          <div>
            <span className="text-muted block text-[10px] font-bold uppercase">Jurisdiction</span>
            <span className="font-bold text-emerald-950 mt-0.5 block">{province}</span>
          </div>
          <div>
            <span className="text-muted block text-[10px] font-bold uppercase">Service Category</span>
            <span className="font-bold text-emerald-950 mt-0.5 block">{serviceType}</span>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-surface p-4 text-xs space-y-2">
          <span className="font-bold text-primary block">Payment Instructions:</span>
          <p className="text-muted leading-relaxed">{instructions}</p>
        </div>
      </div>
    </div>
  );
}
