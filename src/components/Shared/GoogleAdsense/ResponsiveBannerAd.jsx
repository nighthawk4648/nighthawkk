"use client";

import AdUnit from "./AdUnit";

// On phones a full-width ad grows as tall as the screen is wide and pushes the page down.
// fixedOnPhone (top-of-page banners) gives phones a fixed 300x250 ad in a box of the same
// height: 250 + 8px padding + 2px border.
const PHONE_SIZE = { width: 300, height: 250 };

export default function ResponsiveBannerAd({
  className = "",
  slot = "2114378043",
  adTest = false,
  fixedOnPhone = false,
}) {
  return (
    <AdUnit
      slot={slot}
      format="auto"
      fullWidthResponsive={true}
      phoneSize={fixedOnPhone ? PHONE_SIZE : null}
      minHeight={fixedOnPhone ? "min-h-[260px] sm:min-h-[100px]" : "min-h-[250px] sm:min-h-[100px]"}
      className={className}
      adTest={adTest}
    />
  );
}
