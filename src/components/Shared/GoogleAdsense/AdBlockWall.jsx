"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";
import { useAuth } from "@/contexts/AuthContext";
import { PATREON_JOIN_URL, patreonStartUrl } from "@/utils/authApi";
import { isAdFree } from "@/utils/membership";
import {
  adBlockReason,
  adBoxState,
  BOX_TIMEOUT_MS,
  GOOGLE_AD_VARS,
  isPlainSiteLink,
  rememberWall,
  sawWall,
  shouldShowWall,
} from "@/utils/adBlock";
import { loadAdScript } from "./AdUnit";

const enabled = process.env.NEXT_PUBLIC_ADBLOCK_WALL !== "off";
const adsOn = process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_ENABLE_ADSENSE === "true";

// Inline, so cosmetic filters have no class or id to aim at; re-applied if someone edits it
const WALL_STYLE =
  "position:fixed;inset:0;z-index:60;outline:none;display:flex;align-items:center;justify-content:center;overflow-y:auto;padding:16px;background:rgba(0,0,0,0.75);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);";

// Full-page wall for visitors who block ads: turn the blocker off and refresh, or go ad-free on Patreon.
// shortcut: runs in the browser only, so a visitor who blocks this site's own scripts gets past it; lock downloads if that becomes common.
export default function AdBlockWall() {
  const { user, loading, openAuth } = useAuth();
  const pathname = usePathname();
  const [reason, setReason] = useState(null);
  const [host, setHost] = useState(null);
  const wallRef = useRef(null);
  const reportedRef = useRef(false);

  const adFree = isAdFree(user); // paying members (PRO or an ad-free tier) never see ads or the wall

  // 1. Once per page load (never for PRO): load the real ad script, then check Google's own code ran.
  // uBlock in Firefox swaps the script for a stand-in that "loads" fine, so a load check alone misses it.
  useEffect(() => {
    if (!enabled || !adsOn || loading || adFree || reason) return;
    let alive = true;
    const timer = setTimeout(async () => {
      let status = await loadAdScript();
      if (status === "error") {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // a network blip gets a second try
        status = await loadAdScript();
      }
      const siteReachable =
        status === "loaded" || (await fetch("/robots.txt", { cache: "no-store" }).then(() => true, () => false));
      if (!alive) return;
      setReason(
        adBlockReason({
          scriptLoaded: status === "loaded",
          googleReady: GOOGLE_AD_VARS.some((name) => name in window),
          siteReachable,
        })
      );
    }, 1500);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [loading, adFree, reason]);

  // 2. On every page, page changes included: watch our own ad boxes (Google's extra boxes are not in .ad-slot).
  // Catches a blocker switched back on mid-visit: Google's code is still loaded, but its new ad requests never get an answer.
  useEffect(() => {
    if (!enabled || !adsOn || loading || adFree || reason) return;
    let waitingSince = new Map();
    const timer = setInterval(() => {
      // background tabs load slowly, so only time spent on screen counts
      if (document.visibilityState !== "visible") {
        waitingSince.clear();
        return;
      }
      const now = Date.now();
      const stillWaiting = new Map();
      for (const box of document.querySelectorAll(".ad-slot ins.adsbygoogle")) {
        const state = adBoxState({
          adStatus: box.getAttribute("data-ad-status"),
          frameSrc: box.querySelector("iframe")?.getAttribute("src"),
        });
        if (state === "fake") {
          setReason("fake");
          return;
        }
        if (state !== "waiting") continue;
        const since = waitingSince.get(box) ?? now;
        if (now - since >= BOX_TIMEOUT_MS) {
          setReason("no-answer");
          return;
        }
        stillWaiting.set(box, since);
      }
      waitingSince = stillWaiting;
    }, 3000);
    return () => clearInterval(timer);
  }, [loading, adFree, reason]);

  const show = shouldShowWall({
    enabled,
    adsOn,
    loading,
    user,
    pathname,
    userAgent: typeof navigator === "undefined" ? "" : navigator.userAgent,
    blocked: !!reason,
  });

  // 3. The wall lives in its own box on <body>, so it can be put back if someone deletes it
  useEffect(() => {
    if (!show) return;
    const box = document.createElement("div");
    document.body.appendChild(box);
    setHost(box);
    return () => {
      box.remove();
      setHost(null);
    };
  }, [show]);

  // 4. Lock scrolling, and undo deletions or style edits made in DevTools (before paint, so it never shows unstyled)
  useLayoutEffect(() => {
    const wall = wallRef.current;
    if (!host || !wall) return;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    wall.style.cssText = WALL_STYLE;
    const wallStyle = wall.style.cssText;
    const guard = () => {
      if (!host.isConnected) body.appendChild(host);
      if (!wall.isConnected) host.appendChild(wall);
      if (wall.style.cssText !== wallStyle) wall.style.cssText = WALL_STYLE;
      if (body.style.overflow !== "hidden") body.style.overflow = "hidden";
    };
    guard();
    wall.focus();
    const observer = new MutationObserver(guard);
    observer.observe(body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "hidden"] });
    return () => {
      observer.disconnect();
      body.style.overflow = previousOverflow;
    };
  }, [host]);

  // 5. When the wall first shows: remember this visitor in the browser (see 6) and count it
  // (GA is often blocked too, so the count is low)
  useEffect(() => {
    if (!show || reportedRef.current) return;
    reportedRef.current = true;
    rememberWall();
    sendGAEvent("event", "adblock_wall_shown", { reason });
  }, [show, reason]);

  // 6. Visitors who have seen the wall get a real page load on link clicks, so check 1 runs on every page and
  // catches a blocker switched back on mid-visit. Everyone else keeps Next.js's instant page switching.
  useEffect(() => {
    if (!enabled || !adsOn || adFree || !sawWall()) return;
    const onClick = (e) => {
      const link = e.target.closest?.("a[href]");
      const plain =
        link &&
        isPlainSiteLink({
          button: e.button,
          modified: e.metaKey || e.ctrlKey || e.shiftKey || e.altKey,
          target: link.target,
          download: link.hasAttribute("download"),
          href: link.getAttribute("href"),
          pageUrl: window.location.href,
        });
      if (!plain) return;
      e.preventDefault();
      e.stopPropagation(); // Next.js must not also switch the page in place
      window.location.assign(link.href);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [adFree]);

  if (!show || !host) return null;

  return createPortal(
    <div ref={wallRef} role="dialog" aria-modal="true" aria-labelledby="adblock-wall-title" tabIndex={-1}>
      <div className="relative my-auto w-full max-w-md rounded-[28px] border border-line bg-surface/95 p-6 text-fg shadow-2xl backdrop-blur-2xl sm:p-10">
        <h2 id="adblock-wall-title" className="text-xl font-semibold sm:text-2xl">
          Please turn off your ad blocker
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fg-secondary">
          Sketch shaper stays free because of ads. Turn off your ad blocker (or your browser&apos;s ad shield) for this
          site, then refresh the page. Want no ads at all? Become a member on Patreon.
        </p>
        <div className="mt-6 flex flex-col space-y-2.5">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full cursor-pointer rounded-full bg-action px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-canvas shadow-lg transition-all hover:bg-action-hover"
          >
            I turned it off, refresh
          </button>
          <a
            href={PATREON_JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-full bg-[#FF424D] px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#E63A42]"
          >
            Go ad-free with Patreon
          </a>
          {user ? (
            <a href={patreonStartUrl(pathname)} className="py-1 text-center font-mono text-xs text-action hover:underline">
              Already a patron? Connect your Patreon
            </a>
          ) : (
            <button
              type="button"
              onClick={() => openAuth("login")}
              className="cursor-pointer py-1 text-center font-mono text-xs text-action hover:underline"
            >
              Already a member? Sign in
            </button>
          )}
        </div>
      </div>
    </div>,
    host
  );
}
