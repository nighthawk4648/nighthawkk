"use client";

import React, { useState } from "react";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const BASELINE_DOWNLOADS = 39350;

export default function ExtensionBanner({ initialDownloads = 0 }) {
  const [downloadCount, setDownloadCount] = useState(
    BASELINE_DOWNLOADS + (Number(initialDownloads) || 0),
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handleDownload = () => {
    // 1. Optimistic increment
    setDownloadCount((prev) => prev + 1);
    setIsDownloading(true);

    // 2. Increment backend counter
    if (API_BASE_URL) {
      fetch(`${API_BASE_URL}/extension-downloads/increment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extensionName: "MyExtension" }),
        keepalive: true,
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.data?.count != null) {
            setDownloadCount(BASELINE_DOWNLOADS + data.data.count);
          }
        })
        .catch((err) => console.error("Extension counter error:", err));
    }

    // 3. Trigger file download of .rbz
    const link = document.createElement("a");
    link.href = "/assets/rbz/sketchshaper-1.5.0.rbz";
    link.download = "sketchshaper-1.5.0.rbz";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 4. Reset download animation state
    setTimeout(() => {
      setIsDownloading(false);
    }, 2000);
  };

  return (
    <>
      <section
        id="extension"
        className="py-16 sm:py-20 px-4 md:px-[0.5in] w-full text-fg"
      >
        <div className="bg-surface/30 backdrop-blur-2xl rounded-panel border border-white/[0.08] p-8 sm:p-12 shadow-2xl shadow-black/40 overflow-hidden relative">
          {/* Subtle Specular Sheen & Glass Refraction */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-action/[0.02] pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-action/[0.06] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-action/[0.04] rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-[1.618fr_1fr] gap-10 lg:gap-14 items-center relative z-10">
            {/* Left Major Column: Extension Demo Frame */}
            <div className="aspect-[16/9] w-full rounded-[20px] overflow-hidden border border-white/10 bg-canvas/80 relative group shadow-inner backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
                alt="SketchUp Extension in-app interface viewport"
                className="w-full h-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-canvas/40 flex items-center justify-center pointer-events-none">
                <button
                  type="button"
                  onClick={() => setIsVideoOpen(true)}
                  aria-label="Watch extension demo video"
                  className="w-16 h-16 rounded-full glass-panel flex items-center justify-center border border-action/40 text-action hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-lg pointer-events-auto"
                >
                  <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Minor Column: Copy & Green Accent CTA */}
            <div className="flex flex-col items-start">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight-h2 text-fg mb-3 font-sans">
                Use the library inside SketchUp.
              </h2>

              <p className="text-fg-secondary text-sm sm:text-base leading-relaxed mb-6 font-sans">
                Browse and insert SketchShaper models without leaving SketchUp.
                Free extension. Free assets.
              </p>

              {/* Metadata Chips */}
              <div className="flex flex-wrap gap-2 mb-8 font-mono">
                <span className="glass-panel px-3 py-1 rounded-full text-xs text-fg-secondary border border-white/10">
                  v1.5.0
                </span>
                <span className="glass-panel px-3 py-1 rounded-full text-xs text-fg-secondary border border-white/10">
                  SketchUp 2022 &ndash; 2026
                </span>
                <span className="glass-panel px-3 py-1 rounded-full text-xs text-action border border-action-tintLine bg-action-tintBg/80">
                  {downloadCount.toLocaleString()}+ downloads
                </span>
              </div>

              {/* Green Solid Action Button */}
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="px-6 py-3 rounded-full text-sm font-semibold bg-action hover:bg-action-hover active:bg-action-pressed text-canvas transition-all shadow-lg shadow-action/10 font-sans cursor-pointer flex items-center gap-2"
                >
                  {isDownloading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-canvas"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Downloading .rbz...</span>
                    </>
                  ) : (
                    <span>Download extension</span>
                  )}
                </button>
                <Link
                  href="/extension"
                  className="text-sm font-medium text-fg-secondary hover:text-fg transition-colors font-sans"
                >
                  How to install &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Preview Modal */}
      {isVideoOpen && (
        <div
          onClick={() => setIsVideoOpen(false)}
          className="fixed inset-0 z-50 bg-canvas/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl glass-panel rounded-panel border border-line-strong p-4 shadow-2xl relative"
          >
            <div className="flex justify-between items-center mb-3 px-2">
              <span className="text-sm font-semibold text-fg">
                SketchShaper Extension Preview
              </span>
              <button
                type="button"
                onClick={() => setIsVideoOpen(false)}
                className="text-fg-secondary hover:text-fg font-mono text-xs px-2 py-1 rounded bg-surface hover:bg-surface-raised border border-line"
              >
                Close (ESC)
              </button>
            </div>
            <div className="aspect-video w-full rounded-card overflow-hidden bg-canvas">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/vo-nsPWgrkg?autoplay=1"
                title="SketchShaper Extension Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

