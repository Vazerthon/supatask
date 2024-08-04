import { useCallback } from "react";
import useTaskStore from "../useTaskStore";
import { supabase } from "../../../supabaseClient";
import constants from "../../../constants";
import { Completion, Label, Task } from "../../../types/types";

export default function useTasks() {
  const { frequency, frequencyPeriod, setTaskLabelsForTask } = useTaskStore();

  const createTaskLabels = useCallback(
    async (taskId: Task["id"], labels: Label[]) => {
      const taskLabels = labels.map((label) => ({
        task_id: taskId,
        label_id: label.id,
      }));
      await supabase.from(constants.TASK_LABEL_TABLE).insert(taskLabels);
    },
    []
  );

  const addTask = useCallback(
    async (title: string, labels: Label[]) => {
      const taskResult = await supabase
        .from(constants.TASKS_TABLE)
        .insert({ title, frequency })
        .select("id");

      const taskId = taskResult.data ? taskResult.data[0].id : null;
      if (!taskId || !labels.length) {
        return;
      }

      await createTaskLabels(taskId, labels);
    },
    [createTaskLabels, frequency]
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

  const getTaskLabelsForTask = useCallback(
    (taskId: string) => {
      supabase
        .from(constants.TASK_LABEL_TABLE)
        .select()
        .eq("task_id", taskId)
        .then(({ data }) => {
          if (data) {
            setTaskLabelsForTask(taskId, data);
          }
        });
    },
    [setTaskLabelsForTask]
  );

  return {
    addTask,
    toggleTaskCompletion,
    getTaskLabelsForTask,
  };
}
