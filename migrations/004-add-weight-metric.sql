-- This migration adds the "weight" metric to the metrics table
insert into metrics (name, unit) values ('weight', 'kg');
