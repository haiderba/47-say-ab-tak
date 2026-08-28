import { useState } from "react";
import { MapPin, Search } from "lucide-react";

export function DistrictCivicDirectory() {
  const [search, setSearch] = useState("");
  const districts = [
    { name: "Lahore", prov: "Punjab", dc: "DC Office Katchery (042-99210001)", plra: "Arazi Record Centers (Raiwind, Cantt)", pkm: "PKM Qurban Lines 24/7" },
    { name: "Karachi Central", prov: "Sindh", dc: "DC Office Sakhi Hassan (021-99260111)", plra: "Deh Malir Registry", pkm: "PKM Nazimabad" },
    { name: "Islamabad (ICT)", prov: "Federal", dc: "DC Office G-11/4 (051-9108084)", plra: "ICT Land Directorate", pkm: "PKM F-6" },
    { name: "Rawalpindi", prov: "Punjab", dc: "DC Office Kutchery Chowk (051-9292500)", plra: "PLRA Potohar", pkm: "PKM Liaquat Bagh" },
    { name: "Peshawar", prov: "KPK", dc: "DC Office Khyber Road (091-9211338)", plra: "Service Delivery Center", pkm: "PKM Malik Saad Lines" },
  ];

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10 space-y-6">
      <h2 className="font-display text-2xl font-black text-primary">District Civic & Revenue Directory</h2>
      <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search District (e.g. Lahore, Karachi, Islamabad)..." className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-xs font-bold" />
      <div className="grid gap-3 sm:grid-cols-2">
        {districts.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).map(d => (
          <div key={d.name} className="rounded-2xl border border-border bg-bg/50 p-4 space-y-1.5 text-xs">
            <span className="font-bold text-primary block text-sm">{d.name} ({d.prov})</span>
            <div><span className="font-bold text-muted uppercase text-[10px]">DC Office:</span> {d.dc}</div>
            <div><span className="font-bold text-muted uppercase text-[10px]">PLRA:</span> {d.plra}</div>
            <div><span className="font-bold text-muted uppercase text-[10px]">Police Khidmat:</span> {d.pkm}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
