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
      for (const memberId of payload.membersIds) {
        await this.prismaClient.chatsUsers.create({
          data: {
            user_id: memberId,
            chat_id: payload.chatId,
            assignedBy: "user",
          },
        });
      }
    } catch (error) {
      console.log(error);
      throw Error();
    }
  };
}

export default new ChatsUsersService();
