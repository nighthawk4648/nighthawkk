"use client";

import AdUnit from "./AdUnit";

export default function ResponsiveBannerAd({
  className = "",
  slot = "2114378043",
  adTest = false,
}) {
  return (
    <AdUnit
      slot={slot}
      format="auto"
      fullWidthResponsive={true}
      minHeight="min-h-[250px] sm:min-h-[100px]"
      className={className}
      adTest={adTest}
    />
  );
}
