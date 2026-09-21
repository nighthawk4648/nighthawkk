'use client';

import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-16">
      <div className="max-w-3xl w-full rounded-3xl border border-white/10 bg-slate-900/95 p-10 shadow-2xl text-center">
        <h1 className="text-4xl font-bold mb-6">Something went wrong</h1>
        <p className="text-slate-300 leading-8 mb-6">
          We couldn&apos;t load this page right now. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
            Go to homepage
          </Link>
          <button type="button" onClick={() => window.location.reload()} className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            Reload page
          </button>
        </div>
      </div>
    </div>
  );
}
