"use client";

import AdUnit from "./AdUnit";

/**
 * In-Grid Ad Card for Catalog & Asset Lists
 * Matches the responsive grid cell proportions and rounded-xl card styling.
 * Uses format="rectangle" to strictly prevent tall vertical skyscrapers from blowing out row height.
 * Full 100% card height dedicated to the ad unit without headers or footers eating vertical space.
 */
export default function CatalogGridAd({ className = "", adTest = false }) {
  return (
    <article
      className={`h-full min-h-[260px] sm:min-h-[280px] max-h-[305px] flex items-center justify-center bg-surface/30 hover:bg-surface/50 border border-white/[0.08] hover:border-white/20 rounded-xl overflow-hidden transition-all duration-300 shadow-md relative ${className}`}
    >
      <AdUnit
        slot="5146613914"
        format="rectangle"
        fullWidthResponsive={false}
        bare={true}
        className="w-full h-full flex items-center justify-center p-1"
        adTest={adTest}
      />
    </article>
  );
}

