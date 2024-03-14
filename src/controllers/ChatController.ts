import type { Server } from "socket.io";

import ChatService from "@/services/ChatService";
import ChatsUsersService from "@/services/ChatsUsersService";
import { ExtendedContext } from "@/types/common/ExtendedContext";
import { CHATS_EVENTS } from "@/enums/SocketEvent";
import { CreateChatPayload } from "@/types/entities/chat/CreateChatPayload";

class ChatController {
  socket: Server;

  constructor(socket: Server) {
    this.socket = socket;
  }

  findAll = async ({ user, set }: ExtendedContext) => {
    try {
      return await ChatService.findAllByUser(user.id);
    } catch (error) {
      set.status = 500;
      throw Error("Chats not found");
    }
  };

  findOne = async ({ params, user, set }: ExtendedContext) => {
    try {
      const chatId = +params["id"];
      return await ChatService.findOne(chatId, user.id);
    } catch (error) {
      set.status = 500;
      throw Error("Chat not found");
    }
  };

  createOne = async ({ body, set }: ExtendedContext) => {
    try {
      const newChat = await ChatService.createOne({
        name: (body as CreateChatPayload).name,
      });

      await ChatsUsersService.createMany({
        chatId: newChat.id,
        membersIds: (body as CreateChatPayload).members_ids,
      });

      this.socket.emit(CHATS_EVENTS.NEW_CHAT, newChat);
      return newChat;
    } catch (error) {
      set.status = 500;
      throw Error("Chat not created");
    }
  };
}

export default ChatController;
