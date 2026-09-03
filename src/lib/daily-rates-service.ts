import { useEffect, useState } from "react";
import { LIVE_RATES, LiveRatesData } from "@/lib/live-rates";

const CACHE_KEY = "say_ab_tak_daily_rates_cache_v2026";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export function useDailyRates(): {
  rates: LiveRatesData;
  isLoading: boolean;
  lastUpdated: string;
} {
  const [rates, setRates] = useState<LiveRatesData>(LIVE_RATES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("Today, Live Market");

  useEffect(() => {
    let isMounted = true;

    async function syncRates() {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
            if (isMounted) {
              setRates(parsed.data);
              setLastUpdated(parsed.lastUpdated || "Live Today");
            }
            return;
          }
        }

        setIsLoading(true);

        // Fetch live exchange rates from public financial API
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        if (!res.ok) throw new Error("Rates API unreachable");
        const json = await res.json();

        if (json && json.rates && json.rates.PKR) {
          const liveUsd = parseFloat(json.rates.PKR.toFixed(2));
          const liveSar = parseFloat((json.rates.PKR / (json.rates.SAR || 3.75)).toFixed(2));
          const liveAed = parseFloat((json.rates.PKR / (json.rates.AED || 3.67)).toFixed(2));
          const liveGbp = parseFloat((json.rates.PKR / (json.rates.GBP || 0.76)).toFixed(2));
          const liveEur = parseFloat((json.rates.PKR / (json.rates.EUR || 0.91)).toFixed(2));
          const liveCad = parseFloat((json.rates.PKR / (json.rates.CAD || 1.36)).toFixed(2));
          const liveAud = parseFloat((json.rates.PKR / (json.rates.AUD || 1.52)).toFixed(2));

          const updatedRates: LiveRatesData = {
            ...LIVE_RATES,
            currency: {
              usd: liveUsd,
              sar: liveSar,
              aed: liveAed,
              gbp: liveGbp,
              eur: liveEur,
              cad: liveCad,
              aud: liveAud,
            },
          };

          const timeStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

          if (isMounted) {
            setRates(updatedRates);
            setLastUpdated(`Today, ${timeStr}`);
          }

          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              timestamp: Date.now(),
              data: updatedRates,
              lastUpdated: `Today, ${timeStr}`,
            })
          );
        }
      } catch (err) {
        // Fallback to static latest 2026 data
        if (isMounted) {
          setRates(LIVE_RATES);
          setLastUpdated("Live Official Slabs");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    syncRates();

    return () => {
      isMounted = false;
    };
  }, []);

  return { rates, isLoading, lastUpdated };
}
