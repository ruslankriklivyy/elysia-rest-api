import { PrismaClient } from "@prisma/client";
import { unlink } from "node:fs/promises";
import randomstring from "randomstring";

import type { CreateFilePayload } from "@/types/entities/file/CreateFilePayload";
import { FileType } from "@/enums/FileType";

class FileService {
  private readonly prisma = new PrismaClient();
  private readonly uploadsPath = "./uploads";

  create = async ({ file, user_id }: CreateFilePayload) => {
    const arrayBuffer = await file.arrayBuffer();
    const filePath = `${this.uploadsPath}/${randomstring.generate(12)}-${file.name}`;
    const fileUrl = filePath.replace(this.uploadsPath, "");

    await Bun.write(filePath, arrayBuffer);

    return await this.prisma.file.create({
      data: {
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        user_id,
      },
    });
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

  delete = async (fileId: number, userId: number) => {
    const file = await this.prisma.file.findUnique({ where: { id: fileId } });

    if (!file) throw Error("File not found");

    const deletedFile = await this.prisma.file.delete({
      where: { id: fileId, user_id: userId },
    });

    await unlink(file.url);

    return deletedFile;
  };
}

export default new FileService();
