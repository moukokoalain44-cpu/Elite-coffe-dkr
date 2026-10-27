# Elite Coffee Reservations, Sidebar & Admin UX Implementation Plan

> **For agentic workers:** Native execution in the current session; follow the tasks in order.

**Goal:** Improve navigation clarity, compact the catalogue, separate admin media concerns, export reservations as a structured PDF, and enforce terminal reservation status transitions in Supabase.

**Architecture:** Keep the existing React/TanStack app. Use independent scroll containers for admin and public mobile panels, a hover-expanded desktop admin rail, a compact category disclosure in the catalogue, and a right-side editor drawer. Generate reservation PDFs with jsPDF text/table layout rather than screen capture. Enforce status transitions in both UI and a Supabase trigger.

**Tech Stack:** React, TanStack Router, Supabase, Tailwind, jsPDF.

## Tasks

- [ ] Replace all user-facing “inscription” wording by “réservation”; add date-filtered structured PDF export.
- [ ] Add transition guard: pending → confirmed/cancelled; confirmed → cancelled only; cancelled terminal.
- [ ] Make admin sidebar hover-expand/collapse with icon-only compact state and independent scroll.
- [ ] Add overlay treatment and independent mobile menu scroll to public navigation.
- [ ] Compact catalogue categories into one expandable row and move product editor to a right drawer.
- [ ] Separate admin Galerie and Contenu routes and navigation.
- [ ] Run typecheck, tests, build, push, and verify production routes.
