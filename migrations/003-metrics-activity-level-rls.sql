-- This migration adds Row Level Security policies to allow anyone to view activity levels and metrics.
create policy "anyone can view activity levels"
  on activity_levels for select
  using (true);

create policy "anyone can view metrics"
  on metrics for select
  using (true);
