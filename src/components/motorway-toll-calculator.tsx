import { useState } from "react";
import { Compass, Car } from "lucide-react";
import { LIVE_RATES } from "@/lib/live-rates";

export function MotorwayTollCalculator() {
  const [selectedRoute, setSelectedRoute] = useState<string>("M-2");
  const [vehicleType, setVehicleType] = useState<"car" | "wagon" | "coaster" | "bus" | "truck">("car");

  const routeData = LIVE_RATES.motorwayTolls.find((r) => r.route === selectedRoute) || LIVE_RATES.motorwayTolls[0];

  let tollPrice = routeData.carToll;
  if (vehicleType === "wagon") tollPrice = routeData.wagonToll;
  else if (vehicleType === "coaster") tollPrice = routeData.coasterToll;
  else if (vehicleType === "bus") tollPrice = routeData.busToll;
  else if (vehicleType === "truck") tollPrice = routeData.truck2Axle;

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10 space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <Compass className="size-3.5" /> NHA Official 2026 Motorway Toll & M-Tag Portal
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-primary sm:text-3xl">
            Motorway Toll Tax & M-Tag Calculator
          </h2>
          <p className="mt-1 text-xs text-muted">
            Check exact toll tax across M-1, M-2, M-3, M-5, M-9, M-15, and learn instant M-Tag recharge steps.
          </p>
        </div>
        <div className="rounded-2xl bg-bg p-3 border border-border text-right">
          <span className="block text-[10px] font-bold uppercase text-muted">Toll Rate</span>
          <span className="font-mono text-2xl font-extrabold text-emerald-600">Rs {tollPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Select Motorway Route
          </label>
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-xs font-bold text-fg outline-none focus:border-primary"
          >
            {LIVE_RATES.motorwayTolls.map((m) => (
              <option key={m.route} value={m.route}>
                {m.route}: {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Vehicle Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "car", label: "Car / SUV" },
              { id: "wagon", label: "Wagon" },
              { id: "coaster", label: "Coaster" },
              { id: "bus", label: "Bus" },
              { id: "truck", label: "2-Axle Truck" },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVehicleType(v.id as any)}
                className={"rounded-xl p-2.5 text-center border text-xs font-bold transition-all " + (vehicleType === v.id ? "bg-primary text-surface border-primary" : "bg-bg text-muted border-border")}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
