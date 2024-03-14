import { PrismaClient } from "@prisma/client";

import type { CreateFilePayload } from "@/types/entities/file/CreateFilePayload";
import { FileType } from "@/enums/FileType";

class FileService {
  private readonly prisma = new PrismaClient();

  create = (payload: CreateFilePayload) => {
    return this.prisma.file.create({ data: payload });
  };

  attachMany = (filesIds: number[], entityType: FileType, entityId: number) => {
    let fileData = {};

    switch (entityType) {
      case FileType.Message: {
        fileData = { message_id: entityId };
        break;
      }
      case FileType.Task: {
        fileData = { task_id: entityId };
        break;
      }
      default:
        break;
    }

    return this.prisma.file.updateMany({
      where: { id: { in: filesIds } },
      data: fileData,
    });
  };

  delete = (fileId: number, userId: number) => {
    return this.prisma.file.delete({
      where: { id: fileId, user_id: userId },
    });
  };
}

export default new FileService();
