import type { Task } from "./Task";

export interface CreateTaskPayload
  extends Omit<Task, "created_at" | "updated_at" | "id"> {}
