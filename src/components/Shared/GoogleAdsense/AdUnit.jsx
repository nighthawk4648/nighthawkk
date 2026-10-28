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
  minHeight = "min-h-[250px] sm:min-h-[90px]",
  className = "",
  adTest = false,
  bare = false,
}) {
  const containerRef = useRef(null);
  const adRef = useRef(null);
  const pushedRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { user, isAuthenticated, loading } = usePatreonAuth();

  const isPatron = isAuthenticated && !!user?.is_active_patron;

  // Google AdSense requirement: fluid native ads require at least 250px available width
  const minRequiredWidth = format === "fluid" ? 250 : 50;

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Observe container visibility: only render <ins> into DOM when container width >= minRequiredWidth
  // (strictly prevents TagError: No slot size for availableWidth=0 & Fluid responsive ads must be at least 250px wide)
  useEffect(() => {
    if (!mounted || loading || isPatron) return;

    const el = containerRef.current;
    if (!el || typeof window === "undefined") return;

    const checkVisibility = () => {
      if (!el || !document.body.contains(el)) return false;
      const rect = el.getBoundingClientRect();
      if (rect.width < minRequiredWidth) return false;

      const style = window.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") return false;

      return true;
    };

    if (checkVisibility()) {
      setIsVisible(true);
      return;
    }

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width >= minRequiredWidth) {
            setIsVisible(true);
            observer.disconnect();
            break;
          }
        }
      });
      observer.observe(el);
      return () => observer.disconnect();
    }
  }, [mounted, loading, isPatron, minRequiredWidth]);

  // 2. Safe push to adsbygoogle: execute only AFTER browser completes layout and paint pass
  useEffect(() => {
    if (!isVisible || pushedRef.current) return;

    const ins = adRef.current;
    if (!ins || typeof window === "undefined") return;

    let raf2 = null;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const insEl = adRef.current;
        if (!insEl || pushedRef.current || !document.body.contains(insEl)) return;

        const width = insEl.offsetWidth || insEl.parentElement?.offsetWidth || insEl.getBoundingClientRect().width;
        if (width >= minRequiredWidth && !insEl.hasAttribute("data-adsbygoogle-status")) {
          try {
            pushedRef.current = true;
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (err) {
            console.error(`AdSense push error (slot ${slot}):`, err);
          }
        }
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [isVisible, slot, minRequiredWidth]);

  // While mounting or while patron status is verifying, or if user is an active patron, render nothing
  if (!mounted || loading || isPatron) {
    return null;
  }

  if (bare) {
    return (
      <div
        ref={containerRef}
        className={`relative z-10 w-full block text-center ${className}`}
      >
        {isVisible && (
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{
              display: "block",
              width: "100%",
              minWidth: format === "fluid" ? "250px" : undefined,
            }}
            data-ad-client="ca-pub-5557791257949251"
            data-ad-slot={slot}
            data-ad-format={format}
            {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
            {...(fullWidthResponsive ? { "data-full-width-responsive": "true" } : { "data-full-width-responsive": "false" })}
            {...(adTest ? { "data-adtest": "on" } : {})}
          />
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`rounded-panel bg-surface/30 backdrop-blur-2xl border border-white/[0.08] shadow-xl relative w-full block ${minHeight} ${className}`}
    >
      {/* Specular sheen gradient (pointer-events-none, never obscures ad) */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none rounded-panel" />

      {/* Ad Creative Container (Block flow with guaranteed 100% width and min-w-[250px]) */}
      <div
        className="relative z-10 w-full block py-1 text-center"
        style={{ minWidth: format === "fluid" ? "250px" : undefined }}
      >
        {isVisible && (
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{
              display: "block",
              width: "100%",
              minWidth: format === "fluid" ? "250px" : undefined,
            }}
            data-ad-client="ca-pub-5557791257949251"
            data-ad-slot={slot}
            data-ad-format={format}
            {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
            {...(fullWidthResponsive ? { "data-full-width-responsive": "true" } : { "data-full-width-responsive": "false" })}
            {...(adTest ? { "data-adtest": "on" } : {})}
          />
        )}
      </div>
    </div>
  );
}
