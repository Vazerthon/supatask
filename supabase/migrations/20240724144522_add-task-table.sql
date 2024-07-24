create table "public"."task" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid default auth.uid(),
  "title" text
);
alter table "public"."task" enable row level security;
CREATE UNIQUE INDEX task_pkey ON public.task USING btree (id);
alter table "public"."task"
add constraint "task_pkey" PRIMARY KEY using index "task_pkey";
alter table "public"."task"
add constraint "task_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;
alter table "public"."task" validate constraint "task_user_id_fkey";
grant delete on table "public"."task" to "authenticated";
grant insert on table "public"."task" to "authenticated";
grant references on table "public"."task" to "authenticated";
grant select on table "public"."task" to "authenticated";
grant trigger on table "public"."task" to "authenticated";
grant truncate on table "public"."task" to "authenticated";
grant update on table "public"."task" to "authenticated";
grant delete on table "public"."task" to "service_role";
grant insert on table "public"."task" to "service_role";
grant references on table "public"."task" to "service_role";
grant select on table "public"."task" to "service_role";
grant trigger on table "public"."task" to "service_role";
grant truncate on table "public"."task" to "service_role";
grant update on table "public"."task" to "service_role";
create policy "User can see their own tasks" on "public"."task" as permissive for
select to public using (
    (
      (
        SELECT auth.uid() AS uid
      ) = user_id
    )
  );
create policy "Users can insert tasks for themselves" on "public"."task" as permissive for
insert to authenticated with check (true);