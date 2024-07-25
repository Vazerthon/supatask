import { useEffect } from "react";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import useTaskStore from "../hooks/useTaskStore";
import { supabase } from "../supabaseClient";
import constants from "../constants";
import { Task } from "../types/types";

export default function useTasks() {
  const { tasks, setTasks } = useTaskStore();

  useEffect(() => {
    const getTasks = () => {
      supabase
        .from(constants.TASKS_TABLE)
        .select()
        .then(({ data }) => {
          setTasks(data || []);
        });
    };
    getTasks();
  }, [setTasks]);

  useEffect(() => {
    const handleInserts = (payload: RealtimePostgresChangesPayload<Task>) => {
      if (payload.eventType === "INSERT" && payload.new) {
        setTasks([...tasks, payload.new]);
      }
    };

    const subscribeToTasks = () => {
      supabase
        .channel("task-inserts")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: constants.TASKS_TABLE,
          },
          handleInserts
        )
        .subscribe();
    };
    const unsubscribe = () => {
      supabase.channel("task-changes").unsubscribe();
    };

    subscribeToTasks();

    return unsubscribe;
  }, [tasks, setTasks]);

  const addTask = async (title: string) => {
    await supabase.from(constants.TASKS_TABLE).insert({ title });
  };

  return {
    addTask,
  };
}
