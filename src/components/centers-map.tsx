import { useEffect, useState } from "react";
import {
  Building2,
  Clock,
  Compass,
  ExternalLink,
  Filter,
  Landmark,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Search,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";

export type CenterItem = {
  id: string;
  name: string;
  department: "NADRA" | "PLRA" | "Passport" | "Police";
  is24_7: boolean;
  city: string;
  district: string;
  tehsil: string;
  address: string;
  lat: number;
  lng: number;
  timing: string;
  fridayBreak: string;
  phone: string;
  services: string[];
  mouzaCoverage?: string[];
  tokenTip: string;
};

export const OFFICIAL_CENTERS: CenterItem[] = [
  // LAHORE
  {
    id: "lhr-nadra-mega-shimla",
    name: "NADRA Mega Center (Shimla Hill)",
    department: "NADRA",
    is24_7: true,
    city: "Lahore",
    district: "Lahore",
    tehsil: "City",
    address: "Shimla Hill, Abbott Road, Garhi Shahu, Lahore",
    lat: 31.5647,
    lng: 74.3317,
    timing: "Open 24 Hours / 7 Days a Week",
    fridayBreak: "1:00 PM – 2:30 PM (Friday Prayers)",
    phone: "1777 / (042) 99205566",
    services: ["Smart CNIC", "FRC Instant", "Succession Certificate", "Biometric Verification", "NICOP"],
    tokenTip: "Lowest crowd between 11:00 PM and 3:00 AM.",
  },
  {
    id: "lhr-nadra-mega-dha",
    name: "NADRA Mega Center (DHA Phase 4)",
    department: "NADRA",
    is24_7: true,
    city: "Lahore",
    district: "Lahore",
    tehsil: "Cantt",
    address: "Main Boulevard, DHA Phase 4, Commercial Area, Lahore",
    lat: 31.4728,
    lng: 74.3812,
    timing: "Open 24 Hours / 7 Days a Week",
    fridayBreak: "1:00 PM – 2:30 PM",
    phone: "1777 / (042) 35742111",
    services: ["Executive Fast-Track CNIC", "FRC", "Succession", "Overseas NICOP"],
    tokenTip: "Best time: Late night after 10:00 PM.",
  },
  {
    id: "lhr-nadra-mega-iqbal-town",
    name: "NADRA Mega Center (Allama Iqbal Town)",
    department: "NADRA",
    is24_7: true,
    city: "Lahore",
    district: "Lahore",
    tehsil: "Iqbal Town",
    address: "Main Boulevard, Allama Iqbal Town, Lahore",
    lat: 31.5126,
    lng: 74.2842,
    timing: "Open 24 Hours / 7 Days a Week",
    fridayBreak: "1:00 PM – 2:30 PM",
    phone: "1777",
    services: ["Smart CNIC", "FRC", "Succession", "Lost CNIC Duplicate"],
    tokenTip: "Peak rush 11 AM - 4 PM. Visit after 8 PM for zero wait.",
  },
  {
    id: "lhr-plra-city",
    name: "Arazi Record Center (PLRA City / Model Town)",
    department: "PLRA",
    is24_7: false,
    city: "Lahore",
    district: "Lahore",
    tehsil: "Model Town / City",
    address: "Near Arfa Software Technology Park, Ferozepur Road, Lahore",
    lat: 31.4755,
    lng: 74.3418,
    timing: "8:00 AM – 4:00 PM (Monday to Saturday)",
    fridayBreak: "12:30 PM – 2:30 PM",
    phone: "(042) 111-222-272",
    services: ["Digital Fard Malkiat", "Inheritance Mutation (Intiqal Wirasat)", "Sale / Bay Mutation", "E-Registry Verification"],
    mouzaCoverage: ["Ichhra", "Model Town", "Kot Lakhpat", "Baghbanpura", "Muzang", "Kahna"],
    tokenTip: "Book online token 24 hours prior on PLRA mobile app.",
  },
  {
    id: "lhr-plra-raiwind",
    name: "Arazi Record Center (Raiwind Tehsil)",
    department: "PLRA",
    is24_7: false,
    city: "Lahore",
    district: "Lahore",
    tehsil: "Raiwind",
    address: "Main Raiwind Road, Near AC Office, Raiwind",
    lat: 31.2487,
    lng: 74.2155,
    timing: "8:00 AM – 4:00 PM",
    fridayBreak: "12:30 PM – 2:30 PM",
    phone: "(042) 111-222-272",
    services: ["Rural Land Records", "Agricultural Fard", "Mutation Intiqal"],
    mouzaCoverage: ["Raiwind Rural", "Pajia", "Manga Mandi", "Sunder", "Jia Bagga", "Chung"],
    tokenTip: "Early morning 8:00 AM arrival guarantees same-day completion.",
  },
  {
    id: "lhr-pkm-liberty",
    name: "Police Khidmat Markaz (Liberty Gulberg)",
    department: "Police",
    is24_7: true,
    city: "Lahore",
    district: "Lahore",
    tehsil: "Gulberg",
    address: "Liberty Chowk Roundabout, Gulberg III, Lahore",
    lat: 31.5102,
    lng: 74.3444,
    timing: "Open 24 Hours / 7 Days",
    fridayBreak: "1:00 PM – 2:00 PM",
    phone: "(042) 99268333",
    services: ["Character Certificate", "Tenant Registration", "Driving License Learner/Renewal", "Lost Report e-FIR", "Employee Verification"],
    tokenTip: "Average service time 10-15 minutes.",
  },
  {
    id: "lhr-passport-garden-town",
    name: "Regional Passport Office (Garden Town)",
    department: "Passport",
    is24_7: false,
    city: "Lahore",
    district: "Lahore",
    tehsil: "Model Town",
    address: "Civic Centre, Garden Town, Lahore",
    lat: 31.5033,
    lng: 74.3275,
    timing: "8:00 AM – 2:00 PM (Executive Counters: 8:00 AM – 8:00 PM)",
    fridayBreak: "12:30 PM – 2:00 PM",
    phone: "(042) 99230554",
    services: ["New E-Passport", "Machine Readable Passport (MRP)", "Urgent & Fast-Track Printing"],
    tokenTip: "Executive counters stay open till 8 PM with shorter queues.",
  },

  // ISLAMABAD & RAWALPINDI
  {
    id: "isb-nadra-mega-blue-area",
    name: "NADRA Mega Center (Blue Area Islamabad)",
    department: "NADRA",
    is24_7: true,
    city: "Islamabad",
    district: "Islamabad",
    tehsil: "ICT",
    address: "Fazl-ul-Haq Road, Blue Area, G-7/2, Islamabad",
    lat: 33.7128,
    lng: 73.0617,
    timing: "Open 24 Hours / 7 Days a Week",
    fridayBreak: "1:00 PM – 2:30 PM",
    phone: "1777 / (051) 111-786-100",
    services: ["Smart CNIC", "FRC Family", "Succession Certificate", "NICOP Overseas Fast-Track"],
    tokenTip: "24/7 dedicated executive fast-track counters.",
  },
  {
    id: "rwp-nadra-mega-commercial-market",
    name: "NADRA Mega Center (Satellite Town Rawalpindi)",
    department: "NADRA",
    is24_7: true,
    city: "Rawalpindi",
    district: "Rawalpindi",
    tehsil: "Rawalpindi",
    address: "Commercial Market, Satellite Town, Block B, Rawalpindi",
    lat: 33.6366,
    lng: 73.0673,
    timing: "Open 24 Hours / 7 Days a Week",
    fridayBreak: "1:00 PM – 2:30 PM",
    phone: "1777",
    services: ["Smart CNIC", "FRC", "Succession", "Biometric"],
    tokenTip: "Visit past 9 PM for swift processing.",
  },
  {
    id: "rwp-pkm-kachery",
    name: "Police Khidmat Markaz (Kachery Rawalpindi)",
    department: "Police",
    is24_7: true,
    city: "Rawalpindi",
    district: "Rawalpindi",
    tehsil: "Rawalpindi",
    address: "Near District Courts / Kachery Chowk, Rawalpindi",
    lat: 33.5932,
    lng: 73.0544,
    timing: "Open 24 Hours / 7 Days",
    fridayBreak: "1:00 PM – 2:00 PM",
    phone: "(051) 9292611",
    services: ["Character Certificate", "Tenant Verification", "Driving License", "Lost Document Report"],
    tokenTip: "Bring original CNIC and embassy/job letter.",
  },

  // KARACHI
  {
    id: "khi-nadra-mega-defence",
    name: "NADRA Mega Center (DHA Phase 1 Karachi)",
    department: "NADRA",
    is24_7: true,
    city: "Karachi",
    district: "Karachi South",
    tehsil: "DHA / Clifton",
    address: "Korangi Road, DHA Phase 1, Near Sunset Boulevard, Karachi",
    lat: 24.8368,
    lng: 67.0672,
    timing: "Open 24 Hours / 7 Days a Week",
    fridayBreak: "1:00 PM – 2:30 PM",
    phone: "1777 / (021) 111-786-100",
    services: ["Smart CNIC", "FRC", "Succession", "NICOP", "Cancellation on Death"],
    tokenTip: "Late night 12:00 AM - 4:00 AM is the fastest window.",
  },
  {
    id: "khi-nadra-mega-nazimabad",
    name: "NADRA Mega Center (North Nazimabad)",
    department: "NADRA",
    is24_7: true,
    city: "Karachi",
    district: "Karachi Central",
    tehsil: "North Nazimabad",
    address: "Block L, North Nazimabad, Near Sakhi Hassan Chowrangi, Karachi",
    lat: 24.9455,
    lng: 67.0423,
    timing: "Open 24 Hours / 7 Days a Week",
    fridayBreak: "1:00 PM – 2:30 PM",
    phone: "1777",
    services: ["Smart CNIC", "Family FRC", "Succession Certificate"],
    tokenTip: "24/7 active counters.",
  },
  {
    id: "khi-nadra-mega-siemens",
    name: "NADRA Mega Center (Siemens Chowrangi SITE)",
    department: "NADRA",
    is24_7: true,
    city: "Karachi",
    district: "Karachi West",
    tehsil: "SITE",
    address: "Siemens Chowrangi, Estate Avenue, SITE Area, Karachi",
    lat: 24.8967,
    lng: 67.0012,
    timing: "Open 24 Hours / 7 Days a Week",
    fridayBreak: "1:00 PM – 2:30 PM",
    phone: "1777",
    services: ["Smart CNIC", "FRC", "Succession", "Card Renewal"],
    tokenTip: "Spacious parking and quick token issuance.",
  },

  // PESHAWAR & QUETTA
  {
    id: "pew-nadra-mega-peshawar",
    name: "NADRA Mega Center (Hayatabad Peshawar)",
    department: "NADRA",
    is24_7: true,
    city: "Peshawar",
    district: "Peshawar",
    tehsil: "Hayatabad",
    address: "Phase 5, Commercial Complex, Hayatabad, Peshawar",
    lat: 33.9922,
    lng: 71.4398,
    timing: "Open 24 Hours / 7 Days a Week",
    fridayBreak: "1:00 PM – 2:30 PM",
    phone: "1777",
    services: ["Smart CNIC", "FRC", "Afghan Refugee Card Inquiries", "Succession Certificate"],
    tokenTip: "Executive fast track counters operational round the clock.",
  },
  {
    id: "qta-nadra-mega-quetta",
    name: "NADRA Mega Center (Zarghoon Road Quetta)",
    department: "NADRA",
    is24_7: true,
    city: "Quetta",
    district: "Quetta",
    tehsil: "Quetta City",
    address: "Zarghoon Road, Near Railway Station, Quetta",
    lat: 30.1984,
    lng: 67.0142,
    timing: "Open 24 Hours / 7 Days a Week",
    fridayBreak: "1:00 PM – 2:30 PM",
    phone: "1777",
    services: ["Smart CNIC", "FRC", "Succession", "NICOP"],
    tokenTip: "Open 24/7 for provincial capital and transit travelers.",
  },

  // FAISALABAD & MULTAN
  {
    id: "fsd-nadra-mega-d-ground",
    name: "NADRA Mega Center (D-Ground Peoples Colony)",
    department: "NADRA",
    is24_7: true,
    city: "Faisalabad",
    district: "Faisalabad",
    tehsil: "City",
    address: "D-Ground, Peoples Colony No. 1, Faisalabad",
    lat: 31.4116,
    lng: 73.0954,
    timing: "Open 24 Hours / 7 Days a Week",
    fridayBreak: "1:00 PM – 2:30 PM",
    phone: "1777",
    services: ["Smart CNIC", "FRC", "Succession Certificate", "Fast Track"],
    tokenTip: "Visit between 10 PM and 2 AM for instant tokens.",
  },
  {
    id: "mux-nadra-mega-nawan-shehr",
    name: "NADRA Mega Center (Nawan Shehr Multan)",
    department: "NADRA",
    is24_7: true,
    city: "Multan",
    district: "Multan",
    tehsil: "City",
    address: "Abdali Road, Near Nawan Shehr Chowk, Multan",
    lat: 30.1932,
    lng: 71.4583,
    timing: "Open 24 Hours / 7 Days a Week",
    fridayBreak: "1:00 PM – 2:30 PM",
    phone: "1777",
    services: ["Smart CNIC", "FRC", "Succession", "Biometric"],
    tokenTip: "24/7 air-conditioned waiting hall with 30+ service counters.",
  },
];

// Helper: Calculate distance in KM
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function CentersMap() {
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [only24_7, setOnly24_7] = useState<boolean>(false);
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  // Geolocation
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const [selectedCenter, setSelectedCenter] = useState<CenterItem>(OFFICIAL_CENTERS[0]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
      },
      (err) => {
        setGeoError(err.message || "Location permission denied");
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Filter and sort by distance if userPos available
  const filtered = OFFICIAL_CENTERS.filter((c) => {
    const matchDept = deptFilter === "all" || c.department === deptFilter;
    const match247 = !only24_7 || c.is24_7;
    const matchCity = cityFilter === "all" || c.city.toLowerCase() === cityFilter.toLowerCase();
    const query = search.trim().toLowerCase();
    const matchSearch =
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.address.toLowerCase().includes(query) ||
      c.tehsil.toLowerCase().includes(query) ||
      (c.mouzaCoverage && c.mouzaCoverage.some((m) => m.toLowerCase().includes(query)));
    return matchDept && match247 && matchCity && matchSearch;
  }).map((c) => {
    const dist = userPos ? getDistanceKm(userPos.lat, userPos.lng, c.lat, c.lng) : null;
    return { ...c, distanceKm: dist };
  });

  if (userPos) {
    filtered.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
  }

  const cities = Array.from(new Set(OFFICIAL_CENTERS.map((c) => c.city)));

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <MapPin className="size-3.5" /> 24/7 Government Centers & Mouza Locator
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-primary sm:text-3xl">
            Official Centers & 24/7 Mega Center Map
          </h2>
          <p className="mt-1 text-xs text-muted">
            Locate NADRA 24/7 Mega Centers, Arazi Record Centers (PLRA), Passport Offices, and Police Khidmat Markaz.
          </p>
        </div>

        {/* GPS Locate Button */}
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={isLocating}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-surface hover:bg-primary-light transition-all shadow-sm"
        >
          <LocateFixed className={`size-4 ${isLocating ? "animate-spin" : ""}`} />
          {isLocating ? "Locating..." : userPos ? "Location Active (Sorted by Nearest)" : "Find Centers Near Me"}
        </button>
      </div>

      {geoError && (
        <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-warn-fg flex items-center gap-2">
          <ShieldAlert className="size-4 shrink-0" />
          <span>{geoError}. Showing nationwide directory.</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="mt-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Department Pills */}
          {[
            { id: "all", label: "All Departments" },
            { id: "NADRA", label: "🪪 NADRA" },
            { id: "PLRA", label: "📜 Land Records (PLRA)" },
            { id: "Passport", label: "🛂 Passports (DGIP)" },
            { id: "Police", label: "🛡️ Police Khidmat" },
          ].map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDeptFilter(d.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                deptFilter === d.id ? "bg-primary text-surface shadow-sm font-bold" : "border border-border bg-bg text-muted hover:text-fg"
              }`}
            >
              {d.label}
            </button>
          ))}

          {/* 24/7 Switch */}
          <button
            type="button"
            onClick={() => setOnly24_7(!only24_7)}
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all ${
              only24_7 ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-border bg-bg text-muted"
            }`}
          >
            <Zap className="size-3.5 text-emerald-600" />
            24/7 Open Only
          </button>
        </div>

        {/* City Filter & Search Bar */}
        <div className="grid gap-3 sm:grid-cols-12">
          <div className="sm:col-span-4">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-xs font-semibold text-fg outline-none focus:border-primary"
            >
              <option value="all">All Cities (Nationwide)</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="relative sm:col-span-8">
            <Search className="absolute left-3.5 top-3 size-4 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by center name, address, Tehsil, or Mouza (e.g. Shimla Hill, Raiwind, Ichhra)..."
              className="w-full rounded-xl border border-border bg-bg pl-10 pr-4 py-2.5 text-xs font-semibold text-fg outline-none focus:border-primary placeholder:text-muted"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Directory + Map / Detail View */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left List */}
        <div className="max-h-[620px] overflow-y-auto space-y-3 lg:col-span-5 pr-1">
          <div className="text-xs font-bold uppercase tracking-wider text-muted">
            {filtered.length} Centers Found
          </div>

          {filtered.map((c) => {
            const isSelected = selectedCenter.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCenter(c)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
                    : "border-border bg-surface hover:border-primary/40 hover:bg-bg/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-bg px-2 py-0.5 text-[10px] font-bold text-accent">
                      {c.department}
                    </span>
                    {c.is24_7 && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 animate-pulse">
                        <Zap className="size-3" /> 24/7 OPEN
                      </span>
                    )}
                  </div>
                  {c.distanceKm !== null && c.distanceKm !== undefined && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {c.distanceKm < 1 ? `${Math.round(c.distanceKm * 1000)}m` : `${c.distanceKm.toFixed(1)} km`}
                    </span>
                  )}
                </div>

                <h3 className="mt-2 font-display text-sm font-bold text-primary">{c.name}</h3>
                <p className="mt-1 text-xs text-muted line-clamp-1">{c.address}</p>

                <div className="mt-3 flex items-center justify-between border-t border-border/80 pt-2 text-[11px] text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3 text-accent" /> {c.timing.slice(0, 24)}...
                  </span>
                  <span className="font-semibold text-primary">Details →</span>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-border bg-bg p-8 text-center text-xs text-muted">
              No centers found matching your filters. Try selecting "All Cities" or clearing your search.
            </div>
          )}
        </div>

        {/* Right Detail / Map View */}
        <div className="flex flex-col justify-between rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-bg via-surface to-bg p-6 lg:col-span-7 shadow-sm">
          <div>
            {/* Top Status Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-surface">
                  {selectedCenter.department}
                </span>
                {selectedCenter.is24_7 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">
                    <span className="size-2 rounded-full bg-emerald-600 animate-ping" />
                    24/7 Day & Night Active
                  </span>
                ) : (
                  <span className="rounded-lg bg-bg px-3 py-1 text-xs font-semibold text-muted">
                    Day Branch (8:00 AM - 4:00 PM)
                  </span>
                )}
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCenter.name + " " + selectedCenter.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-surface hover:bg-primary-light transition-colors"
              >
                <Navigation className="size-3.5" /> Get Directions in Google Maps <ExternalLink className="size-3" />
              </a>
            </div>

            {/* Title & Address */}
            <h3 className="mt-4 font-display text-2xl font-bold text-primary">
              {selectedCenter.name}
            </h3>
            <p className="mt-1 flex items-start gap-1.5 text-xs text-muted leading-relaxed">
              <MapPin className="size-4 shrink-0 text-accent mt-0.5" />
              <span>{selectedCenter.address} ({selectedCenter.tehsil} Tehsil, {selectedCenter.district} District)</span>
            </p>

            {/* Operating Timings Card */}
            <div className="mt-5 rounded-xl border border-border bg-surface p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Operational Hours:</span>
                <span className="font-bold text-primary">{selectedCenter.timing}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-border pt-1.5">
                <span className="text-muted">Friday Prayer Break:</span>
                <span className="font-semibold text-warn-fg">{selectedCenter.fridayBreak}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-border pt-1.5">
                <span className="text-muted">Official Helpline:</span>
                <span className="font-mono font-bold text-fg">{selectedCenter.phone}</span>
              </div>
            </div>

            {/* Available Services */}
            <div className="mt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted">Available Citizen Services</h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedCenter.services.map((s, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-bg border border-border px-2.5 py-1 text-xs font-semibold text-fg"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Mouza & Patwar Jurisdiction (For PLRA Land Records) */}
            {selectedCenter.mouzaCoverage && (
              <div className="mt-5 rounded-xl bg-amber-50/70 border border-amber-200 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Landmark className="size-4 text-amber-700" /> Revenue Mouza / Village Jurisdiction
                </h4>
                <p className="mt-1 text-xs text-amber-800">
                  This Arazi Record Center is officially designated for land mutations and Fards in these Mouzas:
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedCenter.mouzaCoverage.map((m, i) => (
                    <span key={i} className="rounded-md bg-white border border-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-950">
                      📍 Mouza {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Citizen Token & Rush Advice */}
            <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-primary leading-relaxed">
              <strong>💡 Citizen Token Tip:</strong> {selectedCenter.tokenTip}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
