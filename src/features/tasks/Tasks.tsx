import { useCallback, useEffect } from "react";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import useTaskStore from "../../hooks/useTaskStore";
import { supabase } from "../../supabaseClient";
import constants from "../../constants";
import { Completion, Task } from "../../types/types";

import TaskList from "./components/TaskList";
import CreateTask from "./components/CreateTask";

export default function Tasks() {
  const {
    setTasks,
    frequency,
    addTask: addTaskToStore,
    addCompletionToTask,
    updateCompletionForTask,
  } = useTaskStore();

  const makeTaskFromPayload = useCallback(
    (task: Task): Task => ({
      ...task,
      completion: task.completion || [],
    }),
    []
  );

  useEffect(() => {
    const getTasks = () => {
      supabase
        .from(constants.TASKS_TABLE)
        .select(`*, ${constants.COMPLETION_TABLE}(*)`)
        .eq("frequency", frequency)
        .then(({ data }) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          setTasks(data || []);
        });
    };
    getTasks();
  }, [frequency, setTasks]);

  useEffect(() => {
    const handleCompletionChanges = (
      payload: RealtimePostgresChangesPayload<Completion>
    ) => {
      if (payload.eventType === "INSERT") {
        addCompletionToTask(payload.new.task_id, payload.new);
      }
      if (payload.eventType === "UPDATE") {
        updateCompletionForTask(payload.new.task_id, payload.new);
      }
    };

    const channel = "completion-changes";
    const subscribeToCompletionChanges = () => {
      supabase
        .channel(channel)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: constants.COMPLETION_TABLE,
          },
          handleCompletionChanges
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: constants.COMPLETION_TABLE,
          },
          handleCompletionChanges
        )
        .subscribe();
    };
    const unsubscribe = () => {
      supabase.channel(channel).unsubscribe();
    };

    subscribeToCompletionChanges();

    return unsubscribe;
  }, [addCompletionToTask, addTaskToStore, frequency, updateCompletionForTask]);

  useEffect(() => {
    const handleTaskInserts = (
      payload: RealtimePostgresChangesPayload<Task>
    ) => {
      if (payload.eventType === "INSERT" && payload.new) {
        addTaskToStore(makeTaskFromPayload(payload.new));
      }
    };
    const channel = "task-changes";
    const subscribeToTasks = () => {
      supabase
        .channel(channel)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: constants.TASKS_TABLE,
            filter: `frequency=eq.${frequency}`,
          },
          handleTaskInserts
        )
        .subscribe();
    };
    const unsubscribe = () => {
      supabase.channel(channel).unsubscribe();
    };

    subscribeToTasks();

    return unsubscribe;
  }, [addTaskToStore, frequency, makeTaskFromPayload]);

  return (
    <>
      <TaskList />
      <CreateTask />
    </>
  );
}
