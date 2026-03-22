-- Activity levels lookup table
create table activity_levels (
  id text primary key,
  label text not null,
  tdee_multiplier numeric not null,
  sort_order integer not null
);

-- User profiles
create table user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  height_cm numeric,
  birth_date date,
  default_activity_level text references activity_levels(id),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Metrics catalog
create table metrics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  unit text
);

-- Entries
create table entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  metric_id uuid references metrics(id) on delete cascade not null,
  value numeric not null,
  comment text,
  noted_at timestamptz not null,
  created_at timestamptz default now() not null
);

-- Goals
create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  metric_id uuid references metrics(id) on delete cascade not null,
  target_value numeric not null,
  target_date date not null,
  created_at timestamptz default now() not null
);

-- Seed activity levels
insert into activity_levels (id, label, tdee_multiplier, sort_order) values
  ('sedentary',         'Sedentary',             1.25, 1),
  ('lightly_active',   'Lightly Active',         1.4,  2),
  ('moderately_active','Moderately Active',       1.5,  3),
  ('active',           'Active',                 1.65, 4),
  ('very_active',      'Very Active',            1.8,  5),
  ('extremely_active', 'Extremely Active',       2.0,  6);

