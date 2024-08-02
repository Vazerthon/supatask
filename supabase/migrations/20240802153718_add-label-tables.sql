create table "public"."label" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null default auth.uid(),
  "text" text not null,
  "color_hex" text not null
);
alter table "public"."label" enable row level security;
create table "public"."task_label" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null default auth.uid(),
  "task_id" uuid not null,
  "label_id" uuid not null
);
alter table "public"."task_label" enable row level security;
CREATE UNIQUE INDEX label_pkey ON public.label USING btree (id);
CREATE UNIQUE INDEX task_label_pkey ON public.task_label USING btree (id);
alter table "public"."label"
add constraint "label_pkey" PRIMARY KEY using index "label_pkey";
alter table "public"."task_label"
add constraint "task_label_pkey" PRIMARY KEY using index "task_label_pkey";
alter table "public"."task_label"
add constraint "task_label_label_id_fkey" FOREIGN KEY (label_id) REFERENCES label(id) not valid;
alter table "public"."task_label" validate constraint "task_label_label_id_fkey";
alter table "public"."task_label"
add constraint "task_label_task_id_fkey" FOREIGN KEY (task_id) REFERENCES task(id) not valid;
alter table "public"."task_label" validate constraint "task_label_task_id_fkey";
grant insert on table "public"."label" to "authenticated";
grant references on table "public"."label" to "authenticated";
grant select on table "public"."label" to "authenticated";
grant trigger on table "public"."label" to "authenticated";
grant update on table "public"."label" to "authenticated";
grant insert on table "public"."task_label" to "authenticated";
grant references on table "public"."task_label" to "authenticated";
grant select on table "public"."task_label" to "authenticated";
grant trigger on table "public"."task_label" to "authenticated";
grant update on table "public"."task_label" to "authenticated";
create policy "User can create their own labels" on "public"."label" as permissive for
insert to public with check (
    (
      (
        SELECT auth.uid() AS uid
      ) = user_id
    )
  );
create policy "Users can view their own labels" on "public"."label" as permissive for
select to public using (
    (
      (
        SELECT auth.uid() AS uid
      ) = user_id
    )
  );
create policy "Users can create task labels" on "public"."task_label" as permissive for
insert to public with check (
    (
      (
        SELECT auth.uid() AS uid
      ) = user_id
    )
  );
create policy "Users can select task labels" on "public"."task_label" as permissive for
select to public using (
    (
      (
        SELECT auth.uid() AS uid
      ) = user_id
    )
  );