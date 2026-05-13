# Prompt: Build GrowthHub Backend + Database

Use this prompt in your coding AI to generate the backend.

## Prompt
You are a senior backend engineer. Build a production-ready Express.js backend for GrowthHub with PostgreSQL and Docker.

### Tech Stack
- Node.js + Express + TypeScript
- PostgreSQL
- Prisma ORM
- Zod for validation
- Clerk JWT for auth middleware
- Docker + Docker Compose

### Objective
Implement a clean REST API consumed by:
- Next.js web frontend
- React Native mobile app

### API Base
- /api/v1

### Modules to Implement
1. auth
- GET /api/v1/auth/me
- Verify Clerk token and upsert app user if missing.

2. users/settings
- PATCH /api/v1/users/me/currency
- Allowed: USD, EUR, MAD, GBP, CAD, AED.

3. categories
- GET /api/v1/categories?includeArchived=true|false
- POST /api/v1/categories
- PATCH /api/v1/categories/:id
- PATCH /api/v1/categories/:id/archive
- DELETE /api/v1/categories/:id

4. periods
- GET /api/v1/periods
- GET /api/v1/periods/:id
- POST /api/v1/periods
- PATCH /api/v1/periods/:id
- PATCH /api/v1/periods/:id/close
- DELETE /api/v1/periods/:id

5. budgets
- GET /api/v1/periods/:periodId/budgets
- POST /api/v1/budgets
- PATCH /api/v1/budgets/:id
- DELETE /api/v1/budgets/:id

6. spendings
- GET /api/v1/periods/:periodId/spendings
- POST /api/v1/spendings
- PATCH /api/v1/spendings/:id
- DELETE /api/v1/spendings/:id

7. incomes
- GET /api/v1/incomes
- GET /api/v1/incomes/active
- POST /api/v1/incomes
- PATCH /api/v1/incomes/:id
- PATCH /api/v1/incomes/:id/active
- DELETE /api/v1/incomes/:id

8. dashboard
- GET /api/v1/dashboard
- Return:
  - stats: totalSpent, totalBudget, estimatedMonthlyIncome, txCount, periodName
  - weeklyDays (last 7 days)
  - budgetProgress
  - recentTransactions (limit 8)
  - currency

### Database Schema (Prisma)
Create models:
- User
- Category
- TrackingPeriod
- Budget
- Spending
- Income

Required constraints:
- user.clerk_id unique
- category unique(user_id, name)
- budget unique(tracking_period_id, category_id)

Include timestamps and relations with cascade behavior where appropriate.

### Business Rules
- All resources must be strictly user-owned.
- Never expose cross-user data.
- Return 404 for not-found or not-owned resources.
- Category archive is soft behavior via is_archived flag.
- Closed period cannot be updated.
- Period validation: end_date > start_date.
- Numeric validation:
  - budget max_amount >= 0
  - spending amount > 0
  - income amount > 0

### Monthly Income Estimation Logic
Convert active incomes to monthly:
- weekly: amount * 52 / 12
- bi_weekly: amount * 26 / 12
- monthly: amount
- quarterly: amount / 3
- yearly: amount / 12
- once: 0

### Current Period Selection
For dashboard:
- select latest open period
- if none, select latest period by start_date desc

### Error Handling
Use consistent shape:
- success: { data }
- error: { error: { code, message, details? } }

Status mapping:
- 400 validation
- 401 unauthorized
- 404 not found/not owned
- 409 conflict (unique violations)
- 500 server errors

### Architecture
- Feature-based modules: controller, service, repository, schema, routes
- Middlewares: auth, validate, error-handler
- OpenAPI docs
- Basic unit tests for services and integration tests for key routes

### Docker Requirements
Create:
- Dockerfile for API
- docker-compose.yml with:
  - api
  - postgres
- healthchecks
- persistent volume for postgres data
- env examples

### Output Format
Return:
1. project folder tree
2. Prisma schema
3. key implementation files
4. Docker files
5. migration and run commands
6. quick curl test commands

### Extra
Generate seed data for one demo user including:
- categories
- one open period
- budgets
- spendings
- incomes
