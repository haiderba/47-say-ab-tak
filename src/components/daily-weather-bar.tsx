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
  PhoneCall,
} from "lucide-react";

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

interface WeatherState {
  temp: number;
  condition: string;
  conditionUrdu: string;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  cityName: string;
  province?: string;
  isAutoLocation: boolean;
  loading: boolean;
}

function getWeatherIcon(code: number, className = "size-5") {
  if (code === 0 || code === 1) return <Sun className={`${className} text-amber-500 animate-spin-slow`} />;
  if (code === 2 || code === 3) return <Cloud className={`${className} text-slate-400`} />;
  if (code >= 45 && code <= 48) return <CloudFog className={`${className} text-slate-400`} />;
  if (code >= 51 && code <= 67) return <CloudRain className={`${className} text-blue-500`} />;
  if (code >= 71 && code <= 77) return <Snowflake className={`${className} text-cyan-400`} />;
  if (code >= 80 && code <= 82) return <CloudRain className={`${className} text-blue-600`} />;
  if (code >= 95) return <CloudLightning className={`${className} text-amber-400`} />;
  return <Sun className={`${className} text-amber-500`} />;
}

function decodeWmoCode(code: number): { en: string; urdu: string } {
  if (code === 0) return { en: "Sunny", urdu: "صاف دھوپ" };
  if (code === 1) return { en: "Mainly Clear", urdu: "زیادہ تر صاف" };
  if (code === 2) return { en: "Partly Cloudy", urdu: "جزوی ابر آلود" };
  if (code === 3) return { en: "Overcast", urdu: "مکمل ابر آلود" };
  if (code === 45 || code === 48) return { en: "Foggy / Haze", urdu: "دھند / غبار" };
  if (code >= 51 && code <= 55) return { en: "Light Drizzle", urdu: "ہلکی بوندا باندی" };
  if (code >= 61 && code <= 65) return { en: "Rain", urdu: "بارش" };
  if (code >= 71 && code <= 75) return { en: "Snowfall", urdu: "برف باری" };
  if (code >= 80 && code <= 82) return { en: "Heavy Rain", urdu: "تیز بارش" };
  if (code >= 95) return { en: "Thunderstorm", urdu: "گرج چمک" };
  return { en: "Sunny", urdu: "صاف دھوپ" };
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
    return formatted.includes("AH") ? formatted : `${formatted} AH`;
  } catch {
    return "13 Rabiʻ I 1448 AH";
  }
}

function getGregorianDate(): string {
  const today = new Date();
  return today.toLocaleDateString("en-PK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function DailyWeatherBar() {
  const [selectedCity, setSelectedCity] = useState<CityOption>(MAJOR_PAKISTAN_CITIES[1]); // Default Lahore
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [weather, setWeather] = useState<WeatherState>({
    temp: 32,
    condition: "Sunny",
    conditionUrdu: "صاف دھوپ",
    humidity: 48,
    windSpeed: 10,
    weatherCode: 0,
    cityName: "Lahore",
    province: "Punjab",
    isAutoLocation: false,
    loading: false,
  });

  const hijriDate = getIslamicHijriDate();
  const gregorianDate = getGregorianDate();

  const fetchWeather = useCallback(async (lat: number, lng: number, cityName: string, province?: string, isAuto = false) => {
    setWeather((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia%2FKarachi`
      );
      if (!res.ok) throw new Error("Weather offline");
      const data = await res.json();
      const current = data.current;
      const wmo = decodeWmoCode(current.weather_code);

      setWeather({
        temp: Math.round(current.temperature_2m),
        condition: wmo.en,
        conditionUrdu: wmo.urdu,
        humidity: Math.round(current.relative_humidity_2m),
        windSpeed: Math.round(current.wind_speed_10m),
        weatherCode: current.weather_code,
        cityName,
        province,
        isAutoLocation: isAuto,
        loading: false,
      });
    } catch {
      setWeather((prev) => ({ ...prev, loading: false, cityName, province }));
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
          fetchWeather(lat, lng, closest.name, closest.province, true);
        },
        () => {
          fetchWeather(MAJOR_PAKISTAN_CITIES[1].lat, MAJOR_PAKISTAN_CITIES[1].lng, MAJOR_PAKISTAN_CITIES[1].name, MAJOR_PAKISTAN_CITIES[1].province, false);
        },
        { timeout: 5000 }
      );
    } else {
      fetchWeather(MAJOR_PAKISTAN_CITIES[1].lat, MAJOR_PAKISTAN_CITIES[1].lng, MAJOR_PAKISTAN_CITIES[1].name, MAJOR_PAKISTAN_CITIES[1].province, false);
    }
  }, [fetchWeather]);

  const handleCitySelect = (city: CityOption) => {
    setSelectedCity(city);
    setShowCityPicker(false);
    fetchWeather(city.lat, city.lng, city.name, city.province, false);
  };

  const handleDetectLocation = () => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      setWeather((prev) => ({ ...prev, loading: true }));
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
          fetchWeather(lat, lng, closest.name, closest.province, true);
        },
        () => {
          fetchWeather(selectedCity.lat, selectedCity.lng, selectedCity.name, selectedCity.province, false);
        }
      );
    }
  };

  return (
    <div className="border-b border-border/80 bg-surface px-4 py-3 shadow-2xs">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* 1. Left: Weather Column */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCityPicker(!showCityPicker)}
              className="flex items-center gap-2 text-left group"
            >
              <div className="grid size-9 place-items-center rounded-xl bg-amber-500/10 text-amber-500 shadow-2xs">
                {weather.loading ? (
                  <RefreshCw className="size-4.5 animate-spin text-muted" />
                ) : (
                  getWeatherIcon(weather.weatherCode, "size-5")
                )}
              </div>
              <div>
                <div className="flex items-center gap-1 font-display text-sm font-bold text-primary group-hover:text-primary-light transition-colors">
                  <span>{weather.cityName} {weather.temp}°C</span>
                  <ChevronDown className="size-3 text-muted" />
                </div>
                <div className="text-[11px] text-muted font-medium">{weather.condition}</div>
              </div>
            </button>

            {/* City Dropdown Menu */}
            {showCityPicker && (
              <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-border bg-surface p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-border/80 px-3 py-1.5 text-[11px] font-bold text-muted">
                  <span>Select City</span>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <Compass className="size-3" /> Auto Detect
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto py-1 space-y-0.5">
                  {MAJOR_PAKISTAN_CITIES.map((city) => (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() => handleCitySelect(city)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left text-xs transition-colors ${
                        selectedCity.name === city.name
                          ? "bg-primary text-surface font-bold"
                          : "text-fg hover:bg-bg"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{city.name}</span>
                        <span className="text-[10px] opacity-70">{city.province}</span>
                      </div>
                      <span className="font-serif text-sm opacity-90">{city.nameUrdu}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. Center: Today's Date (Gregorian + Hijri) */}
        <div className="text-center md:border-x md:border-border/70 md:px-6 shrink-0 space-y-0.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted">Today's date</div>
          <div className="font-semibold text-xs sm:text-sm text-fg">
            <span>{gregorianDate}</span>
            <span className="mx-1.5 text-muted">•</span>
            <span className="text-primary font-bold">{hijriDate}</span>
          </div>
        </div>

        {/* 3. Right: Live Daily Ticker */}
        <div className="flex items-center gap-3 overflow-x-auto text-xs shrink-0 max-w-full">
          <div className="text-right hidden xl:block">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted">Live daily ticker</div>
            <div className="font-bold text-xs text-primary">
              Petrol Rs 268.50, Gold 24K Rs 284,500, USD PKR 278.45
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-400">
              <Fuel className="size-3" />
              <span>Petrol 268.50</span>
            </div>
            <div className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              <DollarSign className="size-3" />
              <span>USD 278.45</span>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-2 py-1 text-[11px] font-bold text-yellow-700 dark:text-yellow-400">
              <Coins className="size-3" />
              <span>Gold 284.5k</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
