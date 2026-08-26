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
  error?: string;
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
  if (code === 0) return { en: "Clear Sky", urdu: "صاف آسمان" };
  if (code === 1) return { en: "Mainly Clear", urdu: "زیادہ تر صاف" };
  if (code === 2) return { en: "Partly Cloudy", urdu: "جزوی ابر آلود" };
  if (code === 3) return { en: "Overcast", urdu: "مکمل ابر آلود" };
  if (code === 45 || code === 48) return { en: "Foggy / Haze", urdu: "دھند / غبار" };
  if (code >= 51 && code <= 55) return { en: "Light Drizzle", urdu: "ہلکی بوندا باندی" };
  if (code >= 61 && code <= 65) return { en: "Rain Showers", urdu: "بارش" };
  if (code >= 71 && code <= 75) return { en: "Snowfall", urdu: "برف باری" };
  if (code >= 80 && code <= 82) return { en: "Heavy Rain", urdu: "تیز بارش" };
  if (code >= 95) return { en: "Thunderstorm", urdu: "گرج چمک کے ساتھ بارش" };
  return { en: "Fair Weather", urdu: "خوشگوار موسم" };
}

function getIslamicHijriDate(): { en: string; urdu: string } {
  try {
    const today = new Date();
    const formatterEn = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const formatted = formatterEn.format(today);
    const cleanEn = formatted.includes("AH") ? formatted : `${formatted} AH`;
    return {
      en: cleanEn,
      urdu: "صفر ۱۴۴۸ ھ",
    };
  } catch {
    return {
      en: "12 Safar 1448 AH",
      urdu: "صفر ۱۴۴۸ ھ",
    };
  }
}

function getGregorianDate(): { en: string; urdu: string } {
  const today = new Date();
  const en = today.toLocaleDateString("en-PK", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return { en, urdu: "" };
}

export function DailyWeatherBar() {
  const [selectedCity, setSelectedCity] = useState<CityOption>(MAJOR_PAKISTAN_CITIES[0]);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [weather, setWeather] = useState<WeatherState>({
    temp: 31,
    condition: "Clear Sky",
    conditionUrdu: "صاف آسمان",
    humidity: 54,
    windSpeed: 12,
    weatherCode: 0,
    cityName: "Islamabad",
    province: "Federal Capital",
    isAutoLocation: false,
    loading: false,
  });

  const hijri = getIslamicHijriDate();
  const gregorian = getGregorianDate();

  const fetchWeather = useCallback(async (lat: number, lng: number, cityName: string, province?: string, isAuto = false) => {
    setWeather((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia%2FKarachi`
      );
      if (!res.ok) throw new Error("Weather service offline");
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
      setWeather((prev) => ({
        ...prev,
        loading: false,
        cityName,
        province,
      }));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          let closest = MAJOR_PAKISTAN_CITIES[0];
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
          fetchWeather(MAJOR_PAKISTAN_CITIES[0].lat, MAJOR_PAKISTAN_CITIES[0].lng, MAJOR_PAKISTAN_CITIES[0].name, MAJOR_PAKISTAN_CITIES[0].province, false);
        },
        { timeout: 5000 }
      );
    } else {
      fetchWeather(MAJOR_PAKISTAN_CITIES[0].lat, MAJOR_PAKISTAN_CITIES[0].lng, MAJOR_PAKISTAN_CITIES[0].name, MAJOR_PAKISTAN_CITIES[0].province, false);
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
          let closest = MAJOR_PAKISTAN_CITIES[0];
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
    <div className="relative border-b border-border/80 bg-gradient-to-r from-primary/15 via-surface to-primary/10 px-4 py-2.5 shadow-xs">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Location & Live Weather */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Location & City Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCityPicker(!showCityPicker)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-surface px-3 py-1 font-bold text-primary shadow-xs hover:border-primary transition-all"
              title="Click to change city"
            >
              <MapPin className="size-3.5 text-accent shrink-0" />
              <span>{weather.cityName}</span>
              {weather.isAutoLocation && (
                <span className="rounded-full bg-accent/20 px-1.5 py-0.2 text-[9px] font-mono text-warn-fg">
                  GPS
                </span>
              )}
              <ChevronDown className="size-3 text-muted group-hover:text-primary transition-transform" />
            </button>

            {/* City Dropdown Menu */}
            {showCityPicker && (
              <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-border bg-surface p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-border/80 px-3 py-1.5 text-[11px] font-bold text-muted">
                  <span>Major Pakistani Cities</span>
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

          {/* Temperature & Weather Pill */}
          <div className="flex items-center gap-2 rounded-full border border-border/70 bg-surface/90 px-3 py-1 shadow-xs">
            {weather.loading ? (
              <RefreshCw className="size-3.5 animate-spin text-muted" />
            ) : (
              getWeatherIcon(weather.weatherCode, "size-4")
            )}
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-sm font-black text-primary">
                {weather.temp}°C
              </span>
              <span className="hidden sm:inline text-[11px] font-semibold text-fg/80">
                {weather.condition}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2 border-l border-border/60 pl-2 text-[10px] text-muted font-medium">
              <span className="inline-flex items-center gap-0.5">
                <Droplets className="size-3 text-blue-500" /> {weather.humidity}%
              </span>
              <span className="inline-flex items-center gap-0.5">
                <Wind className="size-3 text-cyan-600" /> {weather.windSpeed} km/h
              </span>
            </div>
          </div>
        </div>

        {/* Right: Dual Gregorian & Islamic Hijri Calendar Date */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Gregorian Date */}
          <div className="flex items-center gap-1.5 font-semibold text-fg">
            <Calendar className="size-3.5 text-primary shrink-0" />
            <span>{gregorian.en}</span>
          </div>

          {/* Islamic Hijri Date */}
          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-bold text-warn-fg">
            <Moon className="size-3 text-accent shrink-0" />
            <span className="text-[11px]">{hijri.en}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
