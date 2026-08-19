import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Building,
  Calculator,
  Car,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  IdCard,
  Info,
  Receipt,
  Scale,
  Sparkles,
  Zap,
} from "lucide-react";

export function FeeCalculator() {
  const [activeTab, setActiveTab] = useState<"nadra" | "passport" | "dlims" | "property" | "vehicle">("nadra");

  // NADRA State
  const [nadraType, setNadraType] = useState<"smart" | "nicop" | "frc" | "succession">("smart");
  const [nadraSpeed, setNadraSpeed] = useState<"normal" | "urgent" | "executive">("urgent");

  // Passport State
  const [passPages, setPassPages] = useState<"36" | "72" | "100">("36");
  const [passValidity, setPassValidity] = useState<"5" | "10">("5");
  const [passSpeed, setPassSpeed] = useState<"normal" | "urgent" | "fast">("normal");

  // DLIMS State
  const [dlimsType, setDlimsType] = useState<"car" | "bike" | "commercial" | "idp">("car");
  const [dlimsStage, setDlimsStage] = useState<"learner" | "regular" | "renewal">("regular");

  // Property Tax State
  const [propRole, setPropRole] = useState<"buyer" | "seller">("buyer");
  const [propFiler, setPropFiler] = useState<boolean>(true);
  const [propValue, setPropValue] = useState<number>(10000000); // 1 Crore default

  // Vehicle State
  const [vehCC, setVehCC] = useState<"1000" | "1300" | "1500" | "1800" | "2000">("1300");
  const [vehAction, setVehAction] = useState<"transfer" | "token">("transfer");
  const [vehFiler, setVehFiler] = useState<boolean>(true);

  // NADRA Calculation
  const calculateNadra = () => {
    if (nadraType === "frc") return { fee: 1000, time: "Same day (Instant)", notes: "Fee applies both online on Pak-ID and at NADRA Mega Centers." };
    if (nadraType === "succession") return { fee: 20000, time: "15–30 Days", notes: "Official NADRA processing fee including 14-day mandatory national newspaper notice." };
    if (nadraType === "nicop") {
      if (nadraSpeed === "normal") return { fee: 8500, time: "20 Working Days", notes: "Zone A delivery via DHL to overseas residence." };
      if (nadraSpeed === "urgent") return { fee: 13500, time: "10 Working Days", notes: "Zone A expedited issuance." };
      return { fee: 18500, time: "4–5 Working Days", notes: "Executive fast-track dispatch." };
    }
    // Smart Card CNIC
    if (nadraSpeed === "normal") return { fee: 750, time: "15 Working Days", notes: "Free standard CNIC available, Smart Chip is PKR 750." };
    if (nadraSpeed === "urgent") return { fee: 1500, time: "7 Working Days", notes: "Urgent processing queue at all centers." };
    return { fee: 2500, time: "2–4 Working Days", notes: "Executive fast-track counters with priority processing." };
  };

  // Passport Calculation
  const calculatePassport = () => {
    let fee = 0;
    let time = "14 Working Days";
    if (passValidity === "5") {
      if (passPages === "36") {
        if (passSpeed === "normal") { fee = 4500; time = "14 Working Days"; }
        else if (passSpeed === "urgent") { fee = 7500; time = "7 Working Days"; }
        else { fee = 12500; time = "4 Working Days"; }
      } else if (passPages === "72") {
        if (passSpeed === "normal") { fee = 8200; time = "14 Working Days"; }
        else if (passSpeed === "urgent") { fee = 13500; time = "7 Working Days"; }
        else { fee = 18500; time = "4 Working Days"; }
      } else {
        if (passSpeed === "normal") { fee = 9000; time = "14 Working Days"; }
        else if (passSpeed === "urgent") { fee = 16800; time = "7 Working Days"; }
        else { fee = 21800; time = "4 Working Days"; }
      }
    } else {
      // 10 Years
      if (passPages === "36") {
        if (passSpeed === "normal") { fee = 6700; time = "14 Working Days"; }
        else if (passSpeed === "urgent") { fee = 11200; time = "7 Working Days"; }
        else { fee = 16200; time = "4 Working Days"; }
      } else if (passPages === "72") {
        if (passSpeed === "normal") { fee = 12400; time = "14 Working Days"; }
        else if (passSpeed === "urgent") { fee = 20200; time = "7 Working Days"; }
        else { fee = 25200; time = "4 Working Days"; }
      } else {
        if (passSpeed === "normal") { fee = 13500; time = "14 Working Days"; }
        else if (passSpeed === "urgent") { fee = 25200; time = "7 Working Days"; }
        else { fee = 30200; time = "4 Working Days"; }
      }
    }
    return { fee, time };
  };

  // Property Calculation (Section 236C / 236K)
  const calculateProperty = () => {
    const rate = propRole === "buyer" 
      ? (propFiler ? 0.03 : 0.07) // 236K: 3% Filer vs 7% Non-Filer
      : (propFiler ? 0.03 : 0.06); // 236C: 3% Filer vs 6% Non-Filer
    const advanceTax = propValue * rate;
    const stampDuty = propValue * 0.01; // 1%
    const tmaTax = propValue * 0.01; // 1%
    const totalDues = advanceTax + stampDuty + tmaTax;
    return { advanceTax, stampDuty, tmaTax, totalDues, ratePct: rate * 100 };
  };

  const nadraRes = calculateNadra();
  const passRes = calculatePassport();
  const propRes = calculateProperty();

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-warn-fg">
            <Calculator className="size-3.5" /> Instant Civic Calculator
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-primary sm:text-3xl">
            Official Fee & Timeline Estimator
          </h2>
          <p className="mt-1 text-xs text-muted">
            Official government fee rates updated as per Federal & Provincial Gazette 2026.
          </p>
        </div>
      </div>

      {/* Calculator Navigation Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 rounded-2xl border border-border bg-bg p-2">
        <button
          type="button"
          onClick={() => setActiveTab("nadra")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
            activeTab === "nadra" ? "bg-primary text-surface shadow-md" : "text-muted hover:text-primary"
          }`}
        >
          <IdCard className="size-4" /> NADRA ID
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("passport")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
            activeTab === "passport" ? "bg-primary text-surface shadow-md" : "text-muted hover:text-primary"
          }`}
        >
          <Receipt className="size-4" /> Passports (DGIP)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("property")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
            activeTab === "property" ? "bg-primary text-surface shadow-md" : "text-muted hover:text-primary"
          }`}
        >
          <Building className="size-4" /> Property Taxes (236C/K)
        </button>
      </div>

      {/* TAB 1: NADRA */}
      {activeTab === "nadra" && (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted">Select Document Type</label>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { id: "smart", label: "Smart CNIC" },
                  { id: "frc", label: "FRC (Family)" },
                  { id: "nicop", label: "NICOP (Overseas)" },
                  { id: "succession", label: "Succession" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setNadraType(item.id as any)}
                    className={`rounded-xl border p-3 text-xs font-semibold transition-all ${
                      nadraType === item.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-bg text-fg hover:bg-surface"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {(nadraType === "smart" || nadraType === "nicop") && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Processing Priority</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { id: "normal", label: "Normal (30d)", desc: "Standard queue" },
                    { id: "urgent", label: "Urgent (15d)", desc: "Priority printing" },
                    { id: "executive", label: "Executive (Same/4d)", desc: "Fast-track VIP" },
                  ].map((speed) => (
                    <button
                      key={speed.id}
                      type="button"
                      onClick={() => setNadraSpeed(speed.id as any)}
                      className={`flex flex-col items-center rounded-xl border p-3 text-xs transition-all ${
                        nadraSpeed === speed.id ? "border-primary bg-primary/10 text-primary font-bold" : "border-border bg-bg text-muted hover:bg-surface"
                      }`}
                    >
                      <span>{speed.label}</span>
                      <span className="mt-0.5 text-[10px] opacity-75">{speed.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-bg via-surface to-bg p-6 shadow-sm lg:col-span-5">
            <div>
              <span className="rounded-md bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warn-fg">
                Official Estimate
              </span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-primary">PKR {nadraRes.fee.toLocaleString()}</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-fg">
                <Clock className="size-4 text-accent" /> Estimated Time: <span className="text-primary font-bold">{nadraRes.time}</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                {nadraRes.notes}
              </p>
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <Link
                to="/guides/$slug"
                params={{ slug: nadraType === "frc" ? "frc" : nadraType === "succession" ? "succession" : "cnic" }}
                className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-surface hover:bg-primary-light"
              >
                View Full Document Checklist <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PASSPORT */}
      {activeTab === "passport" && (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted">Validity Period</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  { id: "5", label: "5 Years Validity" },
                  { id: "10", label: "10 Years Validity (Recommended)" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPassValidity(item.id as any)}
                    className={`rounded-xl border p-3 text-xs font-semibold transition-all ${
                      passValidity === item.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-bg text-fg hover:bg-surface"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted">Booklet Page Count</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  { id: "36", label: "36 Pages", desc: "Regular travel" },
                  { id: "72", label: "72 Pages", desc: "Frequent flyer" },
                  { id: "100", label: "100 Pages", desc: "Heavy business" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPassPages(item.id as any)}
                    className={`flex flex-col items-center rounded-xl border p-3 text-xs transition-all ${
                      passPages === item.id ? "border-primary bg-primary/10 text-primary font-bold" : "border-border bg-bg text-muted hover:bg-surface"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="mt-0.5 text-[10px] opacity-75">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted">Processing Priority</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  { id: "normal", label: "Normal (14d)", desc: "Standard SLA" },
                  { id: "urgent", label: "Urgent (7d)", desc: "Express printing" },
                  { id: "fast", label: "Fast-Track (4d)", desc: "Top priority dispatch" },
                ].map((speed) => (
                  <button
                    key={speed.id}
                    type="button"
                    onClick={() => setPassSpeed(speed.id as any)}
                    className={`flex flex-col items-center rounded-xl border p-3 text-xs transition-all ${
                      passSpeed === speed.id ? "border-primary bg-primary/10 text-primary font-bold" : "border-border bg-bg text-muted hover:bg-surface"
                    }`}
                  >
                    <span>{speed.label}</span>
                    <span className="mt-0.5 text-[10px] opacity-75">{speed.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-bg via-surface to-bg p-6 shadow-sm lg:col-span-5">
            <div>
              <span className="rounded-md bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warn-fg">
                Official DGIP Fee
              </span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-primary">PKR {passRes.fee.toLocaleString()}</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-fg">
                <Clock className="size-4 text-accent" /> Delivery SLA: <span className="text-primary font-bold">{passRes.time}</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                Fee can be paid online directly via the <strong>Passport Fee Asaan</strong> mobile app or 1Bill PSID at any bank ATM/app.
              </p>
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <Link
                to="/guides/$slug"
                params={{ slug: "passport" }}
                className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-surface hover:bg-primary-light"
              >
                View Passport Application Guide <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROPERTY TAX (236C / 236K) */}
      {activeTab === "property" && (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted">Are you Buying or Selling?</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPropRole("buyer")}
                  className={`rounded-xl border p-3 text-xs font-semibold transition-all ${
                    propRole === "buyer" ? "border-primary bg-primary/10 text-primary" : "border-border bg-bg text-fg hover:bg-surface"
                  }`}
                >
                  Buyer (Section 236K)
                </button>
                <button
                  type="button"
                  onClick={() => setPropRole("seller")}
                  className={`rounded-xl border p-3 text-xs font-semibold transition-all ${
                    propRole === "seller" ? "border-primary bg-primary/10 text-primary" : "border-border bg-bg text-fg hover:bg-surface"
                  }`}
                >
                  Seller (Section 236C)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted">FBR Active Taxpayer (ATL) Status</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPropFiler(true)}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
                    propFiler ? "border-primary bg-emerald-50 text-primary" : "border-border bg-bg text-muted hover:bg-surface"
                  }`}
                >
                  <CheckCircle2 className="size-4 text-primary" /> Active Filer (3% Tax)
                </button>
                <button
                  type="button"
                  onClick={() => setPropFiler(false)}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
                    !propFiler ? "border-danger bg-red-50 text-danger" : "border-border bg-bg text-muted hover:bg-surface"
                  }`}
                >
                  Non-Filer ({propRole === "buyer" ? "7%" : "6%"} Tax)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted">
                Property Value / FBR DC Rate (PKR)
              </label>
              <input
                type="number"
                step="500000"
                value={propValue}
                onChange={(e) => setPropValue(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm font-semibold text-fg outline-none focus:border-primary"
              />
              <span className="mt-1 block text-xs text-muted">
                Value: PKR {(propValue / 10000000).toFixed(2)} Crore ({propValue.toLocaleString()} PKR)
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-bg via-surface to-bg p-6 shadow-sm lg:col-span-5">
            <div>
              <span className="rounded-md bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warn-fg">
                Total Government Taxes & Duties
              </span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-primary">
                  PKR {propRes.totalDues.toLocaleString()}
                </span>
              </div>

              <div className="mt-5 space-y-2 text-xs">
                <div className="flex justify-between border-b border-border pb-1 text-fg">
                  <span>Advance Income Tax ({propRes.ratePct}%):</span>
                  <span className="font-bold">PKR {propRes.advanceTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-1 text-fg">
                  <span>Stamp Duty (1%):</span>
                  <span className="font-bold">PKR {propRes.stampDuty.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-1 text-fg">
                  <span>Town / TMA Tax (1%):</span>
                  <span className="font-bold">PKR {propRes.tmaTax.toLocaleString()}</span>
                </div>
              </div>

              {!propFiler && (
                <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-warn-fg">
                  <strong>Filer Tip:</strong> Becoming an active tax filer saves you{" "}
                  <strong>PKR {((propRole === "buyer" ? 0.04 : 0.03) * propValue).toLocaleString()}</strong> on this transaction!
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <Link
                to="/guides/$slug"
                params={{ slug: "e-stamping" }}
                className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-surface hover:bg-primary-light"
              >
                E-Stamping & Registry Guide <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
