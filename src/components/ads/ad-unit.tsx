export type AdFormat =
  | "leaderboard"
  | "rectangle"
  | "skyscraper"
  | "in_feed"
  | "in_article"
  | "footer_banner";

interface AdUnitProps {
  format?: AdFormat;
  adSlotId?: string;
  className?: string;
  label?: string;
}

/**
 * Google Auto-Ads in <head> handles 100% dynamic placements without empty spaces.
 * AdUnit renders null so zero frontend placeholder whitespace is left on the page.
 */
export function AdUnit(_props: AdUnitProps) {
  return null;
}
