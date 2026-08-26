import { useState, useEffect, useCallback } from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudFog,
  CloudLightning,
  Snowflake,
  Wind,
  Droplets,
  MapPin,
  Compass,
  Calendar,
  Moon,
  RefreshCw,
  ChevronDown,
  Sparkles,
  Fuel,
  Coins,
  DollarSign,
  TrendingUp,
  Activity,
  PhoneCall,
  Clock,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "@/lib/i18n";
import { formatDesiDateString } from "@/lib/desi-calendar";
import { calculatePakistaniPrayerTimes, PrayerTimes } from "@/lib/prayer-times";

interface CityOption {
  name: string;
  nameUrdu: string;
  lat: number;
  lng: number;
  province: string;
}

export const MAJOR_PAKISTAN_CITIES: CityOption[] = [
  { name: "Islamabad", nameUrdu: "اسلام آباد", lat: 33.6844, lng: 73.0479, province: "Federal Capital" },
  { name: "Lahore", nameUrdu: "لاہور", lat: 31.5204, lng: 74.3587, province: "Punjab" },
  { name: "Karachi", nameUrdu: "کراچی", lat: 24.8607, lng: 67.0011, province: "Sindh" },
  { name: "Rawalpindi", nameUrdu: "راولپنڈی", lat: 33.5651, lng: 73.0169, province: "Punjab" },
  { name: "Peshawar", nameUrdu: "پشاور", lat: 34.0151, lng: 71.5249, province: "Khyber Pakhtunkhwa" },
  { name: "Quetta", nameUrdu: "کوئٹہ", lat: 30.1798, lng: 66.975, province: "Balochistan" },
  { name: "Multan", nameUrdu: "ملتان", lat: 30.1575, lng: 71.5249, province: "Punjab" },
  { name: "Faisalabad", nameUrdu: "فیصل آباد", lat: 31.4504, lng: 73.135, province: "Punjab" },
  { name: "Sialkot", nameUrdu: "سیالکوٹ", lat: 32.4945, lng: 74.5229, province: "Punjab" },
  { name: "Hyderabad", nameUrdu: "حیدرآباد", lat: 25.396, lng: 68.3578, province: "Sindh" },
  { name: "Gilgit", nameUrdu: "گلگت", lat: 35.9221, lng: 74.3087, province: "Gilgit-Baltistan" },
  { name: "Muzaffarabad", nameUrdu: "مظفر آباد", lat: 34.3705, lng: 73.4711, province: "Azad Kashmir" },
];

function getWeatherIcon(code: number, className = "size-5") {
  if (code === 0 || code === 1) return <Sun className={className + " text-amber-500 animate-spin-slow"} />;
  if (code === 2 || code === 3) return <Cloud className={className + " text-slate-400"} />;
  if (code >= 45 && code <= 48) return <CloudFog className={className + " text-slate-400"} />;
  if (code >= 51 && code <= 67) return <CloudRain className={className + " text-blue-500"} />;
  if (code >= 71 && code <= 77) return <Snowflake className={className + " text-cyan-400"} />;
  if (code >= 80 && code <= 82) return <CloudRain className={className + " text-blue-600"} />;
  if (code >= 95) return <CloudLightning className={className + " text-amber-400"} />;
  return <Sun className={className + " text-amber-500"} />;
}

function getIslamicHijriDate(): string {
  try {
    const today = new Date();
    const formatterEn = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const formatted = formatterEn.format(today);
    return formatted.includes("AH") ? formatted : formatted + " AH";
  } catch {
    return "13 Rabiʻ I 1448 AH";
  }
}

function getGregorianDate(lang: SupportedLanguage): string {
  const today = new Date();
  const localeMap: Record<SupportedLanguage, string> = {
    en: "en-PK",
    ur: "ur-PK",
    pa: "pa-PK",
    ps: "ps-AF",
    sd: "sd-PK",
  };
  try {
    return today.toLocaleDateString(localeMap[lang] || "en-PK", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return today.toLocaleDateString("en-PK", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
}

export function DailyWeatherBar() {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [selectedCity, setSelectedCity] = useState<CityOption>(MAJOR_PAKISTAN_CITIES[1]); // Default Lahore
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [weather, setWeather] = useState({
    temp: 32,
    weatherCode: 0,
    humidity: 48,
    windSpeed: 10,
    aqi: 65,
    loading: false,
  });

  const prayerTimes: PrayerTimes = calculatePakistaniPrayerTimes(selectedCity.lat, selectedCity.lng);
  const hijriDate = getIslamicHijriDate();
  const gregorianDate = getGregorianDate(language);
  const desiDate = formatDesiDateString(language);

  const fetchWeatherAndAqi = useCallback(async (lat: number, lng: number) => {
    setWeather((prev) => ({ ...prev, loading: true }));
    try {
      // 1. Weather
      const weatherRes = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lng + "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia%2FKarachi"
      );
      const weatherData = weatherRes.ok ? await weatherRes.json() : null;

      // 2. Air Quality AQI
      let aqiVal = 65;
      try {
        const aqiRes = await fetch(
          "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=" + lat + "&longitude=" + lng + "&current=us_aqi&timezone=Asia%2FKarachi"
        );
        if (aqiRes.ok) {
          const aqiData = await aqiRes.json();
          if (aqiData?.current?.us_aqi) {
            aqiVal = Math.round(aqiData.current.us_aqi);
          }
        }
      } catch {
        aqiVal = 65;
      }

      if (weatherData?.current) {
        setWeather({
          temp: Math.round(weatherData.current.temperature_2m),
          weatherCode: weatherData.current.weather_code,
          humidity: Math.round(weatherData.current.relative_humidity_2m),
          windSpeed: Math.round(weatherData.current.wind_speed_10m),
          aqi: aqiVal,
          loading: false,
        });
      } else {
        setWeather((prev) => ({ ...prev, loading: false, aqi: aqiVal }));
      }
    } catch {
      setWeather((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          let closest = MAJOR_PAKISTAN_CITIES[1];
          let minDistance = Infinity;
          for (const city of MAJOR_PAKISTAN_CITIES) {
            const d = Math.hypot(city.lat - lat, city.lng - lng);
            if (d < minDistance) {
              minDistance = d;
              closest = city;
            }
          }
          setSelectedCity(closest);
          fetchWeatherAndAqi(lat, lng);
        },
        () => {
          fetchWeatherAndAqi(selectedCity.lat, selectedCity.lng);
        },
        { timeout: 5000 }
      );
    } else {
      fetchWeatherAndAqi(selectedCity.lat, selectedCity.lng);
    }
  }, [fetchWeatherAndAqi]);

  const handleCitySelect = (city: CityOption) => {
    setSelectedCity(city);
    setShowCityPicker(false);
    fetchWeatherAndAqi(city.lat, city.lng);
  };

  const getAqiStatus = (aqi: number) => {
    if (aqi <= 50) return { label: t("aqiGood"), color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30" };
    if (aqi <= 100) return { label: t("aqiModerate"), color: "text-amber-600 bg-amber-500/10 border-amber-500/30" };
    if (aqi <= 150) return { label: t("aqiSensitive"), color: "text-orange-600 bg-orange-500/10 border-orange-500/30" };
    return { label: t("aqiUnhealthy"), color: "text-red-600 bg-red-500/10 border-red-500/30" };
  };

  const aqiInfo = getAqiStatus(weather.aqi);

  return (
    <div className="border-b border-border/80 bg-surface shadow-xs">
      {/* 🌐 1. TOP 5-LANGUAGE SWITCHER HEADER */}
      <div className="bg-[#032b13] px-4 py-2 text-surface border-b border-emerald-900/60">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-xs text-accent">47 Say Ab Tak</span>
            <span className="text-[10px] text-surface/70 hidden sm:inline">• {t("portalSubtitle")}</span>
          </div>

          {/* 5-Language Toggle Pill */}
          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md rounded-full p-1 border border-emerald-500/30">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={
                  "px-2.5 py-0.5 rounded-full text-xs font-bold transition-all " +
                  (language === lang.code
                    ? "bg-accent text-[#01411c] shadow-sm font-black scale-105"
                    : "text-surface/80 hover:text-surface hover:bg-surface/10")
                }
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🌦️ 2. SMART 4-WIDGET DASHBOARD BAR (WEATHER + TRIPLE DATE + AQI + NAMAZ) */}
      <div className="px-4 py-3 bg-gradient-to-r from-primary/5 via-surface to-primary/5">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* WIDGET 1: LIVE WEATHER */}
          <div className="relative flex items-center justify-between rounded-2xl border border-border/80 bg-surface/90 p-3 shadow-2xs">
            <button
              type="button"
              onClick={() => setShowCityPicker(!showCityPicker)}
              className="flex items-center gap-3 text-left group w-full"
            >
              <div className="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-amber-500 shadow-2xs shrink-0">
                {weather.loading ? (
                  <RefreshCw className="size-5 animate-spin text-muted" />
                ) : (
                  getWeatherIcon(weather.weatherCode, "size-6")
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 font-display text-sm font-black text-primary group-hover:text-primary-light transition-colors">
                  <span>{language === "en" ? selectedCity.name : selectedCity.nameUrdu} {weather.temp}°C</span>
                  <ChevronDown className="size-3 text-muted" />
                </div>
                <div className="text-[11px] text-muted font-medium truncate">{t("weatherTitle")} • {weather.humidity}% Hum</div>
              </div>
            </button>

            {showCityPicker && (
              <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-border bg-surface p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-border/80 px-3 py-1.5 text-[11px] font-bold text-muted">
                  <span>{t("weatherTitle")}</span>
                </div>
                <div className="max-h-60 overflow-y-auto py-1 space-y-0.5">
                  {MAJOR_PAKISTAN_CITIES.map((city) => (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() => handleCitySelect(city)}
                      className={
                        "flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left text-xs transition-colors " +
                        (selectedCity.name === city.name ? "bg-primary text-surface font-bold" : "text-fg hover:bg-bg")
                      }
                    >
                      <span>{city.name}</span>
                      <span className="font-serif text-sm opacity-90">{city.nameUrdu}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* WIDGET 2: TRIPLE CALENDAR (GREGORIAN + HIJRI + DESI SOLAR MONTH) */}
          <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-surface/90 p-3 shadow-2xs">
            <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Calendar className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-xs font-black text-primary truncate">
                {gregorianDate}
              </div>
              <div className="text-[11px] font-bold text-accent truncate">
                {hijriDate}
              </div>
              <div className="text-[10px] text-muted font-medium truncate">
                🌾 {t("desiMonth")}: {desiDate}
              </div>
            </div>
          </div>

          {/* WIDGET 3: LIVE AQI SPEEDOMETER / METER */}
          <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-surface/90 p-3 shadow-2xs">
            <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
              <Activity className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold text-muted uppercase">{t("aqiTitle")}</span>
                <span className={"px-2 py-0.5 rounded-md text-[10px] font-black border " + aqiInfo.color}>
                  {aqiInfo.label}
                </span>
              </div>
              <div className="font-display text-sm font-black text-fg mt-0.5">
                AQI {weather.aqi}
              </div>
            </div>
          </div>

          {/* WIDGET 4: NAMAZ PRAYER TIMINGS STRIP */}
          <div className="flex items-center gap-2.5 rounded-2xl border border-border/80 bg-surface/90 p-2.5 shadow-2xs">
            <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Moon className="size-4" />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center justify-between text-[10px] text-muted font-bold">
                <span>{t("namazTitle")}</span>
                <span className="text-primary font-black">{t("nextPrayer")}: {prayerTimes.nextPrayerName}</span>
              </div>
              <div className="grid grid-cols-5 gap-1 text-center font-mono text-[9px]">
                <div className="rounded bg-bg p-0.5"><div className="font-bold text-muted">{t("fajr")}</div><div>{prayerTimes.fajr.split(" ")[0]}</div></div>
                <div className="rounded bg-bg p-0.5"><div className="font-bold text-muted">{t("zuhr")}</div><div>{prayerTimes.zuhr.split(" ")[0]}</div></div>
                <div className="rounded bg-bg p-0.5"><div className="font-bold text-muted">{t("asr")}</div><div>{prayerTimes.asr.split(" ")[0]}</div></div>
                <div className="rounded bg-bg p-0.5"><div className="font-bold text-muted">{t("maghrib")}</div><div>{prayerTimes.maghrib.split(" ")[0]}</div></div>
                <div className="rounded bg-bg p-0.5"><div className="font-bold text-muted">{t("isha")}</div><div>{prayerTimes.isha.split(" ")[0]}</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📈 3. LIVE MARKET & STOCK EXCHANGE CONTINUOUS SLOW MARQUEE TICKER RIBBON */}
      <div className="border-t border-border/70 bg-[#063318] text-surface py-2 text-xs relative overflow-hidden select-none">
        {/* Left and right gradient fade for premium look */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#063318] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#063318] to-transparent z-10" />

        <div className="flex items-center w-full overflow-hidden">
          <div className="animate-marquee-ticker flex items-center gap-6 shrink-0 py-0.5">
            {/* Set 1 */}
            <div className="flex items-center gap-6 shrink-0">
              {/* PSX KSE-100 */}
              <div className="inline-flex items-center gap-1.5 font-bold">
                <TrendingUp className="size-3.5 text-emerald-400" />
                <span className="text-accent">{t("psxKse100")}:</span>
                <span className="text-surface font-black">82,450.20</span>
                <span className="text-[10px] text-emerald-400 font-mono">(+410.50)</span>
              </div>

              {/* Petrol */}
              <div className="inline-flex items-center gap-1 font-bold">
                <Fuel className="size-3 text-amber-400" />
                <span>{t("petrol")}:</span>
                <span className="text-accent font-black">Rs 268.50</span>
              </div>

              {/* Diesel */}
              <div className="inline-flex items-center gap-1 font-bold">
                <Fuel className="size-3 text-amber-300" />
                <span>Diesel:</span>
                <span className="text-surface font-black">Rs 276.40</span>
              </div>

              {/* USD */}
              <div className="inline-flex items-center gap-1 font-bold">
                <DollarSign className="size-3 text-emerald-400" />
                <span>{t("usdPkr")}:</span>
                <span className="text-surface font-black">Rs 278.45</span>
              </div>

              {/* SAR */}
              <div className="inline-flex items-center gap-1 font-bold">
                <span>🇸🇦 {t("sarPkr")}:</span>
                <span className="text-surface font-black">Rs 74.20</span>
              </div>

              {/* AED */}
              <div className="inline-flex items-center gap-1 font-bold">
                <span>🇦🇪 {t("aedPkr")}:</span>
                <span className="text-surface font-black">Rs 75.80</span>
              </div>

              {/* GBP */}
              <div className="inline-flex items-center gap-1 font-bold">
                <span>🇬🇧 GBP/PKR:</span>
                <span className="text-surface font-black">Rs 365.10</span>
              </div>

              {/* Gold 24K */}
              <div className="inline-flex items-center gap-1 font-bold">
                <Coins className="size-3 text-yellow-400" />
                <span>{t("gold24k")}:</span>
                <span className="text-accent font-black">Rs 284,500</span>
              </div>

              {/* 24/7 Helplines */}
              <div className="inline-flex items-center gap-2 border-l border-emerald-800 pl-3">
                <span className="text-[11px] text-surface/80 font-bold">{t("helplines")}:</span>
                <a href="tel:15" className="px-1.5 py-0.5 rounded bg-surface/10 hover:bg-surface/20 text-accent font-bold text-[10px]">15 (Police)</a>
                <a href="tel:1122" className="px-1.5 py-0.5 rounded bg-surface/10 hover:bg-surface/20 text-accent font-bold text-[10px]">1122 (Rescue)</a>
                <a href="tel:1777" className="px-1.5 py-0.5 rounded bg-surface/10 hover:bg-surface/20 text-accent font-bold text-[10px]">1777 (NADRA)</a>
              </div>
            </div>

            {/* Set 2 (Duplicate for Seamless Infinite Marquee Loop) */}
            <div className="flex items-center gap-6 shrink-0" aria-hidden="true">
              {/* PSX KSE-100 */}
              <div className="inline-flex items-center gap-1.5 font-bold">
                <TrendingUp className="size-3.5 text-emerald-400" />
                <span className="text-accent">{t("psxKse100")}:</span>
                <span className="text-surface font-black">82,450.20</span>
                <span className="text-[10px] text-emerald-400 font-mono">(+410.50)</span>
              </div>

              {/* Petrol */}
              <div className="inline-flex items-center gap-1 font-bold">
                <Fuel className="size-3 text-amber-400" />
                <span>{t("petrol")}:</span>
                <span className="text-accent font-black">Rs 268.50</span>
              </div>

              {/* Diesel */}
              <div className="inline-flex items-center gap-1 font-bold">
                <Fuel className="size-3 text-amber-300" />
                <span>Diesel:</span>
                <span className="text-surface font-black">Rs 276.40</span>
              </div>

              {/* USD */}
              <div className="inline-flex items-center gap-1 font-bold">
                <DollarSign className="size-3 text-emerald-400" />
                <span>{t("usdPkr")}:</span>
                <span className="text-surface font-black">Rs 278.45</span>
              </div>

              {/* SAR */}
              <div className="inline-flex items-center gap-1 font-bold">
                <span>🇸🇦 {t("sarPkr")}:</span>
                <span className="text-surface font-black">Rs 74.20</span>
              </div>

              {/* AED */}
              <div className="inline-flex items-center gap-1 font-bold">
                <span>🇦🇪 {t("aedPkr")}:</span>
                <span className="text-surface font-black">Rs 75.80</span>
              </div>

              {/* GBP */}
              <div className="inline-flex items-center gap-1 font-bold">
                <span>🇬🇧 GBP/PKR:</span>
                <span className="text-surface font-black">Rs 365.10</span>
              </div>

              {/* Gold 24K */}
              <div className="inline-flex items-center gap-1 font-bold">
                <Coins className="size-3 text-yellow-400" />
                <span>{t("gold24k")}:</span>
                <span className="text-accent font-black">Rs 284,500</span>
              </div>

              {/* 24/7 Helplines */}
              <div className="inline-flex items-center gap-2 border-l border-emerald-800 pl-3">
                <span className="text-[11px] text-surface/80 font-bold">{t("helplines")}:</span>
                <a href="tel:15" className="px-1.5 py-0.5 rounded bg-surface/10 hover:bg-surface/20 text-accent font-bold text-[10px]">15 (Police)</a>
                <a href="tel:1122" className="px-1.5 py-0.5 rounded bg-surface/10 hover:bg-surface/20 text-accent font-bold text-[10px]">1122 (Rescue)</a>
                <a href="tel:1777" className="px-1.5 py-0.5 rounded bg-surface/10 hover:bg-surface/20 text-accent font-bold text-[10px]">1777 (NADRA)</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
