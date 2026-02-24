import { CURRENCIES } from "./currencies";

/**
 * Format a numeric amount with the user's currency symbol.
 * e.g. fmtAmount(42.5, "MAD") → "42.50 DH"
 *      fmtAmount(42.5, "USD") → "$42.50"
 */
export function fmtAmount(amount: number | string, currency = "USD"): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  const fixed = isNaN(num) ? "0.00" : num.toFixed(2);
  const entry = CURRENCIES.find((c) => c.code === currency);
  const symbol = entry?.symbol ?? currency;

  // Post-fix symbols (non-latin)
  const postfix = ["DH", "د.إ"];
  if (postfix.includes(symbol)) return `${fixed} ${symbol}`;
  return `${symbol}${fixed}`;
}
