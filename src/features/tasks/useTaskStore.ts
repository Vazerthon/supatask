import { create } from "zustand";
import { useCallback } from "react";
import { supabase } from "../../supabaseClient";
import constants from "../../constants";
import { Completion, Task, TaskLabel, Label } from "../../types/types";

import {
  today,
  day,
  week,
  month,
  year,
  formatDay,
  formatWeekOfYear,
  formatMonthOfYear,
  formatYear,
} from "../../date-helpers";
type Frequency = "one off" | "daily" | "weekly" | "monthly" | "yearly";
type Sort = "alphabetical" | "completion";

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  updateTask: (task: Task) => void;
  addTask: (task: Task) => void;
  setTaskLabelsForTask: (taskId: Task["id"], labels: TaskLabel[]) => void;
  frequencies: ["one off", "daily", "weekly", "monthly", "yearly"];
  frequency: Frequency;
  setFrequency: (frequency: Frequency) => void;
  day: string;
  week: string;
  month: string;
  year: string;
  frequencyPeriod: Record<Frequency, string>;
  frequencyLabel: Record<Frequency, string>;
  deleteTask: (taskId: Task["id"]) => void;
  sortTasksBy: Sort;
}

const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  setTasks: (tasks: Task[]) => set({ tasks }),
  updateTask: (task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    })),
  addTask: (task: Task) => set((state) => ({ tasks: [...state.tasks, task] })),
  setTaskLabelsForTask: (taskId, labels) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, task_label: labels } : task
      ),
    }));
  },
  frequencies: ["one off", "daily", "weekly", "monthly", "yearly"],
  frequency: "one off",
  setFrequency: (frequency: Frequency) => set({ frequency }),
  day,
  week,
  month,
  year,
  frequencyPeriod: {
    "one off": "one off",
    daily: day,
    weekly: week,
    monthly: month,
    yearly: year,
  },
  frequencyLabel: {
    "one off": "One time tasks to be done",
    daily: `To do today, ${formatDay(today)}`,
    weekly: `To do in week ${formatWeekOfYear(today)}`,
    monthly: `To do in ${formatMonthOfYear(today)}`,
    yearly: `To do in ${formatYear(today)}`,
  },
  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
  sortTasksBy: "completion",
}));

export const useFrequency = () => useTaskStore((state) => state.frequency);
export const useFrequencies = () => useTaskStore((state) => state.frequencies);
export const useSetFrequency = () =>
  useTaskStore((state) => state.setFrequency);

export const useAddCompletionToTask = () => {
  const updateTask = useTaskStore((state) => state.updateTask);
  const frequencyPeriod = useTaskStore((state) => state.frequencyPeriod);

  return useCallback(
    (taskId: Task["id"], completion: Completion) => {
      const task = useTaskStore.getState().tasks.find((t) => t.id === taskId);
      if (!task) {
        return;
      }
      updateTask({
        ...task,
        completion: [...task.completion, completion],
        completionForCurrentPeriod:
          completion.period === frequencyPeriod[task.frequency]
            ? completion
            : task.completionForCurrentPeriod,
      });
    },
    [updateTask, frequencyPeriod]
  );
};
export const useUpdateCompletionForTask = () => {
  const updateTask = useTaskStore((state) => state.updateTask);
  const frequencyPeriod = useTaskStore((state) => state.frequencyPeriod);

  return useCallback(
    (taskId: Task["id"], completion: Completion) => {
      const task = useTaskStore.getState().tasks.find((t) => t.id === taskId);
      if (!task) {
        return;
      }
      updateTask({
        ...task,
        completion: task.completion.map((c) =>
          c.id === completion.id ? completion : c
        ),
        completionForCurrentPeriod:
          completion.period === frequencyPeriod[task.frequency]
            ? completion
            : task.completionForCurrentPeriod,
      });
    },
    [updateTask, frequencyPeriod]
  );
};

export const useFrequencyLabel = () =>
  useTaskStore((state) => state.frequencyLabel);

const addCompletionForCurrentPeriod =
  (frequencyPeriod: Record<Frequency, string>) =>
  (task: Task): Task => ({
    ...task,
    completionForCurrentPeriod: task.completion.find(
      (c) => c.period === frequencyPeriod[task.frequency]
    ),
  });

export const useAddTask = () => {
  const addTaskInStore = useTaskStore((state) => state.addTask);
  const frequencyPeriod = useTaskStore((state) => state.frequencyPeriod);

  const addTask = useCallback(
    (task: Task) => {
      addTaskInStore(addCompletionForCurrentPeriod(frequencyPeriod)(task));
    },
    [addTaskInStore, frequencyPeriod]
  );

  return addTask;
};

export const useSetTasks = () => {
  const setTasksInStore = useTaskStore((state) => state.setTasks);
  const frequencyPeriod = useTaskStore((state) => state.frequencyPeriod);

  const setTasks = useCallback(
    (tasks: Task[]) => {
      setTasksInStore(
        tasks.map(addCompletionForCurrentPeriod(frequencyPeriod))
      );
    },
    [setTasksInStore, frequencyPeriod]
  );

  return setTasks;
};

const sortTasksByCompletion = (tasks: Task[]): Task[] => {
  return tasks.sort((a, b) => {
    if (
      a.completionForCurrentPeriod?.complete ===
      b.completionForCurrentPeriod?.complete
    ) {
      return a.title.localeCompare(b.title);
    }
    return a.completionForCurrentPeriod?.complete ? 1 : -1;
  });
};

const sortTasksByAlphabetical = (tasks: Task[]): Task[] => {
  return tasks.sort((a, b) => {
    return a.title.localeCompare(b.title);
  });
};

const sortingFunctions = {
  alphabetical: sortTasksByAlphabetical,
  completion: sortTasksByCompletion,
};

export const useTasksList = () => {
  const tasks = useTaskStore((state) => state.tasks);

  const sortTasksBy = useTaskStore((state) => state.sortTasksBy);
  return sortingFunctions[sortTasksBy](tasks);
};

export function useTasksApi() {
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
