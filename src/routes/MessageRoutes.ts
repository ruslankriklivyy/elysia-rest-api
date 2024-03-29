import { Elysia } from "elysia";
import { Server } from "socket.io";

import MessageController from "@/controllers/MessageController";
import NotificationService from "@/services/NotificationService";
import CreateMessageValidation from "@/helpers/validations/messages/CreateMessageValidation";

export const createMessageRoutes = (
  app: Elysia<"/api/messages">,
  socket: Server
) => {
  const notificationService = new NotificationService(socket);
  const MessageCtrl = new MessageController(notificationService);

  return app
    .get("", MessageCtrl.findAllByChat)
    .post("", MessageCtrl.createOne, { body: CreateMessageValidation });
};
