import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { Task } from "./types/types";
import CreateTask from "./CreateTask";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import constants from "./constants";

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  function getTasks() {
    supabase
      .from(constants.TASKS_TABLE)
      .select()
      .then(({ data }) => {
        setTasks(data || []);
      });
  }

  const handleRealtimeChange = useCallback(
    () => (payload: RealtimePostgresChangesPayload<Task>) => {
      if (payload.eventType === "INSERT" && payload.new) {
        setTasks([...tasks, payload.new]);
      }
    },
    [tasks]
  );

  const subscribeToTasks = useCallback(() => {
    supabase
      .channel("task-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: constants.TASKS_TABLE,
        },
        handleRealtimeChange
      )
      .subscribe();
  }, [handleRealtimeChange]);

  useEffect(() => {
    getTasks();
    subscribeToTasks();
  }, [subscribeToTasks]);

  return (
    <>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
      <CreateTask />
    </>
  );
}

export default TaskList;
