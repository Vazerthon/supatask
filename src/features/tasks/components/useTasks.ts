import { useCallback } from "react";
import useTaskStore from "../useTaskStore";
import { supabase } from "../../../supabaseClient";
import constants from "../../../constants";
import { Completion, Task } from "../../../types/types";

export default function useTasks() {
  const { frequency, frequencyPeriod } = useTaskStore();

  const addTask = useCallback(
    async (title: string) => {
      await supabase.from(constants.TASKS_TABLE).insert({ title, frequency });
    },
    [frequency]
  );

  const toggleTaskCompletion = useCallback(
    async (
      task: Task,
      complete: boolean,
      completionForCurrentPeriod?: Completion
    ) => {
      await supabase.from(constants.COMPLETION_TABLE).upsert({
        id: completionForCurrentPeriod?.id,
        task_id: task.id,
        period: frequencyPeriod[frequency],
        complete,
      });
    },
    [frequency, frequencyPeriod]
  );

  return {
    addTask,
    toggleTaskCompletion,
  };
}
