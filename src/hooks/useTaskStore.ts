import { create } from "zustand";
import {
  getDayOfYear,
  getMonth,
  getWeek,
  getYear,
  startOfToday,
  format,
} from "date-fns";
import { Completion, Task } from "../types/types";

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  addCompletionToTask: (taskId: Task["id"], completion: Completion) => void;
  updateCompletionForTask: (taskId: Task["id"], completion: Completion) => void;
  frequencies: ["daily", "weekly", "monthly", "yearly"];
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  setFrequency: (frequency: "daily" | "weekly" | "monthly" | "yearly") => void;
  day: string;
  week: string;
  month: string;
  year: string;
  frequencyPeriod: Record<"daily" | "weekly" | "monthly" | "yearly", string>;
  frequencyLabel: Record<"daily" | "weekly" | "monthly" | "yearly", string>;
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
  frequencies: ["daily", "weekly", "monthly", "yearly"],
  frequency: "daily",
  setFrequency: (frequency: "daily" | "weekly" | "monthly" | "yearly") =>
    set({ frequency }),
  day,
  week,
  month,
  year,
  frequencyPeriod: {
    daily: day,
    weekly: week,
    monthly: month,
    yearly: year,
  },
  frequencyLabel: {
    daily: `To do today, ${format(today, "MMMM do")}`,
    weekly: `To do in week ${getWeek(today)} of ${getYear(today)}`,
    monthly: `To do in ${format(today, "MMMM yyyy")}`,
    yearly: `To do in ${getYear(today)}`,
  },
}));

export default useTaskStore;
