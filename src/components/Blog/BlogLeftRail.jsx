"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiList,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { FaXTwitter, FaLinkedinIn } from "react-icons/fa6";

export default function BlogLeftRail({
  tocItems: initialTocItems = [],
  title = "",
  url = "",
}) {
  const [tocItems, setTocItems] = useState(initialTocItems);
  const [activeId, setActiveId] = useState("");
  const [copied, setCopied] = useState(false);

  // Sync initialTocItems if passed or updated
  useEffect(() => {
    if (initialTocItems && initialTocItems.length > 0) {
      setTocItems(initialTocItems);
      return;
    }

    // Client-side fallback if headings were rendered dynamically
    const timer = setTimeout(() => {
      const headings = document.querySelectorAll(
        ".blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4"
      );
      if (!headings || headings.length === 0) return;

      const extracted = [];
      const seenIds = new Set();

      headings.forEach((heading, idx) => {
        let id = heading.id;
        const text = heading.textContent?.trim() || "";
        if (!text) return;

        if (!id) {
          let baseId =
            text
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "") || `heading-${idx}`;
          id = baseId;
          let counter = 1;
          while (seenIds.has(id)) {
            id = `${baseId}-${counter++}`;
          }
          heading.id = id;
        }
        seenIds.add(id);

        extracted.push({
          id,
          text,
          level: heading.tagName.toLowerCase(),
        });
      });

      if (extracted.length > 0) {
        setTocItems(extracted);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [initialTocItems]);

  // Robust viewport-relative scroll spy using getBoundingClientRect
  useEffect(() => {
    if (!tocItems || tocItems.length === 0) return;

    const handleScroll = () => {
      const headingElements = tocItems
        .map((item) => document.getElementById(item.id))
        .filter(Boolean);

      if (headingElements.length === 0) return;

      const threshold = 140; // Pixels from viewport top
      let currentActiveId = headingElements[0].id;

      for (let i = 0; i < headingElements.length; i++) {
        const el = headingElements[i];
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold) {
          currentActiveId = el.id;
        } else {
          break;
        }
      }

      // If reached the bottom of page, highlight the last heading
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 60
      ) {
        currentActiveId = headingElements[headingElements.length - 1].id;
      }

      setActiveId(currentActiveId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocItems]);

  const handleScrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);

      if (typeof window !== "undefined" && window.history?.pushState) {
        window.history.pushState(null, "", `#${id}`);
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      const shareUrl =
        url || (typeof window !== "undefined" ? window.location.href : "");
      if (shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const shareUrl = encodeURIComponent(
    url || (typeof window !== "undefined" ? window.location.href : "")
  );
  const shareTitle = encodeURIComponent(
    title || "Check out this architectural article on SketchShaper"
  );

  return (
    <aside className="hidden xl:flex flex-col w-[240px] 2xl:w-[280px] shrink-0 sticky top-24 z-10 space-y-4">
      {/* Back Navigation Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-xs font-mono text-fg-secondary hover:text-action transition-colors duration-200 group py-1"
      >
        <FiArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
        <span>All Articles</span>
      </Link>

      {/* Table of Contents Card */}
      {tocItems && tocItems.length > 0 ? (
        <div className="rounded-card bg-surface/30 backdrop-blur-2xl border border-white/[0.08] p-4 shadow-xl relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <FiList className="w-3.5 h-3.5 text-action" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-fg font-medium">
                Contents
              </span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-action-tintBg text-action border border-action-tintLine">
              {tocItems.length}
            </span>
          </div>

          {/* Links List */}
          <nav
            aria-label="Table of contents"
            className="relative z-10 max-h-[calc(100vh-320px)] overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-white/10"
          >
            {tocItems.map((item) => {
              const isActive = activeId === item.id;
              const isSub = item.level === "h3" || item.level === "h4";

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleScrollToHeading(item.id)}
                  className={`w-full text-left transition-all duration-200 block truncate rounded py-1 px-2 ${
                    isSub ? "pl-4 text-[11px]" : "text-xs font-medium"
                  } ${
                    isActive
                      ? "text-action bg-action-tintBg border-l-2 border-action font-semibold shadow-sm"
                      : "text-fg-secondary hover:text-fg hover:bg-white/[0.03]"
                  }`}
                  title={item.text}
                >
                  <span className="truncate block">{item.text}</span>
                </button>
              );
            })}
          </nav>
        </div>
      ) : null}

      {/* Social Sharing Card */}
      <div className="rounded-card bg-surface/30 backdrop-blur-2xl border border-white/[0.08] p-3.5 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
          <p className="font-mono text-[9px] uppercase tracking-wider text-fg-secondary/60 mb-2.5 font-medium">
            Share Guide
          </p>
          <div className="flex items-center gap-1.5">
            {/* Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy article link"
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-mono transition-all duration-200 border ${
                copied
                  ? "bg-action-tintBg text-action border-action-tintLine"
                  : "bg-surface-raised/40 hover:bg-surface-raised text-fg border-white/[0.08] hover:border-white/20"
              }`}
            >
              {copied ? (
                <>
                  <FiCheck className="w-3.5 h-3.5 text-action" />
                  <span className="text-[10px]">Copied</span>
                </>
              ) : (
                <>
                  <FiCopy className="w-3.5 h-3.5 text-fg-secondary" />
                  <span className="text-[10px]">Copy</span>
                </>
              )}
            </button>

            {/* X / Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on X"
              className="w-8 h-8 rounded-lg bg-surface-raised/40 hover:bg-surface-raised text-fg-secondary hover:text-fg border border-white/[0.08] hover:border-white/20 flex items-center justify-center transition-colors"
            >
              <FaXTwitter className="w-3.5 h-3.5" />
            </a>

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on LinkedIn"
              className="w-8 h-8 rounded-lg bg-surface-raised/40 hover:bg-surface-raised text-fg-secondary hover:text-fg border border-white/[0.08] hover:border-white/20 flex items-center justify-center transition-colors"
            >
              <FaLinkedinIn className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
