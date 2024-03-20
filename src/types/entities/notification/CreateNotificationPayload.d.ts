import { NotifiableType } from "@/enums/NotifiableType";

export interface CreateNotificationPayload {
  user_id: number;
  body: string;
  notifiable_id: number;
  notifiable_type: NotifiableType;
}
