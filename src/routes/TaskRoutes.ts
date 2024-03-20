import { Elysia } from "elysia";
import { Server } from "socket.io";

import CreateTaskValidation from "@/helpers/validations/tasks/CreateTaskValidation";
import UpdateTaskValidation from "@/helpers/validations/tasks/UpdateTaskValidation";
import TaskController from "@/controllers/TaskController";
import NotificationService from "@/services/NotificationService";

export const createTaskRoutes = (app: Elysia<"/api/tasks">, socket: Server) => {
  const notificationService = new NotificationService(socket);
  const TaskCtrl = new TaskController(notificationService);

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
