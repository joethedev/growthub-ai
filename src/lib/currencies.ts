export const CURRENCIES = [
  { code: "USD", symbol: "$",   label: "US Dollar" },
  { code: "EUR", symbol: "€",   label: "Euro" },
  { code: "MAD", symbol: "DH",  label: "Moroccan Dirham" },
  { code: "GBP", symbol: "£",   label: "British Pound" },
  { code: "CAD", symbol: "C$",  label: "Canadian Dollar" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham" },
] as const;

export type CurrencyCode = typeof CURRENCIES[number]["code"];
