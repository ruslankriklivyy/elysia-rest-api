export interface CreateFilePayload {
  name: string;
  url: string;
  type: string;
  size: number;
  user_id: number;
  message_id?: number;
  task_id?: number;
}
