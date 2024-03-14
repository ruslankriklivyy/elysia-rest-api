import { Elysia } from "elysia";

import ChatController from "@/controllers/ChatController";
import { Server } from "socket.io";

export const createChatsRoutes = (
  app: Elysia<"/api/chats">,
  socket: Server
) => {
  const ChatCtrl = new ChatController(socket);

  return app
    .get("/", ChatCtrl.findAll)
    .get("/:id", ChatCtrl.findOne)
    .post("/", ChatCtrl.createOne);
};
