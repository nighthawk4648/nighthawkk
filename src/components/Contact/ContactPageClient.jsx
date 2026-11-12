"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FiGrid,
  FiHome,
  FiBox,
  FiLayers,
  FiCpu,
  FiMessageSquare,
  FiUploadCloud,
  FiX,
  FiPaperclip,
  FiArrowRight,
  FiPhone,
  FiMail,
  FiUser,
  FiCheck,
  FiExternalLink,
  FiChevronDown,
} from "react-icons/fi";

const WHATSAPP_NUMBER = "+880 1956274648";
const phoneFormatted = WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
const WHATSAPP_URL = `https://wa.me/${phoneFormatted}`;
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB limit

const REQUEST_OPTIONS = [
  {
    id: "architecture",
    title: "Architectural Project",
    icon: FiHome,
    colSpan: "col-span-1",
  },
  {
    id: "single-model",
    title: "3D Model",
    icon: FiBox,
    colSpan: "col-span-1",
  },
  {
    id: "textures",
    title: "Textures & Materials",
    icon: FiLayers,
    colSpan: "col-span-1",
  },
  {
    id: "extension",
    title: "Plugin / Extension",
    icon: FiCpu,
    colSpan: "col-span-1",
  },
  {
    id: "support",
    title: "General Support & Inquiries",
    icon: FiMessageSquare,
    colSpan: "col-span-2",
  },
];

const SCOPE_OPTIONS_BY_TYPE = {
  architecture: [
    "Full Interior Design & 3D Render",
    "Full Exterior Architecture & Landscaping",
    "3D Floor Plan & Layout Visualization",
    "Other Architectural Scope",
  ],
  "single-model": [
    "Single Furniture Piece / Fixture",
    "Complete Furniture / Room Set",
    "Custom Decorative / Parametric Asset",
    "Other 3D Model Scope",
  ],
  textures: [
    "Seamless PBR Material Pack",
    "V-Ray / Corona Shader Setup",
    "Material Pack / Surface Catalog",
    "Other Material Need",
  ],
  extension: [
    "Custom SketchUp Ruby Extension",
    "Asset Importer / Exporter Utility",
    "Other Custom Development",
  ],
  support: [
    "Report Broken Download / File Issue",
    "Licensing & Commercial Use Inquiry",
    "Account / Access Assistance",
    "Partnership or General Question",
    "Other Support Request",
  ],
};

const RECENT_PROJECTS = [
  {
    type: "architecture",
    scope: "Full Interior Design & 3D Render",
    category: "Full Interior Scene",
    title: "Nordic Minimalist Living & Dining Room",
    specs: "Complete room scene • Native SketchUp (.skp) • Enscape / V-Ray ready",
    tag: "Interior Design",
    gradient: "from-emerald-950/40 via-surface/80 to-surface/40",
    borderAccent: "group-hover:border-action/40",
  },
  {
    type: "architecture",
    scope: "Full Exterior Architecture & Landscaping",
    category: "Full Exterior Architecture",
    title: "Modern Concrete & Glass Residential Villa",
    specs: "Facade, glazing & landscape • Real millimeter scale • 3D modeling",
    tag: "Exterior Architecture",
    gradient: "from-slate-900/60 via-surface/80 to-surface/40",
    borderAccent: "group-hover:border-action/40",
  },
  {
    type: "single-model",
    scope: "Single Furniture Piece / Fixture",
    category: "Bespoke 3D Furniture",
    title: "Sculptural Curved Lounge Armchair",
    specs: "Clean quad topology • 4K PBR textures • .SKP + .OBJ formats",
    tag: "Custom Model",
    gradient: "from-zinc-900/60 via-surface/80 to-surface/40",
    borderAccent: "group-hover:border-action/40",
  },
];

export default function ContactPageClient() {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Form State: defaults to architecture so form is displayed right away in the 65% column
  const [selectedType, setSelectedType] = useState("architecture");
  const [serviceScope, setServiceScope] = useState("");
  const [customScope, setCustomScope] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Close custom glass dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Close custom glass dropdown on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsDropdownOpen(false);
    };
    if (isDropdownOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  // Interactive emerald lighting layer tracking mouse position with 0.12 lerp physics (matching SupportDesk)
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

  // File Upload State (Max 50MB)
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ visible: false, success: true, message: "" });

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (selectedFile.size / (1024 * 1024)).toFixed(1);
      setFileError(`File is too large (${sizeMb} MB). Maximum allowed size is 50 MB.`);
      return;
    }

    setFileError(null);
    setFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  };

  const removeFile = () => {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(null);
    setFilePreview(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const selectProjectFromShowcase = (typeId, defaultScope) => {
    setSelectedType(typeId);
    if (defaultScope) setServiceScope(defaultScope);
    setCustomScope("");
    setIsDropdownOpen(false);
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const activeOption = REQUEST_OPTIONS.find((o) => o.id === selectedType);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setFeedback({
        visible: true,
        success: false,
        message: "Please fill in all required fields (Name, Email, and Message/Brief).",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ visible: false, success: true, message: "" });

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
        "https://api.sketchshaper.com/api";

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      if (phone.trim()) formData.append("phone", phone.trim());
      formData.append("service_type", selectedType);
      if (serviceScope.trim()) formData.append("service_scope", serviceScope.trim());
      if (customScope.trim()) formData.append("custom_scope", customScope.trim());
      if (referenceUrl.trim()) formData.append("reference_url", referenceUrl.trim());
      formData.append("message", message.trim());
      if (honeypot.trim()) formData.append("website", honeypot.trim());
      if (file) formData.append("attachment", file);

      const response = await fetch(`${backendUrl}/contact`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error("File is too large. Maximum allowed size is 50 MB.");
        }
        if (response.status === 429) {
          throw new Error(
            "Too many submissions. Please try again in a few minutes or contact us on WhatsApp.",
          );
        }
        throw new Error(result?.message || "Failed to submit request.");
      }

      setFeedback({
        visible: true,
        success: true,
        message:
          selectedType === "support"
            ? "Your message has been received. Our support desk will get back to you shortly."
            : "Project brief received. The Sketch shaper studio team will review your requirements and follow up shortly.",
      });

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setServiceScope("");
      setCustomScope("");
      setMessage("");
      setReferenceUrl("");
      setHoneypot("");
      removeFile();
    } catch (err) {
      console.error("Contact submission error:", err);
      setFeedback({
        visible: true,
        success: false,
        message:
          err.message ||
          "Failed to send your request. Please try again or reach out directly via WhatsApp.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full text-fg selection:bg-action selection:text-canvas">
      <div className="w-full px-4 md:px-[0.5in] py-8 sm:py-12">
        {/* Simple Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-fg-secondary">
          <Link href="/" className="hover:text-action transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-fg">Contact Studio</span>
        </nav>

        {/* ========================================================================= */}
        {/* SPLIT LAYOUT: LEFT SIDE (32%) - GAP (3%) - RIGHT SIDE (65%)              */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[32%_65%] gap-8 lg:gap-[3%] items-start">
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT SIDE (32%): Header, WhatsApp, and 2-Column Options Grid            */}
          {/* ----------------------------------------------------------------------- */}
          <div className="flex flex-col space-y-6">
            <div className="pb-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.03em] text-fg font-sans">
                Get in Touch with Sketch shaper
              </h1>
            </div>

            {/* Direct WhatsApp Action Bar */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-surface-raised/40 hover:border-action/40 p-3 text-xs text-fg transition-all cursor-pointer backdrop-blur-sm shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-action-tintBg text-action shrink-0">
                  <FiPhone className="h-4 w-4" />
                </div>
                <div className="text-left font-mono text-[11px]">
                  <div className="font-semibold text-fg text-[13px]">Direct WhatsApp Desk</div>
                  <span className="text-action text-[10px]">Instant chat with studio</span>
                </div>
              </div>
              <FiExternalLink className="h-3.5 w-3.5 text-fg-secondary/50 shrink-0" />
            </a>

            {/* The 5 Option Buttons in 2-Column Grid */}
            <div className="pt-1">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-fg-secondary mb-3">
                Select Request Type:
              </label>

              <div className="grid grid-cols-2 gap-2">
                {REQUEST_OPTIONS.map((opt) => {
                  const isSelected = selectedType === opt.id;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedType(opt.id);
                        setServiceScope("");
                        setCustomScope("");
                        setIsDropdownOpen(false);
                      }}
                      className={`group relative p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        opt.colSpan
                      } ${
                        isSelected
                          ? "border-action bg-action-tintBg/50 text-fg ring-1 ring-action/50 shadow-sm"
                          : "border-white/[0.08] bg-surface/30 hover:border-white/20 text-fg-secondary hover:text-fg hover:bg-surface-raised/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2 w-full">
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                            isSelected
                              ? "border-action/40 bg-action-tintBg text-action"
                              : "border-white/10 bg-surface-raised text-fg-secondary group-hover:text-action group-hover:border-action/30"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>

                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                            isSelected
                              ? "border-action bg-action text-canvas"
                              : "border-white/20 bg-surface/50 group-hover:border-white/40"
                          }`}
                        >
                          {isSelected && <FiCheck className="h-2.5 w-2.5 stroke-[3]" />}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <h3
                          className={`text-sm font-semibold truncate ${
                            isSelected ? "text-action" : "text-fg group-hover:text-action"
                          }`}
                        >
                          {opt.title}
                        </h3>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT SIDE (65%): Form Fill-Up Card                                     */}
          {/* ----------------------------------------------------------------------- */}
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-2xl sm:rounded-panel border border-white/[0.08] bg-surface/30 backdrop-blur-2xl p-5 sm:p-8 lg:p-10 shadow-2xl shadow-black/40"
          >
            {/* Subtle Specular Sheen & Corner Depth Accents (matching SupportDesk) */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-action/[0.02] pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-action/[0.06] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-extension/[0.03] rounded-full blur-3xl pointer-events-none" />

            {/* Interactive emerald lighting layer tracking mouse position with 0.12 lerp physics */}
            <div
              ref={glowRef}
              aria-hidden="true"
              className="absolute left-[85%] top-[85%] z-0 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl pointer-events-none will-change-transform"
              style={{
                background:
                  "radial-gradient(circle, rgba(79, 219, 134, 0.24) 0%, rgba(79, 219, 134, 0.08) 45%, transparent 70%)",
              }}
            />

            {/* Form Top Active Indicator Bar */}
            <div className="relative z-10 mb-6 pb-4 border-b border-white/[0.08] flex items-center gap-3">
              <span className="text-sm sm:text-base font-semibold text-fg">
                {activeOption?.title}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 space-y-6 sm:space-y-7" noValidate>
              {/* Honeypot field for bot protection (off-screen, not display:none, so simple bots still fill it) */}
              <div
                aria-hidden="true"
                className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
              >
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* 1. Client Contact Details */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-semibold tracking-wide text-fg font-sans">
                  Your Contact Information
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      id="client-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name *"
                      className="w-full rounded-xl border border-white/10 bg-surface-raised/50 hover:border-white/20 pl-8 pr-3 py-2.5 text-xs sm:text-sm text-fg placeholder:text-fg-secondary/50 outline-none transition-colors focus:border-action focus:ring-1 focus:ring-action/20"
                    />
                    <FiUser className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fg-secondary/50 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <input
                      id="client-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address *"
                      className="w-full rounded-xl border border-white/10 bg-surface-raised/50 hover:border-white/20 pl-8 pr-3 py-2.5 text-xs sm:text-sm text-fg placeholder:text-fg-secondary/50 outline-none transition-colors focus:border-action focus:ring-1 focus:ring-action/20"
                    />
                    <FiMail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fg-secondary/50 pointer-events-none" />
                  </div>
                </div>

                {/* Optional WhatsApp / Phone */}
                <div className="relative">
                  <input
                    id="client-phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="WhatsApp or Phone Number (Optional — for quick messaging)"
                    className="w-full rounded-xl border border-white/10 bg-surface-raised/40 hover:border-white/20 pl-8 pr-3 py-2 text-xs text-fg placeholder:text-fg-secondary/50 outline-none transition-colors focus:border-action focus:ring-1 focus:ring-action/20"
                  />
                  <FiPhone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fg-secondary/40 pointer-events-none" />
                </div>
              </div>

              {/* 2. Custom Glass Dropdown: Project Scope / Inquiry Type */}
              <div className="pt-4 border-t border-white/[0.06]" ref={dropdownRef}>
                <label
                  id="service-scope-label"
                  className="block text-xs sm:text-sm font-semibold tracking-wide text-fg font-sans mb-1.5"
                >
                  {selectedType === "support"
                    ? "Inquiry Category"
                    : "Project Scope & Service"}
                </label>

                <div className="relative">
                  {/* Glass Trigger Button */}
                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isDropdownOpen}
                    aria-labelledby="service-scope-label"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className={`w-full flex items-center justify-between rounded-xl border pl-3.5 pr-3 py-2.5 text-xs sm:text-sm text-left outline-none transition-all cursor-pointer ${
                      isDropdownOpen
                        ? "border-action bg-surface-raised/70 ring-1 ring-action/30 shadow-lg shadow-action/5"
                        : "border-white/10 bg-surface-raised/50 hover:border-white/20 hover:bg-surface-raised/70"
                    }`}
                  >
                    <span
                      className={`truncate ${
                        serviceScope ? "text-fg font-medium" : "text-fg-secondary/60"
                      }`}
                    >
                      {serviceScope ||
                        (selectedType === "support"
                          ? "Select inquiry type..."
                          : "Select project scope (e.g. Full Interior, Single Model)...")}
                    </span>

                    <FiChevronDown
                      className={`h-4 w-4 shrink-0 text-fg-secondary transition-transform duration-200 ml-2 ${
                        isDropdownOpen ? "rotate-180 text-action" : ""
                      }`}
                    />
                  </button>

                  {/* Floating Glass Options Menu */}
                  {isDropdownOpen && (
                    <div
                      role="listbox"
                      aria-labelledby="service-scope-label"
                      className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-white/15 bg-surface/95 backdrop-blur-2xl p-1.5 shadow-2xl shadow-black/80 space-y-0.5"
                    >
                      {(SCOPE_OPTIONS_BY_TYPE[selectedType] || []).map((scope) => {
                        const isSelected = serviceScope === scope;
                        return (
                          <button
                            key={scope}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              setServiceScope(scope);
                              if (!scope.toLowerCase().includes("other")) {
                                setCustomScope("");
                              }
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm transition-all text-left cursor-pointer ${
                              isSelected
                                ? "bg-action-tintBg text-action font-medium"
                                : "text-fg-secondary hover:text-fg hover:bg-white/[0.06]"
                            }`}
                          >
                            <span className="truncate">{scope}</span>
                            {isSelected && (
                              <FiCheck className="h-3.5 w-3.5 text-action shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Custom Scope / Problem Input when "Other" is selected */}
                {serviceScope.toLowerCase().includes("other") && (
                  <div className="mt-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <input
                      type="text"
                      value={customScope}
                      onChange={(e) => setCustomScope(e.target.value)}
                      placeholder={
                        selectedType === "support"
                          ? "Specify your issue or what you need help with..."
                          : "Specify your custom project scope (e.g. 3D floor plan variation, exhibition stand)..."
                      }
                      className="w-full rounded-xl border border-white/10 bg-surface-raised/50 hover:border-white/20 px-3.5 py-2.5 text-xs sm:text-sm text-fg placeholder:text-fg-secondary/50 outline-none transition-colors focus:border-action focus:ring-1 focus:ring-action/20"
                      autoFocus
                    />
                  </div>
                )}
              </div>

            {/* 3. Project Details & Reference Materials */}
            <div className="space-y-3">
              <label
                htmlFor="project-brief"
                className="block text-xs sm:text-sm font-semibold tracking-wide text-fg font-sans"
              >
                {selectedType === "support"
                  ? "Your Message"
                  : "Project Brief & References"}
              </label>

              <textarea
                id="project-brief"
                name="message"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  selectedType === "support"
                    ? "Describe your question, issue, or feedback in detail..."
                    : "Describe your project (e.g. room dimensions, architectural style, specific furniture pieces, or what you need created)..."
                }
                className="w-full resize-none rounded-xl border border-white/10 bg-surface-raised/50 hover:border-white/20 p-3.5 text-xs sm:text-sm text-fg placeholder:text-fg-secondary/50 outline-none transition-colors focus:border-action focus:ring-2 focus:ring-action/10"
              />

              {/* Reference Photo Upload (Max 50MB) */}
              <div>
                {!file ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex items-center justify-between p-3.5 rounded-xl border border-dashed transition-all cursor-pointer ${
                      isDragging
                        ? "border-action bg-action-tintBg/30"
                        : "border-white/15 bg-surface-raised/20 hover:border-action/50 hover:bg-surface-raised/40"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2.5 text-xs text-fg-secondary">
                      <FiUploadCloud className="h-4 w-4 text-action shrink-0" />
                      <span>
                        <strong className="text-fg font-medium">
                          {selectedType === "support"
                            ? "Attach screenshot or file"
                            : "Attach reference photo"}
                        </strong>{" "}
                        {selectedType === "support"
                          ? "(optional — max 50 MB)"
                          : "or drag & drop (plans, sketches, images)"}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-fg-secondary/60">
                      Max 50 MB
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-xl border border-action-tintLine bg-action-tintBg/30">
                    <div className="flex items-center gap-3 min-w-0">
                      {filePreview ? (
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="h-10 w-10 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-raised text-action shrink-0">
                          <FiPaperclip className="h-4 w-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-fg truncate">
                          {file.name}
                        </p>
                        <p className="font-mono text-[10px] text-action mt-0.5">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1.5 rounded-lg text-fg-secondary hover:text-danger hover:bg-white/[0.05] transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {fileError && (
                  <p className="mt-1.5 text-xs text-danger font-mono">
                    ⚠️ {fileError}
                  </p>
                )}
              </div>

              {/* Cloud Reference Link (Optional) */}
              <div className="relative">
                <input
                  id="reference-url"
                  type="url"
                  value={referenceUrl}
                  onChange={(e) => setReferenceUrl(e.target.value)}
                  placeholder="Or paste cloud folder link (Google Drive, Dropbox, Pinterest)..."
                  className="w-full rounded-xl border border-white/10 bg-surface-raised/40 hover:border-white/20 pl-3.5 pr-9 py-2 text-xs text-fg placeholder:text-fg-secondary/50 outline-none transition-colors focus:border-action focus:ring-1 focus:ring-action/20"
                />
                <FiExternalLink className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fg-secondary/40 pointer-events-none" />
              </div>
            </div>

            {/* Feedback Alert */}
            {feedback.visible && (
              <div
                className={`p-3.5 rounded-xl text-xs font-mono border ${
                  feedback.success
                    ? "bg-action-tintBg border-action-tintLine text-action-tintFg"
                    : "bg-red-950/40 border-red-800 text-red-200"
                }`}
              >
                {feedback.message}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-end pt-3">
              <button
                id="submit-brief-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-action px-7 py-2.5 text-xs sm:text-sm font-semibold text-canvas shadow-button-primary transition-all hover:bg-action-hover active:bg-action-pressed disabled:opacity-50 cursor-pointer"
              >
                <span>
                  {isSubmitting
                    ? "Sending..."
                    : selectedType === "support"
                    ? "Send Message"
                    : "Submit Project Brief"}
                </span>
                <FiArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RECENT STUDIO WORK (AT THE BOTTOM AS PROOF / INSPIRATION)              */}
      {/* ========================================================================= */}
      <section className="mt-16 sm:mt-24 pt-10 border-t border-white/[0.08]">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-2xl font-semibold tracking-[-0.02em] text-fg font-sans">
                Recent Studio Work
              </h2>
              <p className="text-xs text-fg-secondary mt-1">
                A preview of custom projects crafted by the Sketch shaper modeling team.
              </p>
            </div>
            <Link
              href="/gallery"
              className="text-xs font-mono text-action hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View full 3D gallery</span>
              <FiArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RECENT_PROJECTS.map((project, idx) => (
              <div
                key={idx}
                onClick={() => selectProjectFromShowcase(project.type, project.scope)}
                className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-surface/30 p-5 hover:border-action/40 hover:bg-surface/50 transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Architectural Preview Container */}
                <div className={`h-36 rounded-lg bg-gradient-to-br ${project.gradient} border border-white/[0.06] mb-4 flex flex-col items-center justify-center p-4 relative overflow-hidden group-hover:border-action/30 transition-colors`}>
                  <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
                  <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-surface/70 text-fg-secondary group-hover:text-action group-hover:scale-105 group-hover:border-action/40 transition-all shadow-inner">
                    {project.category.includes("Interior") && <FiGrid className="h-5 w-5" />}
                    {project.category.includes("Exterior") && <FiHome className="h-5 w-5" />}
                    {project.type === "single-model" && <FiBox className="h-5 w-5" />}
                  </div>
                  <span className="relative z-10 font-mono text-[10px] text-fg-secondary/70 uppercase tracking-wider mt-2.5">
                    {project.tag}
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-action block mb-1">
                    {project.category}
                  </span>
                  <h3 className="text-sm font-semibold text-fg group-hover:text-action transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-fg-secondary leading-relaxed">
                    {project.specs}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-fg-secondary group-hover:text-action transition-colors">
                  <span>Commission similar</span>
                  <FiArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
