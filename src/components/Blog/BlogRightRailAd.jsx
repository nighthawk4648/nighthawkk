"use client";

import React from "react";
import AdUnit from "@/components/Shared/GoogleAdsense/AdUnit";
import { useAuth } from "@/contexts/AuthContext";

export default function BlogRightRailAd({
  slot = "2445550536",
  className = "",
}) {
  const { user, loading } = useAuth();
  const isPatron = !!user?.isPro;

  // Ad-free experience for Patreon supporters
  if (!loading && isPatron) {
    return null;
  }

  return (
    <aside
      className={`hidden xl:flex flex-col w-[240px] 2xl:w-[300px] shrink-0 sticky top-24 z-10 ${className}`}
      aria-label="Advertisement rail"
    >
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
    </aside>
  );
}
