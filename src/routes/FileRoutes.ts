import { Elysia } from "elysia";

import FileController from "@/controllers/FileController";

export const createFileRoutes = (app: Elysia<"/api/files">) => {
  return app
    .get("/:path", FileController.stream)
    .post("", FileController.createOne)
    .delete("", FileController.deleteOne);
};
