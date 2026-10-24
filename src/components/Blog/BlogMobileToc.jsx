"use client";

import React, { useState } from "react";
import { FiList, FiChevronDown } from "react-icons/fi";

export default function BlogMobileToc({ tocItems = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!tocItems || tocItems.length === 0) {
    return null;
  }

  const handleScrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <div className="xl:hidden my-6 rounded-card bg-surface/30 backdrop-blur-2xl border border-white/[0.08] shadow-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-white/[0.02]"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <FiList className="w-4 h-4 text-action" />
          <span className="font-mono text-xs uppercase tracking-wider text-fg font-medium">
            Table of Contents
          </span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-action-tintBg text-action border border-action-tintLine">
            {tocItems.length}
          </span>
        </div>
        <FiChevronDown
          className={`w-4 h-4 text-fg-secondary transition-transform duration-200 ${
            isOpen ? "rotate-180 text-action" : ""
          }`}
        />
      </button>

      {isOpen && (
        <nav
          aria-label="Mobile table of contents"
          className="border-t border-white/[0.08] p-3 space-y-1 max-h-[50vh] overflow-y-auto scrollbar-thin"
        >
          {tocItems.map((item) => {
            const isSub = item.level === "h3" || item.level === "h4";

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleScrollToHeading(item.id)}
                className={`w-full text-left py-1.5 px-2 rounded text-xs transition-colors block truncate ${
                  isSub
                    ? "pl-5 text-fg-secondary/70 hover:text-fg text-[11px]"
                    : "text-fg/90 font-medium hover:text-action"
                }`}
                title={item.text}
              >
                <span className="truncate block">{item.text}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

