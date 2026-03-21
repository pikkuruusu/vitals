-- Activity levels lookup table
CREATE TABLE activity_levels (
  id text primary key,
  label text not null,
  tdee_multiplier numeric not null,
  sort_order integer not null
);

