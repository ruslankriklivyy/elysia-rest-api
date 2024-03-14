export interface CreateMessagePayload {
  body: string;
  chat_id: number;
  sender_id: number;
  files_ids?: number[];
}
