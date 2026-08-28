import { useState } from "react";
import { Calculator, DollarSign, Sparkles, TrendingUp, ShieldCheck, CheckCircle2, Info, ArrowRight, Percent, Building2 } from "lucide-react";

export function SalaryTaxCalculator() {
  const [salaryMode, setSalaryMode] = useState<"monthly" | "annual">("monthly");
  const [personType, setPersonType] = useState<"salaried" | "business">("salaried");
  const [inputSalary, setInputSalary] = useState<number>(150000);
  const [taxYear, setTaxYear] = useState<"2025-2026" | "2024-2025">("2025-2026");

  // Calculate annual taxable income
  const annualSalary = salaryMode === "monthly" ? inputSalary * 12 : inputSalary;
  const monthlySalary = salaryMode === "monthly" ? inputSalary : inputSalary / 12;

  // Pakistan Finance Act Slabs for Salaried Individuals (FY 2025-2026)
  const calculateSalariedTax = (annual: number) => {
    let tax = 0;
    let slabDesc = "";
    let baseRate = 0;
    let excessRate = 0;
    let minThreshold = 0;

    if (annual <= 600000) {
      tax = 0;
      slabDesc = "0% Tax (Below Rs 600,000 threshold)";
    } else if (annual <= 1200000) {
      minThreshold = 600000;
      excessRate = 5;
      tax = (annual - 600000) * 0.05;
      slabDesc = "5% of amount exceeding Rs 600,000";
    } else if (annual <= 2200000) {
      minThreshold = 1200000;
      baseRate = 30000;
      excessRate = 15;
      tax = 30000 + (annual - 1200000) * 0.15;
      slabDesc = "Rs 30,000 + 15% of amount exceeding Rs 1,200,000";
    } else if (annual <= 3200000) {
      minThreshold = 2200000;
      baseRate = 180000;
      excessRate = 25;
      tax = 180000 + (annual - 2200000) * 0.25;
      slabDesc = "Rs 180,000 + 25% of amount exceeding Rs 2,200,000";
    } else if (annual <= 4100000) {
      minThreshold = 3200000;
      baseRate = 430000;
      excessRate = 30;
      tax = 430000 + (annual - 3200000) * 0.30;
      slabDesc = "Rs 430,000 + 30% of amount exceeding Rs 3,200,000";
    } else {
      minThreshold = 4100000;
      baseRate = 700000;
      excessRate = 35;
      tax = 700000 + (annual - 4100000) * 0.35;
      slabDesc = "Rs 700,000 + 35% of amount exceeding Rs 4,100,000";
    }

    // 10% Surcharge on ultra high earners above 10M annual
    let surcharge = 0;
    if (annual > 10000000) {
      surcharge = tax * 0.10;
      tax += surcharge;
    }

    return { tax: Math.round(tax), slabDesc, surcharge: Math.round(surcharge) };
  };

  // Pakistan Finance Act Slabs for Non-Salaried / Association of Persons
  const calculateBusinessTax = (annual: number) => {
    let tax = 0;
    let slabDesc = "";

    if (annual <= 600000) {
      tax = 0;
      slabDesc = "0% Tax (Up to Rs 600,000)";
    } else if (annual <= 1200000) {
      tax = (annual - 600000) * 0.15;
      slabDesc = "15% of amount exceeding Rs 600,000";
    } else if (annual <= 1600000) {
      tax = 90000 + (annual - 1200000) * 0.20;
      slabDesc = "Rs 90,000 + 20% of amount exceeding Rs 1,200,000";
    } else if (annual <= 3200000) {
      tax = 170000 + (annual - 1600000) * 0.30;
      slabDesc = "Rs 170,000 + 30% of amount exceeding Rs 1,600,000";
    } else if (annual <= 5600000) {
      tax = 650000 + (annual - 3200000) * 0.40;
      slabDesc = "Rs 650,000 + 40% of amount exceeding Rs 3,200,000";
    } else {
      tax = 1610000 + (annual - 5600000) * 0.45;
      slabDesc = "Rs 1,610,000 + 45% of amount exceeding Rs 5,600,000";
    }

    return { tax: Math.round(tax), slabDesc, surcharge: 0 };
  };

  const { tax: annualTax, slabDesc, surcharge } = personType === "salaried"
    ? calculateSalariedTax(annualSalary)
    : calculateBusinessTax(annualSalary);

  const monthlyTax = Math.round(annualTax / 12);
  const monthlyTakeHome = Math.max(0, Math.round(monthlySalary - monthlyTax));
  const annualTakeHome = Math.max(0, Math.round(annualSalary - annualTax));
  const effectiveTaxRate = annualSalary > 0 ? ((annualTax / annualSalary) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-8 rounded-3xl border border-border/80 bg-surface p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <Sparkles className="size-3.5" /> FBR Pakistan Finance Act 2025–2026 Slabs
          </div>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-black text-primary">
            Salaried & Individual Income Tax Calculator
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Calculate your exact monthly tax deduction, net take-home salary, and effective tax bracket.
          </p>
        </div>

        {/* Individual Type Switcher */}
        <div className="inline-flex rounded-2xl border border-primary/20 bg-bg p-1 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setPersonType("salaried")}
            className={"rounded-xl px-4 py-2 transition-all " + (personType === "salaried" ? "bg-primary text-surface shadow-xs" : "text-muted hover:text-fg")}
          >
            Salaried Person
          </button>
          <button
            type="button"
            onClick={() => setPersonType("business")}
            className={"rounded-xl px-4 py-2 transition-all " + (personType === "business" ? "bg-primary text-surface shadow-xs" : "text-muted hover:text-fg")}
          >
            AOP / Non-Salaried
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid gap-6 lg:grid-cols-12 items-center">
        <div className="lg:col-span-6 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-fg">Enter Income (PKR)</label>
              <div className="flex items-center gap-1 bg-bg p-1 rounded-xl border border-border/80">
                <button
                  type="button"
                  onClick={() => setSalaryMode("monthly")}
                  className={"px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all " + (salaryMode === "monthly" ? "bg-primary text-surface shadow-2xs" : "text-muted")}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setSalaryMode("annual")}
                  className={"px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all " + (salaryMode === "annual" ? "bg-primary text-surface shadow-2xs" : "text-muted")}
                >
                  Annual
                </button>
              </div>
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-4 text-sm font-black text-muted font-mono">PKR</span>
              <input
                type="number"
                min={0}
                step={5000}
                value={inputSalary || ""}
                onChange={(e) => setInputSalary(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-2xl border-2 border-primary/30 bg-surface pl-16 pr-4 py-3.5 font-mono text-xl sm:text-2xl font-black text-fg outline-none focus:border-primary transition-all shadow-xs"
                placeholder="150000"
              />
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-2">
            {[50000, 100000, 150000, 250000, 400000, 750000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  setSalaryMode("monthly");
                  setInputSalary(val);
                }}
                className="rounded-xl border border-border bg-bg/60 px-3 py-1.5 text-xs font-semibold text-fg hover:border-primary hover:bg-primary/10 transition-all"
              >
                Rs {val >= 100000 ? (val / 1000) + "k" : val.toLocaleString()} /mo
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-border/80 bg-[#f9faf9] dark:bg-bg/40 p-4 space-y-2 text-xs">
            <div className="font-bold text-primary flex items-center gap-1.5">
              <Info className="size-4 text-primary" /> Active FBR Tax Slab Rule:
            </div>
            <p className="text-muted leading-relaxed font-mono">{slabDesc}</p>
            {surcharge > 0 && (
              <p className="text-amber-600 font-bold">Includes 10% High-Earner Surcharge: Rs {surcharge.toLocaleString()}</p>
            )}
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-[#063318] via-[#094120] to-[#042411] p-6 sm:p-7 text-surface shadow-md space-y-5 border border-emerald-800/40">
          <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Tax Summary</span>
            <span className="rounded-full bg-accent/20 px-3 py-0.5 text-xs font-black text-accent">
              Effective Tax: {effectiveTaxRate}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-black/25 p-4 border border-emerald-700/30">
              <div className="text-[11px] font-medium text-surface/75">Monthly Tax Deduction</div>
              <div className="font-mono text-xl sm:text-2xl font-black text-red-400 mt-1">
                Rs {monthlyTax.toLocaleString()}
              </div>
            </div>

            <div className="rounded-2xl bg-black/25 p-4 border border-emerald-700/30">
              <div className="text-[11px] font-medium text-surface/75">Monthly Take-Home</div>
              <div className="font-mono text-xl sm:text-2xl font-black text-emerald-300 mt-1">
                Rs {monthlyTakeHome.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-emerald-800/80 text-xs">
            <div className="flex items-center justify-between text-surface/85">
              <span>Annual Taxable Gross:</span>
              <span className="font-mono font-bold text-surface">Rs {annualSalary.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-surface/85">
              <span>Total Annual Income Tax:</span>
              <span className="font-mono font-bold text-red-300">Rs {annualTax.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-surface/85">
              <span>Annual Net Income:</span>
              <span className="font-mono font-bold text-emerald-400">Rs {annualTakeHome.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Relief & Savings Guidance */}
      <div className="border-t border-border/80 pt-6 space-y-3">
        <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" /> Permissible FBR Tax Credits & Reductions (Under Income Tax Ordinance 2001)
        </h3>
        <div className="grid gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-2xl border border-border/80 bg-bg/40 p-3.5 space-y-1">
            <div className="font-bold text-fg">1. Section 60 (Zakat Deduction)</div>
            <p className="text-muted leading-relaxed">Direct rupee-for-rupee deduction from total taxable income for Zakat paid under the Zakat & Ushr Ordinance.</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-bg/40 p-3.5 space-y-1">
            <div className="font-bold text-fg">2. Section 63 (VPS Pension Funds)</div>
            <p className="text-muted leading-relaxed">Tax credit of up to 20% of taxable income for investments in SECP-approved Voluntary Pension Schemes.</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-bg/40 p-3.5 space-y-1">
            <div className="font-bold text-fg">3. Section 61 (Approved Charities)</div>
            <p className="text-muted leading-relaxed">Tax credit for direct donations to universities, relief funds, and non-profit institutions listed in the 13th Schedule.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
