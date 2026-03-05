export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          clerk_id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          image_url: string | null;
          currency: string;
          role: "USER" | "ADMIN";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          image_url?: string | null;
          currency?: string;
          role?: "USER" | "ADMIN";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          image_url?: string | null;
          currency?: string;
          role?: "USER" | "ADMIN";
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          is_archived: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          is_archived?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          is_archived?: boolean;
          created_at?: string;
        };
      };
      tracking_periods: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: "MONTHLY" | "WEEKLY" | "CUSTOM";
          start_date: string;
          end_date: string;
          is_closed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: "MONTHLY" | "WEEKLY" | "CUSTOM";
          start_date: string;
          end_date: string;
          is_closed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: "MONTHLY" | "WEEKLY" | "CUSTOM";
          start_date?: string;
          end_date?: string;
          is_closed?: boolean;
          created_at?: string;
        };
      };
      budgets: {
        Row: {
          id: string;
          tracking_period_id: string;
          category_id: string;
          max_amount: string;
          is_recurrent: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          tracking_period_id: string;
          category_id: string;
          max_amount: string;
          is_recurrent?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          tracking_period_id?: string;
          category_id?: string;
          max_amount?: string;
          is_recurrent?: boolean;
          created_at?: string;
        };
      };
      spendings: {
        Row: {
          id: string;
          budget_id: string;
          amount: string;
          spending_date: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          budget_id: string;
          amount: string;
          spending_date: string;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          budget_id?: string;
          amount?: string;
          spending_date?: string;
          note?: string | null;
          created_at?: string;
        };
      };
      incomes: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: string;
          amount: string;
          frequency: string;
          received_at: string | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: string;
          amount: string;
          frequency: string;
          received_at?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: string;
          amount?: string;
          frequency?: string;
          received_at?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
