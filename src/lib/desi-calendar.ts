import { SupportedLanguage } from "./i18n";

export interface DesiDateInfo {
  day: number;
  monthIndex: number;
  monthNameEn: string;
  monthNameUrdu: string;
  monthNamePunjabi: string;
  bikramiYear: number;
  season: string;
}

const DESI_MONTHS = [
  { index: 0, en: "Chet", urdu: "چیت", punjabi: "چیت", pashto: "چیت", sindhi: "چيٽ", startMonth: 2, startDay: 14, season: "Spring (بہار)" },
  { index: 1, en: "Visakh", urdu: "وساکھ", punjabi: "وساکھ", pashto: "وساکھ", sindhi: "ويساک", startMonth: 3, startDay: 14, season: "Harvest (کٹائی)" },
  { index: 2, en: "Jeth", urdu: "جیٹھ", punjabi: "جیٹھ", pashto: "جیټه", sindhi: "ڄيٺ", startMonth: 4, startDay: 15, season: "Early Summer (گرمی)" },
  { index: 3, en: "Harh", urdu: "ہاڑ", punjabi: "ہاڑ", pashto: "هاړ", sindhi: "هاڙهه", startMonth: 5, startDay: 15, season: "Peak Summer (شدید گرمی)" },
  { index: 4, en: "Sawan", urdu: "ساون", punjabi: "ساون", pashto: "ساون", sindhi: "سانوڻ", startMonth: 6, startDay: 16, season: "Monsoon (برسات)" },
  { index: 5, en: "Bhadon", urdu: "بھادوں", punjabi: "بھادوں", pashto: "بهادون", sindhi: "بڊو", startMonth: 7, startDay: 16, season: "Late Monsoon (حبس و برسات)" },
  { index: 6, en: "Assu", urdu: "اسو", punjabi: "اسو", pashto: "اسو", sindhi: "اسُو", startMonth: 8, startDay: 16, season: "Autumn (خزاں)" },
  { index: 7, en: "Kattak", urdu: "کتک", punjabi: "کتک", pashto: "کتک", sindhi: "ڪَتي", startMonth: 9, startDay: 17, season: "Mild Autumn (خنکی)" },
  { index: 8, en: "Maghar", urdu: "مگھر", punjabi: "مگھر", pashto: "مګهر", sindhi: "مگهه", startMonth: 10, startDay: 16, season: "Early Winter (سردی)" },
  { index: 9, en: "Poh", urdu: "پوہ", punjabi: "پوہ", pashto: "پوه", sindhi: "پوهه", startMonth: 11, startDay: 15, season: "Peak Winter (شدید سردی)" },
  { index: 10, en: "Magh", urdu: "ماگھ", punjabi: "ماگھ", pashto: "ماګھ", sindhi: "ماهه", startMonth: 0, startDay: 14, season: "Winter Frost (کورا)" },
  { index: 11, en: "Phagan", urdu: "پھگن", punjabi: "پھگن", pashto: "پھګن", sindhi: "ڦڳڻ", startMonth: 1, startDay: 13, season: "Late Winter (بہار دی آمد)" },
];

export function getDesiDate(date: Date = new Date()): DesiDateInfo {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth();
  const gDay = date.getDate();

  let bikramiYear = gYear + 57;
  if (gMonth < 2 || (gMonth === 2 && gDay < 14)) {
    bikramiYear = gYear + 56;
  }

  let activeMonth = DESI_MONTHS[0];
  let desiDay = 1;

  for (let i = 0; i < DESI_MONTHS.length; i++) {
    const m = DESI_MONTHS[i];
    if (m.startMonth === gMonth) {
      if (gDay >= m.startDay) {
        activeMonth = m;
        desiDay = gDay - m.startDay + 1;
        break;
      } else {
        const prevM = DESI_MONTHS[(i + 11) % DESI_MONTHS.length];
        activeMonth = prevM;
        desiDay = gDay + (31 - prevM.startDay) + 1;
        break;
      }
    }
  }

  return {
    day: desiDay,
    monthIndex: activeMonth.index,
    monthNameEn: activeMonth.en,
    monthNameUrdu: activeMonth.urdu,
    monthNamePunjabi: activeMonth.punjabi,
    bikramiYear,
    season: activeMonth.season,
  };
}

export function formatDesiDateString(lang: SupportedLanguage, date: Date = new Date()): string {
  const info = getDesiDate(date);
  const m = DESI_MONTHS[info.monthIndex];

  if (lang === "en") return info.day + " " + m.en + " " + info.bikramiYear;
  if (lang === "pa") return info.day + " " + m.punjabi + " " + info.bikramiYear;
  if (lang === "ps") return info.day + " " + m.pashto + " " + info.bikramiYear;
  if (lang === "sd") return info.day + " " + m.sindhi + " " + info.bikramiYear;
  return info.day + " " + m.urdu + " " + info.bikramiYear;
}
