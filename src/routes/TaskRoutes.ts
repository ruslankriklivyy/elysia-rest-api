import { Elysia } from "elysia";
import { Server } from "socket.io";

import CreateTaskValidation from "@/helpers/validations/tasks/CreateTaskValidation";
import UpdateTaskValidation from "@/helpers/validations/tasks/UpdateTaskValidation";
import TaskController from "@/controllers/TaskController";

export const createTaskRoutes = (app: Elysia<"/api/tasks">, socket: Server) => {
  const TaskCtrl = new TaskController(socket);

  return app
    .get("/", TaskCtrl.findAll)
    .get("/:id", TaskCtrl.findOne)
    .post("/", TaskCtrl.createOne, {
      body: CreateTaskValidation,
    })
    .patch("/:id", TaskCtrl.updateOne, {
      body: UpdateTaskValidation,
    })
    .delete("/:id", TaskCtrl.deleteOne);
};
