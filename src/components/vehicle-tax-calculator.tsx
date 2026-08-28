import { useState } from "react";
import { Car, DollarSign, Sparkles, ShieldCheck, CheckCircle2, ExternalLink, Info, Building2, Fuel } from "lucide-react";

export function VehicleTaxCalculator() {
  const [province, setProvince] = useState<"punjab" | "sindh" | "ict" | "kpk">("punjab");
  const [engineCC, setEngineCC] = useState<number>(1300);
  const [actionType, setActionType] = useState<"token" | "transfer" | "registration">("transfer");
  const [isFiler, setIsFiler] = useState<boolean>(true);
  const [vehicleAge, setVehicleAge] = useState<"new" | "1_5" | "5_plus">("1_5");

  // Calculate annual token tax
  const calculateTokenTax = (cc: number, prov: string) => {
    if (cc <= 1000) return 2500;
    if (cc <= 1300) return 5500;
    if (cc <= 1500) return 9000;
    if (cc <= 1800) return 14500;
    if (cc <= 2500) return 25000;
    return 45000;
  };

  // FBR Section 231B Advance Withholding Tax for Transfer / Purchase
  const calculateWht = (cc: number, filer: boolean, action: string) => {
    if (action === "token") return 0;
    
    // FBR Sec 231B WHT Slabs
    let baseFiler = 0;
    if (cc <= 850) baseFiler = 10000;
    else if (cc <= 1000) baseFiler = 20000;
    else if (cc <= 1300) baseFiler = 37500;
    else if (cc <= 1600) baseFiler = 75000;
    else if (cc <= 1800) baseFiler = 112500;
    else if (cc <= 2000) baseFiler = 150000;
    else if (cc <= 2500) baseFiler = 225000;
    else if (cc <= 3000) baseFiler = 300000;
    else baseFiler = 450000;

    // Non-filers pay 3x to 4x standard withholding tax
    return filer ? baseFiler : baseFiler * 3;
  };

  // Motor Vehicle Transfer / Registration Fee
  const calculateTransferFee = (cc: number) => {
    if (cc <= 1000) return 2000;
    if (cc <= 1300) return 3500;
    if (cc <= 1800) return 6000;
    return 10000;
  };

  const tokenTax = calculateTokenTax(engineCC, province);
  const wht = calculateWht(engineCC, isFiler, actionType);
  const transferFee = actionType === "token" ? 0 : calculateTransferFee(engineCC);
  const biometricFee = actionType === "transfer" ? 650 : 0; // NADRA biometric fee
  const smartCardFee = actionType === "token" ? 0 : 1500; // Smart card issuance

  const totalPayable = (actionType === "token" ? tokenTax : 0) + wht + transferFee + biometricFee + smartCardFee;

  const getPortalUrl = () => {
    if (province === "punjab") return "https://epay.punjab.gov.pk";
    if (province === "sindh") return "https://excise.gos.pk";
    if (province === "ict") return "https://islamabadexcise.gov.pk";
    return "https://kpexcise.gov.pk";
  };

  return (
    <div className="space-y-8 rounded-3xl border border-border/80 bg-surface p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-400">
            <Car className="size-3.5" /> Provincial Excise & FBR Sec 231B Engine
          </div>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-black text-primary">
            Vehicle Biometric Transfer & Token Tax Engine
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Exact breakdown of annual Token Tax, FBR Withholding Tax (Filer vs Non-Filer), and Biometric Transfer PSID amount.
          </p>
        </div>

        {/* Province Switcher */}
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value as any)}
          className="rounded-2xl border-2 border-primary/30 bg-surface px-4 py-2 text-xs font-bold text-primary outline-none focus:border-primary shrink-0"
        >
          <option value="punjab">Punjab (e-Pay 1Bill)</option>
          <option value="sindh">Sindh Excise</option>
          <option value="ict">Islamabad (ICT)</option>
          <option value="kpk">Khyber Pakhtunkhwa</option>
        </select>
      </div>

      {/* Input Form */}
      <div className="grid gap-8 lg:grid-cols-12 items-center">
        <div className="lg:col-span-7 space-y-5">
          {/* Action Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-fg">Transaction Nature:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "transfer", label: "Biometric Transfer" },
                { id: "token", label: "Annual Token Tax" },
                { id: "registration", label: "New Registration" },
              ].map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => setActionType(act.id as any)}
                  className={"rounded-xl p-3 text-xs font-bold transition-all border " + (actionType === act.id ? "bg-primary text-surface border-primary shadow-xs" : "bg-bg/40 border-border text-fg hover:border-primary/40")}
                >
                  {act.label}
                </button>
              ))}
            </div>
          </div>

          {/* Engine Capacity CC */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-fg">Engine Displacement (CC):</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { label: "< 1000cc", cc: 1000 },
                { label: "1300cc", cc: 1300 },
                { label: "1500cc", cc: 1500 },
                { label: "1800cc", cc: 1800 },
                { label: "2000cc", cc: 2000 },
                { label: "2500cc+", cc: 2500 },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setEngineCC(item.cc)}
                  className={"rounded-xl py-2 px-2 text-xs font-bold transition-all border text-center " + (engineCC === item.cc ? "bg-primary text-surface border-primary shadow-xs" : "bg-bg/40 border-border text-fg hover:border-primary/40")}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* FBR Filer Status */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-fg">FBR Active Taxpayer (ATL) Filer Status:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsFiler(true)}
                className={"rounded-2xl border p-3.5 text-left transition-all " + (isFiler ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold" : "border-border bg-bg/40 text-fg")}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>Active Filer (Reduced WHT)</span>
                </div>
                <div className="text-[11px] font-normal text-muted mt-1">Saves up to 66% on FBR Section 231B Advance Tax.</div>
              </button>

              <button
                type="button"
                onClick={() => setIsFiler(false)}
                className={"rounded-2xl border p-3.5 text-left transition-all " + (!isFiler ? "border-red-500 bg-red-500/10 text-red-800 dark:text-red-300 font-bold" : "border-border bg-bg/40 text-fg")}
              >
                <div className="flex items-center gap-2">
                  <span className="size-4 rounded-full bg-red-500/20 text-red-600 grid place-items-center text-xs font-bold">!</span>
                  <span>Non-Filer (Triple WHT)</span>
                </div>
                <div className="text-[11px] font-normal text-muted mt-1">3x punitive tax under Finance Act.</div>
              </button>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-[#063318] via-[#094120] to-[#042411] p-6 sm:p-7 text-surface shadow-md space-y-5 border border-emerald-800/40">
          <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Total Payable Estimate</span>
            <span className="rounded-full bg-accent/20 px-3 py-0.5 text-xs font-black text-accent">
              {province.toUpperCase()} PSID
            </span>
          </div>

          <div className="rounded-2xl bg-black/25 p-5 border border-emerald-700/30 text-center space-y-1">
            <div className="text-xs font-medium text-surface/75 uppercase tracking-wider">Estimated Total PSID Amount</div>
            <div className="font-mono text-3xl sm:text-4xl font-black text-accent">
              Rs {totalPayable.toLocaleString()}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-emerald-800/80 text-xs">
            {actionType === "token" && (
              <div className="flex items-center justify-between text-surface/85">
                <span>Motor Vehicle Tax (Annual):</span>
                <span className="font-mono font-bold text-surface">Rs {tokenTax.toLocaleString()}</span>
              </div>
            )}
            {actionType !== "token" && (
              <>
                <div className="flex items-center justify-between text-surface/85">
                  <span>FBR Advance Tax (Sec 231B):</span>
                  <span className={"font-mono font-bold " + (isFiler ? "text-emerald-300" : "text-red-300")}>Rs {wht.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-surface/85">
                  <span>Excise Transfer Fee:</span>
                  <span className="font-mono font-bold text-surface">Rs {transferFee.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-surface/85">
                  <span>NADRA Biometric Fee:</span>
                  <span className="font-mono font-bold text-surface">Rs {biometricFee.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-surface/85">
                  <span>Smart Card & Plates:</span>
                  <span className="font-mono font-bold text-surface">Rs {smartCardFee.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>

          <div className="pt-2">
            <a
              href={getPortalUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-black text-[#01411c] hover:brightness-110 transition-all shadow-md"
            >
              <span>Generate Official PSID on {province.toUpperCase()} e-Pay</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
