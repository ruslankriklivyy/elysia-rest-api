import { Server } from "socket.io";

import TaskService from "@/services/TaskService";
import { ExtendedContext } from "@/types/common/ExtendedContext";
import { CreateTaskPayload } from "@/types/entities/task/CreateTaskPayload";
import type { UpdateTaskPayload } from "@/types/entities/task/UpdateTaskPayload";
import { TASKS_EVENTS } from "@/enums/SocketEvent";

class TaskController {
  private readonly socket: Server;

  constructor(socket: Server) {
    this.socket = socket;
  }

  findAll = ({ user }: ExtendedContext) => {
    return TaskService.findAll({
      userId: user.id,
    });
  };

  findOne = async ({ params, set }: ExtendedContext) => {
    try {
      const taskId = +params["id"];
      const task = await TaskService.findOne({ taskId });
      return task;
    } catch (error) {
      set.status = 404;
      throw Error("Task was not found");
    }
  };

  createOne = async ({ body, user, set }: ExtendedContext) => {
    try {
      const createdTask = await TaskService.createOne({
        ...(body as CreateTaskPayload),
        user_id: user.id,
        end_date: new Date((body as CreateTaskPayload).end_date),
      });
      this.socket.emit(TASKS_EVENTS.TASK_CREATED, createdTask);
      return createdTask;
    } catch (error) {
      set.status = 500;
      throw Error("Task was not created");
    }
  };

  updateOne = ({ body, params, set }: ExtendedContext) => {
    try {
      const taskId = +params["id"];
      return TaskService.updateOne(taskId, body as UpdateTaskPayload);
    } catch (error) {
      set.status = 500;
      throw Error("Task was not updated");
    }
  };

  deleteOne = async ({ params, set }: ExtendedContext) => {
    try {
      const taskId = +params["id"];
      const deletedTask = await TaskService.deleteOne(taskId);
      this.socket.emit(TASKS_EVENTS.TASK_DELETED, deletedTask);
    } catch (error) {
      set.status = 500;
      throw Error("Task was not deleted");
    }
  };
}

export default TaskController;
