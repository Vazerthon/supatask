import type { Database } from "./generated";

export type Completion = Database["public"]["Tables"]["completion"]["Row"];
export type Task = Database["public"]["Tables"]["task"]["Row"] & {
  completion: Completion[];
  task_label: Database["public"]["Tables"]["task_label"]["Row"][];
};
export type Label = Database["public"]["Tables"]["label"]["Row"] & {
  enabled: boolean;
};
