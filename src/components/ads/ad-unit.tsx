import { useEffect, useRef } from "react";

export type AdFormat =
  | "leaderboard" // 728x90 or responsive top banner
  | "rectangle" // 300x250 medium rectangle
  | "skyscraper" // 300x600 half-page vertical unit
  | "in_feed" // Fluid native card unit
  | "in_article" // Full-width in-content reading unit
  | "footer_banner"; // 970x90 or responsive bottom anchor unit

interface AdUnitProps {
  format?: AdFormat;
  adSlotId?: string;
  className?: string;
  label?: string;
}

const ADSENSE_CLIENT_ID = "ca-pub-9428710482914820";

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export function AdUnit({
  format = "leaderboard",
  adSlotId = "1234567890",
  className = "",
  label = "Sponsored / Advertisement",
}: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // Ignore push errors in SPA navigation
    }
  }, [format]);

  // Size styling maps
  const sizeMap: Record<AdFormat, string> = {
    leaderboard: "min-h-[90px] w-full max-w-4xl mx-auto",
    rectangle: "min-h-[250px] w-full max-w-[320px] mx-auto",
    skyscraper: "min-h-[500px] w-full max-w-[320px] mx-auto",
    in_feed: "min-h-[120px] w-full",
    in_article: "min-h-[140px] w-full my-6",
    footer_banner: "min-h-[90px] w-full max-w-5xl mx-auto",
  };

  return (
    <div
      ref={adRef}
      className={`relative my-6 overflow-hidden rounded-2xl border border-dashed border-border/80 bg-surface/60 p-3 sm:p-4 text-center select-none backdrop-blur-xs transition-all ${sizeMap[format]} ${className}`}
    >
      {/* Top Header Tag */}
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted/70 mb-2 border-b border-border/40 pb-1">
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-accent animate-pulse" />
          {label}
        </span>
        <span className="font-mono text-[9px] text-muted/60">Google AdSense Space</span>
      </div>

      {/* Google AdSense ins tag */}
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={adSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />

      {/* High-Converting Polished Placeholder */}
      <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-border/50 p-4 min-h-[70px]">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-primary/80">
          <span className="rounded-md bg-accent/20 px-2 py-0.5 text-[10px] font-black uppercase text-primary">
            AD
          </span>
          <span className="font-display tracking-wide">
            {format === "leaderboard" && "Leaderboard Display (728 × 90)"}
            {format === "rectangle" && "Medium Rectangle (300 × 250)"}
            {format === "skyscraper" && "Half Page Skyscraper (300 × 600)"}
            {format === "in_feed" && "Native In-Feed Sponsored Stream"}
            {format === "in_article" && "In-Article Content Display Slot"}
            {format === "footer_banner" && "Sitewide Anchor Banner (970 × 90)"}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted">
          High-yield monetization slot ready for Google AdSense &amp; Programmatic Ads
        </p>
      </div>
    </div>
  );
}
