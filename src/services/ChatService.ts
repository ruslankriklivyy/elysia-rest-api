import { PrismaClient } from "@prisma/client";

import type { CreateChatPayload } from "@/types/entities/chat/CreateChatPayload";

class ChatService {
  private prismaClient = new PrismaClient();

  findAllByUser = (userId: number) => {
    return this.prismaClient.chat.findMany({
      where: { members: { some: { user_id: userId } } },
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
}

export default new ChatService();
