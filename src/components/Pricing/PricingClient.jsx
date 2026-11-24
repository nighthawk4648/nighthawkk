"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiCheck } from "react-icons/fi";
import { PLANS, yearlyPrice, yearlyFullPrice } from "@/utils/pricing";

export default function PricingClient() {
  const [yearly, setYearly] = useState(false);
  const toggle = (active) =>
    `px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
      active ? "bg-action text-canvas" : "text-fg-secondary hover:text-fg"
    }`;

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

        <div className="mx-auto mt-6 flex w-fit items-center gap-1 rounded-full border border-line bg-surface p-1">
          <button
            type="button"
            aria-pressed={!yearly}
            onClick={() => setYearly(false)}
            className={toggle(!yearly)}
          >
            Monthly
          </button>
          <button
            type="button"
            aria-pressed={yearly}
            onClick={() => setYearly(true)}
            className={toggle(yearly)}
          >
            Yearly &middot; 2 months free
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {PLANS.map((plan) => {
            const popular = plan.popular === (yearly ? "yearly" : "monthly");
            return (
            <div
              key={plan.name}
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
                  <s
                    className="text-sm text-fg-secondary"
                    aria-label={`Regular price $${yearlyFullPrice(plan.monthly)}`}
                  >
                    ${yearlyFullPrice(plan.monthly)}
                  </s>
                )}
                <span className="text-4xl font-semibold tracking-tight">
                  ${yearly ? yearlyPrice(plan.monthly) : plan.monthly}
                </span>
                <span className="text-sm text-fg-secondary">
                  / {yearly ? "year" : "month"}
                </span>
              </div>
              <ul className="mt-5 flex-1 space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <FiCheck
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-action"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              {/* Becomes the Paddle checkout button once Paddle is set up */}
              <button
                type="button"
                disabled
                className={`mt-6 w-full cursor-not-allowed rounded-full px-4 py-2 text-sm font-semibold ${
                  popular ? "bg-action/60 text-canvas" : "bg-white/5 text-fg-secondary"
                }`}
              >
                Coming soon
              </button>
            </div>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-fg-secondary">
          Prices are in US dollars. Payments are handled by Paddle.
        </p>
      </div>
    </div>
  );
}
