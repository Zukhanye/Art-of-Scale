# Technical spec 001: Data partner tracker
From contract: docs/intent/001-data-partner-tracker.md · Owner of this file: the coding agent · Status: checked

## Data
| Table | Fields | Row level security | Notes (user_id + per-user policy; data class) |
|---|---|---|---|
| `partners` | `id` uuid pk default gen_random_uuid() · `user_id` uuid not null default auth.uid() references auth.users(id) · `name` text not null (1–120 chars, trimmed) · `partner_type` text not null, one of Hospital group / Pharmacy chain / Pathology lab / Clinic network / Other · `data_offered` text[] not null default '{}', each one of Dispensing records / Claims and billing / Lab results / Visit and attendance / Other · `sites` int null (0–100000) · `stage` text not null default 'Identified', one of Identified / In talks / Agreement drafting / Signed / Data flowing / Lost · `next_follow_up` date null · `created_at` timestamptz default now() · `updated_at` timestamptz default now() | On. `revoke all` from anon and authenticated. Grant `select, insert` and `update (stage, next_follow_up, updated_at)` to authenticated only. No delete. | Policies: `own_select` (auth.uid() = user_id), `own_insert` (with check auth.uid() = user_id), `own_update` (using and with check auth.uid() = user_id). Organisation details only; no people, no free text beyond the organisation name. Check constraints enforce the lists. |

Example made-up rows: Example Hospital Group (Hospital group, Dispensing records + Lab results, 40 sites, Identified) · Sample Pharmacy Chain (Pharmacy chain, Dispensing records, 120 sites, In talks) · Demo Pathology Lab (Pathology lab, Lab results, 15 sites, Agreement drafting).

SQL: `supabase/migrations/001_init.sql` (the Owner runs it in the Supabase SQL Editor).

## Screens and flow
- No session → `SignIn` (from `src/lib/auth.tsx`). Stranger sees only this.
- Signed in → **Partners** screen: header with Sign out; "Add a data partner" form (name, type, data checkboxes, sites, stage); list of partners. Empty list → "No partners yet. Add your first data partner above."
- Each row shows name, type, data, sites, a stage dropdown and a follow-up date field (slice 2).
- List sorted by follow-up date (overdue first, highlighted; no date last), with a stage filter (slice 2).
- `?status` → the factory status board and Passport (moved to `src/StatusBoard.tsx`).

## Vertical slices (each is shippable on its own)
1. Login + partners table + add form + list + empty state · proves scenario tests 1, 2, 3, 4, 5
2. Change stage and follow-up date on each row; sort by follow-up with overdue highlight; stage filter · proves 6, 7, 8

## Tests (one or more per acceptance criterion)
| Acceptance criterion | Test (Level 3: Coach checks the code and SQL; Owner tests by hand) |
|---|---|
| 1 Stranger sees only login | Open the live link in a private window: login form only. SQL: no grant to anon. |
| 2 Empty state | New account: empty-state message shown. |
| 3 Second user sees nothing | Break-it test with user B in a private window. SQL: every policy checks auth.uid() = user_id. |
| 4 Add partner | Add the example row; it appears with all details. |
| 5 Name required | Submit with an empty name: message "Please enter the organisation name", nothing saved (form check + not null + length check in SQL). |
| 6 Change stage and date | Change, refresh, values kept. |
| 7 Overdue highlight | Set a past date: row marked "Overdue", at the top. |
| 8 Filter | Pick "In talks": only those rows shown. |

## Risks and concerns
- Free-text risk: only the organisation name is free text; the form label says "Organisation name (no people's names)".
- If the Owner has not run the SQL yet, the app shows "The partners table is not set up yet" instead of failing silently.

## Changes during the build
- (none yet)
