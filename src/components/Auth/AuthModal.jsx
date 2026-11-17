"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { safeReturnPath } from "@/utils/safeReturnPath";
import { SignInPanel, SignUpPanel } from "./AuthForms";

// The sign-in / sign-up popup, opened from the navbar and from PRO download prompts
export default function AuthModal() {
  const { authModal, closeAuth, setAuthMode } = useAuth();
  const dialogRef = useRef(null);
  const { open, mode } = authModal;
  const next = safeReturnPath(authModal.next);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && closeAuth();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeAuth]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-canvas/80 p-4 backdrop-blur-md"
      onMouseDown={(e) => e.target === e.currentTarget && closeAuth()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        tabIndex={-1}
        className="relative my-auto w-full max-w-md rounded-[28px] border border-line bg-surface/95 p-6 text-fg shadow-2xl outline-none backdrop-blur-2xl sm:p-10"
      >
        <button
          type="button"
          onClick={closeAuth}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface-raised font-mono text-sm text-fg-secondary transition-colors hover:text-fg"
        >
          ✕
        </button>
        {mode === "signup" ? (
          <SignUpPanel modal next={next} onSwitch={setAuthMode} />
        ) : (
          <SignInPanel modal next={next} onSwitch={setAuthMode} onDone={closeAuth} />
        )}
      </div>
    </div>
  );
}
