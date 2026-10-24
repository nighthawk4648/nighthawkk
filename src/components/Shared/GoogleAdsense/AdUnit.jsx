"use client";

import { useEffect, useRef, useState } from "react";
import { usePatreonAuth } from "@/contexts/PatreonAuthContext";

/**
 * Consolidated Google AdSense Unit
 * Handles client mounting, Patreon ad-free bypass with loading guard,
 * AdSense script pushes, and clean glass framing.
 */
export default function AdUnit({
  slot,
  format = "auto",
  layoutKey = null,
  fullWidthResponsive = false,
  minHeight = "min-h-[90px]",
  className = "",
  adTest = false,
  bare = false,
}) {
  const adRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, loading } = usePatreonAuth();

  const isPatron = isAuthenticated && !!user?.is_active_patron;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe push to adsbygoogle: guards against unmounted, loading auth, patron bypass,
  // and elements with 0 width (prevents TagError: No slot size for availableWidth=0)
  useEffect(() => {
    if (!mounted || loading || isPatron) return;

    const el = adRef.current;
    if (!el || typeof window === "undefined") return;

    const tryPush = () => {
      if (!el) return false;
      // Do not push if element is hidden or width is 0 (e.g. hidden lg:block or hidden min-[1800px]:flex)
      const containerWidth = el.offsetWidth || el.parentElement?.offsetWidth || 0;
      if (containerWidth === 0) {
        return false;
      }

      if (!el.hasAttribute("data-adsbygoogle-status")) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          return true;
        } catch (err) {
          console.error(`AdSense push error (slot ${slot}):`, err);
          return true;
        }
      }
      return true;
    };

    // If visible right now, push immediately
    if (tryPush()) return;

    // Otherwise, observe until container becomes visible (e.g. screen widens or drawer opens)
    if (typeof ResizeObserver !== "undefined") {
      const target = el.parentElement || el;
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0) {
            if (tryPush()) {
              observer.disconnect();
              break;
            }
          }
        }
      });
      observer.observe(target);
      return () => observer.disconnect();
    }
  }, [mounted, loading, isPatron, slot]);

  // While mounting or while patron status is verifying, or if user is an active patron, render nothing
  if (!mounted || loading || isPatron) {
    return null;
  }

  if (bare) {
    return (
      <div className={`relative z-10 w-full flex items-center justify-center ${className}`}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client="ca-pub-5557791257949251"
          data-ad-slot={slot}
          data-ad-format={format}
          {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
          {...(fullWidthResponsive ? { "data-full-width-responsive": "true" } : { "data-full-width-responsive": "false" })}
          {...(adTest ? { "data-adtest": "on" } : {})}
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-panel bg-surface/30 backdrop-blur-2xl border border-white/[0.08] shadow-xl relative w-full flex flex-col justify-center ${minHeight} ${className}`}
    >
      {/* Specular sheen gradient (pointer-events-none, never obscures ad) */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none rounded-panel" />

      {/* Ad Creative Container (No overflow-hidden to prevent clipping) */}
      <div className="relative z-10 w-full flex items-center justify-center py-1">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client="ca-pub-5557791257949251"
          data-ad-slot={slot}
          data-ad-format={format}
          {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
          {...(fullWidthResponsive ? { "data-full-width-responsive": "true" } : { "data-full-width-responsive": "false" })}
          {...(adTest ? { "data-adtest": "on" } : {})}
        />
      </div>
    </div>
  );
}
