// Roman Urdu & Urdu Phonetic Expansion Engine for 47 Say Ab Tak
export interface SearchSynonymGroup {
  keywords: string[]; // Roman Urdu, Urdu, English phrases
  targetToolId?: string;
  targetGuideSlug?: string;
  targetCategorySlug?: string;
  badge: string;
  title: string;
  description: string;
}

export const ROMAN_URDU_DICTIONARY: SearchSynonymGroup[] = [
  // 1. Vehicles & Driving
  {
    keywords: [
      "gari", "gaari", "car", "motorcycle", "bike", "gari ka token", "token tax", "gari transfer",
      "gari ki biometric", "mtmis", "excise", "gari registration", "gari check", "number plate",
      "گاڑی", "ٹوکن ٹیکس", "گاڑی ٹرانسفر", "گاڑی بائیو میٹرک"
    ],
    targetToolId: "mtmis_vehicle",
    badge: "Excise & MTMIS",
    title: "MTMIS 4-Province Vehicle Verifier & Token Tax",
    description: "Check registered owner, token tax paid status, and biometric transfer across Punjab, Sindh, ICT & KP.",
  },
  {
    keywords: [
      "license", "driving license", "dlims", "learner", "license renew", "license fee",
      "ڈرائیونگ لائسنس", "لرنر پرمٹ", "لائسنس فیس"
    ],
    targetToolId: "fee",
    targetGuideSlug: "driving-license-dlims",
    badge: "Traffic Police",
    title: "DLIMS Driving License Renewal & Learner Guide",
    description: "Complete procedure, computerized fee breakdown, and Police Khidmat Markaz steps.",
  },
  {
    keywords: [
      "gari sale", "gari bechna", "car receipt", "iqrarnama gari", "vehicle agreement",
      "اقرار نامہ بیع گاڑی", "گاڑی رسید"
    ],
    targetToolId: "vehicle_sale",
    badge: "Legal Deed",
    title: "Vehicle Sale Receipt & Indemnity Drafter",
    description: "Generate legally binding stamp paper sale agreement protecting seller against traffic challans and accidents.",
  },

  // 2. NADRA & Citizen ID
  {
    keywords: [
      "shanakhti card", "shanakht", "cnic", "smart card", "id card", "gum ho gya", "lost cnic",
      "cnic renew", "nicop", "nadra", "pak id", "tracking cnic", "12 digit tracking",
      "شناختی کارڈ", "نادرا", "شناختی کارڈ گم", "سمارٹ کارڈ"
    ],
    targetToolId: "nadra_tracking",
    targetGuideSlug: "smart-cnic-issuance",
    badge: "NADRA Pak-ID",
    title: "NADRA Pak-ID Tracking & Lost CNIC Guide",
    description: "Track 12-digit application tracking ID and step-by-step renewal/lost card procedure.",
  },
  {
    keywords: [
      "bache ka b form", "b form", "b farm", "crc", "child registration", "paidaish certificate",
      "birth certificate", "بے فارم", "پیدائش سرٹیفکیٹ", "سی آر سی"
    ],
    targetGuideSlug: "crc-b-form-registration",
    badge: "NADRA CRC",
    title: "Child Registration Certificate (B-Form / CRC) Guide",
    description: "Union Council birth certificate to computerized NADRA B-Form issuance steps.",
  },
  {
    keywords: [
      "shajra nasab", "shajra", "family tree", "frc", "khandan shajra", "heirship",
      "شجرہ نسب", "خاندانی شجرہ", "ایف آر سی"
    ],
    targetToolId: "shajra_nasab",
    badge: "Succession",
    title: "Shajra-e-Nasab (Succession Family Tree) Drafter",
    description: "Draw legal ancestral family trees for inheritance distribution and PLRA land transfers.",
  },

  // 3. Overseas Pakistani & MOFA
  {
    keywords: [
      "overseas", "pardesi", "bahar ka mulk", "mofa", "attestation", "degree attestation",
      "power of attorney overseas", "mukhtar nama abroad", "poc", "pakistan origin card",
      "nicop abroad", "dubai", "saudi", "uk", "usa", "canada", "rda", "roshan digital",
      "اوورسیز پاکستانی", "وزارت خارجہ تصدیق", "مختار نامہ بیرون ملک", "روشن ڈیجیٹل"
    ],
    targetToolId: "overseas_mofa",
    badge: "MOFA & OPF",
    title: "Overseas Pakistani & MOFA Attestation Portal",
    description: "MOFA QR degree attestation, Embassy Digital Power of Attorney, and NICOP vs POC eligibility.",
  },

  // 4. Land, Property & Rent
  {
    keywords: [
      "fard", "fard malkiat", "fard bayan", "inteqal", "zameen", "plot", "registry", "patwari",
      "plra", "arazi record", "property transfer", "bayana", "token money",
      "فرد ملکیت", "فرد بیع", "انتقال جائیداد", "پلاٹ رجسٹری", "بیعانہ"
    ],
    targetToolId: "property_bayana",
    targetGuideSlug: "land-record-fard-issuance",
    badge: "PLRA & Land",
    title: "Property Transfer, Fard Malkiat & Bayana Agreement",
    description: "Arazi Record Center (PLRA) computerization, Challan 32-A stamp paper, and bayana deed generator.",
  },
  {
    keywords: [
      "kiraya nama", "rent agreement", "kirayedaar", "makan kiraya", "tenant agreement",
      "کرایہ نامہ", "مکان کرایہ", "کرایہ دار پولیس تصدیق"
    ],
    targetToolId: "rent_agreement",
    badge: "Legal Deed",
    title: "Residential Rent Agreement Drafter (Punjab Rented Premises Act)",
    description: "Generate authentic bilingual tenancy contract compliant with Police Tenant Registration SOPs.",
  },

  // 5. Electricity, Solar & Utilities
  {
    keywords: [
      "bijli", "bijli ka bill", "wapda bill", "lesco", "iesco", "mepco", "nepra", "unit rate",
      "fpa", "fuel price adjustment", "bill slab", "solar", "net metering", "solar units",
      "بجلی بل", "نیپرا سلیب", "سولر نیٹ میٹرنگ", "لیسکو بل"
    ],
    targetToolId: "solar",
    badge: "NEPRA Energy",
    title: "Solar Net-Metering & NEPRA Electricity Slabs Calculator",
    description: "Calculate solar system ROI, payback period, and 2026 NEPRA protected/unprotected bill slabs.",
  },
  {
    keywords: [
      "psid", "1bill", "epay", "e-pay punjab", "challan 32a", "challan check", "17 digit psid",
      "سرکاری چالان", "پی ایس آئی ڈی", "ای پے پنجاب"
    ],
    targetToolId: "psid_1bill",
    badge: "1Link API",
    title: "17-Digit PSID / 1Bill Challan Verifier",
    description: "Instantly decode government dues for e-Pay Punjab, FBR, ICT, and DISCO utilities.",
  },

  // 6. Mobile & PTA
  {
    keywords: [
      "mobile check", "pta", "imei", "pta tax", "mobile tax", "stolen phone", "cpid",
      "8484", "dirbs", "iphone pta tax", "samsung pta tax",
      "موبائل پی ٹی اے", "آئی ایم ای آئی", "موبائل ٹیکس"
    ],
    targetToolId: "pta_imei",
    badge: "PTA DIRBS",
    title: "PTA DIRBS 15-Digit IMEI & Customs Tax Inspector",
    description: "Check phone hardware specs from GSMA TAC and calculate exact 2026 Passport/CNIC customs duties.",
  },

  // 7. Taxes & FBR
  {
    keywords: [
      "fbr", "filer", "non filer", "active taxpayer", "atl", "9966", "income tax", "salary tax",
      "freelancer tax", "it export tax", "iris", "ntn check",
      "ایف بی آر", "فائلر", "نان فائلر", "انکم ٹیکس"
    ],
    targetToolId: "fbr_atl",
    badge: "FBR ATL",
    title: "FBR Active Taxpayer (ATL) & NTN Status Verifier",
    description: "Verify active filer status, assigned RTO jurisdiction, and statutory withholding tax reductions.",
  },

  // 8. Legal Notices, Courts & Police
  {
    keywords: [
      "consumer court", "sarif adalat", "15 day notice", "kharab cheez", "refund", "dhoka",
      "صارف عدالت", "پندرہ روزہ نوٹس", "ہرجانہ"
    ],
    targetToolId: "consumer_court",
    badge: "Consumer Law",
    title: "Consumer Court 15-Day Statutory Legal Notice Drafter",
    description: "Draft official notice against defective products, fraud warranties, and service deficiencies (Rs 0 court fee).",
  },
  {
    keywords: [
      "affidavit", "bayan e halfi", "half nama", "stamp paper", "e-stamp",
      "بیان حلفی", "حلف نامہ", "اشٹام پیپر"
    ],
    targetToolId: "affidavit",
    badge: "E-Stamp Deed",
    title: "Affidavit Drafter (بیان حلفی - 5 Legal Templates)",
    description: "Draft lost documents affidavit, income declaration, no-marriage certificate, and character indemnity.",
  },
  {
    keywords: [
      "zakat", "ushr", "nisab", "gold zakat", "silver zakat", "sona zakat", "chandi nisab",
      "زکوٰۃ", "عشر", "نصاب چاندی"
    ],
    targetToolId: "zakat",
    badge: "Islamic Finance",
    title: "Zakat & Ushr Calculator (Live Nisab Standards)",
    description: "Calculate obligatory Zakat on gold, silver, bank cash, and agricultural Ushr.",
  },
  {
    keywords: [
      "disaster", "flood", "smog", "aqi", "air quality", "rain alert", "ndma", "pmd", "1129",
      "سموگ", "سیلاب", "موسم الرٹ", "این ڈی ایم اے"
    ],
    targetToolId: "ndma_alerts",
    badge: "PMD / NDMA",
    title: "National Hazard, Smog AQI & Disaster Alert Center",
    description: "Live PMD meteorological warnings, provincial flood alerts, and National Smog AQI dashboard.",
  },
];

// Smart search resolution query matcher
export function searchWithRomanUrdu(query: string): SearchSynonymGroup[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();
  const words = q.split(/\s+/);

  return ROMAN_URDU_DICTIONARY.filter((item) => {
    // 1. Direct title/desc match
    if (item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)) {
      return true;
    }
    // 2. Keyword match
    return item.keywords.some((keyword) => {
      const k = keyword.toLowerCase();
      // Check if user query matches keyword or any word matches
      if (k.includes(q) || q.includes(k)) return true;
      return words.some((w) => w.length > 2 && k.includes(w));
    });
  });
}
