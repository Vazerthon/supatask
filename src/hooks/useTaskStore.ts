import { create } from "zustand";
import { Task } from "../types/types";

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  frequencies: ["daily", "weekly", "monthly", "yearly"];
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  setFrequency: (frequency: "daily" | "weekly" | "monthly" | "yearly") => void;
}

const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  setTasks: (tasks: Task[]) => set({ tasks }),
  frequencies: ["daily", "weekly", "monthly", "yearly"],
  frequency: "daily",
  setFrequency: (frequency: "daily" | "weekly" | "monthly" | "yearly") =>
    set({ frequency }),
}));

export default useTaskStore;
