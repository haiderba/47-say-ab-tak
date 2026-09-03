import { Fuel, DollarSign, Coins, Zap, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";
import { useDailyRates } from "@/lib/daily-rates-service";

export const EMERGENCY_HELPLINES = [
  { name: "Police Emergency", number: "15", desc: "All Pakistan Police" },
  { name: "Rescue & Medical", number: "1122", desc: "Emergency Ambulance & Fire" },
  { name: "NADRA Citizen Care", number: "1777", desc: "Identity & Verification Helpline" },
  { name: "Edhi Ambulance", number: "115", desc: "Disaster & Burial Services" },
];

export function DailyCitizenIndices() {
  const { rates, lastUpdated } = useDailyRates();

  const dailyIndices = [
    { id: "gold", label: "Gold 24K", value: `Rs ${rates.gold.k24Tola.toLocaleString()}`, icon: Coins, color: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20", unit: "per Tola" },
    { id: "psx", label: "PSX KSE-100", value: `${rates.psx.kse100.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20", unit: `+${rates.psx.changePct}%` },
    { id: "petrol", label: "Petrol", value: `Rs ${rates.fuel.petrol.toFixed(2)}`, icon: Fuel, color: "text-amber-600 bg-amber-500/10 border-amber-500/20", unit: "per Litre" },
    { id: "diesel", label: "Diesel", value: `Rs ${rates.fuel.diesel.toFixed(2)}`, icon: Fuel, color: "text-blue-600 bg-blue-500/10 border-blue-500/20", unit: "per Litre" },
    { id: "usd", label: "USD / PKR", value: `Rs ${rates.currency.usd.toFixed(2)}`, icon: DollarSign, color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20", unit: "Interbank" },
    { id: "sar", label: "SAR / PKR", value: `Rs ${rates.currency.sar.toFixed(2)}`, icon: DollarSign, color: "text-teal-600 bg-teal-500/10 border-teal-500/20", unit: "Open Market" },
  ];

  return (
    <div className="border-b border-border/70 bg-bg px-4 py-2.5">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
        {/* Daily Economic Indices Carousel/Pill Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="shrink-0 font-display text-[11px] font-black uppercase tracking-wider text-primary flex items-center gap-1 mr-1">
            <Sparkles className="size-3.5 text-accent" /> Live Daily Rates ({lastUpdated}):
          </span>
          <div className="flex items-center gap-2">
            {dailyIndices.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`inline-flex items-center gap-1.5 shrink-0 rounded-xl border px-2.5 py-1 font-medium bg-surface shadow-2xs ${item.color}`}
                >
                  <Icon className="size-3.5 shrink-0" />
                  <span className="font-bold text-fg">{item.label}:</span>
                  <span className="font-black text-primary">{item.value}</span>
                  {item.unit && <span className="text-[10px] text-muted opacity-80">({item.unit})</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* 1-Tap National Helplines */}
        <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 border-border/60 pt-2 lg:pt-0">
          <span className="font-bold text-muted text-[11px] flex items-center gap-1">
            <ShieldAlert className="size-3 text-danger" /> 24/7 Helplines:
          </span>
          <div className="flex items-center gap-1.5">
            {EMERGENCY_HELPLINES.map((h) => (
              <a
                key={h.number}
                href={`tel:${h.number}`}
                className="rounded-lg bg-surface border border-border px-2 py-0.5 text-[11px] font-bold text-primary hover:border-primary/50 transition-colors shadow-2xs"
                title={h.desc}
              >
                {h.name.split(" ")[0]} <span className="text-accent font-black font-mono">({h.number})</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
