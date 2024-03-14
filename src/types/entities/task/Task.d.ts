import type { BaseEntity } from "../BaseEntity";

export interface Task extends BaseEntity {
  name: string;
  description?: string;
  end_date: Date;
  is_completed: boolean;
  user_id: number;
}
