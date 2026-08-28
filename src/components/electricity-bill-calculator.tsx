import { useState } from "react";
import { Zap, Calculator, Info, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { LIVE_RATES } from "@/lib/live-rates";

export function ElectricityBillCalculator() {
  const [units, setUnits] = useState<number>(320);
  const [isProtected, setIsProtected] = useState<boolean>(false);
  const [isFiler, setIsFiler] = useState<boolean>(true);
  const [disco, setDisco] = useState<string>("LESCO (Lahore)");

  let baseRatePerUnit = 0;
  if (isProtected) {
    if (units <= 100) baseRatePerUnit = LIVE_RATES.nepraTariff.protected.slab1to100;
    else baseRatePerUnit = LIVE_RATES.nepraTariff.protected.slab101to200;
  } else {
    if (units <= 100) baseRatePerUnit = LIVE_RATES.nepraTariff.unprotected.slab1to100;
    else if (units <= 200) baseRatePerUnit = LIVE_RATES.nepraTariff.unprotected.slab101to200;
    else if (units <= 300) baseRatePerUnit = LIVE_RATES.nepraTariff.unprotected.slab201to300;
    else if (units <= 700) baseRatePerUnit = LIVE_RATES.nepraTariff.unprotected.slab301to700;
    else baseRatePerUnit = LIVE_RATES.nepraTariff.unprotected.slab700plus;
  }

  const costOfElectricity = units * baseRatePerUnit;
  const fpaCharge = units * LIVE_RATES.nepraTariff.fpaEstimatedPerUnit;
  const electricityDuty = (costOfElectricity * LIVE_RATES.nepraTariff.electricityDutyPct) / 100;
  const gst = ((costOfElectricity + fpaCharge) * LIVE_RATES.nepraTariff.generalSalesTaxPct) / 100;
  const tvFee = LIVE_RATES.nepraTariff.tvFee;
  
  const subtotal = costOfElectricity + fpaCharge + electricityDuty + gst + tvFee;
  const nonFilerTax = (!isFiler && subtotal > LIVE_RATES.nepraTariff.nonFilerTaxThreshold)
    ? (subtotal * LIVE_RATES.nepraTariff.nonFilerTaxPct) / 100
    : 0;

  const totalBillPkr = Math.round(subtotal + nonFilerTax);

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10 space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-600">
            <Zap className="size-3.5" /> NEPRA FY 2025–2026 Domestic Tariff Slabs
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-primary sm:text-3xl">
            Electricity Bill & Slab Estimator
          </h2>
          <p className="mt-1 text-xs text-muted">
            Includes Protected Consumer status check, Fuel Price Adjustment (FPA), GST (18%), and Section 235A Non-Filer Tax.
          </p>
        </div>
        <div className="rounded-2xl bg-bg p-3 border border-border text-right">
          <span className="block text-[10px] font-bold uppercase text-muted">Est. Total Bill</span>
          <span className="font-mono text-2xl font-extrabold text-primary">Rs {totalBillPkr.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Units Consumed (kWh)
          </label>
          <input
            type="number"
            min={1}
            max={5000}
            value={units}
            onChange={(e) => setUnits(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm font-bold text-fg outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Distribution Company (DISCO)
          </label>
          <select
            value={disco}
            onChange={(e) => setDisco(e.target.value)}
            className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-xs font-bold text-fg outline-none focus:border-primary"
          >
            <option>LESCO (Lahore / Kasur / Okara)</option>
            <option>IESCO (Islamabad / Rawalpindi)</option>
            <option>K-Electric (Karachi)</option>
            <option>FESCO (Faisalabad)</option>
            <option>GEPCO (Gujranwala / Sialkot)</option>
            <option>MEPCO (Multan / Bahawalpur)</option>
            <option>PESCO (Peshawar)</option>
            <option>HESCO / SEPCO (Sindh)</option>
            <option>QESCO (Quetta / Balochistan)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Consumer Category
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsProtected(false)}
              className={"rounded-xl p-2.5 text-left border text-xs font-bold transition-all " + (!isProtected ? "bg-primary text-surface border-primary" : "bg-bg text-muted border-border")}
            >
              Unprotected
            </button>
            <button
              type="button"
              onClick={() => setIsProtected(true)}
              className={"rounded-xl p-2.5 text-left border text-xs font-bold transition-all " + (isProtected ? "bg-primary text-surface border-primary" : "bg-bg text-muted border-border")}
            >
              Protected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
