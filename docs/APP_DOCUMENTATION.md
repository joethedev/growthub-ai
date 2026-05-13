# GrowthHub App Documentation

## 1) Product Overview
GrowthHub is a personal finance application focused on budget planning and spending control.

Main goals:
- Track expenses by period (monthly, weekly, custom).
- Create category-based budgets and monitor progress.
- Log spendings against budgets.
- Track multiple income streams and estimate monthly income.
- Show actionable dashboard insights and alerts.
- Support user currency preferences.

## 2) Current Frontend Stack
- Next.js (App Router)
- React + TypeScript
- Clerk authentication
- Supabase (current data layer)
- Zod validation schemas

## 3) Functional Modules

### 3.1 Authentication and User Sync
- Users sign in via Clerk.
- On first authenticated request, user profile is synced into app DB.
- Core user profile fields include identity, role, and preferred currency.

### 3.2 Categories
- Create, update, delete category.
- Category fields: name, description, icon, color.
- Supports archive/restore (soft archive).
- Default list excludes archived categories.

### 3.3 Tracking Periods
- Create periods with type: MONTHLY, WEEKLY, CUSTOM.
- Define start_date and end_date.
- Close period to lock workflow.
- Period listing is newest first.

### 3.4 Budgets
- One budget per category per period.
- Fields: max_amount, recurrent flag.
- Budget list for selected period includes aggregated spent_total.
- Budget operations are user-owned through period ownership checks.

### 3.5 Spendings
- Log transactions against a budget.
- Fields: amount, spending_date, note.
- Spendings are retrieved by period (resolved through budgets).
- Results include category metadata (name/color/icon).
- UI groups spendings by date.

### 3.6 Incomes
- Manage income streams with type and frequency.
- Supports active/inactive toggling.
- Frequency examples: once, weekly, bi_weekly, monthly, quarterly, yearly.
- Monthly estimate derives from active incomes.

### 3.7 Dashboard
- Uses current period (latest open, else latest closed).
- Displays:
  - total spent
  - total budget
  - estimated monthly income
  - transaction count
  - budget progress by category
  - recent transactions
  - last 7-day spending chart
- Includes smart alerts (over-budget and high-usage scenarios).

### 3.8 Settings
- User can change currency.
- Allowed currencies: USD, EUR, MAD, GBP, CAD, AED.

## 4) Data Model (Logical)

### users
- id
- clerk_id (unique)
- email
- first_name
- last_name
- image_url
- currency
- role
- created_at
- updated_at

### categories
- id
- user_id
- name
- description
- icon
- color
- is_archived
- created_at

### tracking_periods
- id
- user_id
- name
- type (MONTHLY | WEEKLY | CUSTOM)
- start_date
- end_date
- is_closed
- created_at

### budgets
- id
- tracking_period_id
- category_id
- max_amount
- is_recurrent
- created_at

### spendings
- id
- budget_id
- amount
- spending_date
- note
- created_at

### incomes
- id
- user_id
- name
- type
- amount
- frequency
- received_at
- notes
- is_active
- created_at
- updated_at

## 5) Key Business Rules
- All resources are user-scoped.
- Category name is unique per user.
- Only one budget per category per period.
- Closed periods cannot be edited.
- Amount validations:
  - budget max_amount >= 0
  - spending amount > 0
  - income amount > 0
- period end_date must be after start_date.

## 6) Current App Navigation
- Landing page with auth panel.
- Dashboard root with summary and analytics.
- Sub-pages:
  - Categories
  - Periods
  - Budgets
  - Spendings
  - Incomes
  - Settings

## 7) Target Backend Migration Direction
Planned architecture:
- Express.js API (TypeScript)
- PostgreSQL database
- Dockerized local dev and deployment foundation
- React/Next and React Native consume same API contracts

Use docs/BACKEND_BUILD_PROMPT.md to bootstrap backend generation.