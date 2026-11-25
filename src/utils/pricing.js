// Same tiers as Patreon. Prices are whole US dollars per month; yearly bills 10 months for 12.
const YEARLY_MONTHS_PAID = 10;

export const yearlyPrice = (monthly) => monthly * YEARLY_MONTHS_PAID;
export const yearlyFullPrice = (monthly) => monthly * 12; // what 12 monthly payments would cost

// `id` is the plan name the server knows. `popular` is the billing period in which the plan gets the "Most popular" highlight.
// Each plan includes the one before it, so its list starts with that.
export const PLANS = [
  {
    id: "early_access",
    name: "Early Access",
    monthly: 3,
    features: ["Ad-free browsing across Sketch shaper", "One model request per month for our public library"],
  },
  {
    id: "pro",
    name: "Sketch shaper PRO",
    monthly: 5,
    popular: "yearly",
    features: ["All Early Access benefits", "Full access to all PRO models", "PRO models available directly in the SketchUp extension"],
  },
  {
    id: "sponsor",
    name: "Sponsor",
    monthly: 30,
    popular: "monthly",
    features: [
      "All Sketch shaper PRO benefits",
      "Direct support from the studio",
      "Custom assets created for you (limited)",
      "Your logo and website link featured on our homepage",
    ],
  },
];

// Shown under the plans, because a model request is not a promise
export const REQUEST_NOTE = "Model requests are reviewed by our team. Availability and timing are not guaranteed.";

export const planName = (id) => PLANS.find((p) => p.id === id)?.name || id;

// After paying, the page asks whether the membership is active: every 2 s for the first minute, then every 5 s,
// for 5 minutes in all. Returns the wait before the next ask, or null to stop.
export const nextCheckDelay = (waitedMs) => (waitedMs >= 300_000 ? null : waitedMs < 60_000 ? 2000 : 5000);
