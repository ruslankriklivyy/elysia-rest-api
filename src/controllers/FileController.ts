import { Context } from "elysia";

import FileService from "@/services/FileService";
import { ExtendedContext } from "@/types/common/ExtendedContext";
import { CreateFilePayload } from "@/types/entities/file/CreateFilePayload";

class FileController {
  stream = ({ params }: Context) => {
    return Bun.file(`uploads/${params["path"]}`);
  };

  createOne = async ({ body, user, set }: ExtendedContext) => {
    try {
      return await FileService.create({
        user_id: user.id,
        file: (body as CreateFilePayload).file,
      });
    } catch (error) {
      set.status = 500;
      throw Error("File not uploaded");
    }
  };

  deleteOne = async ({ params, user, set }: ExtendedContext) => {
    try {
      const fileId = +params["id"];
      return await FileService.delete(fileId, user.id);
    } catch (error) {
      set.status = 500;
      throw Error("File not deleted");
    }
  };
}

export default new FileController();
