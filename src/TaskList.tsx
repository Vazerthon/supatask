import { useCallback, useEffect, useState } from "react";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";
import { Task } from "./types/types";
import CreateTask from "./CreateTask";
import constants from "./constants";

import { ListItem, UnorderedList } from "@chakra-ui/react";

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
      <UnorderedList>
        {tasks.map((task) => (
          <ListItem key={task.id}>{task.title}</ListItem>
        ))}
      </UnorderedList>
      <CreateTask />
    </>
  );
}

export default TaskList;
