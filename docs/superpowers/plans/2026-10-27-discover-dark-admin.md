# Discover Elite Coffee & Dark Theme Implementation Plan

> **For agentic workers:** Native execution in the current session.

**Goal:** Add an editorial “Découvrez Elite Coffee” section, a media-managed interior gallery, functional admin profile/notifications, and robust dark-mode styling.

**Architecture:** Keep the current TanStack/React routes. Add reusable public section components driven by stable media keys, use CSS variables plus scoped dark overrides for the existing hard-coded admin palette, store admin profile preferences locally, and derive notifications from pending reservations.

**Tech Stack:** React, Tailwind CSS v4, Supabase media table, Lucide icons.

## Tasks

- [ ] Add stable interior media keys and seed them in Supabase.
- [ ] Add six-card Discover and three-image Favorite Space sections with hover/parallax behavior.
- [ ] Correct dark mode for public/admin surfaces, forms, borders, text and overlays.
- [ ] Replace pencil icons with Image/FileText icons; add editable admin name/avatar in Settings.
- [ ] Make top-bar notifications open a useful pending-reservation panel.
- [ ] Validate typecheck, tests, build and production routes.
