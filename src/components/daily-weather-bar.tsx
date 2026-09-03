import {
  Cloud,
  Droplets,
  Eye,
  MapPin,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
  Coins,
  DollarSign,
  Fuel,
  TrendingUp,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/language-context";
import { useDailyRates } from "@/lib/daily-rates-service";

interface CityWeather {
  name: string;
  nameUrdu: string;
  temp: number;
  condition: string;
  conditionUrdu: string;
  humidity: number;
  aqi: number;
  prayer: string;
  prayerUrdu: string;
  nextPrayer: string;
  nextPrayerTime: string;
}

const CITIES: CityWeather[] = [
  {
    name: "Islamabad",
    nameUrdu: "اسلام آباد",
    temp: 24,
    condition: "Sunny",
    conditionUrdu: "صاف موسم",
    humidity: 48,
    aqi: 65,
    prayer: "Dhuhr 12:15 PM",
    prayerUrdu: "ظہر 12:15",
    nextPrayer: "Asr",
    nextPrayerTime: "3:45 PM",
  },
  {
    name: "Lahore",
    nameUrdu: "لاہور",
    temp: 28,
    condition: "Hazy Sun",
    conditionUrdu: "ہلکی دھند",
    humidity: 55,
    aqi: 145,
    prayer: "Dhuhr 12:08 PM",
    prayerUrdu: "ظہر 12:08",
    nextPrayer: "Asr",
    nextPrayerTime: "3:38 PM",
  },
  {
    name: "Karachi",
    nameUrdu: "کراچی",
    temp: 31,
    condition: "Humid",
    conditionUrdu: "مرطوب",
    humidity: 72,
    aqi: 95,
    prayer: "Dhuhr 12:28 PM",
    prayerUrdu: "ظہر 12:28",
    nextPrayer: "Asr",
    nextPrayerTime: "3:52 PM",
  },
  {
    name: "Peshawar",
    nameUrdu: "پشاور",
    temp: 26,
    condition: "Clear",
    conditionUrdu: "صاف مطلع",
    humidity: 42,
    aqi: 110,
    prayer: "Dhuhr 12:20 PM",
    prayerUrdu: "ظہر 12:20",
    nextPrayer: "Asr",
    nextPrayerTime: "3:50 PM",
  },
  {
    name: "Quetta",
    nameUrdu: "کوئٹہ",
    temp: 18,
    condition: "Breezy",
    conditionUrdu: "ٹھنڈی ہوا",
    humidity: 28,
    aqi: 45,
    prayer: "Dhuhr 12:35 PM",
    prayerUrdu: "ظہر 12:35",
    nextPrayer: "Asr",
    nextPrayerTime: "4:02 PM",
  },
];

export function DailyWeatherBar() {
  const [cityIndex, setCityIndex] = useState(0);
  const { language, t } = useLanguage();
  const { rates } = useDailyRates();

  useEffect(() => {
    const timer = setInterval(() => {
      setCityIndex((prev) => (prev + 1) % CITIES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const city = CITIES[cityIndex];

  return (
    <div className="border-b border-border bg-primary text-surface">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs">
        {/* City Weather & Prayer Quick Glance */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 font-bold">
            <MapPin className="size-3.5 text-accent shrink-0" />
            <span className="text-surface font-black">
              {language === "ur" ? city.nameUrdu : city.name}
            </span>
            <span className="font-mono text-accent font-black">{city.temp}°C</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 border-l border-emerald-800 pl-3 text-[11px] text-surface/85">
            <span className="truncate">{language === "ur" ? city.conditionUrdu : city.condition}</span>
            <span className="hidden md:inline text-surface/60">•</span>
            <span className="hidden md:inline">AQI: <strong className={city.aqi > 100 ? "text-amber-300" : "text-emerald-300"}>{city.aqi}</strong></span>
            <span className="hidden lg:inline text-surface/60">•</span>
            <span className="hidden lg:inline">{language === "ur" ? city.prayerUrdu : city.prayer}</span>
          </div>
        </div>

        {/* Live Economic Indices Marquee Ticker */}
        <div className="flex-1 overflow-hidden ml-4 pl-4 border-l border-emerald-800/80">
          <div className="flex items-center gap-6 text-xs whitespace-nowrap animate-marquee">
            {/* Set 1 */}
            <div className="flex items-center gap-6 shrink-0">
              {/* Gold 24K */}
              <div className="inline-flex items-center gap-1.5 font-bold">
                <Coins className="size-3.5 text-yellow-400" />
                <span className="text-accent">Gold 24K:</span>
                <span className="text-surface font-black">Rs {rates.gold.k24Tola.toLocaleString()}</span>
                <span className="text-[10px] text-surface/75">/tola</span>
              </div>

              {/* PSX KSE-100 */}
              <div className="inline-flex items-center gap-1.5 font-bold">
                <TrendingUp className="size-3.5 text-emerald-400" />
                <span className="text-accent">PSX KSE-100:</span>
                <span className="text-surface font-black">{rates.psx.kse100.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-300 font-mono">(+{rates.psx.change} / +{rates.psx.changePct}%)</span>
              </div>

              {/* Petrol */}
              <div className="inline-flex items-center gap-1 font-bold">
                <Fuel className="size-3 text-amber-400" />
                <span>Petrol:</span>
                <span className="text-accent font-black">Rs {rates.fuel.petrol.toFixed(2)}</span>
                <span className="text-[10px] text-surface/75">/L</span>
              </div>

              {/* Diesel */}
              <div className="inline-flex items-center gap-1 font-bold">
                <Fuel className="size-3 text-amber-300" />
                <span>Diesel:</span>
                <span className="text-surface font-black">Rs {rates.fuel.diesel.toFixed(2)}</span>
                <span className="text-[10px] text-surface/75">/L</span>
              </div>

              {/* USD */}
              <div className="inline-flex items-center gap-1 font-bold">
                <DollarSign className="size-3 text-emerald-400" />
                <span>USD/PKR:</span>
                <span className="text-surface font-black">Rs {rates.currency.usd.toFixed(2)}</span>
              </div>

              {/* SAR */}
              <div className="inline-flex items-center gap-1 font-bold">
                <span>🇸🇦 SAR/PKR:</span>
                <span className="text-surface font-black">Rs {rates.currency.sar.toFixed(2)}</span>
              </div>

              {/* AED */}
              <div className="inline-flex items-center gap-1 font-bold">
                <span>🇦🇪 AED/PKR:</span>
                <span className="text-surface font-black">Rs {rates.currency.aed.toFixed(2)}</span>
              </div>

              {/* GBP */}
              <div className="inline-flex items-center gap-1 font-bold">
                <span>🇬🇧 GBP/PKR:</span>
                <span className="text-surface font-black">Rs {rates.currency.gbp.toFixed(2)}</span>
              </div>

              {/* 24/7 Helplines */}
              <div className="inline-flex items-center gap-2 border-l border-emerald-800 pl-3">
                <span className="text-[11px] text-surface/80 font-bold">24/7 Helplines:</span>
                <a href="tel:15" className="px-1.5 py-0.5 rounded bg-surface/10 hover:bg-surface/20 text-accent font-bold text-[10px]">15 (Police)</a>
                <a href="tel:1122" className="px-1.5 py-0.5 rounded bg-surface/10 hover:bg-surface/20 text-accent font-bold text-[10px]">1122 (Rescue)</a>
                <a href="tel:1777" className="px-1.5 py-0.5 rounded bg-surface/10 hover:bg-surface/20 text-accent font-bold text-[10px]">1777 (NADRA)</a>
              </div>
            </div>

            {/* Set 2 (Duplicate for Seamless Infinite Marquee Loop) */}
            <div className="flex items-center gap-6 shrink-0" aria-hidden="true">
              {/* Gold 24K */}
              <div className="inline-flex items-center gap-1.5 font-bold">
                <Coins className="size-3.5 text-yellow-400" />
                <span className="text-accent">Gold 24K:</span>
                <span className="text-surface font-black">Rs {rates.gold.k24Tola.toLocaleString()}</span>
                <span className="text-[10px] text-surface/75">/tola</span>
              </div>

              {/* PSX KSE-100 */}
              <div className="inline-flex items-center gap-1.5 font-bold">
                <TrendingUp className="size-3.5 text-emerald-400" />
                <span className="text-accent">PSX KSE-100:</span>
                <span className="text-surface font-black">{rates.psx.kse100.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-300 font-mono">(+{rates.psx.change} / +{rates.psx.changePct}%)</span>
              </div>

              {/* Petrol */}
              <div className="inline-flex items-center gap-1 font-bold">
                <Fuel className="size-3 text-amber-400" />
                <span>Petrol:</span>
                <span className="text-accent font-black">Rs {rates.fuel.petrol.toFixed(2)}</span>
                <span className="text-[10px] text-surface/75">/L</span>
              </div>

              {/* Diesel */}
              <div className="inline-flex items-center gap-1 font-bold">
                <Fuel className="size-3 text-amber-300" />
                <span>Diesel:</span>
                <span className="text-surface font-black">Rs {rates.fuel.diesel.toFixed(2)}</span>
                <span className="text-[10px] text-surface/75">/L</span>
              </div>

              {/* USD */}
              <div className="inline-flex items-center gap-1 font-bold">
                <DollarSign className="size-3 text-emerald-400" />
                <span>USD/PKR:</span>
                <span className="text-surface font-black">Rs {rates.currency.usd.toFixed(2)}</span>
              </div>

              {/* SAR */}
              <div className="inline-flex items-center gap-1 font-bold">
                <span>🇸🇦 SAR/PKR:</span>
                <span className="text-surface font-black">Rs {rates.currency.sar.toFixed(2)}</span>
              </div>

              {/* AED */}
              <div className="inline-flex items-center gap-1 font-bold">
                <span>🇦🇪 AED/PKR:</span>
                <span className="text-surface font-black">Rs {rates.currency.aed.toFixed(2)}</span>
              </div>

              {/* GBP */}
              <div className="inline-flex items-center gap-1 font-bold">
                <span>🇬🇧 GBP/PKR:</span>
                <span className="text-surface font-black">Rs {rates.currency.gbp.toFixed(2)}</span>
              </div>

              {/* 24/7 Helplines */}
              <div className="inline-flex items-center gap-2 border-l border-emerald-800 pl-3">
                <span className="text-[11px] text-surface/80 font-bold">24/7 Helplines:</span>
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
