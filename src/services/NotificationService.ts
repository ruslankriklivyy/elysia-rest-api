import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";

import { CreateNotificationPayload } from "@/types/entities/notification/CreateNotificationPayload";
import { UpdateNotificationPayload } from "@/types/entities/notification/UpdateNotificationPayload";

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

    this.socket.emit(payload.notifiable_type, createdNotification);

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
