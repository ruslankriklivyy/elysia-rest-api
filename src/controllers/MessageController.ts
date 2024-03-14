import type { Server } from "socket.io";

import MessageService from "@/services/MessageService";
import { MESSAGES_EVENTS } from "@/enums/SocketEvent";
import { ExtendedContext } from "@/types/common/ExtendedContext";
import { CreateMessagePayload } from "@/types/entities/message/CreateMessagePayload";

class MessageController {
  socket: Server;

  constructor(socket: Server) {
    this.socket = socket;
  }

  findAllByChat = async ({ query, set }: ExtendedContext) => {
    try {
      const chatId = +query["chat_id"]!;
      return await MessageService.findAllByChat(chatId);
    } catch (error) {
      set.status = 500;
      throw Error("Messages not found");
    }
  };

  createOne = async ({ params, body, user, set }: ExtendedContext) => {
    try {
      const chatId = +params["id"];

      const newMessage = await MessageService.createOne({
        ...(body as CreateMessagePayload),
        chat_id: chatId,
        sender_id: user.id,
      });

      this.socket.emit(MESSAGES_EVENTS.NEW_MESSAGE, newMessage);
      return newMessage;
    } catch (error) {
      set.status = 500;
      throw Error("Message not created");
    }
  };
}

export default MessageController;
