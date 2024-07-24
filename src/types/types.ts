import type { Database } from "./generated";

export type Task = Database["public"]["Tables"]["task"]["Row"];
