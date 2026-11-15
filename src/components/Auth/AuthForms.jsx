"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { authRequest, patreonStartUrl } from "@/utils/authApi";
import { safeReturnPath } from "@/utils/safeReturnPath";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-surface-raised/50 hover:border-white/20 px-4 py-3 text-sm text-fg placeholder:text-fg-secondary/50 outline-none transition-colors focus:border-action focus:ring-2 focus:ring-action/10";
const buttonClass =
  "w-full rounded-full bg-action px-6 py-3 text-sm font-semibold text-canvas transition-colors hover:bg-action-hover active:bg-action-pressed disabled:cursor-not-allowed disabled:opacity-60";
const linkClass = "text-action hover:underline";

// Reasons the backend sends back after a Patreon sign-in did not finish (/login?error=...)
const PATREON_ERRORS = {
  patreon_denied: "Patreon sign-in was cancelled.",
  patreon_failed: "Patreon sign-in did not work. Please try again.",
  patreon_email_unverified: "Your Patreon email is not verified. Verify it on Patreon, or sign in with your email and password.",
  patreon_in_use: "That Patreon account is already connected to a different account.",
  patreon_no_email: "Patreon did not share your email address. Please allow email access and try again.",
};

function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 sm:py-16 text-fg">
      <div className="w-full max-w-md rounded-[28px] bg-surface/80 border border-line p-6 sm:p-10 shadow-2xl backdrop-blur-md">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight font-sans mb-2">{title}</h1>
        {subtitle && <p className="text-sm text-fg-secondary leading-relaxed mb-6">{subtitle}</p>}
        {children}
        {footer && <div className="mt-6 text-center text-xs text-fg-secondary">{footer}</div>}
      </div>
    </div>
  );
}

function Field({ label, id, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-fg-secondary">
        {label}
      </label>
      <input id={id} name={id} className={inputClass} {...props} />
    </div>
  );
}

const Message = ({ type = "error", children }) => (
  <p
    role={type === "error" ? "alert" : "status"}
    className={`rounded-xl border px-3.5 py-2.5 text-xs leading-relaxed ${
      type === "error"
        ? "border-danger/30 bg-danger/10 text-danger"
        : "border-action-tintLine bg-action-tintBg text-action-tintFg"
    }`}
  >
    {children}
  </p>
);

// Shared submit handling: busy flag, one error message, success callback
function useSubmit(action) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const res = await action(new FormData(event.currentTarget));
    if (res && !res.ok) setError(res.message || "Something went wrong. Please try again.");
    setBusy(false);
  };
  return { busy, error, submit };
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeReturnPath(params.get("next"));
  const patreonError = PATREON_ERRORS[params.get("error")];
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  const { busy, error, submit } = useSubmit(async (form) => {
    const res = await authRequest("/login", {
      body: { email: form.get("email"), password: form.get("password") },
    });
    if (res.ok) setUser(res.data.user);
    return res;
  });

  return (
    <AuthCard
      title="Sign in"
      subtitle="Sign in to download models and keep your account in one place."
      footer={
        <>
          New here? <Link href="/signup" className={linkClass}>Create an account</Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Email" id="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        <Field label="Password" id="password" type="password" autoComplete="current-password" required />
        {(error || patreonError) && <Message>{error || patreonError}</Message>}
        <button type="submit" disabled={busy} className={buttonClass}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <div className="text-right text-xs">
          <Link href="/forgot-password" className={linkClass}>Forgot your password?</Link>
        </div>
      </form>

      <div className="my-6 flex items-center gap-3 text-[11px] font-mono uppercase text-fg-secondary/70">
        <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
      </div>
      <a
        href={patreonStartUrl(next)}
        className="block w-full rounded-full border border-line bg-surface-raised px-6 py-3 text-center text-sm font-medium text-fg transition-colors hover:border-action"
      >
        Continue with Patreon
      </a>
    </AuthCard>
  );
}

export function SignUpForm() {
  const [sentTo, setSentTo] = useState("");
  const [resent, setResent] = useState("");

  const { busy, error, submit } = useSubmit(async (form) => {
    const email = form.get("email");
    const res = await authRequest("/register", {
      body: { name: form.get("name"), email, password: form.get("password") },
    });
    if (res.ok) setSentTo(email);
    return res;
  });

  const resend = async () => {
    const res = await authRequest("/resend-verification", { body: { email: sentTo } });
    setResent(res.ok ? "We sent another link." : res.message);
  };

  if (sentTo) {
    return (
      <AuthCard title="Check your email" footer={<Link href="/login" className={linkClass}>Back to sign in</Link>}>
        <div className="space-y-4">
          <Message type="success">
            We sent a confirmation link to <strong>{sentTo}</strong>. It works for 24 hours.
          </Message>
          <p className="text-xs text-fg-secondary leading-relaxed">
            Nothing yet? Look in your spam folder, or{" "}
            <button type="button" onClick={resend} className={linkClass}>send the link again</button>.
          </p>
          {resent && <p className="text-xs text-fg-secondary">{resent}</p>}
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Free to join. Confirm your email to keep your account safe."
      footer={
        <>
          Already have an account? <Link href="/login" className={linkClass}>Sign in</Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Name (optional)" id="name" type="text" autoComplete="name" maxLength={100} />
        <Field label="Email" id="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        <Field label="Password" id="password" type="password" autoComplete="new-password" required minLength={8} placeholder="At least 8 characters" />
        {error && <Message>{error}</Message>}
        <button type="submit" disabled={busy} className={buttonClass}>
          {busy ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}

export function VerifyEmailForm() {
  const token = useSearchParams().get("token");
  const { setUser } = useAuth();
  const [state, setState] = useState(token ? "working" : "failed");
  const [message, setMessage] = useState("");
  const started = useRef(false);

  useEffect(() => {
    // The link works once, so make sure React's dev double-run does not spend it twice
    if (!token || started.current) return;
    started.current = true;
    authRequest("/verify-email", { body: { token } }).then((res) => {
      if (res.ok) {
        setUser(res.data.user);
        setState("done");
      } else {
        setMessage(res.message);
        setState("failed");
      }
    });
  }, [token, setUser]);

  if (state === "working") {
    return <AuthCard title="Confirming your email..."><p className="text-sm text-fg-secondary">One moment.</p></AuthCard>;
  }
  if (state === "done") {
    return (
      <AuthCard title="Email confirmed">
        <div className="space-y-4">
          <Message type="success">Thank you. Your email is confirmed and you are signed in.</Message>
          <Link href="/" className={`${buttonClass} block text-center`}>Go to the home page</Link>
        </div>
      </AuthCard>
    );
  }
  return (
    <AuthCard
      title="This link did not work"
      subtitle={message || "The link is missing, already used, or expired."}
      footer={<Link href="/login" className={linkClass}>Sign in to request a new one</Link>}
    >
      <p className="text-xs text-fg-secondary">Sign in and we will offer to send a fresh link, or create the account again with the same email.</p>
    </AuthCard>
  );
}

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const { busy, error, submit } = useSubmit(async (form) => {
    const res = await authRequest("/forgot-password", { body: { email: form.get("email") } });
    if (res.ok) setSent(true);
    return res;
  });

  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your email and we will send you a link to choose a new one."
      footer={<Link href="/login" className={linkClass}>Back to sign in</Link>}
    >
      {sent ? (
        <Message type="success">If an account exists for that email, a reset link is on its way. It works for 1 hour.</Message>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Field label="Email" id="email" type="email" autoComplete="email" required placeholder="you@example.com" />
          {error && <Message>{error}</Message>}
          <button type="submit" disabled={busy} className={buttonClass}>
            {busy ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}

export function ResetPasswordForm() {
  const token = useSearchParams().get("token");
  const [done, setDone] = useState(false);
  const { busy, error, submit } = useSubmit(async (form) => {
    if (form.get("password") !== form.get("confirm")) {
      return { ok: false, message: "The two passwords do not match." };
    }
    const res = await authRequest("/reset-password", { body: { token, password: form.get("password") } });
    if (res.ok) setDone(true);
    return res;
  });

  if (!token) {
    return (
      <AuthCard title="This link did not work" footer={<Link href="/forgot-password" className={linkClass}>Request a new link</Link>}>
        <p className="text-sm text-fg-secondary">The reset link is missing or incomplete.</p>
      </AuthCard>
    );
  }
  if (done) {
    return (
      <AuthCard title="Password updated">
        <div className="space-y-4">
          <Message type="success">Your password was changed. Please sign in with the new one.</Message>
          <Link href="/login" className={`${buttonClass} block text-center`}>Sign in</Link>
        </div>
      </AuthCard>
    );
  }
  return (
    <AuthCard title="Choose a new password" subtitle="Use at least 8 characters.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="New password" id="password" type="password" autoComplete="new-password" required minLength={8} />
        <Field label="Repeat the password" id="confirm" type="password" autoComplete="new-password" required />
        {error && (
          <Message>
            {error}{" "}
            {/expired|invalid/i.test(error) && <Link href="/forgot-password" className="underline">Request a new link</Link>}
          </Message>
        )}
        <button type="submit" disabled={busy} className={buttonClass}>
          {busy ? "Saving..." : "Save password"}
        </button>
      </form>
    </AuthCard>
  );
}
