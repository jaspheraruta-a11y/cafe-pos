# Brew & Co — Cafe Web Ordering & POS

A full-stack, responsive cafe ordering and Point of Sale (POS) system with a warm, coffee-themed UI.

## Features

- **Landing page** — Hero, menu preview, testimonials, about, location (Google Maps), contact, promos
- **Auth** — Login, sign up, forgot password (Supabase Auth); role-based: Admin, Client, Rider
- **Customer** — Browse menu, cart, checkout, order history, order tracking, profile
- **Admin / POS** — Sales dashboard, POS (walk-in orders), order management, products, riders, promos
- **Rider** — Delivery list, status updates, history, earnings
- **Database** — Supabase (PostgreSQL) with schema and RLS
- **Payments** — Structure for Cash, GCash, Card, COD; ready for Stripe/PayMongo integration

## Tech stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Radix-style UI components
- **Backend / DB:** Supabase (Auth, Database, optional Realtime)
- **State:** Zustand (cart)

## Setup

1. **Clone and install**

   ```bash
   cd cafe-pos
   npm install
   ```

2. **Supabase**

   - Create a project at [supabase.com](https://supabase.com).
   - In the SQL Editor, run the contents of `supabase/schema.sql`.
   - In Project Settings → API, copy the project URL and anon key.

3. **Environment**

   - Copy `.env.example` to `.env.local`.
   - Set:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## First admin user

Supabase Auth does not set `profiles.role` by default. To make a user an admin:

1. Sign up or log in as that user.
2. In Supabase Dashboard → Table Editor → `profiles`, find the row by `id` (same as `auth.users.id`) and set `role` to `admin`.

Then log in and go to `/admin`.

## Project structure

- `src/app/` — Routes: `/` (landing), `/login`, `/signup`, `/order`, `/checkout`, `/dashboard/*`, `/admin/*`, `/rider/*`
- `src/components/` — UI and landing sections
- `src/lib/` — Supabase client/server, utils
- `src/store/` — Cart (Zustand)
- `src/types/` — Shared TS types
- `supabase/schema.sql` — Full DB schema for Supabase SQL Editor
- `docs/API.md` — API and integration notes

## Payments and maps

- **Payments:** Integrate Stripe, PayMongo, or GCash in `checkout` and/or API routes; update `payments` (and optionally `orders`) on success.
- **Maps:** Add a map component (Google Maps or Mapbox) for delivery tracking; use `riders.current_lat/lng` and `delivery_tracking` as needed.

See `docs/API.md` for details.

## License

MIT.
