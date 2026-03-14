# Cafe POS — API & Integration

## Overview

The app uses **Next.js App Router** and **Supabase** for backend. Most data flows through the Supabase client (browser or server). This doc describes patterns and where to add external APIs.

## Authentication

- **Provider:** Supabase Auth
- **Storage:** JWT in HTTP-only cookies (handled by `@supabase/ssr`)
- **Roles:** Stored in `profiles.role` (`admin` | `client` | `rider`)

### Protecting routes

- **Server:** In layout or page, call `createClient()` from `@/lib/supabase/server`, then `supabase.auth.getUser()`. Redirect if unauthenticated.
- **Role check:** Query `profiles` for `role` and redirect (e.g. admin → `/admin`, rider → `/rider`).

## Database (Supabase)

All tables and RLS are defined in `supabase/schema.sql`. Run that file in the Supabase SQL Editor.

### Main tables

| Table               | Purpose                    |
|---------------------|----------------------------|
| `profiles`          | User profile + role        |
| `riders`            | Rider profile (vehicle, availability) |
| `categories`        | Menu categories            |
| `products`          | Menu items                 |
| `product_sizes`     | Size options + price       |
| `product_addons`    | Add-ons + price            |
| `orders`            | Order header               |
| `order_items`       | Order lines                |
| `payments`          | Payment record per order   |
| `delivery_tracking` | Status + optional lat/lng  |
| `promos`            | Discount codes             |
| `inventory`         | Stock (for alerts)          |
| `sales_reports`     | Daily aggregates           |
| `admin_logs`        | Admin activity             |

### Real-time (optional)

Subscribe to order changes:

```ts
const channel = supabase
  .channel('orders')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
    console.log('Order update', payload);
  })
  .subscribe();
```

Use in customer order status page or admin live orders.

## Application “API” (Next.js)

- **Server Components:** Fetch via `createClient()` from `@/lib/supabase/server` in layout/page.
- **Client Components:** Use `createClient()` from `@/lib/supabase/client`.
- **Actions:** For mutations from forms, you can add Server Actions in `src/app/.../actions.ts` that use the server Supabase client and redirect or revalidate.

No separate REST API is required for core CRUD; Supabase is the API. If you add one (e.g. Express), it would sit alongside Next.js and use the same Supabase project (service role for admin operations).

## Payment integration

- **Current:** Orders and payments are stored in `orders` and `payments` (method: `cash` | `gcash` | `card` | `cod`, status: `pending` | `paid` | `failed`).
- **To integrate:**
  - **Stripe:** Use Stripe Checkout or Elements; on success, call Supabase to set `payments.status = 'paid'` and `payments.paid_at`, and optionally `orders.status = 'confirmed'`.
  - **PayMongo / GCash:** Same idea: redirect or webhook → update `payments` (and optionally `orders`) in Supabase.

Add API routes under `src/app/api/` (e.g. `src/app/api/webhooks/stripe/route.ts`) for webhooks; use `NEXT_PUBLIC_*` only for publishable keys in the client.

## Maps (delivery tracking)

- **Current:** No map component; `delivery_tracking` and `riders` have `lat`/`lng` fields.
- **To add:** Use Google Maps or Mapbox in a client component:
  - Load map with rider and/or destination.
  - Update rider position (e.g. from app or driver app) into `riders.current_lat/lng` or `delivery_tracking`.
  - Optionally compute ETA and store in `delivery_tracking.eta_minutes`.

Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (or Mapbox token) in `.env.local`.

## Summary

| Area           | Where it lives                    | Notes                          |
|----------------|-----------------------------------|--------------------------------|
| Auth           | Supabase Auth + `profiles`        | JWT in cookies, role in DB     |
| CRUD           | Supabase client (server/client)   | RLS enforces access            |
| Payments       | `payments` table + external API   | Webhook/redirect → update DB   |
| Maps           | Client component + API key         | Optional; DB ready for lat/lng |
| Real-time      | Supabase Realtime                 | Subscribe to `orders` if needed|

For a full REST API doc (e.g. OpenAPI), you can add a separate spec once you introduce custom API routes or an external backend.
