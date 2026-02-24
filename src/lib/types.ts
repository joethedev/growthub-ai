// ─── Database DTOs ────────────────────────────────────────────────────────────

export interface DbUser {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  currency: string;   // e.g. "USD", "EUR", "MAD" — default "USD"
  role: "USER" | "ADMIN";
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  is_archived: boolean;
  created_at: Date;
}

export interface TrackingPeriod {
  id: string;
  user_id: string;
  name: string;
  type: "MONTHLY" | "WEEKLY" | "CUSTOM";
  start_date: string;
  end_date: string;
  is_closed: boolean;
  created_at: Date;
}

export interface Budget {
  id: string;
  tracking_period_id: string;
  category_id: string;
  max_amount: string; // numeric comes as string from postgres
  is_recurrent: boolean;
  created_at: Date;
  // Joined fields
  category_name?: string;
  category_color?: string;
  category_icon?: string;
  spent_total?: string;
}

export interface Spending {
  id: string;
  budget_id: string;
  amount: string; // numeric comes as string from postgres
  spending_date: string;
  note: string | null;
  created_at: Date;
  // Joined fields
  category_name?: string;
  category_color?: string;
  category_icon?: string;
  period_name?: string;
}

export interface Income {
  id: string;
  user_id: string;
  name: string;
  type: string;
  amount: string; // numeric comes as string from supabase
  frequency: string;
  received_at: string | null; // ISO date — set for one-time incomes
  notes: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// ─── Action result wrapper ────────────────────────────────────────────────────

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
