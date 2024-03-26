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

    switch (payload.notifiable_type) {
      case NotifiableType.NEW_CHAT:
      case NotifiableType.NEW_CHAT_MEMBER:
      case NotifiableType.NEW_MESSAGE: {
        const chatsUsers = await ChatsUsersService.findAll(notifiable_id);

        for (const chatUser of chatsUsers) {
          this.socket
            .in(`${payload.notifiable_type}.${chatUser.user_id}`)
            .emit(payload.notifiable_type, createdNotification);
        }

        break;
      }
      case NotifiableType.NEW_TASK:
      case NotifiableType.REMOVE_TASK: {
        const task = await TaskService.findOne({
          taskId: payload.notifiable_id,
          userId: user_id,
        });

        if (task) {
          this.socket
            .in(`${payload.notifiable_type}.${task.user_id}`)
            .emit(payload.notifiable_type, createdNotification);
        }

        break;
      }
      default:
        break;
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
