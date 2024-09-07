import { create } from "zustand";
import { useCallback, useEffect } from "react";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
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
  hideCompleted: boolean;
  setHideCompleted: (hideCompleted: boolean) => void;
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
  hideCompleted: false,
  setHideCompleted: (hideCompleted) => set({ hideCompleted }),
}));

export const useFrequency = () => useTaskStore((state) => state.frequency);
export const useFrequencies = () => useTaskStore((state) => state.frequencies);
export const useSetFrequency = () =>
  useTaskStore((state) => state.setFrequency);
export const useHideCompleted = () =>
  useTaskStore((state) => state.hideCompleted);
export const useSetHideCompleted = () =>
  useTaskStore((state) => state.setHideCompleted);

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

const sortTasksByCompletion = (a: Task, b: Task) => {
  if (
    a.completionForCurrentPeriod?.complete ===
    b.completionForCurrentPeriod?.complete
  ) {
    return a.title.localeCompare(b.title);
  }
  return a.completionForCurrentPeriod?.complete ? 1 : -1;
};

const sortTasksByAlphabetical = (a: Task, b: Task) => {
  return a.title.localeCompare(b.title);
};

const sortingFunctions = {
  alphabetical: sortTasksByAlphabetical,
  completion: sortTasksByCompletion,
};

const filterCompleted = (task: Task) =>
  !task.completionForCurrentPeriod?.complete;

const makeIncludesRequiredLabelFilter =
  (labelsFilter: Record<Label["id"], Label>) => (task: Task) => {
    const unlabelledEnabled = labelsFilter?.["unlabelled"]?.enabled;
    const taskHasNoLabels = task.task_label.length === 0;
    return (
      (unlabelledEnabled && taskHasNoLabels) ||
      task.task_label.some((tl) => {
        return labelsFilter?.[tl.label_id]?.enabled;
      })
    );
  };

export const useTasksList = (labelsFilter: Record<Label["id"], Label>) => {
  const tasks = useTaskStore((state) => state.tasks);
  const hideCompleted = useTaskStore((state) => state.hideCompleted);
  const sortTasksBy = useTaskStore((state) => state.sortTasksBy);

  const sorter = sortingFunctions[sortTasksBy];
  const completedFilter = hideCompleted ? filterCompleted : () => true;
  const includesRequiredLabelFilter =
    makeIncludesRequiredLabelFilter(labelsFilter);

  const filteredTasks = tasks
    .sort(sorter)
    .filter(completedFilter)
    .filter(includesRequiredLabelFilter);

  return {
    tasks: filteredTasks,
    hiddenCount: tasks.length - filteredTasks.length,
  };
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

export function useSubscribeToTaskEvents() {
  const frequency = useFrequency();
  const addCompletionToTask = useAddCompletionToTask();
  const updateCompletionForTask = useUpdateCompletionForTask();

  const addTaskToStore = useAddTask();
  const setTasks = useSetTasks();

  const { getTaskLabelsForTask } = useTasksApi();

  const makeTaskFromPayload = useCallback(
    (task: Task): Task => ({
      ...task,
      completion: task.completion || [],
      task_label: task.task_label || [],
    }),
    []
  );

  useEffect(() => {
    const getTasks = () => {
      supabase
        .from(constants.TASKS_TABLE)
        .select(
          `*, ${constants.COMPLETION_TABLE}(*), ${constants.TASK_LABEL_TABLE}(*)`
        )
        .eq("frequency", frequency)
        .eq("deleted", false)
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
        console.log("add completion", payload.new);
        addCompletionToTask(payload.new.task_id, payload.new);
      }
      if (payload.eventType === "UPDATE") {
        console.log("update completion", payload.new);
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
        getTaskLabelsForTask(payload.new.id);
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
  }, [addTaskToStore, frequency, getTaskLabelsForTask, makeTaskFromPayload]);
}
