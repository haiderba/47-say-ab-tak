import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Coins,
  FileCheck,
  HelpCircle,
  Landmark,
  PieChart,
  Scale,
  Sparkles,
  Users,
} from "lucide-react";

export function InheritanceCalculator() {
  const [deceasedGender, setDeceasedGender] = useState<"male" | "female">("male");
  const [spouseCount, setSpouseCount] = useState<number>(1); // For male deceased: 1 to 4 wives; for female: 1 husband
  const [sons, setSons] = useState<number>(2);
  const [daughters, setDaughters] = useState<number>(1);
  const [fatherAlive, setFatherAlive] = useState<boolean>(false);
  const [motherAlive, setMotherAlive] = useState<boolean>(true);

  // Asset values
  const [cash, setCash] = useState<number>(5000000); // 50 Lakh
  const [property, setProperty] = useState<number>(20000000); // 2 Crore
  const [debts, setDebts] = useState<number>(500000); // 5 Lakh funeral/debts

  const grossEstate = Math.max(0, cash + property);
  const netEstate = Math.max(0, grossEstate - debts);

  // Islamic Inheritance Engine (Hanafi / Pakistani Legal Standard)
  const calculateShares = () => {
    const hasChildren = sons > 0 || daughters > 0;
    let shares: { role: string; count: number; fraction: string; pct: number; amount: number }[] = [];

    let remainingPct = 100;

    // 1. Spouse Share
    if (deceasedGender === "male") {
      // Wife gets 1/8 if children exist, 1/4 if no children
      const wifeShareTotalPct = hasChildren ? 12.5 : 25.0;
      const count = Math.max(1, Math.min(4, spouseCount));
      const perWifePct = wifeShareTotalPct / count;
      shares.push({
        role: count > 1 ? `Wives (${count} total)` : "Wife / Widow",
        count,
        fraction: hasChildren ? "1/8" : "1/4",
        pct: wifeShareTotalPct,
        amount: (netEstate * wifeShareTotalPct) / 100,
      });
      remainingPct -= wifeShareTotalPct;
    } else {
      // Husband gets 1/4 if children exist, 1/2 if no children
      const husbandPct = hasChildren ? 25.0 : 50.0;
      shares.push({
        role: "Husband / Widower",
        count: 1,
        fraction: hasChildren ? "1/4" : "1/2",
        pct: husbandPct,
        amount: (netEstate * husbandPct) / 100,
      });
      remainingPct -= husbandPct;
    }

    // 2. Mother Share
    if (motherAlive) {
      // Mother gets 1/6 (16.67%) if children exist or siblings exist; 1/3 (33.33%) if no children
      const motherPct = hasChildren ? 16.6667 : 33.3333;
      shares.push({
        role: "Mother",
        count: 1,
        fraction: hasChildren ? "1/6" : "1/3",
        pct: motherPct,
        amount: (netEstate * motherPct) / 100,
      });
      remainingPct -= motherPct;
    }

    // 3. Father Share
    if (fatherAlive) {
      // Father gets 1/6 fixed if children exist
      const fatherPct = hasChildren ? 16.6667 : remainingPct;
      shares.push({
        role: "Father",
        count: 1,
        fraction: hasChildren ? "1/6" : "Residuary",
        pct: fatherPct,
        amount: (netEstate * fatherPct) / 100,
      });
      remainingPct -= fatherPct;
    }

    // 4. Children (Sons and Daughters - 2:1 ratio)
    if (hasChildren) {
      const totalUnits = sons * 2 + daughters * 1;
      if (totalUnits > 0 && remainingPct > 0) {
        const unitPct = remainingPct / totalUnits;
        if (sons > 0) {
          const totalSonsPct = unitPct * 2 * sons;
          shares.push({
            role: `Sons (${sons} total — 2 shares each)`,
            count: sons,
            fraction: `${(2 * sons)}/${totalUnits} of residue`,
            pct: totalSonsPct,
            amount: (netEstate * totalSonsPct) / 100,
          });
        }
        if (daughters > 0) {
          const totalDaughtersPct = unitPct * 1 * daughters;
          shares.push({
            role: `Daughters (${daughters} total — 1 share each)`,
            count: daughters,
            fraction: `${daughters}/${totalUnits} of residue`,
            pct: totalDaughtersPct,
            amount: (netEstate * totalDaughtersPct) / 100,
          });
        }
      }
    }

    return shares;
  };

  const results = calculateShares();

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <Scale className="size-3.5" /> Pakistani Islamic Succession Law (Faraid)
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-primary sm:text-3xl">
            Inheritance & Legal Heirship Calculator
          </h2>
          <p className="mt-1 text-xs text-muted">
            Computes legal estate shares as per Muslim Family Laws Ordinance and Succession Certificate guidelines.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* INPUTS COLUMN */}
        <div className="space-y-6 lg:col-span-7">
          {/* Deceased Gender */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted">Deceased Person</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeceasedGender("male")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
                  deceasedGender === "male" ? "border-primary bg-primary/10 text-primary font-bold" : "border-border bg-bg text-fg"
                }`}
              >
                Male (Father / Husband)
              </button>
              <button
                type="button"
                onClick={() => setDeceasedGender("female")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
                  deceasedGender === "female" ? "border-primary bg-primary/10 text-primary font-bold" : "border-border bg-bg text-fg"
                }`}
              >
                Female (Mother / Wife)
              </button>
            </div>
          </div>

          {/* Surviving Family Tree */}
          <div className="rounded-2xl border border-border bg-bg/50 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <Users className="size-4 text-accent" /> Surviving Legal Heirs
            </h3>

            {/* Spouse & Parents */}
            <div className="grid gap-3 sm:grid-cols-2">
              {deceasedGender === "male" && (
                <div>
                  <label className="text-xs font-semibold text-fg">Surviving Wives</label>
                  <select
                    value={spouseCount}
                    onChange={(e) => setSpouseCount(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none"
                  >
                    <option value={1}>1 Wife (1/8 share)</option>
                    <option value={2}>2 Wives (Shared 1/8)</option>
                    <option value={3}>3 Wives (Shared 1/8)</option>
                    <option value={4}>4 Wives (Shared 1/8)</option>
                  </select>
                </div>
              )}

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-fg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={motherAlive}
                    onChange={(e) => setMotherAlive(e.target.checked)}
                    className="size-4 accent-primary rounded"
                  />
                  Mother is Alive
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-fg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fatherAlive}
                    onChange={(e) => setFatherAlive(e.target.checked)}
                    className="size-4 accent-primary rounded"
                  />
                  Father is Alive
                </label>
              </div>
            </div>

            {/* Sons and Daughters Count */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
              <div>
                <label className="text-xs font-semibold text-fg">Number of Sons</label>
                <div className="mt-1.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSons(Math.max(0, sons - 1))}
                    className="size-8 rounded-lg border border-border bg-surface font-bold text-fg hover:bg-bg"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-display text-sm font-bold text-primary">{sons}</span>
                  <button
                    type="button"
                    onClick={() => setSons(sons + 1)}
                    className="size-8 rounded-lg border border-border bg-surface font-bold text-fg hover:bg-bg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-fg">Number of Daughters</label>
                <div className="mt-1.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDaughters(Math.max(0, daughters - 1))}
                    className="size-8 rounded-lg border border-border bg-surface font-bold text-fg hover:bg-bg"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-display text-sm font-bold text-primary">{daughters}</span>
                  <button
                    type="button"
                    onClick={() => setDaughters(daughters + 1)}
                    className="size-8 rounded-lg border border-border bg-surface font-bold text-fg hover:bg-bg"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Estate Assets & Debts */}
          <div className="rounded-2xl border border-border bg-bg/50 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <Coins className="size-4 text-accent" /> Total Estate Assets (Tarka)
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-muted">Cash, Bank & Gold (PKR)</label>
                <input
                  type="number"
                  step="100000"
                  value={cash}
                  onChange={(e) => setCash(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-muted">Immovable Land / House (PKR)</label>
                <input
                  type="number"
                  step="500000"
                  value={property}
                  onChange={(e) => setProperty(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted">Outstanding Debts / Funeral Expenses (Deducted First)</label>
              <input
                type="number"
                step="50000"
                value={debts}
                onChange={(e) => setDebts(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-danger outline-none focus:border-danger"
              />
            </div>
          </div>
        </div>

        {/* RESULTS BREAKDOWN COLUMN */}
        <div className="flex flex-col justify-between rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-bg via-surface to-bg p-6 shadow-sm lg:col-span-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warn-fg">
                Net Distributable Estate
              </span>
              <span className="text-xs text-muted">Gross: PKR {grossEstate.toLocaleString()}</span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold text-primary sm:text-4xl">
                PKR {netEstate.toLocaleString()}
              </span>
            </div>

            {/* Individual Heir Breakdown List */}
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
                Legal Shares Breakdown (فرد تقسیم)
              </h4>

              {results.map((res, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-surface p-3 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-primary">{res.role}</div>
                      <div className="text-[11px] text-muted">
                        Quranic Share: <strong className="text-fg">{res.fraction}</strong> ({res.pct.toFixed(2)}%)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-sm font-bold text-fg">
                        PKR {Math.round(res.amount).toLocaleString()}
                      </div>
                      {res.count > 1 && (
                        <div className="text-[10px] text-accent font-semibold">
                          (PKR {Math.round(res.amount / res.count).toLocaleString()} each)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl bg-primary/5 p-3 text-[11px] leading-relaxed text-muted">
              <strong>Mandatory Step:</strong> After calculating shares, file for the official{" "}
              <strong>NADRA Succession Certificate</strong> (for bank & vehicles) and visit the{" "}
              <strong>Arazi Record Center (PLRA)</strong> for Land Mutation (Intiqal Wirasat).
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-4">
            <Link
              to="/flow"
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-surface hover:bg-primary-light transition-colors"
            >
              View Step-by-Step Inheritance Process Map <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
