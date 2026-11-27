"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { SiPatreon } from "react-icons/si";
import { approveExtension, authRequest, googleStartUrl, patreonStartUrl, PATREON_MANAGE_URL } from "@/utils/authApi";
import { accountStatus, membershipFacts, membershipKind, planBadge, polarProblem } from "@/utils/membership";
import { planName, REQUEST_NOTE } from "@/utils/pricing";
import ManageBillingButton from "@/components/Pricing/ManageBillingButton";
import { cleanConnectCode, forgetConnect, recallConnectPath, rememberConnect } from "@/utils/extensionConnect";
import { safeReturnPath } from "@/utils/safeReturnPath";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-surface-raised/50 hover:border-white/20 px-4 py-3 text-sm text-fg placeholder:text-fg-secondary/50 outline-none transition-colors focus:border-action focus:ring-2 focus:ring-action/10";
const buttonClass =
  "w-full rounded-full bg-action px-6 py-3 text-sm font-semibold text-canvas transition-colors hover:bg-action-hover active:bg-action-pressed disabled:cursor-not-allowed disabled:opacity-60";
const socialClass =
  "flex w-full items-center justify-center gap-3 rounded-full border border-line bg-surface-raised px-6 py-3 text-sm font-medium text-fg transition-colors hover:border-action";
const linkClass = "text-action hover:underline";

// Reasons the backend sends back after a Google or Patreon sign-in did not finish (/login?error=...)
const PROVIDER_ERRORS = {
  google_denied: "Google sign-in was cancelled.",
  google_failed: "Google sign-in did not work. Please try again.",
  google_email_unverified: "Google could not confirm your email address. Please sign in with your email and password.",
  google_in_use: "That Google account is already connected to a different account.",
  google_no_email: "Google did not share your email address. Please allow email access and try again.",
  google_unavailable: "Google sign-in is not available right now. Please use another option.",
  patreon_denied: "Patreon sign-in was cancelled.",
  patreon_failed: "Patreon sign-in did not work. Please try again.",
  patreon_email_unverified: "Your Patreon email is not verified. Verify it on Patreon, or sign in with your email and password.",
  patreon_in_use: "That Patreon account is already connected to a different account.",
  patreon_no_email: "Patreon did not share your email address. Please allow email access and try again.",
};

// Page layout (used by /login, /signup and the email-link pages)
function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 sm:py-16 text-fg">
      <div className="w-full max-w-md rounded-[28px] bg-surface/80 border border-line p-6 sm:p-10 shadow-2xl backdrop-blur-md">
        <Panel title={title} subtitle={subtitle} footer={footer}>{children}</Panel>
      </div>
    </div>
  );
}

// The content of a sign-in box, shared by the pages and the popup
function Panel({ title, subtitle, children, footer, modal = false }) {
  const Heading = modal ? "h2" : "h1";
  return (
    <>
      <Heading id="auth-title" className="text-2xl sm:text-3xl font-semibold tracking-tight font-sans mb-2">{title}</Heading>
      {subtitle && <p className="text-sm text-fg-secondary leading-relaxed mb-6">{subtitle}</p>}
      {children}
      {footer && <div className="mt-6 text-center text-xs text-fg-secondary">{footer}</div>}
    </>
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

// Google, Patreon, then "or": the same for signing in and signing up (each creates the account when it is new)
function SocialOptions({ next }) {
  return (
    <>
      <div className="space-y-3">
        <a href={googleStartUrl(next)} className={socialClass}>
          <FcGoogle className="h-5 w-5" /> Continue with Google
        </a>
        <a href={patreonStartUrl(next)} className={socialClass}>
          <SiPatreon className="h-4 w-4 text-[#FF424D]" /> Continue with Patreon
        </a>
      </div>
      <div className="my-6 flex items-center gap-3 text-[11px] font-mono uppercase text-fg-secondary/70">
        <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
      </div>
    </>
  );
}

// Moves between sign in and sign up: a button inside the popup, a normal link on the pages
function SwitchLink({ mode, next, onSwitch, children }) {
  if (onSwitch) {
    return (
      <button type="button" onClick={() => onSwitch(mode)} className={linkClass}>
        {children}
      </button>
    );
  }
  const path = mode === "signup" ? "/signup" : "/login";
  return (
    <Link href={next === "/" ? path : `${path}?next=${encodeURIComponent(next)}`} className={linkClass}>
      {children}
    </Link>
  );
}

export function SignInPanel({ next, modal = false, onSwitch, onDone, urlError }) {
  const { setUser } = useAuth();
  const { busy, error, submit } = useSubmit(async (form) => {
    const res = await authRequest("/login", {
      body: { email: form.get("email"), password: form.get("password") },
    });
    if (res.ok) {
      setUser(res.data.user);
      onDone?.();
    }
    return res;
  });

  return (
    <Panel
      modal={modal}
      title="Sign in"
      subtitle="Sign in to download models and keep your account in one place."
      footer={<>New here? <SwitchLink mode="signup" next={next} onSwitch={onSwitch}>Create an account</SwitchLink></>}
    >
      {urlError && <div className="mb-4"><Message>{urlError}</Message></div>}
      <SocialOptions next={next} />
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Email" id="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        <Field label="Password" id="password" type="password" autoComplete="current-password" required />
        {error && <Message>{error}</Message>}
        <button type="submit" disabled={busy} className={buttonClass}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <div className="text-right text-xs">
          <Link href="/forgot-password" className={linkClass}>Forgot your password?</Link>
        </div>
      </form>
    </Panel>
  );
}

export function SignUpPanel({ next, modal = false, onSwitch }) {
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
      <Panel modal={modal} title="Check your email" footer={<SwitchLink mode="login" next={next} onSwitch={onSwitch}>Back to sign in</SwitchLink>}>
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
      </Panel>
    );
  }

  return (
    <Panel
      modal={modal}
      title="Create your account"
      subtitle="Free to join. Use Google, Patreon or your email."
      footer={<>Already have an account? <SwitchLink mode="login" next={next} onSwitch={onSwitch}>Sign in</SwitchLink></>}
    >
      <SocialOptions next={next} />
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Name (optional)" id="name" type="text" autoComplete="name" maxLength={100} />
        <Field label="Email" id="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        <Field label="Password" id="password" type="password" autoComplete="new-password" required minLength={8} placeholder="At least 8 characters" />
        {error && <Message>{error}</Message>}
        <button type="submit" disabled={busy} className={buttonClass}>
          {busy ? "Creating account..." : "Create account"}
        </button>
      </form>
    </Panel>
  );
}

// /login and /signup: the same panels on their own page
function PageShell({ children }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 sm:py-16 text-fg">
      <div className="w-full max-w-md rounded-[28px] bg-surface/80 border border-line p-6 sm:p-10 shadow-2xl backdrop-blur-md">
        {children}
      </div>
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeReturnPath(params.get("next"));
  const { user } = useAuth();

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  return (
    <PageShell>
      <SignInPanel next={next} urlError={PROVIDER_ERRORS[params.get("error")]} onDone={() => router.replace(next)} />
    </PageShell>
  );
}

export function SignUpForm() {
  const next = safeReturnPath(useSearchParams().get("next"));
  return (
    <PageShell>
      <SignUpPanel next={next} />
    </PageShell>
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
    const connectPath = recallConnectPath(); // they came here from the SketchUp extension
    return (
      <AuthCard title="Email confirmed">
        <div className="space-y-4">
          <Message type="success">Thank you. Your email is confirmed and you are signed in.</Message>
          <Link href={connectPath || "/"} className={`${buttonClass} block text-center`}>
            {connectPath ? "Continue to SketchUp" : "Go to the home page"}
          </Link>
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

// /extension/connect: the SketchUp extension sends people here to sign in or sign up, then press Connect
export function ExtensionConnectForm() {
  const params = useSearchParams();
  const { user, loading, setUser, signOut } = useAuth();
  const linkCode = cleanConnectCode(params.get("code"));
  const wantsPatreon = params.get("patreon") === "1"; // sent here to link Patreon to this account
  const [mode, setMode] = useState(params.get("mode") === "signup" ? "signup" : "login");
  const [connected, setConnected] = useState(false);
  const [resent, setResent] = useState("");
  const code = linkCode;
  const next = `/extension/connect${wantsPatreon ? "?patreon=1" : linkCode ? `?code=${linkCode}` : ""}`;

  useEffect(() => {
    if (linkCode) rememberConnect(linkCode);
  }, [linkCode]);

  // Someone who confirmed their email in another tab comes back here already signed in
  useEffect(() => {
    if (user?.emailVerified) return undefined;
    const recheck = () =>
      authRequest("/me", { method: "GET" }).then((res) => {
        if (res.data?.user) setUser(res.data.user);
      });
    window.addEventListener("focus", recheck);
    return () => window.removeEventListener("focus", recheck);
  }, [user, setUser]);

  const { busy, error, submit } = useSubmit(async () => {
    const res = await approveExtension(code);
    if (res.ok) {
      forgetConnect();
      setConnected(true);
    }
    return res;
  });

  if (loading) return <PageShell><p className="text-sm text-fg-secondary">One moment.</p></PageShell>;

  if (connected) {
    return (
      <PageShell>
        <Panel title="SketchUp is connected">
          <Message type="success">You are all set. Close this page and go back to SketchUp.</Message>
        </Panel>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <div className="mb-6"><Message type="success">Sign in or create your account to connect SketchUp.</Message></div>
        {mode === "signup" ? <SignUpPanel next={next} onSwitch={setMode} /> : <SignInPanel next={next} onSwitch={setMode} />}
      </PageShell>
    );
  }

  if (wantsPatreon) {
    return (
      <PageShell>
        <Panel
          title={user.patreonLinked ? "Patreon is connected" : "Connect your Patreon"}
          subtitle={`Signed in as ${user.name || user.email}.`}
          footer={<button type="button" onClick={signOut} className={linkClass}>Use a different account</button>}
        >
          {user.patreonLinked ? (
            <Message type="success">Go back to SketchUp and press &quot;check again&quot;.</Message>
          ) : (
            <a href={patreonStartUrl(next)} className={socialClass}>
              <SiPatreon className="h-4 w-4 text-[#FF424D]" /> Connect Patreon
            </a>
          )}
        </Panel>
      </PageShell>
    );
  }

  if (!user.emailVerified) {
    const resend = async () => {
      const res = await authRequest("/resend-verification", { body: { email: user.email } });
      setResent(res.ok ? "We sent another link." : res.message);
    };
    return (
      <PageShell>
        <Panel title="Confirm your email first" subtitle={`Open the link we sent to ${user.email}, then come back to this page.`}>
          <button type="button" onClick={resend} className={buttonClass}>Send the link again</button>
          {resent && <p className="mt-3 text-xs text-fg-secondary">{resent}</p>}
        </Panel>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Panel
        title="Connect to SketchUp"
        subtitle={`Signed in as ${user.name || user.email}.`}
        footer={<button type="button" onClick={signOut} className={linkClass}>Use a different account</button>}
      >
        {code ? (
          // The code travels in the link from SketchUp; people never need to see or type it
          <form onSubmit={submit} className="space-y-4" noValidate>
            <p className="text-sm leading-relaxed text-fg-secondary">
              Connect the Sketch shaper extension in SketchUp to this account?
            </p>
            <p className="text-xs leading-relaxed text-fg-secondary">
              Only press Connect if you just pressed Sign in or Sign up in your own SketchUp.
            </p>
            {error && <Message>{error}</Message>}
            <button type="submit" disabled={busy} className={buttonClass}>
              {busy ? "Connecting..." : "Connect"}
            </button>
          </form>
        ) : (
          <Message>Open this page with the Sign in button in the Sketch shaper extension in SketchUp.</Message>
        )}
      </Panel>
    </PageShell>
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

// /account: membership, profile and password for a signed-in member
const cardClass = "rounded-xl border border-line bg-black/20 p-5 backdrop-blur-md sm:p-6";
const primaryBtn =
  "inline-flex items-center justify-center rounded-full bg-action px-4 py-2 text-sm font-semibold text-canvas transition-colors hover:bg-action-hover cursor-pointer disabled:opacity-60";
const secondaryBtn =
  "inline-flex items-center justify-center rounded-full border border-line-strong px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-action hover:text-action cursor-pointer disabled:opacity-60";
const TONES = {
  ok: ["border-action/30 text-action", "bg-action"],
  warn: ["border-amber-400/30 text-amber-300", "bg-amber-400"],
  danger: ["border-danger/30 text-danger", "bg-danger"],
};

function Chip({ tone, children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs ${TONES[tone][0]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${TONES[tone][1]}`} />
      {children}
    </span>
  );
}

function AccountShell({ subtitle, children, narrow = false }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 text-fg sm:py-12 md:px-8">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-fg-secondary">
        <Link href="/" className="hover:text-action transition-colors">Home</Link>
        <span>/</span>
        <span className="text-fg">Account</span>
      </nav>
      <h1 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">Account</h1>
      {subtitle && <p className="mt-2 text-sm text-fg-secondary">{subtitle}</p>}
      <div className={`mt-8 ${narrow ? "max-w-xl" : ""}`}>{children}</div>
    </div>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-fg-secondary">{title}</h2>
      {children}
    </section>
  );
}

// A settings row: label on the left, the control on the right
function Row({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
      <div className="shrink-0 sm:w-56">
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-fg-secondary">{hint}</p>}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function IdentityCard({ user }) {
  const badge = planBadge(user);
  const status = accountStatus(user);
  return (
    <div className={`${cardClass} flex items-center gap-4 lg:flex-col lg:items-start`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-action/15 font-semibold text-action lg:h-16 lg:w-16 lg:text-xl">
        {(user.name || user.email).charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 space-y-1">
        <p className="truncate text-base font-semibold">{user.name || user.email.split("@")[0]}</p>
        <p className="break-all text-sm text-fg-secondary">{user.email}</p>
        {(badge || status) && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {badge && (
              <span className={`rounded px-2 py-0.5 font-mono text-[11px] font-semibold ${badge === "AD-FREE" ? "border border-action text-action" : "bg-action text-canvas"}`}>
                {badge}
              </span>
            )}
            {status && <Chip tone={status.tone}>{status.label}</Chip>}
          </div>
        )}
      </div>
    </div>
  );
}

function MembershipCard({ user }) {
  const kind = membershipKind(user);
  const problem = polarProblem(user);
  const patron = user.proSource === "patreon";
  const facts = membershipFacts(user);
  return (
    <div className={cardClass}>
      <p className="text-lg font-semibold">{kind === "blocked" ? "Membership paused" : user.plan ? planName(user.plan) : "Free plan"}</p>
      {kind === "free" && <p className="mt-1 text-sm text-fg-secondary">Upgrade for ad-free browsing and PRO models.</p>}
      {kind === "blocked" ? (
        <div className="mt-4">
          <Message>Your PRO access is paused. Please <Link href="/contact" className="underline">contact us</Link>.</Message>
        </div>
      ) : (
        <>
          {problem && (
            <div className="mt-4">
              <Message>Your last payment failed. Update your card in Manage billing to get access back.</Message>
            </div>
          )}
          {facts.length > 0 && (
            <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-5 sm:grid-cols-3 xl:grid-cols-4">
              {facts.map(({ label, value }) => (
                <div key={label}>
                  <dt className="font-mono text-[11px] uppercase tracking-wide text-fg-secondary">{label}</dt>
                  <dd className="mt-1 text-sm text-fg">{value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            {kind === "free" && !problem && <Link href="/pricing" className={primaryBtn}>Become a member</Link>}
            {kind === "adfree" &&
              (patron ? (
                <a href={PATREON_MANAGE_URL} target="_blank" rel="noopener noreferrer" className={primaryBtn}>Upgrade for PRO models</a>
              ) : (
                <Link href="/pricing" className={primaryBtn}>Upgrade for PRO models</Link>
              ))}
            {user.polar && <ManageBillingButton className={secondaryBtn} />}
            {patron && (
              <a href={PATREON_MANAGE_URL} target="_blank" rel="noopener noreferrer" className={`${secondaryBtn} gap-2`}>
                <SiPatreon aria-hidden="true" className="h-3 w-3" />
                Patreon membership
              </a>
            )}
            {user.plan && <Link href="/contact" className={secondaryBtn}>Request a model &rarr;</Link>}
          </div>
          {/* Patreon only for patrons: someone who pays on our site never needs it */}
          {(user.patreonLinked || (kind === "free" && !user.polar)) && (
            <p className="mt-3 text-xs">
              <a href={patreonStartUrl("/account")} className={linkClass}>
                {user.patreonLinked ? "Refresh Patreon status" : "Already a patron? Connect Patreon"} &rarr;
              </a>
            </p>
          )}
          {user.plan && <p className="mt-3 text-xs text-fg-secondary">Members can request one model a month. {REQUEST_NOTE}</p>}
        </>
      )}
    </div>
  );
}

function ProfileCard({ user, setUser }) {
  const [saved, setSaved] = useState(false);
  const [resent, setResent] = useState("");
  const { busy, error, submit } = useSubmit(async (form) => {
    setSaved(false);
    const res = await authRequest("/profile", { body: { name: form.get("name") } });
    if (res.ok) {
      setUser(res.data.user);
      setSaved(true);
    }
    return res;
  });

  const resend = async () => {
    const res = await authRequest("/resend-verification", { body: { email: user.email } });
    setResent(res.ok ? "We sent another link." : res.message);
  };

  return (
    <div className={`${cardClass} divide-y divide-line`}>
      <Row label="Name" hint="Shown on your account.">
        <form onSubmit={submit} className="max-w-md" noValidate>
          <div className="flex gap-2">
            <input
              name="name"
              aria-label="Name"
              type="text"
              autoComplete="name"
              maxLength={100}
              defaultValue={user.name || ""}
              className={`${inputClass} min-w-0 !py-2.5`}
            />
            <button type="submit" disabled={busy} className={primaryBtn}>{busy ? "Saving..." : "Save"}</button>
          </div>
          {(error || saved) && (
            <div className="mt-3">{error ? <Message>{error}</Message> : <Message type="success">Saved.</Message>}</div>
          )}
        </form>
      </Row>
      <Row label="Email" hint="Used to sign in.">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="break-all text-sm">{user.email}</span>
          {user.emailVerified ? <Chip tone="ok">Confirmed</Chip> : <Chip tone="warn">Not confirmed</Chip>}
          {!user.emailVerified && (
            <button type="button" onClick={resend} className={`${linkClass} cursor-pointer text-xs`}>Send the link again</button>
          )}
        </div>
        {resent && <p className="mt-2 text-xs text-fg-secondary">{resent}</p>}
      </Row>
    </div>
  );
}

// Mounted only while open, so closing it also clears what was typed and any error
function PasswordForm({ setUser, onDone, onCancel }) {
  const { busy, error, submit } = useSubmit(async (form) => {
    const res = await authRequest("/change-password", {
      body: { currentPassword: form.get("currentPassword"), newPassword: form.get("newPassword") },
    });
    if (res.ok) {
      setUser(res.data.user);
      onDone();
    }
    return res;
  });
  return (
    <form onSubmit={submit} className="max-w-md space-y-4" noValidate>
      <Field label="Current password" id="currentPassword" type="password" autoComplete="current-password" required />
      <Field label="New password" id="newPassword" type="password" autoComplete="new-password" required minLength={8} placeholder="At least 8 characters" />
      {error && <Message>{error}</Message>}
      <div className="flex gap-2">
        <button type="submit" disabled={busy} className={primaryBtn}>{busy ? "Saving..." : "Update password"}</button>
        <button type="button" onClick={onCancel} className={secondaryBtn}>Cancel</button>
      </div>
    </form>
  );
}

function PasswordCard({ user, setUser }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const link = useSubmit(async () => {
    const res = await authRequest("/forgot-password", { body: { email: user.email } });
    if (res.ok) setLinkSent(true);
    return res;
  });

  return (
    <div className={cardClass}>
      {user.hasPassword ? (
        <Row label="Password" hint="Change the password you sign in with.">
          {open ? (
            <PasswordForm
              setUser={setUser}
              onDone={() => {
                setOpen(false);
                setDone(true);
              }}
              onCancel={() => setOpen(false)}
            />
          ) : (
            <div className="space-y-3">
              {done && <Message type="success">Password changed. Other devices were signed out.</Message>}
              <button
                type="button"
                onClick={() => {
                  setDone(false);
                  setOpen(true);
                }}
                className={secondaryBtn}
              >
                Change password
              </button>
            </div>
          )}
        </Row>
      ) : (
        <Row label="Password" hint="You sign in with Google or Patreon.">
          <form onSubmit={link.submit} className="space-y-3">
            {link.error && <Message>{link.error}</Message>}
            {linkSent ? (
              <Message type="success">Check your email for the link.</Message>
            ) : (
              <button type="submit" disabled={link.busy} className={secondaryBtn}>
                {link.busy ? "Sending..." : "Email me a link to set one"}
              </button>
            )}
          </form>
        </Row>
      )}
    </div>
  );
}

export function AccountPage() {
  const { user, loading, setUser, openAuth } = useAuth();

  if (loading) return <AccountShell><p className="text-sm text-fg-secondary">One moment.</p></AccountShell>;

  if (!user) {
    return (
      <AccountShell narrow>
        <div className={cardClass}>
          <p className="text-sm text-fg-secondary">Sign in to see your membership, profile and password.</p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => openAuth("login", "/account")} className={primaryBtn}>Sign in</button>
            <Link href="/login?next=/account" className={`${linkClass} text-sm`}>Open the sign-in page</Link>
          </div>
        </div>
      </AccountShell>
    );
  }

  return (
    <AccountShell subtitle="Manage your membership, profile and password.">
      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
        <div className="space-y-4 lg:sticky lg:top-24">
          <IdentityCard user={user} />
          <nav aria-label="Account sections" className={`${cardClass} hidden !p-2 lg:block`}>
            {[["membership", "Membership"], ["profile", "Profile"], ["security", "Security"]].map(([id, label]) => (
              <a key={id} href={`#${id}`} className="block rounded-lg px-3 py-2 text-sm text-fg-secondary hover:bg-surface-raised hover:text-fg">{label}</a>
            ))}
          </nav>
        </div>
        <div className="min-w-0 space-y-8">
          <Section id="membership" title="Membership"><MembershipCard user={user} /></Section>
          <Section id="profile" title="Profile"><ProfileCard user={user} setUser={setUser} /></Section>
          <Section id="security" title="Security"><PasswordCard user={user} setUser={setUser} /></Section>
        </div>
      </div>
    </AccountShell>
  );
}
