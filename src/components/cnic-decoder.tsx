import { useState } from "react";
import { IdCard, ShieldCheck, MapPin, Sparkles, CheckCircle2, AlertCircle, Copy, Check, Users, Compass } from "lucide-react";

interface DecodedCnic {
  province: string;
  division: string;
  districtCode: string;
  tehsilCode: string;
  familyTreeIndex: string;
  gender: "Male" | "Female";
  isValidFormat: boolean;
}

const PROVINCE_MAP: Record<string, string> = {
  "1": "Khyber Pakhtunkhwa (KPK)",
  "2": "FATA (Merged Tribal Districts)",
  "3": "Punjab",
  "4": "Sindh",
  "5": "Balochistan",
  "6": "Islamabad Capital Territory (ICT)",
  "7": "Gilgit-Baltistan",
  "8": "Azad Jammu & Kashmir (AJK)",
};

const DIVISION_MAP: Record<string, string> = {
  // Punjab
  "31": "Bahawalpur Division",
  "32": "Dera Ghazi Khan Division",
  "33": "Faisalabad Division",
  "34": "Gujranwala / Gujrat Division",
  "35": "Lahore Division",
  "36": "Multan Division",
  "37": "Rawalpindi Division",
  "38": "Sahiwal Division",
  "39": "Sargodha Division",
  // Sindh
  "41": "Hyderabad Division",
  "42": "Karachi Division (Central/East/South/West/Malir/Korangi)",
  "43": "Sukkur Division",
  "44": "Larkana Division",
  "45": "Mirpur Khas Division",
  "46": "Shaheed Benazirabad (Nawabshah) Division",
  // KPK
  "11": "Peshawar Division",
  "12": "Mardan Division",
  "13": "Malakand Division (Swat/Dir/Chitral)",
  "14": "Hazara Division (Abbottabad/Mansehra/Haripur)",
  "15": "Kohat Division",
  "16": "Bannu Division",
  "17": "Dera Ismail Khan Division",
  // Balochistan
  "51": "Quetta Division",
  "52": "Kalat Division",
  "53": "Makran Division (Gwadar/Turbat)",
  "54": "Nasirabad Division",
  "55": "Sibi Division",
  "56": "Zhob / Loralai Division",
  "57": "Rakhshan Division",
  // ICT
  "61": "Islamabad Federal Capital Area",
  // GB
  "71": "Gilgit / Hunza / Nagar",
  "72": "Baltistan (Skardu/Shigar/Ghanche)",
  "73": "Diamer / Astore",
  // AJK
  "81": "Muzaffarabad Division",
  "82": "Mirpur Division",
  "83": "Poonch / Rawalakot Division",
};

export function CnicDecoder() {
  const [inputCnic, setInputCnic] = useState("35202-1234567-1");
  const [copied, setCopied] = useState(false);

  // Format CNIC with dashes automatically
  const handleInputChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 13);
    let formatted = raw;
    if (raw.length > 5 && raw.length <= 12) {
      formatted = raw.slice(0, 5) + "-" + raw.slice(5);
    } else if (raw.length > 12) {
      formatted = raw.slice(0, 5) + "-" + raw.slice(5, 12) + "-" + raw.slice(12, 13);
    }
    setInputCnic(formatted);
  };

  const decodeCnic = (cnicStr: string): DecodedCnic | null => {
    const digits = cnicStr.replace(/\D/g, "");
    if (digits.length !== 13) return null;

    const pDigit = digits[0];
    const divDigits = digits.slice(0, 2);
    const lastDigit = Number(digits[12]);

    const province = PROVINCE_MAP[pDigit] || "Special Administrative Jurisdiction";
    const division = DIVISION_MAP[divDigits] || ("Administrative Division Code " + divDigits);
    const districtCode = digits.slice(2, 4);
    const tehsilCode = digits.slice(4, 5);
    const familyTreeIndex = digits.slice(5, 12);
    const gender = lastDigit % 2 === 1 ? "Male" : "Female";

    return {
      province,
      division,
      districtCode,
      tehsilCode,
      familyTreeIndex,
      gender,
      isValidFormat: true,
    };
  };

  const decoded = decodeCnic(inputCnic);

  return (
    <div className="space-y-8 rounded-3xl border border-border/80 bg-surface p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <ShieldCheck className="size-3.5" /> 100% Client-Side Private Decoder
          </div>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-black text-primary">
            Smart CNIC 13-Digit Inspector & Jurisdiction Decoder
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Instantly decode native province, administrative division, family lineage serial, and gender from any 13-digit Pakistani CNIC.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 shrink-0">
          <CheckCircle2 className="size-4 text-emerald-600" />
          <span>Zero Server Uploads (100% Private)</span>
        </div>
      </div>

      {/* Input Form */}
      <div className="max-w-2xl space-y-4">
        <label className="block text-xs font-bold text-fg">
          Enter 13-Digit National Identity Card Number (CNIC / NICOP / POC)
        </label>
        <div className="relative flex items-center">
          <IdCard className="absolute left-4 size-5 text-primary" />
          <input
            type="text"
            value={inputCnic}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="35202-1234567-1"
            className="w-full rounded-2xl border-2 border-primary/30 bg-surface pl-12 pr-4 py-3.5 font-mono text-xl sm:text-2xl font-black tracking-widest text-fg outline-none focus:border-primary transition-all shadow-xs"
          />
        </div>

        {/* Quick sample chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted font-semibold">Test Sample Origins:</span>
          {[
            { label: "Lahore (Punjab)", cnic: "35201-1234567-1" },
            { label: "Karachi (Sindh)", cnic: "42101-7654321-2" },
            { label: "Peshawar (KP)", cnic: "17301-9876543-1" },
            { label: "Quetta (Balochistan)", cnic: "54401-1122334-1" },
            { label: "Islamabad (ICT)", cnic: "61101-5566778-2" },
          ].map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => setInputCnic(sample.cnic)}
              className="rounded-xl border border-border bg-bg/60 px-2.5 py-1 text-[11px] font-bold text-primary hover:border-primary hover:bg-primary/10 transition-all"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Decoded Results Deck */}
      {decoded ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
          {/* Card 1: Province */}
          <div className="rounded-2xl border border-primary/20 bg-[#eef7f0] dark:bg-primary/10 p-5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-primary">
              <MapPin className="size-5" />
              <span className="rounded-md bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">Digit 1: {inputCnic[0]}</span>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted">Native Province / Region</div>
            <div className="font-display text-base font-black text-primary leading-tight">
              {decoded.province}
            </div>
          </div>

          {/* Card 2: Division */}
          <div className="rounded-2xl border border-primary/20 bg-[#eef7f0] dark:bg-primary/10 p-5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-primary">
              <Compass className="size-5" />
              <span className="rounded-md bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">Digits 1–2: {inputCnic.slice(0, 2)}</span>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted">Administrative Division</div>
            <div className="font-display text-base font-black text-primary leading-tight">
              {decoded.division}
            </div>
          </div>

          {/* Card 3: Family Tree Index */}
          <div className="rounded-2xl border border-primary/20 bg-[#eef7f0] dark:bg-primary/10 p-5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-primary">
              <Users className="size-5" />
              <span className="rounded-md bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">Middle 7 Digits</span>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted">NADRA Family Lineage Code</div>
            <div className="font-mono text-base font-black text-primary leading-tight">
              {decoded.familyTreeIndex}
            </div>
          </div>

          {/* Card 4: Gender Parity */}
          <div className="rounded-2xl border border-primary/20 bg-[#eef7f0] dark:bg-primary/10 p-5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-primary">
              <IdCard className="size-5" />
              <span className="rounded-md bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">Last Digit: {inputCnic[inputCnic.length - 1]}</span>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted">Gender Parity Check</div>
            <div className="font-display text-base font-black text-primary leading-tight flex items-center gap-2">
              <span>{decoded.gender}</span>
              <span className="text-xs font-normal text-muted">({decoded.gender === "Male" ? "Odd checksum" : "Even checksum"})</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0 text-amber-600" />
          <span>Please enter a valid 13-digit CNIC to view administrative jurisdiction breakdown.</span>
        </div>
      )}

      {/* NADRA 13-Digit Architectural Anatomy Explanation */}
      <div className="rounded-2xl border border-border/80 bg-bg/50 p-5 space-y-3 text-xs">
        <h3 className="font-display font-bold text-primary text-sm flex items-center gap-2">
          <ShieldCheck className="size-4" /> How NADRA 13-Digit CNIC Encoding Works:
        </h3>
        <div className="grid gap-3 sm:grid-cols-3 text-muted leading-relaxed">
          <div>
            <span className="font-bold text-fg block mb-1">1. First 5 Digits (Geo Code):</span>
            Digit 1 indicates the province/region, digit 2 indicates the division, digits 3-4 indicate district, and digit 5 indicates the tehsil/UC.
          </div>
          <div>
            <span className="font-bold text-fg block mb-1">2. Middle 7 Digits (Family Sequence):</span>
            Generated sequentially under the family head (Father / Husband) tree for Family Registration Certificate (FRC) grouping.
          </div>
          <div>
            <span className="font-bold text-fg block mb-1">3. 13th Checksum Digit (Gender):</span>
            Odd numbers (1, 3, 5, 7, 9) are assigned to male and transgender citizens, while even numbers (2, 4, 6, 8) are assigned to female citizens.
          </div>
        </div>
      </div>
    </div>
  );
}
