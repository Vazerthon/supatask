create type "public"."frequency" as enum ('daily', 'weekly', 'monthly', 'yearly');
drop policy "Users can insert tasks for themselves" on "public"."task";
create table "public"."completion" (
  "id" uuid not null default gen_random_uuid(),
  "task_id" uuid not null,
  "complete" boolean not null default false,
  "period" text not null,
  "user_id" uuid not null default auth.uid()
);
alter table "public"."completion" enable row level security;
alter table "public"."task"
add column "frequency" frequency not null default 'daily'::frequency;
CREATE UNIQUE INDEX "task-completion_pkey" ON public.completion USING btree (id);
alter table "public"."completion"
add constraint "task-completion_pkey" PRIMARY KEY using index "task-completion_pkey";
alter table "public"."completion"
add constraint "task-completion_taskId_fkey" FOREIGN KEY (task_id) REFERENCES task(id) not valid;
alter table "public"."completion" validate constraint "task-completion_taskId_fkey";
grant delete on table "public"."completion" to "anon";
grant insert on table "public"."completion" to "anon";
grant references on table "public"."completion" to "anon";
grant select on table "public"."completion" to "anon";
grant trigger on table "public"."completion" to "anon";
grant truncate on table "public"."completion" to "anon";
grant update on table "public"."completion" to "anon";
grant delete on table "public"."completion" to "authenticated";
grant insert on table "public"."completion" to "authenticated";
grant references on table "public"."completion" to "authenticated";
grant select on table "public"."completion" to "authenticated";
grant trigger on table "public"."completion" to "authenticated";
grant truncate on table "public"."completion" to "authenticated";
grant update on table "public"."completion" to "authenticated";
grant delete on table "public"."completion" to "service_role";
grant insert on table "public"."completion" to "service_role";
grant references on table "public"."completion" to "service_role";
grant select on table "public"."completion" to "service_role";
grant trigger on table "public"."completion" to "service_role";
grant truncate on table "public"."completion" to "service_role";
grant update on table "public"."completion" to "service_role";
create policy "Users can add task completions" on "public"."completion" as permissive for
insert to public with check (
    (
      (
        SELECT auth.uid() AS uid
      ) = user_id
    )
  );
create policy "Users can update their own task completions" on "public"."completion" as permissive for
update to public using (
    (
      (
        SELECT auth.uid() AS uid
      ) = user_id
    )
  );
create policy "Users can view their own task completions" on "public"."completion" as permissive for
select to public using (
    (
      (
        SELECT auth.uid() AS uid
      ) = user_id
    )
  );
create policy "Users can insert tasks for themselves" on "public"."task" as permissive for
insert to authenticated with check (
    (
      (
        SELECT auth.uid() AS uid
      ) = user_id
    )
  );