import { useCallback } from "react";
import useTaskStore from "../useTaskStore";
import { supabase } from "../../../supabaseClient";
import constants from "../../../constants";
import { Completion, Label, Task } from "../../../types/types";

export default function useTasks() {
  const {
    frequency,
    frequencyPeriod,
    setTaskLabelsForTask,
    deleteTask: storeDeleteTask,
  } = useTaskStore();

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
        completed_at: complete ? new Date().toISOString() : null,
      });
    },
    [frequency, frequencyPeriod]
  );

  const getTaskLabelsForTask = useCallback(
    (taskId: Task["id"]) => {
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

  const deleteTask = useCallback(
    (taskId: Task["id"]) => {
      supabase
        .from(constants.TASKS_TABLE)
        .update({ deleted: true })
        .eq("id", taskId)
        .then(() => {
          storeDeleteTask(taskId);
        });
    },
    [storeDeleteTask]
  );

  const addTaskNote = useCallback(
    async (
      task: Task,
      note: string,
      completionForCurrentPeriod?: Completion
    ) => {
      await supabase.from(constants.COMPLETION_TABLE).upsert({
        id: completionForCurrentPeriod?.id,
        task_id: task.id,
        period: frequencyPeriod[frequency],
        note,
      });
    },
    [frequency, frequencyPeriod]
  );

  return {
    addTask,
    toggleTaskCompletion,
    getTaskLabelsForTask,
    deleteTask,
    addTaskNote,
  };
}
