import type { Database } from "./generated";

export type Completion = Database["public"]["Tables"]["completion"]["Row"];
export type Task = Database["public"]["Tables"]["task"]["Row"] & {
  completion: Completion[];
};
