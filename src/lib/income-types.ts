// ─── Income Types ─────────────────────────────────────────────────────────────

export const INCOME_TYPES = [
  { value: "salary",      label: "Salary",         icon: "💼" },
  { value: "freelance",   label: "Freelance",       icon: "💻" },
  { value: "cashback",    label: "Cashback",        icon: "💳" },
  { value: "bonus",       label: "Bonus",           icon: "🎯" },
  { value: "rental",      label: "Rental Income",   icon: "🏠" },
  { value: "dividend",    label: "Dividend",        icon: "📈" },
  { value: "gift",        label: "Gift",            icon: "🎁" },
  { value: "refund",      label: "Refund",          icon: "🔄" },
  { value: "side_hustle", label: "Side Hustle",     icon: "🚀" },
  { value: "investment",  label: "Investment",      icon: "💰" },
  { value: "pension",     label: "Pension",         icon: "🏦" },
  { value: "other",       label: "Other",           icon: "📥" },
] as const;

export type IncomeTypeValue = typeof INCOME_TYPES[number]["value"];

// ─── Income Frequencies ───────────────────────────────────────────────────────

export const INCOME_FREQUENCIES = [
  { value: "once",       label: "One-time" },
  { value: "weekly",     label: "Weekly" },
  { value: "bi_weekly",  label: "Bi-weekly" },
  { value: "monthly",    label: "Monthly" },
  { value: "quarterly",  label: "Quarterly" },
  { value: "yearly",     label: "Yearly" },
] as const;

export type IncomeFrequency = typeof INCOME_FREQUENCIES[number]["value"];
