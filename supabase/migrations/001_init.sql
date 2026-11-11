-- Contract 001: Data partner tracker. Organisation details only: no patients, no people's names or contact details.
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  partner_type text not null check (partner_type in ('Hospital group', 'Pharmacy chain', 'Pathology lab', 'Clinic network', 'Other')),
  data_offered text[] not null default '{}'
    check (data_offered <@ array['Dispensing records', 'Claims and billing', 'Lab results', 'Visit and attendance', 'Other']::text[]),
  sites integer check (sites between 0 and 100000),
  stage text not null default 'Identified'
    check (stage in ('Identified', 'In talks', 'Agreement drafting', 'Signed', 'Data flowing', 'Lost')),
  next_follow_up date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.partners enable row level security;

-- Strangers (anon) get nothing. Logged-in users may read, add, and change only stage and follow-up date. No delete.
revoke all on table public.partners from anon, authenticated;
grant select, insert on table public.partners to authenticated;
grant update (stage, next_follow_up, updated_at) on table public.partners to authenticated;

-- Each logged-in user sees and changes only their own rows.
drop policy if exists own_select on public.partners;
create policy own_select on public.partners for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists own_insert on public.partners;
create policy own_insert on public.partners for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists own_update on public.partners;
create policy own_update on public.partners for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
