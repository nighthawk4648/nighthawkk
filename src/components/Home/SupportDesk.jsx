"use client";

import React, { useState, useEffect, useRef } from "react";

const WHATSAPP_NUMBER = "+880 1956274648";
const phoneFormatted = WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
const WHATSAPP_URL = `https://wa.me/${phoneFormatted}`;

export default function SupportDesk() {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ visible: false, message: "", success: true });

  // Interactive emerald lighting layer tracking mouse position with 0.12 lerp physics
  useEffect(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const rest = { x: 85, y: 85 };
    let target = { ...rest };
    let current = { ...rest };
    let rafId = null;

    const animateGlow = () => {
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;

      if (glow) {
        glow.style.left = `${current.x}%`;
        glow.style.top = `${current.y}%`;
      }

      const settled =
        Math.abs(target.x - current.x) < 0.01 &&
        Math.abs(target.y - current.y) < 0.01;

      if (!settled || target !== rest) {
        rafId = requestAnimationFrame(animateGlow);
      } else {
        rafId = null;
      }
    };

    const requestAnimation = () => {
      if (rafId === null) rafId = requestAnimationFrame(animateGlow);
    };

    const handleMouseMove = (event) => {
      const rect = card.getBoundingClientRect();
      target = {
        x: ((event.clientX - rect.left) / rect.width) * 100,
        y: ((event.clientY - rect.top) / rect.height) * 100,
      };
      requestAnimation();
    };

    const handleMouseLeave = () => {
      target = rest;
      requestAnimation();
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    // Initial position
    glow.style.left = `${rest.x}%`;
    glow.style.top = `${rest.y}%`;

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    setIsSubmitting(true);
    setFeedback({ visible: false, message: "", success: true });

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
        "https://api.sketchshaper.com/api";
      const response = await fetch(`${backendUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to deliver message.");
      }

      setFeedback({
        visible: true,
        message: "Request received — the studio desk will follow up shortly.",
        success: true,
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Support request error:", err);
      setFeedback({
        visible: true,
        message: err.message || "Failed to send message. Please reach out via WhatsApp.",
        success: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="support" className="relative w-full px-4 md:px-[0.5in] py-8 sm:py-20 text-fg">
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl sm:rounded-panel border border-white/[0.08] bg-surface/30 backdrop-blur-2xl p-4 sm:p-10 lg:p-14 shadow-2xl shadow-black/40"
      >
        {/* Subtle Specular Sheen & Corner Depth Accents */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-action/[0.02] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-action/[0.06] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-extension/[0.03] rounded-full blur-3xl pointer-events-none" />

        {/* Interactive emerald lighting layer */}
        <div
          ref={glowRef}
          aria-hidden="true"
          className="absolute left-[85%] top-[85%] z-0 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl pointer-events-none will-change-transform"
          style={{
            background:
              "radial-gradient(circle, rgba(79, 219, 134, 0.24) 0%, rgba(79, 219, 134, 0.08) 45%, transparent 70%)",
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] items-center gap-6 sm:gap-10 lg:gap-14">
          {/* Left Column: Context / direct communication */}
          <div className="flex flex-col justify-center">
            <h2 className="max-w-xl text-xl sm:text-3xl lg:text-4xl font-semibold leading-tight tracking-[-0.03em] text-fg font-sans">
              Need help or have a model request?
            </h2>

            <p className="mt-2.5 sm:mt-4 max-w-md text-xs sm:text-base leading-relaxed text-fg-secondary">
              Custom models, dimension scaling, or extension help &mdash; send us the details and we&apos;ll handle it.
            </p>

            {/* Direct WhatsApp Action Card */}
            <div className="mt-5 sm:mt-8 flex items-center justify-between gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-white/10 bg-surface-raised/40 p-3 sm:p-4 backdrop-blur-md sm:max-w-xl shadow-sm">
              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-action-tintBg text-action ring-1 ring-inset ring-action-tintLine">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="truncate text-xs sm:text-sm font-medium text-fg font-sans">
                    Direct WhatsApp Desk
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] sm:text-[11px] text-action">
                    Average reply: &lt; 30 mins
                  </div>
                </div>
              </div>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group shrink-0 rounded-full bg-action px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold text-canvas shadow-sm transition-colors hover:bg-action-hover focus:outline-none focus:ring-2 focus:ring-action/50 active:bg-action-pressed"
                aria-label="Chat with the SketchShaper support desk on WhatsApp"
              >
                Chat now <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>

          {/* Right Column: Commissioning / Request Form */}
          <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-canvas/60 p-4 sm:p-8 shadow-xl backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="support-name"
                    className="mb-1 sm:mb-1.5 block font-mono text-[10px] sm:text-[11px] uppercase tracking-wide text-fg-secondary"
                  >
                    Your Name
                  </label>
                  <input
                    id="support-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Elena Vance"
                    className="w-full rounded-xl border border-white/10 bg-surface-raised/50 hover:border-white/20 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-fg placeholder:text-fg-secondary/50 outline-none transition-colors focus:border-action focus:ring-2 focus:ring-action/10 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="support-email"
                    className="mb-1 sm:mb-1.5 block font-mono text-[10px] sm:text-[11px] uppercase tracking-wide text-fg-secondary"
                  >
                    Email Address
                  </label>
                  <input
                    id="support-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="elena@studio.com"
                    className="w-full rounded-xl border border-white/10 bg-surface-raised/50 hover:border-white/20 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-fg placeholder:text-fg-secondary/50 outline-none transition-colors focus:border-action focus:ring-2 focus:ring-action/10 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="support-message"
                  className="mb-1 sm:mb-1.5 block font-mono text-[10px] sm:text-[11px] uppercase tracking-wide text-fg-secondary"
                >
                  Message or Model Details
                </label>
                <textarea
                  id="support-message"
                  name="message"
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what model you need (furniture name, dimensions, reference link) or how we can help..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-surface-raised/50 hover:border-white/20 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-fg placeholder:text-fg-secondary/50 outline-none transition-colors focus:border-action focus:ring-2 focus:ring-action/10 backdrop-blur-sm"
                />
              </div>

              {feedback.visible && (
                <div
                  className={`p-3 rounded-lg text-xs font-mono border ${
                    feedback.success
                      ? "bg-action-tintBg border-action-tintLine text-action-tintFg"
                      : "bg-red-950/40 border-red-800 text-red-200"
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-white/[0.08] pt-3.5 sm:pt-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-mono text-[10px] sm:text-[11px] text-fg-secondary">
                  Direct studio inbox • No spam
                </span>
                <button
                  id="support-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-action px-5 py-2 sm:px-6 sm:py-2.5 text-xs font-semibold text-canvas shadow-[0_0_30px_-5px_rgba(79,219,134,0.25)] transition-all hover:bg-action-hover focus:outline-none focus:ring-2 focus:ring-action/50 active:bg-action-pressed disabled:cursor-wait disabled:opacity-70 cursor-pointer"
                >
                  <span>{isSubmitting ? "Sending..." : "Send message"}</span>
                  <svg
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h14m-6-6 6 6-6 6"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
