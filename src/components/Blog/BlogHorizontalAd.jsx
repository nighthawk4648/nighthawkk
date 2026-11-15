"use client";

import React from "react";
import AdUnit from "@/components/Shared/GoogleAdsense/AdUnit";
import { useAuth } from "@/contexts/AuthContext";

export default function BlogHorizontalAd({
  slot = "2114378043",
  className = "",
  minHeight = "min-h-[250px] sm:min-h-[120px]",
  fallback = null,
}) {
  const { user, loading } = useAuth();
  const isPatron = !!user?.isPro;

  // Ad-free experience for Patreon supporters (renders fallback or null)
  if (!loading && isPatron) {
    return fallback;
  }

  return (
    <div className={`my-8 w-full ${className}`} aria-label="Horizontal advertisement">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="font-mono text-[9px] uppercase tracking-wider text-fg-secondary/50 font-medium">
          Advertisement
        </span>
      </div>

      <AdUnit
        slot={slot}
        format="auto"
        fullWidthResponsive={true}
        minHeight={minHeight}
        className="p-2"
      />
    </div>
  );
}
