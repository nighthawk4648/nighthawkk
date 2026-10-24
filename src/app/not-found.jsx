import Link from "next/link";
import { FiHome, FiGrid } from "react-icons/fi";

export const metadata = {
  title: "404 - Page Not Found | SketchShaper",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-canvas px-4 py-16 text-fg">
      <div className="relative max-w-xl w-full mx-auto p-8 sm:p-12 rounded-[28px] bg-surface/80 border border-line shadow-2xl backdrop-blur-md text-center">
        {/* Subtle decorative CAD grid glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-action/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-line text-xs font-mono text-fg-secondary mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
          HTTP 404 &bull; RESOURCE_NOT_FOUND
        </div>

        <h1 className="text-7xl sm:text-8xl font-mono font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-action via-action to-action-pressed mb-4">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-sans font-semibold text-fg tracking-tight mb-3">
          Coordinate Not Found
        </h2>

        <p className="text-sm sm:text-base text-fg-secondary leading-relaxed mb-8 max-w-md mx-auto">
          The 3D model, page, or category you requested does not exist or has been relocated to another coordinate in our library.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-action hover:bg-action-hover active:bg-action-pressed text-canvas font-semibold text-sm transition-all shadow-lg shadow-action/15 hover:scale-105"
          >
            <FiHome className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/gallery"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-surface-raised hover:bg-surface border border-line hover:border-line-control text-fg hover:text-action font-medium text-sm transition-all"
          >
            <FiGrid className="w-4 h-4" />
            <span>Browse 3D Models</span>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-line/60 text-xs text-fg-secondary/70 font-mono">
          Looking for a specific asset? Try searching directly from the search bar above.
        </div>
      </div>
    </div>
  );
}
