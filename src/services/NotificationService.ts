import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";

import { CreateNotificationPayload } from "@/types/entities/notification/CreateNotificationPayload";
import { UpdateNotificationPayload } from "@/types/entities/notification/UpdateNotificationPayload";
import { NotifiableType } from "@/enums/NotifiableType";
import ChatsUsersService from "@/services/ChatsUsersService";
import TaskService from "@/services/TaskService";

class NotificationService {
  private readonly prisma = new PrismaClient();
  private readonly socket: Server;

  constructor(socket: Server) {
    this.socket = socket;
  }

  findAll = () => {
    return this.prisma.notification.findMany();
  };

  createOne = async (payload: CreateNotificationPayload) => {
    const { body, user_id, notifiable_type, notifiable_id } = payload;
    const createdNotification = await this.prisma.notification.create({
      data: {
        body,
        user_id,
        notifiable_id,
        notifiable_type,
      },
    });

    if (
      payload.notifiable_type === NotifiableType.NEW_CHAT ||
      payload.notifiable_type === NotifiableType.NEW_CHAT_MEMBER ||
      payload.notifiable_type === NotifiableType.NEW_MESSAGE
    ) {
      const chats = await ChatsUsersService.findAll(notifiable_id);

      for (const chat of chats) {
        this.socket
          .in(`${payload.notifiable_type}.${chat.user_id}`)
          .emit(payload.notifiable_type, createdNotification);
      }
    }

    if (
      payload.notifiable_type === NotifiableType.NEW_TASK ||
      payload.notifiable_type === NotifiableType.REMOVE_TASK
    ) {
      const task = await TaskService.findOne({
        taskId: payload.notifiable_id,
        userId: user_id,
      });

      if (task) {
        this.socket
          .in(`${payload.notifiable_type}.${task.user_id}`)
          .emit(payload.notifiable_type, createdNotification);
      }
    }

    return createdNotification;
  };

  updateOne = (id: number, payload: UpdateNotificationPayload) => {
    const { is_read } = payload;
    return this.prisma.notification.update({
      where: { id },
      data: { is_read },
    });
  };
}

export default NotificationService;
