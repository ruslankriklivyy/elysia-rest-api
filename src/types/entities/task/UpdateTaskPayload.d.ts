import type { Task } from "./Task";

export interface UpdateTaskPayload
  extends Omit<Task, "created_at" | "updated_at" | "id" | "user_id"> {}
