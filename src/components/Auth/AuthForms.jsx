"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { SiPatreon } from "react-icons/si";
import { approveExtension, authRequest, googleStartUrl, patreonStartUrl, PATREON_MANAGE_URL } from "@/utils/authApi";
import { hasLivePolar, membershipKind, planBadge, polarProblem, polarText, proUntilText } from "@/utils/membership";
import { REQUEST_NOTE } from "@/utils/pricing";
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
function AccountCard({ title, children }) {
  return (
    <section className="rounded-[28px] bg-surface/80 border border-line p-6 sm:p-10 shadow-2xl backdrop-blur-md">
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight font-sans mb-5">{title}</h2>
      {children}
    </section>
  );
}

function MembershipCard({ user }) {
  const kind = membershipKind(user);
  const badge = planBadge(user);
  const live = hasLivePolar(user);
  const patron = user.proSource === "patreon";
  return (
    <AccountCard title="Membership">
      <div className="space-y-3 text-sm text-fg">
        {kind !== "blocked" && <p>{badge ? `Your plan: ${badge}` : "You are on the free plan."}</p>}
        {kind === "blocked" ? (
          <Link href="/contact" className={`${linkClass} block`}>PRO access is paused &middot; contact us &rarr;</Link>
        ) : (
          <>
            {polarProblem(user) && <p>Payment problem &middot; please update your card in Manage billing</p>}
            {kind === "manual" && <p>PRO &middot; {proUntilText(user)}</p>}
            {kind === "adfree" && user.proSource === "manual" && <p>Ad-free &middot; {proUntilText(user)}</p>}
            {live && <p>{polarText(user.polar)}</p>}
            {patron && (
              <a href={PATREON_MANAGE_URL} target="_blank" rel="noopener noreferrer" className={`${linkClass} flex items-center gap-2`}>
                <SiPatreon aria-hidden="true" className="h-3 w-3" />
                {/* with a Polar plan too, the tier name may be the Polar one */}
                {user.membershipTier && !live ? `Patreon: ${user.membershipTier}` : "Patreon membership"}
              </a>
            )}
            {kind === "adfree" &&
              (patron ? (
                <a href={PATREON_MANAGE_URL} target="_blank" rel="noopener noreferrer" className={`${linkClass} block`}>Upgrade for PRO models</a>
              ) : (
                <Link href="/pricing" className={`${linkClass} block`}>Upgrade for PRO models</Link>
              ))}
            {user.polar && <ManageBillingButton className={`${linkClass} cursor-pointer`} />}
            {kind === "free" && !polarProblem(user) && <Link href="/pricing" className={`${linkClass} block`}>Become a member</Link>}
            {/* Patreon only for patrons: someone who pays on our site never needs it */}
            {(user.patreonLinked || (kind === "free" && !user.polar)) && (
              <a href={patreonStartUrl("/account")} className={`${linkClass} block`}>
                {user.patreonLinked ? "Refresh Patreon status" : "Already a patron? Connect Patreon"} &rarr;
              </a>
            )}
            {user.plan && (
              <div className="border-t border-line pt-3">
                <Link href="/contact" className={`${linkClass} block`}>Request a model &rarr;</Link>
                <p className="mt-1 text-xs text-fg-secondary">Members can request one model a month. {REQUEST_NOTE}</p>
              </div>
            )}
          </>
        )}
      </div>
    </AccountCard>
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
    <AccountCard title="Profile">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Name" id="name" type="text" autoComplete="name" maxLength={100} defaultValue={user.name || ""} />
        <p className="text-sm text-fg-secondary">Email: {user.email}</p>
        {error && <Message>{error}</Message>}
        {saved && <Message type="success">Saved.</Message>}
        <button type="submit" disabled={busy} className={buttonClass}>{busy ? "Saving..." : "Save"}</button>
      </form>
      {!user.emailVerified && (
        <div className="mt-5 space-y-2 border-t border-line pt-4 text-xs text-fg-secondary">
          <p>Email not confirmed yet</p>
          <button type="button" onClick={resend} className={linkClass}>Send the link again</button>
          {resent && <p>{resent}</p>}
        </div>
      )}
    </AccountCard>
  );
}

function PasswordCard({ user, setUser }) {
  const formRef = useRef(null);
  const [done, setDone] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const { busy, error, submit } = useSubmit(async (form) => {
    setDone(false);
    const res = await authRequest("/change-password", {
      body: { currentPassword: form.get("currentPassword"), newPassword: form.get("newPassword") },
    });
    if (res.ok) {
      setUser(res.data.user);
      formRef.current?.reset(); // the form event is gone after the await
      setDone(true);
    }
    return res;
  });
  const link = useSubmit(async () => {
    const res = await authRequest("/forgot-password", { body: { email: user.email } });
    if (res.ok) setLinkSent(true);
    return res;
  });

  if (!user.hasPassword) {
    return (
      <AccountCard title="Password">
        <form onSubmit={link.submit} className="space-y-4">
          <p className="text-sm leading-relaxed text-fg-secondary">
            You sign in with Google or Patreon. To also sign in with a password, we can email you a link to set one.
          </p>
          {link.error && <Message>{link.error}</Message>}
          {linkSent ? (
            <Message type="success">Check your email for the link.</Message>
          ) : (
            <button type="submit" disabled={link.busy} className={buttonClass}>{link.busy ? "Sending..." : "Email me a link"}</button>
          )}
        </form>
      </AccountCard>
    );
  }
  return (
    <AccountCard title="Password">
      <form ref={formRef} onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Current password" id="currentPassword" type="password" autoComplete="current-password" required />
        <Field label="New password" id="newPassword" type="password" autoComplete="new-password" required minLength={8} placeholder="At least 8 characters" />
        {error && <Message>{error}</Message>}
        {done && <Message type="success">Password changed. Other devices were signed out.</Message>}
        <button type="submit" disabled={busy} className={buttonClass}>{busy ? "Saving..." : "Change password"}</button>
      </form>
    </AccountCard>
  );
}

export function AccountPage() {
  const { user, loading, setUser, openAuth } = useAuth();

  if (loading) return <PageShell><p className="text-sm text-fg-secondary">One moment.</p></PageShell>;

  if (!user) {
    return (
      <AuthCard title="Sign in to see your account">
        <div className="space-y-4">
          <button type="button" onClick={() => openAuth("login", "/account")} className={buttonClass}>Sign in</button>
          <p className="text-center text-xs"><Link href="/login?next=/account" className={linkClass}>Open the sign-in page</Link></p>
        </div>
      </AuthCard>
    );
  }

  return (
    <div className="min-h-[70vh] px-4 py-12 sm:py-16 text-fg">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <MembershipCard user={user} />
        <ProfileCard user={user} setUser={setUser} />
        <PasswordCard user={user} setUser={setUser} />
      </div>
    </div>
  );
}
