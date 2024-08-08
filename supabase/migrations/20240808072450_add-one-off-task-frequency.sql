alter table "public"."task" alter column "frequency" drop default;

alter type "public"."frequency" rename to "frequency__old_version_to_be_dropped";

create type "public"."frequency" as enum ('one off', 'daily', 'weekly', 'monthly', 'yearly');

alter table "public"."task" alter column frequency type "public"."frequency" using frequency::text::"public"."frequency";

alter table "public"."task" alter column "frequency" set default 'daily'::frequency;

drop type "public"."frequency__old_version_to_be_dropped";

