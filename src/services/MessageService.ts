import { PrismaClient } from "@prisma/client";

import type { CreateMessagePayload } from "@/types/entities/message/CreateMessagePayload";
import FileService from "@/services/FileService";
import { FileType } from "@/enums/FileType";

class MessageService {
  private prisma = new PrismaClient();

  findAllByChat = (chatId: number) => {
    return this.prisma.message.findMany({ where: { chat_id: chatId } });
  };

  createOne = async (payload: CreateMessagePayload) => {
    const newMessage = await this.prisma.message.create({
      data: {
        body: payload.body,
        sender_id: payload.sender_id,
        chat_id: payload.chat_id,
      },
    });

    if (payload?.files_ids?.length) {
      await FileService.attachMany(
        payload.files_ids,
        FileType.Message,
        newMessage.id
      );
    }

    return newMessage;
  };
}

export default new MessageService();
