-- Activate rls on all tables
alter table user_profiles enable row level security;
alter table entries enable row level security;
alter table goals enable row level security;

-- user_profiles: users can only see and change their own profile
create policy "users can view own profile"
  on user_profiles for select
  using (auth.uid() = id);

create policy "users can update own profile"
  on user_profiles for update
  using (auth.uid() = id);

create policy "users can insert own profile"
  on user_profiles for insert
  with check (auth.uid() = id);

-- entries: users can only see and change their own entries
create policy "users can view own entries"
  on entries for select
  using (auth.uid() = user_id);

create policy "users can update own entries"
  on entries for update
  using (auth.uid() = user_id);

create policy "users can insert own entries"
  on entries for insert
  with check (auth.uid() = user_id);

create policy "users can delete own entries"
  on entries for delete
  using (auth.uid() = user_id);

-- goals: users can only see and change their own goals
create policy "users can view own goals"
  on goals for select
  using (auth.uid() = user_id);

create policy "users can update own goals"
  on goals for update
  using (auth.uid() = user_id);

create policy "users can insert own goals"
  on goals for insert
  with check (auth.uid() = user_id);

create policy "users can delete own goals"
  on goals for delete
  using (auth.uid() = user_id);
