import { create } from "zustand";
import {
  getDayOfYear,
  getMonth,
  getWeek,
  getYear,
  startOfToday,
  format,
} from "date-fns";
import { Completion, Task, TaskLabel } from "../../types/types";

type Frequency = "one off" | "daily" | "weekly" | "monthly" | "yearly";

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  addCompletionToTask: (taskId: Task["id"], completion: Completion) => void;
  updateCompletionForTask: (taskId: Task["id"], completion: Completion) => void;
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
}

const today = startOfToday();
const day = `day-${getDayOfYear(today)}-${getYear(today)}`;
const week = `week-${getWeek(today)}-${getYear(today)}`;
const month = `month-${getMonth(today)}-${getYear(today)}`;
const year = `year-${getYear(today)}`;

const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  setTasks: (tasks: Task[]) => set({ tasks }),
  addTask: (task: Task) => set((state) => ({ tasks: [...state.tasks, task] })),
  addCompletionToTask: (taskId, completion) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, completion: [...task.completion, completion] }
          : task
      ),
    })),
  updateCompletionForTask: (taskId, completion) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completion: task.completion.map((c) =>
                c.id === completion.id ? completion : c
              ),
            }
          : task
      ),
    })),
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
    daily: `To do today, ${format(today, "MMMM do")}`,
    weekly: `To do in week ${getWeek(today)} of ${getYear(today)}`,
    monthly: `To do in ${format(today, "MMMM yyyy")}`,
    yearly: `To do in ${getYear(today)}`,
  },
  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
}));

export default useTaskStore;
