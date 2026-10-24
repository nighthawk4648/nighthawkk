"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import useSWR from "swr";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const DOWNLOAD_COUNT_BASELINE = 39350; // Baseline download count
const fetcher = (url) => fetch(url).then((res) => res.json());

const ExtensionPage = ({ initialData }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const feedbackTimeoutRef = useRef(null);

  const { data: downloadData, mutate: mutateDownloadData } = useSWR(
    API_BASE_URL ? `${API_BASE_URL}/extension-downloads/MyExtension` : null,
    fetcher,
    {
      fallbackData: initialData,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  const totalDownloads =
    DOWNLOAD_COUNT_BASELINE + (downloadData?.data?.count || 0);

  const handleDownload = () => {
    // 1. Immediately increment the counter on screen (optimistic UI update)
    mutateDownloadData(
      (current) => ({
        ...current,
        data: {
          ...(current?.data || {}),
          count: (current?.data?.count || 0) + 1,
        },
      }),
      false
    );

    // 2. Dispatch increment request to backend (keepalive: true)
    if (API_BASE_URL) {
      fetch(`${API_BASE_URL}/extension-downloads/increment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ extensionName: "MyExtension" }),
        keepalive: true,
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((resData) => {
          if (resData?.data?.count != null) {
            mutateDownloadData(
              (current) => ({
                ...current,
                data: {
                  ...(current?.data || {}),
                  count: Math.max(current?.data?.count || 0, resData.data.count),
                },
              }),
              false
            );
          }
        })
        .catch((error) => {
          console.error("Error incrementing click count:", error);
        });
    }

    // 3. Trigger browser file download immediately
    const link = document.createElement("a");
    link.href = "/assets/rbz/sketchshaper-1.5.0.rbz";
    link.download = "sketchshaper-1.5.0.rbz";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 4. Brief visual feedback on button
    setIsDownloading(true);
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = setTimeout(() => {
      setIsDownloading(false);
    }, 1800);
  };

  const scrollToInstall = (e) => {
    e.preventDefault();
    const element = document.getElementById("how-to-install");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const faqs = [
    {
      q: "Which SketchUp versions are compatible?",
      a: "SketchShaper is natively engineered and verified for SketchUp 2022, 2023, 2024, 2025, and 2026 across both Windows (10/11 64-bit) and macOS (including Apple Silicon M1, M2, M3, and M4 chips).",
    },
    {
      q: "How do I install the .rbz extension file in SketchUp?",
      a: "Do not unzip or extract the .rbz file. In SketchUp, go to Extensions > Extension Manager (or Window > Extension Manager in older releases), click 'Install Extension' at the bottom, select 'sketchshaper-1.5.0.rbz', and click Open. The toolbar docks automatically.",
    },
    {
      q: "Are the 3D models and textures free for commercial rendering?",
      a: "Yes. All assets inserted through the SketchShaper extension come with full commercial visualization rights. You can use them in client presentations, architectural competitions, and commercial renders with zero licensing fees or attribution required.",
    },
    {
      q: "Does the extension slow down SketchUp startup time or viewport FPS?",
      a: "Not at all. The extension uses a lightweight Ruby wrapper (<5MB) that streams models and PBR textures on demand from cloud endpoints. It has zero measurable impact on SketchUp viewport frame rates or startup times.",
    },
    {
      q: "Which render engines are supported for materials and models?",
      a: "All SketchUp models and PBR materials work seamlessly with native SketchUp display, V-Ray, Enscape, Lumion, Twinmotion, D5 Render, and Thea Render out of the box.",
    },
    {
      q: "Do I need an account or subscription to download?",
      a: "No registration or subscription is required. SketchShaper is 100% free forever. You can download the .rbz bundle directly and start inserting 3D models immediately without signing in.",
    },
  ];

  return (
    <div className="min-h-screen text-fg w-full px-4 md:px-[0.5in] pt-8 sm:pt-14 pb-20 sm:pb-32 selection:bg-action selection:text-canvas">
      {/* 1. HERO SECTION (Clean Architectural Headline & Generous Breathing Space) */}
      <section className="relative max-w-4xl mx-auto text-center pt-6 sm:pt-12 pb-16 sm:pb-24">
        {/* Subtle Green Glow */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[620px] h-[380px] sm:h-[460px] pointer-events-none -z-10 rounded-full blur-[130px] opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(79, 219, 134, 0.35) 0%, rgba(22, 44, 31, 0.12) 60%, transparent 80%)",
          }}
        />

        {/* Clean Architectural Title (No redundant top badge) */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight-title text-fg font-sans mb-5 sm:mb-6">
          Sketch<span className="text-action">shaper</span> for SketchUp
        </h1>

        {/* Core Value Proposition with Comfortable Spacing */}
        <p className="text-base sm:text-xl text-fg-secondary leading-relaxed sm:leading-loose max-w-2xl mx-auto font-sans mb-9 sm:mb-11">
          Stream thousands of curated 3D models and calibrated PBR textures directly into your active SketchUp drawing coordinates without switching tabs.
        </p>

        {/* Primary Download Button & Quick Install Link */}
        <div className="flex flex-col items-center justify-center gap-3.5 mb-8">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full sm:w-auto px-9 py-4 rounded-full text-base font-semibold bg-action hover:bg-action-hover active:bg-action-pressed text-canvas transition-all duration-200 transform hover:-translate-y-0.5 shadow-xl shadow-action/25 flex items-center justify-center gap-3 cursor-pointer"
          >
            {isDownloading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-canvas"
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
              <>
                <svg
                  className="w-5 h-5 fill-none stroke-current stroke-2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>Download Free Extension (.rbz)</span>
              </>
            )}
          </button>

          <a
            href="#how-to-install"
            onClick={scrollToInstall}
            className="text-xs sm:text-sm text-fg-secondary hover:text-action transition-colors font-mono inline-flex items-center gap-1.5 cursor-pointer mt-1"
          >
            <span>How to install in 60 seconds</span>
            <span>&darr;</span>
          </a>
        </div>

        {/* Minimalist Telemetry Strip (Exact downloads count with no plus sign) */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-mono text-fg-secondary mt-10 sm:mt-12 pt-6 sm:pt-7 border-t border-line/40 max-w-2xl mx-auto">
          <span>
            Version <span className="text-fg font-medium">1.5.0</span>
          </span>
          <span className="text-line-strong hidden sm:inline">&bull;</span>
          <span>
            SketchUp <span className="text-fg font-medium">2022&ndash;2026</span>
          </span>
          <span className="text-line-strong hidden sm:inline">&bull;</span>
          <span>
            <strong className="text-action font-semibold">
              {totalDownloads.toLocaleString()}
            </strong>{" "}
            downloads
          </span>
        </div>
      </section>

      {/* 2. CAD VIEWPORT WORKSTATION DEMO (Spacious, clean architectural separation) */}
      <section className="max-w-6xl mx-auto pt-10 sm:pt-16 lg:pt-20 mb-24 sm:mb-32">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight-h2 text-fg font-sans mb-3 sm:mb-4">
            See SketchShaper in <span className="text-action">Action</span>
          </h2>
          <p className="text-sm sm:text-base text-fg-secondary max-w-xl mx-auto font-sans leading-relaxed">
            Watch how fast assets stream into the 3D workspace and snap straight to active drawing axes.
          </p>
        </div>

        {/* Viewport Frame with CAD Header Bar */}
        <div className="rounded-[20px] border border-line bg-surface shadow-2xl overflow-hidden">
          {/* Top Frame Control Bar */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-surface border-b border-line text-xs font-mono text-fg-secondary">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-fg/70">
                viewport-session.skp &bull; [SketchShaper Toolset]
              </span>
            </div>
          </div>

          {/* Iframe Viewport */}
          <div className="aspect-video w-full bg-canvas relative">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/vo-nsPWgrkg"
              title="SketchShaper Extension Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 3. DESIGNED FOR SPEED & PRECISION (Architectural 3-Pillar Grid with Balanced Rhythms) */}
      <section className="max-w-6xl mx-auto mb-20 sm:mb-28">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight-h2 text-fg font-sans mb-3">
            Designed for <span className="text-action">Speed &amp; Precision</span>
          </h2>
          <p className="text-sm sm:text-base text-fg-secondary max-w-xl mx-auto font-sans leading-relaxed">
            Every feature is calibrated around the daily workflow of architects, interior designers, and 3D visualizers.
          </p>
        </div>

        {/* 3 Balanced Architectural Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 mb-8">
          {/* Card 1: Cloud Library */}
          <div className="bg-surface rounded-card border border-line hover:border-action-tintLine overflow-hidden transition-all duration-300 flex flex-col justify-between group p-6 sm:p-7 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-md bg-action-tintBg border border-action-tintLine text-[10px] font-mono text-action-tintFg">
                  01 / CLOUD LIBRARY
                </span>
                <span className="text-xs font-mono text-fg-secondary">
                  NATIVE .SKP
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-fg font-sans mb-2.5 group-hover:text-action transition-colors">
                Curated 3D Model Cloud
              </h3>
              <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed font-sans mb-6">
                Browse thousands of curated furniture pieces, fixtures, lighting, and landscape elements directly from the extension panel inside SketchUp.
              </p>
            </div>
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-canvas border border-line/60">
              <Image
                src="https://res.cloudinary.com/dn0rgr930/image/upload/v1770007276/v1_wdzv0h.jpg"
                alt="SketchShaper 3D Models Cloud Library"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          </div>

          {/* Card 2: Calibrated PBR Textures */}
          <div className="bg-surface rounded-card border border-line hover:border-action-tintLine overflow-hidden transition-all duration-300 flex flex-col justify-between group p-6 sm:p-7 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-md bg-action-tintBg border border-action-tintLine text-[10px] font-mono text-action-tintFg">
                  02 / PBR MATERIALS
                </span>
                <span className="text-xs font-mono text-fg-secondary">
                  V-RAY &bull; ENSCAPE
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-fg font-sans mb-2.5 group-hover:text-action transition-colors">
                Calibrated PBR Textures
              </h3>
              <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed font-sans mb-6">
                Render-ready architectural materials with pre-configured roughness, displacement, and normal channels for immediate photorealism.
              </p>
            </div>
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-canvas border border-line/60">
              <Image
                src="https://res.cloudinary.com/dn0rgr930/image/upload/v1770007276/v3_lr5lhu.jpg"
                alt="SketchShaper Calibrated PBR Textures"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          </div>

          {/* Card 3: 1-Click Placement */}
          <div className="bg-surface rounded-card border border-line hover:border-action-tintLine overflow-hidden transition-all duration-300 flex flex-col justify-between group p-6 sm:p-7 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-md bg-action-tintBg border border-action-tintLine text-[10px] font-mono text-action-tintFg">
                  03 / DIRECT INSERTION
                </span>
                <span className="text-xs font-mono text-fg-secondary">
                  AXIS SNAPPING
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-fg font-sans mb-2.5 group-hover:text-action transition-colors">
                1-Click Viewport Drop
              </h3>
              <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed font-sans mb-6">
                Insert models directly at your cursor tip or active drawing axes with zero manual importing, file moving, or unzipping.
              </p>
            </div>
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-canvas border border-line/60">
              <Image
                src="https://res.cloudinary.com/dn0rgr930/image/upload/v1770007276/v2_p1o2z1.jpg"
                alt="SketchShaper 1-Click Integration"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </div>

      </section>

      {/* 4. 60-SECOND INSTALLATION PROTOCOL */}
      <section
        id="how-to-install"
        className="max-w-6xl mx-auto mb-20 sm:mb-28 scroll-mt-20"
      >
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight-h2 text-fg font-sans mb-3">
            How to Install in <span className="text-action">SketchUp</span>
          </h2>
          <p className="text-sm sm:text-base text-fg-secondary max-w-xl mx-auto font-sans leading-relaxed">
            Follow these 3 simple steps to integrate SketchShaper into your modeling workspace.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-surface rounded-card border border-line p-7 relative flex flex-col justify-between hover:border-action-tintLine transition-all">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-3xl font-mono font-bold text-action">
                  01
                </span>
                <span className="px-2.5 py-1 rounded-md bg-action-tintBg border border-action-tintLine text-[11px] font-mono text-action-tintFg">
                  DOWNLOAD
                </span>
              </div>
              <h3 className="text-lg font-semibold text-fg font-sans mb-2">
                Download the .rbz bundle
              </h3>
              <p className="text-sm text-fg-secondary leading-relaxed font-sans mb-4">
                Click download to get{" "}
                <code className="text-action-tintFg bg-action-tintBg px-1.5 py-0.5 rounded text-xs font-mono">
                  sketchshaper-1.5.0.rbz
                </code>
                . Do not unzip or extract the file.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownload}
              className="mt-4 text-xs font-mono text-action hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <span>Download file now</span>
              <span>&rarr;</span>
            </button>
          </div>

          {/* Step 2 */}
          <div className="bg-surface rounded-card border border-line p-7 relative flex flex-col justify-between hover:border-action-tintLine transition-all">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-3xl font-mono font-bold text-action">
                  02
                </span>
                <span className="px-2.5 py-1 rounded-md bg-surface-raised border border-line text-[11px] font-mono text-fg-secondary">
                  SKETCHUP MENU
                </span>
              </div>
              <h3 className="text-lg font-semibold text-fg font-sans mb-2">
                Open Extension Manager
              </h3>
              <p className="text-sm text-fg-secondary leading-relaxed font-sans mb-4">
                In SketchUp, open the top menu bar and select:
                <br />
                <span className="text-fg font-mono text-xs block mt-2 p-2 bg-canvas/70 rounded border border-line">
                  Extensions &gt; Extension Manager
                </span>
                <span className="text-xs text-fg-secondary/80 block mt-1">
                  (Or Window &gt; Extension Manager in older releases)
                </span>
              </p>
            </div>
            <div className="text-xs font-mono text-fg-secondary">
              Available in SketchUp 2022&ndash;2026
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-surface rounded-card border border-line p-7 relative flex flex-col justify-between hover:border-action-tintLine transition-all">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-3xl font-mono font-bold text-action">
                  03
                </span>
                <span className="px-2.5 py-1 rounded-md bg-action-tintBg border border-action-tintLine text-[11px] font-mono text-action-tintFg">
                  ACTIVATE
                </span>
              </div>
              <h3 className="text-lg font-semibold text-fg font-sans mb-2">
                Click &ldquo;Install Extension&rdquo;
              </h3>
              <p className="text-sm text-fg-secondary leading-relaxed font-sans mb-4">
                Click the Install button at the bottom of the manager, select your downloaded{" "}
                <span className="text-action font-mono">.rbz</span> file, and accept. The SketchShaper toolbar docks immediately!
              </p>
            </div>
            <div className="text-xs font-mono text-action flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Ready to shape 3D spaces</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ARCHITECTURAL FAQ & SPECS MATRIX (Smooth 300ms transitions & SEO schema aligned) */}
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight-h2 text-fg font-sans mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-fg-secondary max-w-xl mx-auto font-sans leading-relaxed">
            Everything you need to know about compatibility, licensing, and workflow integration.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="bg-surface/85 border border-line rounded-xl overflow-hidden transition-colors duration-200 hover:border-line-strong"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-medium text-fg font-sans">
                    {faq.q}
                  </span>
                  <span
                    className={`w-7 h-7 shrink-0 rounded-full bg-surface-raised border border-line flex items-center justify-center text-action font-mono text-base transition-transform duration-300 ease-out ${
                      isOpen ? "rotate-45 bg-action-tintBg border-action-tintLine" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-sm sm:text-base text-fg-secondary leading-relaxed font-sans border-t border-line/40">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ExtensionPage;
