import { PrismaClient } from "@prisma/client";

import type { CreateChatsUsersPayload } from "@/types/entities/chatsUsers/CreateChatsUsersPayload";

class ChatsUsersService {
  private prismaClient = new PrismaClient();

  findAllByUser = (userId: number) => {
    return this.prismaClient.chatsUsers.findMany({
      where: { user_id: userId },
      include: { chat: {} },
    });
  };

  createMany = async (payload: CreateChatsUsersPayload) => {
    if (!payload?.membersIds) throw Error("membersIds not provided");

    try {
      const newChatsUsers = payload.membersIds.map((memberId) => ({
        user_id: memberId,
        chat_id: payload.chatId,
        assignedBy: "user",
      }));
      await this.prismaClient.chatsUsers.createMany({
        data: newChatsUsers,
      });
    } catch (error) {
      throw Error(error as any);
    }
  };

  deleteMany = (chatId: number, userIds: number[]) => {
    return this.prismaClient.chatsUsers.deleteMany({
      where: { chat_id: chatId, user_id: { in: userIds } },
    });
  };
}

export default new ChatsUsersService();
