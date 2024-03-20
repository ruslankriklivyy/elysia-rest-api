import { PrismaClient } from "@prisma/client";
import { difference } from "lodash";

import type { CreateChatsUsersPayload } from "@/types/entities/chatsUsers/CreateChatsUsersPayload";

class ChatsUsersService {
  private readonly prismaClient = new PrismaClient();

  findAllByUser = (userId: number) => {
    return this.prismaClient.chatsUsers.findMany({
      where: { user_id: userId },
      include: { chat: {} },
    });
  };

  upsert = async (payload: CreateChatsUsersPayload) => {
    if (!payload?.membersIds) throw Error("membersIds not provided");

    try {
      const chatsUsers = await this.prismaClient.chatsUsers.findMany({
        where: { chat_id: payload.chatId },
      });
      const existingChatUsersIds = chatsUsers.map(({ user_id }) => user_id);
      const newMembersIds = difference(
        payload.membersIds,
        existingChatUsersIds
      );
      const deletedMembersIds = difference(
        existingChatUsersIds,
        payload.membersIds
      );

      if (newMembersIds.length) {
        await this.prismaClient.chatsUsers.createMany({
          data: newMembersIds.map((memberId) => ({
            chat_id: payload.chatId,
            user_id: memberId,
            assignedBy: "user",
          })),
        });
      }

      if (deletedMembersIds.length) {
        await this.deleteMany(payload.chatId, deletedMembersIds);
      }
    } catch (error) {
      throw Error(error as any);
    }
  };

  deleteMany = (chatId: number, membersIds: number[]) => {
    return this.prismaClient.chatsUsers.deleteMany({
      where: { chat_id: chatId, user_id: { in: membersIds } },
    });
  };
}

export default new ChatsUsersService();
