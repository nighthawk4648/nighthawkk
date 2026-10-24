"use client";

import React from "react";
import AdUnit from "@/components/Shared/GoogleAdsense/AdUnit";
import { usePatreonAuth } from "@/contexts/PatreonAuthContext";

/**
 * Normal-scroll vertical skyscraper ads placed in the outer margin/gutter space.
 * Appears only on wide screens (>=1800px) where gutters naturally exist on 1080p+ displays.
 * Supports multiple sequential units (e.g. top, mid, bottom) as the user scrolls.
 */
export default function BlogGutterAd({
  slot = "2445550536",
  className = "",
  position = "right",
  count = 2,
}) {
  const { user, isAuthenticated, loading } = usePatreonAuth();
  const isPatron = isAuthenticated && !!user?.is_active_patron;

  // Ad-free experience for Patreon supporters
  if (!loading && isPatron) {
    return null;
  }

  const items = Array.from({ length: Math.max(1, count) }, (_, i) => i);

  return (
    <aside
      className={`hidden min-[1800px]:flex flex-col gap-[450px] w-[160px] shrink-0 pt-8 z-10 ${className}`}
      aria-label={`${position} advertisement gutter`}
    >
      {items.map((index) => (
        <div key={`${position}-ad-${index}`} className="flex flex-col w-full">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="font-mono text-[9px] uppercase tracking-wider text-fg-secondary/50 font-medium">
              Advertisement
            </span>
          </div>

          <AdUnit
            slot={slot}
            format="auto"
            fullWidthResponsive={true}
            minHeight="min-h-[600px]"
            className="p-1"
          />
        </div>
      ))}
    </aside>
  );
}
