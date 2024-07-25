import { useEffect } from "react";
import {
  getDayOfYear,
  getMonth,
  getWeek,
  getYear,
  startOfToday,
} from "date-fns";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import useTaskStore from "../hooks/useTaskStore";
import { supabase } from "../supabaseClient";
import constants from "../constants";
import { Task } from "../types/types";

export default function useTasks() {
  const { tasks, setTasks, frequency } = useTaskStore();

  const today = startOfToday();
  const year = `year-${getYear(today)}`;
  const day = `day-${getDayOfYear(today)}-${getYear(today)}`;
  const week = `week-${getWeek(today)}-${getYear(today)}`;
  const month = `month-${getMonth(today)}-${getYear(today)}`;

  useEffect(() => {
    const getTasks = () => {
      supabase
        .from(constants.TASKS_TABLE)
        .select(`*, completion(*)`)
        .eq("frequency", frequency)
        .then(({ data }) => {
          setTasks(data || []);
        });
    };
    getTasks();
  }, [setTasks, frequency]);

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
            filter: `frequency=eq.${frequency}`,
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
  }, [tasks, setTasks, frequency]);

  const addTask = async (title: string) => {
    await supabase.from(constants.TASKS_TABLE).insert({ title, frequency });
  };

  return {
    addTask,
  };
}
