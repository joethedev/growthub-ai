// ─── Fake transactions ───────────────────────────────────────────────────────
export type Category =
  | "Food & Dining"
  | "Transport"
  | "Shopping"
  | "Subscriptions"
  | "Health"
  | "Entertainment"
  | "Utilities"
  | "Travel";

export interface Transaction {
  id: string;
  name: string;
  category: Category;
  amount: number;
  date: string;
  type: "expense" | "income";
}

export const TRANSACTIONS: Transaction[] = [
  { id: "1",  name: "Whole Foods Market",   category: "Food & Dining",  amount: -82.40,  date: "2026-02-24", type: "expense" },
  { id: "2",  name: "Spotify Premium",       category: "Subscriptions",  amount: -9.99,   date: "2026-02-24", type: "expense" },
  { id: "3",  name: "Uber",                  category: "Transport",      amount: -14.50,  date: "2026-02-23", type: "expense" },
  { id: "4",  name: "Client Payment",        category: "Shopping",       amount: 2400.00, date: "2026-02-23", type: "income"  },
  { id: "5",  name: "Netflix",               category: "Subscriptions",  amount: -15.49,  date: "2026-02-22", type: "expense" },
  { id: "6",  name: "CVS Pharmacy",          category: "Health",         amount: -34.20,  date: "2026-02-22", type: "expense" },
  { id: "7",  name: "Chipotle",              category: "Food & Dining",  amount: -13.75,  date: "2026-02-21", type: "expense" },
  { id: "8",  name: "Amazon",                category: "Shopping",       amount: -67.99,  date: "2026-02-21", type: "expense" },
  { id: "9",  name: "Gym Membership",        category: "Health",         amount: -29.00,  date: "2026-02-20", type: "expense" },
  { id: "10", name: "Electric Bill",         category: "Utilities",      amount: -98.00,  date: "2026-02-20", type: "expense" },
  { id: "11", name: "Delta Airlines",        category: "Travel",         amount: -340.00, date: "2026-02-19", type: "expense" },
  { id: "12", name: "Freelance Invoice",     category: "Shopping",       amount: 850.00,  date: "2026-02-19", type: "income"  },
  { id: "13", name: "Starbucks",             category: "Food & Dining",  amount: -6.80,   date: "2026-02-18", type: "expense" },
  { id: "14", name: "Movie Tickets",         category: "Entertainment",  amount: -28.00,  date: "2026-02-18", type: "expense" },
  { id: "15", name: "Metro Card Top-up",     category: "Transport",      amount: -33.00,  date: "2026-02-17", type: "expense" },
];

// ─── Budget limits per category ─────────────────────────────────────────────
export const BUDGETS: Record<Category, number> = {
  "Food & Dining":  400,
  "Transport":      150,
  "Shopping":       300,
  "Subscriptions":   80,
  "Health":         150,
  "Entertainment":  100,
  "Utilities":      200,
  "Travel":         500,
};

// ─── Weekly spend for sparkline chart (last 7 days) ─────────────────────────
export const WEEKLY_SPEND = [
  { day: "Mon", amount: 42 },
  { day: "Tue", amount: 130 },
  { day: "Wed", amount: 67 },
  { day: "Thu", amount: 220 },
  { day: "Fri", amount: 88 },
  { day: "Sat", amount: 174 },
  { day: "Sun", amount: 52 },
];

// ─── Category colour map ─────────────────────────────────────────────────────
export const CATEGORY_COLOR: Record<Category, string> = {
  "Food & Dining":  "hsl(252 95% 65%)",
  "Transport":      "hsl(200 80% 55%)",
  "Shopping":       "hsl(280 80% 60%)",
  "Subscriptions":  "hsl(330 80% 60%)",
  "Health":         "hsl(142 71% 45%)",
  "Entertainment":  "hsl(38 90% 55%)",
  "Utilities":      "hsl(215 60% 55%)",
  "Travel":         "hsl(170 70% 45%)",
};
