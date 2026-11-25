"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiCheck } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { authRequest, startCheckout } from "@/utils/authApi";
import { hasLivePolar, isAdFree } from "@/utils/membership";
import { PLANS, yearlyPrice, yearlyFullPrice } from "@/utils/pricing";
import ManageBillingButton from "./ManageBillingButton";

const planButton = (popular) =>
  `mt-6 w-full rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
    popular ? "bg-action text-canvas hover:bg-action-hover" : "bg-white/10 text-fg hover:bg-white/15"
  }`;

export default function PricingClient() {
  const { user, loading, setUser, openAuth } = useAuth();
  const [yearly, setYearly] = useState(false);
  const [busyPlan, setBusyPlan] = useState(null);
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false); // Polar sent the visitor back here after paying
  const period = yearly ? "yearly" : "monthly";
  const live = hasLivePolar(user);
  const toggle = (active) =>
    `px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
      active ? "bg-action text-canvas" : "text-fg-secondary hover:text-fg"
    }`;

  useEffect(() => {
    setPaid(new URLSearchParams(window.location.search).get("checkout") === "success");
  }, []);

  // Polar tells our server about the payment a moment after the visitor returns, so ask again until it shows
  useEffect(() => {
    if (!paid || live) return;
    let tries = 0;
    const timer = setInterval(async () => {
      const res = await authRequest("/me", { method: "GET" });
      if (res.data?.user) setUser(res.data.user);
      if (++tries >= 20) clearInterval(timer);
    }, 2000);
    return () => clearInterval(timer);
  }, [paid, live, setUser]);

  const subscribe = async (plan) => {
    if (!user) return openAuth("signup"); // an account first, then the payment
    setError("");
    setBusyPlan(plan.id);
    const res = await startCheckout(plan.id, period);
    if (res.ok && res.data?.url) return window.location.assign(res.data.url);
    setBusyPlan(null);
    setError(res.message || "Could not start the payment. Please try again.");
  };

  return (
    <div className="relative min-h-screen w-full text-fg">
      <div className="w-full px-4 md:px-[0.5in] py-8 sm:py-12">
        <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-fg-secondary">
          <Link href="/" className="hover:text-action transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-fg">Pricing</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.03em] font-sans text-center">
          Unlock Sketchshaper with these plans.
        </h1>

        {paid && (
          <p role="status" className="mx-auto mt-6 max-w-xl rounded-xl border border-action bg-black/20 px-4 py-3 text-center text-sm">
            {live ? "You're all set. Your membership is active." : "Payment received. Activating your membership…"}
          </p>
        )}
        {user && isAdFree(user) && !live && !paid && (
          <p className="mx-auto mt-6 max-w-xl text-center text-sm text-fg-secondary">
            You already have access through {user.proSource === "manual" ? "a membership set by us" : "Patreon"}. Subscribing
            here as well would charge you twice.
          </p>
        )}

        <div className="mx-auto mt-6 flex w-fit items-center gap-1 rounded-full border border-line bg-surface p-1">
          <button type="button" aria-pressed={!yearly} onClick={() => setYearly(false)} className={toggle(!yearly)}>
            Monthly
          </button>
          <button type="button" aria-pressed={yearly} onClick={() => setYearly(true)} className={toggle(yearly)}>
            Yearly &middot; 2 months free
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {PLANS.map((plan) => {
            const popular = plan.popular === period;
            const current = live && user.polar.plan === plan.id && user.polar.period === period;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-xl border bg-black/20 p-6 backdrop-blur-md transition-all ${
                  popular
                    ? "border-action shadow-[0_0_32px_rgba(79,219,134,0.18)] md:-translate-y-2"
                    : "border-white/10"
                }`}
              >
                {popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-action px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-canvas">
                    Most popular
                  </span>
                )}
                <h2 className="text-lg font-semibold">{plan.name}</h2>
                <div className="mt-4 flex items-baseline gap-2">
                  {yearly && (
                    <s className="text-sm text-fg-secondary" aria-label={`Regular price $${yearlyFullPrice(plan.monthly)}`}>
                      ${yearlyFullPrice(plan.monthly)}
                    </s>
                  )}
                  <span className="text-4xl font-semibold tracking-tight">
                    ${yearly ? yearlyPrice(plan.monthly) : plan.monthly}
                  </span>
                  <span className="text-sm text-fg-secondary">/ {yearly ? "year" : "month"}</span>
                </div>
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <FiCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-action" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {live && current ? (
                  <button type="button" disabled className={planButton(popular)}>
                    Current plan
                  </button>
                ) : live ? (
                  <ManageBillingButton className={planButton(popular)} />
                ) : (
                  <button
                    type="button"
                    onClick={() => subscribe(plan)}
                    disabled={loading || busyPlan !== null}
                    className={planButton(popular)}
                  >
                    {busyPlan === plan.id ? "Opening payment…" : "Subscribe"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <p role="alert" className="mt-6 text-center text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
