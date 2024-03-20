import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";

import { CreateNotificationPayload } from "@/types/entities/notification/CreateNotificationPayload";
import { UpdateNotificationPayload } from "@/types/entities/notification/UpdateNotificationPayload";
import UserService from "@/services/UserService";
import { NotifiableType } from "@/enums/NotifiableType";
import ChatService from "@/services/ChatService";
import TaskService from "@/services/TaskService";
import MessageService from "@/services/MessageService";

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
    let userHasAccess = false;
    const user = await UserService.findOne({ userId: user_id });

    switch (notifiable_type) {
      case NotifiableType.NEW_CHAT: {
        userHasAccess = !!(await ChatService.findOne(notifiable_id, user_id));
        break;
      }

      case NotifiableType.NEW_CHAT_MEMBER: {
        userHasAccess = !!(await ChatService.findOne(notifiable_id, user_id));
        break;
      }

      case NotifiableType.REMOVE_TASK: {
        userHasAccess = !!(await TaskService.findOne({
          taskId: notifiable_id,
          userId: user_id,
        }));
        break;
      }

      case NotifiableType.NEW_MESSAGE: {
        const message = await MessageService.findOne({
          id: notifiable_id,
          userId: user_id,
        });
        userHasAccess = !message
          ? false
          : !!(await ChatService.findOne(message.chat_id, user_id));
        break;
      }

      default:
        userHasAccess = false;
    }

    if (userHasAccess) {
      this.socket.emit(payload.notifiable_type, createdNotification);
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
