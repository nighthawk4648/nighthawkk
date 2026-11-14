"use client";

import { ErrorFallback } from "@/components/Shared/ErrorFallback/ErrorFallback";

// Catches errors in the root layout itself (e.g. the backend is down and nothing is cached yet)
export default function GlobalError() {
  return (
    <html lang="en">
      <body>
        <ErrorFallback />
      </body>
    </html>
  );
}
