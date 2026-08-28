import { useState } from "react";
import { Coins, DollarSign, Sparkles, Scale, CheckCircle2, AlertCircle, Info, BookOpen } from "lucide-react";

export function ZakatCalculator() {
  const [calcMode, setCalcMode] = useState<"wealth" | "ushr">("wealth");

  // Gold holdings
  const [goldWeight, setGoldWeight] = useState<number>(0);
  const [goldUnit, setGoldUnit] = useState<"tola" | "gram">("tola");
  const [goldKarat, setGoldKarat] = useState<"24" | "22" | "21" | "18">("24");
  const [goldRatePerTola, setGoldRatePerTola] = useState<number>(284500); // live default PKR

  // Silver holdings
  const [silverWeight, setSilverWeight] = useState<number>(0);
  const [silverUnit, setSilverUnit] = useState<"tola" | "gram">("tola");
  const [silverRatePerTola, setSilverRatePerTola] = useState<number>(3500);

  // Cash & Financial Assets
  const [cashInHand, setCashInHand] = useState<number>(0);
  const [bankBalance, setBankBalance] = useState<number>(0);
  const [prizeBonds, setPrizeBonds] = useState<number>(0);
  const [tradeGoods, setTradeGoods] = useState<number>(0);
  const [receivableLoans, setReceivableLoans] = useState<number>(0);

  // Liabilities to deduct
  const [immediateDebts, setImmediateDebts] = useState<number>(0);
  const [pendingBills, setPendingBills] = useState<number>(0);

  // Agricultural Ushr State
  const [cropType, setCropType] = useState<"rain" | "artificial">("artificial");
  const [cropGrossValue, setCropGrossValue] = useState<number>(500000);

  // Conversions
  const goldTolas = goldUnit === "tola" ? goldWeight : goldWeight / 11.6638;
  const silverTolas = silverUnit === "tola" ? silverWeight : silverWeight / 11.6638;

  // Purity factors
  const karatFactor = { "24": 1, "22": 22 / 24, "21": 21 / 24, "18": 18 / 24 }[goldKarat];
  const goldTotalValue = goldTolas * goldRatePerTola * karatFactor;
  const silverTotalValue = silverTolas * silverRatePerTola;

  const totalLiquidAssets = cashInHand + bankBalance + prizeBonds + tradeGoods + receivableLoans;
  const totalGrossWealth = goldTotalValue + silverTotalValue + totalLiquidAssets;
  const totalLiabilities = immediateDebts + pendingBills;
  const netZakatableWealth = Math.max(0, totalGrossWealth - totalLiabilities);

  // Nisab threshold (Silver standard: 52.5 tolas vs Gold standard: 7.5 tolas)
  const silverNisabValue = 52.5 * silverRatePerTola; // ~PKR 183,750
  const goldNisabValue = 7.5 * goldRatePerTola; // ~PKR 2,133,750

  const isEligible = netZakatableWealth >= silverNisabValue;
  const payableZakat = isEligible ? Math.round(netZakatableWealth * 0.025) : 0;

  // Ushr calculation (10% rain-fed, 5% canal/tubewell)
  const ushrRate = cropType === "rain" ? 0.10 : 0.05;
  const payableUshr = Math.round(cropGrossValue * ushrRate);

  return (
    <div className="space-y-8 rounded-3xl border border-border/80 bg-surface p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-800 dark:text-yellow-400">
            <Coins className="size-3.5" /> Islamic Shariah Guidelines (2.5% Zakat & 5%/10% Ushr)
          </div>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-black text-primary">
            Zakat & Agricultural Ushr Calculator
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Calculate your exact obligatory 2.5% Zakat on Gold, Silver, Cash savings, and Agricultural harvest against live Nisab.
          </p>
        </div>

        <div className="inline-flex rounded-2xl border border-primary/20 bg-bg p-1 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setCalcMode("wealth")}
            className={"rounded-xl px-4 py-2 transition-all " + (calcMode === "wealth" ? "bg-primary text-surface shadow-xs" : "text-muted hover:text-fg")}
          >
            Wealth & Gold Zakat
          </button>
          <button
            type="button"
            onClick={() => setCalcMode("ushr")}
            className={"rounded-xl px-4 py-2 transition-all " + (calcMode === "ushr" ? "bg-primary text-surface shadow-xs" : "text-muted hover:text-fg")}
          >
            Agricultural Ushr (عشر)
          </button>
        </div>
      </div>

      {calcMode === "wealth" ? (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Input Columns */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Gold Assets */}
            <div className="rounded-2xl border border-border/80 bg-bg/40 p-5 space-y-4">
              <h3 className="font-display font-bold text-primary text-sm flex items-center justify-between">
                <span>1. Gold (سونا) Holdings</span>
                <span className="font-mono text-xs font-normal text-muted">Rs {goldRatePerTola.toLocaleString()} / Tola</span>
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="text-[11px] font-bold text-muted">Weight</label>
                  <input
                    type="number"
                    min={0}
                    value={goldWeight || ""}
                    onChange={(e) => setGoldWeight(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-bold text-fg outline-none focus:border-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted">Unit</label>
                  <select
                    value={goldUnit}
                    onChange={(e) => setGoldUnit(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-bold text-fg outline-none"
                  >
                    <option value="tola">Tolas (تولہ)</option>
                    <option value="gram">Grams (گرام)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted">Purity</label>
                  <select
                    value={goldKarat}
                    onChange={(e) => setGoldKarat(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-bold text-fg outline-none"
                  >
                    <option value="24">24K (Pure Gold)</option>
                    <option value="22">22K (Jewellery)</option>
                    <option value="21">21K</option>
                    <option value="18">18K</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Silver Assets */}
            <div className="rounded-2xl border border-border/80 bg-bg/40 p-5 space-y-4">
              <h3 className="font-display font-bold text-primary text-sm flex items-center justify-between">
                <span>2. Silver (چاندی) Holdings</span>
                <span className="font-mono text-xs font-normal text-muted">Rs {silverRatePerTola.toLocaleString()} / Tola</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted">Weight</label>
                  <input
                    type="number"
                    min={0}
                    value={silverWeight || ""}
                    onChange={(e) => setSilverWeight(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-bold text-fg outline-none focus:border-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted">Unit</label>
                  <select
                    value={silverUnit}
                    onChange={(e) => setSilverUnit(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-bold text-fg outline-none"
                  >
                    <option value="tola">Tolas (تولہ)</option>
                    <option value="gram">Grams (گرام)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Cash & Financial Savings */}
            <div className="rounded-2xl border border-border/80 bg-bg/40 p-5 space-y-4">
              <h3 className="font-display font-bold text-primary text-sm">3. Cash, Bank Accounts & Investments (نقد رقم)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted">Cash in Hand & Home</label>
                  <input
                    type="number"
                    min={0}
                    value={cashInHand || ""}
                    onChange={(e) => setCashInHand(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-bold text-fg outline-none focus:border-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted">Bank Accounts (Savings/Current)</label>
                  <input
                    type="number"
                    min={0}
                    value={bankBalance || ""}
                    onChange={(e) => setBankBalance(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-bold text-fg outline-none focus:border-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted">Prize Bonds & Shares</label>
                  <input
                    type="number"
                    min={0}
                    value={prizeBonds || ""}
                    onChange={(e) => setPrizeBonds(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-bold text-fg outline-none focus:border-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted">Business Trade Goods</label>
                  <input
                    type="number"
                    min={0}
                    value={tradeGoods || ""}
                    onChange={(e) => setTradeGoods(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-bold text-fg outline-none focus:border-primary"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* 4. Liabilities Deductions */}
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 space-y-4">
              <h3 className="font-display font-bold text-red-700 dark:text-red-400 text-sm">4. Immediate Liabilities Deductions (واجب الادا قرضے)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted">Short-term Debts Due Now</label>
                  <input
                    type="number"
                    min={0}
                    value={immediateDebts || ""}
                    onChange={(e) => setImmediateDebts(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-bold text-fg outline-none focus:border-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted">Unpaid Utilities & Due Salaries</label>
                  <input
                    type="number"
                    min={0}
                    value={pendingBills || ""}
                    onChange={(e) => setPendingBills(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-bold text-fg outline-none focus:border-primary"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-gradient-to-br from-[#063318] via-[#094120] to-[#042411] p-6 sm:p-7 text-surface shadow-md space-y-5 border border-emerald-800/40">
              <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Zakat Assessment</span>
                <span className={"rounded-full px-3 py-0.5 text-xs font-black " + (isEligible ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300")}>
                  {isEligible ? "Nisab Met (Obligatory)" : "Below Nisab Threshold"}
                </span>
              </div>

              <div className="rounded-2xl bg-black/25 p-5 border border-emerald-700/30 text-center space-y-1">
                <div className="text-xs font-medium text-surface/75 uppercase tracking-wider">Total Obligatory Zakat (2.5%)</div>
                <div className="font-mono text-3xl sm:text-4xl font-black text-accent">
                  Rs {payableZakat.toLocaleString()}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-emerald-800/80 text-xs">
                <div className="flex items-center justify-between text-surface/85">
                  <span>Gross Assets:</span>
                  <span className="font-mono font-bold text-surface">Rs {Math.round(totalGrossWealth).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-surface/85">
                  <span>Deductible Liabilities:</span>
                  <span className="font-mono font-bold text-red-300">- Rs {Math.round(totalLiabilities).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-surface/85 font-bold border-t border-emerald-800/60 pt-1.5">
                  <span>Net Zakatable Wealth:</span>
                  <span className="font-mono text-emerald-300">Rs {Math.round(netZakatableWealth).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-surface/70 pt-1">
                  <span>Active Silver Nisab (52.5 Tola):</span>
                  <span className="font-mono">Rs {silverNisabValue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 8 Quranic Recipients of Zakat */}
            <div className="rounded-2xl border border-border/80 bg-bg/50 p-5 space-y-2 text-xs">
              <div className="font-bold text-primary flex items-center gap-1.5">
                <BookOpen className="size-4" /> 8 Quranic Beneficiaries (Surah At-Tawbah 9:60):
              </div>
              <p className="text-muted leading-relaxed">
                1. The Poor (الفقراء) • 2. The Needy (المساكين) • 3. Zakat Administrators • 4. Reconciling Hearts • 5. Freeing Captives • 6. Those in Debt • 7. In the Cause of Allah • 8. Stranded Wayfarers.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Agricultural Ushr Section */
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-3">
              <label className="text-xs font-bold text-fg">Select Agricultural Irrigation Method:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCropType("artificial")}
                  className={"rounded-2xl border p-4 text-left transition-all " + (cropType === "artificial" ? "border-primary bg-primary/10 text-primary shadow-xs font-bold" : "border-border bg-surface text-fg")}
                >
                  <div className="font-bold">Artificially Irrigated (5% Ushr)</div>
                  <div className="text-[11px] text-muted mt-1">Canal water fees paid, Tubewell electricity/diesel operated.</div>
                </button>
                <button
                  type="button"
                  onClick={() => setCropType("rain")}
                  className={"rounded-2xl border p-4 text-left transition-all " + (cropType === "rain" ? "border-primary bg-primary/10 text-primary shadow-xs font-bold" : "border-border bg-surface text-fg")}
                >
                  <div className="font-bold">Rain-Fed / Barani (10% Ushr)</div>
                  <div className="text-[11px] text-muted mt-1">Natural rainfall, spring water, or river inundation without cost.</div>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-fg">Total Gross Harvest / Crop Market Value (PKR)</label>
              <input
                type="number"
                min={0}
                value={cropGrossValue || ""}
                onChange={(e) => setCropGrossValue(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-2xl border-2 border-primary/30 bg-surface px-4 py-3 font-mono text-xl font-bold text-fg outline-none focus:border-primary shadow-xs"
                placeholder="500000"
              />
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-[#063318] via-[#094120] to-[#042411] p-6 sm:p-7 text-surface shadow-md space-y-5 border border-emerald-800/40">
            <div className="text-xs font-bold uppercase tracking-wider text-accent">Obligatory Ushr Due</div>
            <div className="rounded-2xl bg-black/25 p-5 border border-emerald-700/30 text-center space-y-1">
              <div className="text-xs font-medium text-surface/75 uppercase tracking-wider">Due at Time of Harvest ({cropType === "rain" ? "10%" : "5%"})</div>
              <div className="font-mono text-3xl sm:text-4xl font-black text-accent">
                Rs {payableUshr.toLocaleString()}
              </div>
            </div>
            <p className="text-[11px] text-surface/80 leading-relaxed text-center">
              Under Quranic mandate (Surah Al-An'am 6:141), Ushr is due on the day of harvest.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
