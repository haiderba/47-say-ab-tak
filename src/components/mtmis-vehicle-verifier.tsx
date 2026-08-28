import { useState } from "react";
import { Car, Search, ShieldCheck, AlertTriangle, ExternalLink, Printer } from "lucide-react";

export function MtmisVehicleVerifier() {
  const [regNo, setRegNo] = useState("LEA-22-4591");
  const [province, setProvince] = useState<"punjab" | "sindh" | "ict" | "kp">("punjab");

  const portals = {
    punjab: { name: "Punjab Excise (MTMIS / e-Pay)", url: "https://mtmis.punjab.gov.pk", note: "Search by full registration number (e.g. LEA-22-4591 or LEB-18-1234)." },
    sindh: { name: "Sindh Excise & Taxation", url: "https://excise.gos.pk/vehicle/vehicle_search", note: "Search by 3-letter, 3-digit registration (e.g. BGF-382)." },
    ict: { name: "Islamabad ICT Excise & Taxation", url: "https://islamabadexcise.gov.pk", note: "Search by Islamabad registration numbers (e.g. ICT-AB-123)." },
    kp: { name: "KP Excise & Taxation (Zama KP)", url: "https://kpexcise.gov.pk", note: "Search by Peshawar/KP provincial registration numbers." },
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-8 space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
            <Car className="size-3.5" /> Provincial Excise & Taxation MTMIS Gateway
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-primary sm:text-3xl">
            Vehicle Verification & Tax Clearance Hub
          </h2>
          <p className="mt-1 text-xs text-muted">
            Check vehicle registration records, engine/chassis matching, and token tax paid status across all 4 provinces.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-surface hover:bg-primary-light shadow-xs"
        >
          <Printer className="size-4" /> Print B&W Record
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Select Province / Registration Authority
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "punjab", label: "Punjab (Lahore/Rwp)" },
              { id: "sindh", label: "Sindh (Karachi/Hyd)" },
              { id: "ict", label: "Islamabad (ICT)" },
              { id: "kp", label: "KPK (Peshawar)" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProvince(p.id as any)}
                className={
                  "rounded-xl p-2.5 text-left border text-xs font-bold transition-all " +
                  (province === p.id ? "bg-primary text-surface border-primary shadow-xs" : "bg-bg text-muted border-border hover:text-fg")
                }
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Vehicle Registration Number
          </label>
          <input
            type="text"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value.toUpperCase())}
            placeholder="e.g. LEA-22-4591"
            className="w-full rounded-2xl border border-border bg-bg px-4 py-3 font-mono text-sm font-bold text-fg uppercase outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Verification Action */}
      <div className="rounded-2xl border border-border bg-bg/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary text-xs">{portals[province].name}</span>
          <a
            href={portals[province].url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-surface hover:bg-primary-light shadow-xs"
          >
            Open Official MTMIS Database <ExternalLink className="size-3.5" />
          </a>
        </div>
        <p className="text-xs text-muted">{portals[province].note}</p>
      </div>
    </div>
  );
}
