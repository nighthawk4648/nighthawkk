"use client";

import AdUnit from "./AdUnit";

export default function InFeedAd({
  className = "",
  slot = "7956325644",
  layoutKey = "-6t+ed+2i-1n-4w",
  adTest = false,
}) {
  return (
    <AdUnit
      slot={slot}
      format="fluid"
      layoutKey={layoutKey}
      minHeight="min-h-[250px]"
      className={className}
      adTest={adTest}
    />
  );
}
