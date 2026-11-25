// Same tiers as Patreon. Prices are whole US dollars per month; yearly bills 10 months for 12.
const YEARLY_MONTHS_PAID = 10;

export const yearlyPrice = (monthly) => monthly * YEARLY_MONTHS_PAID;
export const yearlyFullPrice = (monthly) => monthly * 12; // what 12 monthly payments would cost

const PRO_FEATURES = ["No ads on the whole website", "All PRO models", "PRO models in the SketchUp extension"];

// `id` is the plan name the server knows. `popular` is the billing period in which the plan gets the "Most popular" highlight
export const PLANS = [
  { id: "early_access", name: "Early Access", monthly: 3, features: ["No ads on the whole website"] },
  { id: "pro", name: "Sketch shaper PRO", monthly: 5, popular: "yearly", features: PRO_FEATURES },
  {
    id: "sponsor",
    name: "Sponsor",
    monthly: 30,
    popular: "monthly",
    features: [...PRO_FEATURES, "Direct support from the studio", "A few custom assets"],
  },
];

export const planName = (id) => PLANS.find((p) => p.id === id)?.name || id;
