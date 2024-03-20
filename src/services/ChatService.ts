import { PrismaClient } from "@prisma/client";

import type { CreateChatPayload } from "@/types/entities/chat/CreateChatPayload";
import { UpdateChatPayload } from "@/types/entities/chat/UpdateChatPayload";

class ChatService {
  private prismaClient = new PrismaClient();

  findAllByUser = (userId: number) => {
    return this.prismaClient.chat.findMany({
      where: { members: { some: { user_id: userId } } },
      include: { members: { include: { user: true } } },
    });
  };

  findOne = (chatId: number, userId: number) => {
    return this.prismaClient.chat.findUnique({
      where: { id: chatId, members: { some: { user_id: userId } } },
    });
  };

  createOne = (payload: CreateChatPayload) => {
    return this.prismaClient.chat.create({
      data: {
        name: payload.name,
      },
    });
  };

  updateOne = (chatId: number, payload: UpdateChatPayload) => {
    return this.prismaClient.chat.update({
      where: { id: chatId },
      data: payload,
    });
  };

  deleteOne = (chatId: number) => {
    return this.prismaClient.chat.delete({ where: { id: chatId } });
  };
}

export default new ChatService();
