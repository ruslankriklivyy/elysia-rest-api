import { Elysia } from "elysia";
import { Server } from "socket.io";

import MessageController from "@/controllers/MessageController";

export const createMessageRoutes = (
  app: Elysia<"/api/messages">,
  socket: Server
) => {
  const MessageCtrl = new MessageController(socket);

  return app.get("", MessageCtrl.findAllByChat).post("", MessageCtrl.createOne);
};
