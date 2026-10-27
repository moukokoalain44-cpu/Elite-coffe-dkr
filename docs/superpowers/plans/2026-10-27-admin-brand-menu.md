# Elite Coffee Admin, Menu & Brand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Align the admin with Elite Coffee’s real on-site operations, provide authenticated CRUD for menu categories and dishes, and apply the logo and light gray/white/soft pink visual identity to public and admin surfaces.

**Architecture:** Remove order-specific UI and seeded order analytics from the admin. Keep reservations, menu products, and site media as the operational model. Add small Supabase CRUD helpers for `menu_products`, authenticated through the existing session, and make the catalog page a responsive editor with category management and local-media upload.

**Tech Stack:** React, TanStack Router, Tailwind CSS, Supabase JS, Recharts, Lucide.

**Spec:** User request 2026-10-27.

## Global Constraints

- Elite Coffee has no delivery or online ordering; no public or admin order workflow may remain.
- Menu edits are authenticated and persisted in Supabase.
- Stable media keys must remain stable; uploads use Supabase Storage.
- Public and admin UI share the same gray, white, and lightly saturated pink identity.
- Existing reservation and media workflows remain functional.

## Review Focus

- Order terminology or `/admin/orders` must not remain in navigation, dashboard copy, or generated routes.
- Menu CRUD must persist name, category, description, price, availability, visibility, and image URL.
- Upload failure and unsupported file formats must show a readable toast and preserve the previous image.
- Collapsed sidebar must remain navigable by icon/title and work on mobile.
- Logo must render from a real extracted asset, not a CSS approximation.

---

### Task 1: Remove irrelevant order operations

**Files:** `src/components/AdminChrome.tsx`, `src/routes/admin.index.tsx`, `src/routes/admin.analytics.tsx`, `src/contexts/AdminContext.tsx`, `src/routes/admin.orders.tsx`, `src/routeTree.gen.ts`, `public/manus-routes.json`.

- [ ] Remove seeded order state, order KPIs, order analytics, order navigation and the obsolete admin orders route.
- [ ] Replace dashboard metrics with reservations, visible menu items, categories, and editable media counts.
- [ ] Regenerate routes and verify no `orders`, `Commande`, `checkout`, or delivery wording remains in admin.

### Task 2: Add authenticated menu CRUD helpers

**Files:** `src/lib/supabase.ts`, `src/contexts/AdminContext.tsx`.

- [ ] Add `createMenuProduct`, `updateMenuProduct`, `deleteMenuProduct`, and `fetchMenuProductsAdmin` with explicit selected columns.
- [ ] Add category derivation and category deletion guard in the UI; deleting a category requires moving or deleting its products first.
- [ ] Keep RLS restricted to authenticated users for writes and public visibility limited to visible rows.

### Task 3: Rebuild the catalogue editor

**Files:** `src/routes/admin.catalog.tsx`.

- [ ] Add create/edit dialog or inline form for name, category, description, price, availability, visibility, featured, and image.
- [ ] Add `input[type=file]` upload to `site-media` under `menu/<product-id>/...`, then persist `image_url`.
- [ ] Add category list, add category flow, delete category guard, product deletion confirmation, search and pagination.

### Task 4: Apply brand asset and visual system

**Files:** `public/assets/brand/elite-coffee-logo.png`, `src/components/SiteChrome.tsx`, `src/components/AdminChrome.tsx`, `src/styles.css`, `src/data/site.ts`.

- [ ] Use the extracted logo in public and admin headers.
- [ ] Replace orange/brown admin accents with soft pink, graphite, white and light gray tokens while preserving accessible contrast.
- [ ] Improve sidebar active states, collapse affordance, profile block, cards and responsive spacing.

### Task 5: Verify and publish

- [ ] Run Prettier, typecheck, tests and production build.
- [ ] Run SQL checks for menu rows and RLS behavior.
- [ ] Test public home/menu and authenticated admin catalog/media routes.
- [ ] Commit and push to `main` for Vercel deployment.
