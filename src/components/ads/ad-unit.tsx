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

const ADSENSE_CLIENT_ID = "ca-pub-6963163931040692";

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export function AdUnit({
  format = "leaderboard",
  adSlotId = "1234567890",
  className = "",
}: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // Handled silently
    }
  }, [format]);

  // Clean slot-aware responsive container classes
  const sizeMap: Record<AdFormat, string> = {
    leaderboard: "w-full max-w-4xl mx-auto my-4 text-center overflow-hidden",
    rectangle: "w-full max-w-[336px] mx-auto my-4 text-center overflow-hidden",
    skyscraper: "w-full max-w-[336px] mx-auto my-4 text-center overflow-hidden",
    in_feed: "w-full my-4 text-center overflow-hidden",
    in_article: "w-full my-6 text-center overflow-hidden",
    footer_banner: "w-full max-w-5xl mx-auto my-4 text-center overflow-hidden",
  };

  return (
    <div ref={adRef} className={`adsense-container ${sizeMap[format]} ${className}`}>
      {/* Official Clean Google AdSense Placement Tag (No visual placeholders) */}
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={adSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
