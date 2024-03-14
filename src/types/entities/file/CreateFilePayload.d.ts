export interface CreateFilePayload {
  file: File;
  user_id: number;
  message_id?: number;
  task_id?: number;
}
