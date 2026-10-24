"use client";

import React from "react";
import Link from "next/link";
import { FiAlertTriangle, FiHome, FiRefreshCw } from "react-icons/fi";

export default function ErrorPage({ error, reset }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-canvas px-4 py-16 text-fg">
      <div className="relative max-w-xl w-full mx-auto p-8 sm:p-12 rounded-[28px] bg-surface/80 border border-line shadow-2xl backdrop-blur-md text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-line text-xs font-mono text-danger mb-6">
          <FiAlertTriangle className="w-3.5 h-3.5" />
          SYSTEM_EXCEPTION &bull; RUNTIME_ERROR
        </div>

        <h1 className="text-3xl sm:text-4xl font-sans font-semibold text-fg tracking-tight mb-3">
          Something went wrong
        </h1>

        <p className="text-sm sm:text-base text-fg-secondary leading-relaxed mb-8 max-w-md mx-auto">
          We encountered an unexpected error while rendering this viewport. Please try refreshing the scene or returning home.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => (reset ? reset() : window.location.reload())}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-action hover:bg-action-hover active:bg-action-pressed text-canvas font-semibold text-sm transition-all shadow-lg shadow-action/15 hover:scale-105 cursor-pointer"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Reload Viewport</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-surface-raised hover:bg-surface border border-line hover:border-line-control text-fg hover:text-action font-medium text-sm transition-all"
          >
            <FiHome className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {error?.message && (
          <div className="mt-8 pt-6 border-t border-line/60 text-left">
            <p className="text-[11px] font-mono text-fg-secondary/70 uppercase tracking-wider mb-1">
              Diagnostic Details
            </p>
            <pre className="text-xs font-mono bg-canvas/80 p-3 rounded-xl border border-line text-danger/90 overflow-x-auto max-h-32 whitespace-pre-wrap break-all">
              {error.message}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
