import { Elysia } from "elysia";
import { Server } from "socket.io";

import ChatController from "@/controllers/ChatController";
import NotificationService from "@/services/NotificationService";
import CreateChatValidation from "@/helpers/validations/chats/CreateChatValidation";
import UpdateChatValidation from "@/helpers/validations/chats/UpdateChatValidation";

export const createChatsRoutes = (
  app: Elysia<"/api/chats">,
  socket: Server
) => {
  const notificationService = new NotificationService(socket);
  const ChatCtrl = new ChatController(notificationService);

  return app
    .get("/", ChatCtrl.findAll)
    .get("/:id", ChatCtrl.findOne)
    .post("/", ChatCtrl.createOne, { body: CreateChatValidation })
    .patch("/:id", ChatCtrl.updateOne, { body: UpdateChatValidation })
    .delete("/:id", ChatCtrl.deleteOne);
};
