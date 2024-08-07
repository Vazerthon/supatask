alter table "public"."task"
add column "deleted" boolean not null default false;
alter table "public"."task"
alter column "title"
set not null;
alter table "public"."task"
alter column "user_id"
set not null;
create policy "Users can update their own tasks" on "public"."task" as permissive for
update to public using (
    (
      (
        SELECT auth.uid() AS uid
      ) = user_id
    )
  );