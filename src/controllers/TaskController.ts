import TaskService from "@/services/TaskService";
import { ExtendedContext } from "@/types/common/ExtendedContext";
import { CreateTaskPayload } from "@/types/entities/task/CreateTaskPayload";
import type { UpdateTaskPayload } from "@/types/entities/task/UpdateTaskPayload";
import NotificationService from "@/services/NotificationService";
import { NotifiableType } from "@/enums/NotifiableType";

class TaskController {
  private readonly notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  findAll = ({ user }: ExtendedContext) => {
    return TaskService.findAll({
      userId: user.id,
    });
  };

  findOne = async ({ params, set }: ExtendedContext) => {
    try {
      const taskId = +params["id"];
      return await TaskService.findOne({ taskId });
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
      await this.notificationService.createOne({
        body: `Task #${createdTask.id} was created`,
        user_id: user.id,
        notifiable_id: createdTask.id,
        notifiable_type: NotifiableType.NEW_TASK,
      });
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

  deleteOne = async ({ params, set, user }: ExtendedContext) => {
    try {
      const taskId = +params["id"];
      const deletedTask = await TaskService.deleteOne(taskId);

      await this.notificationService.createOne({
        body: `Task #${deletedTask.id} was deleted`,
        user_id: user.id,
        notifiable_id: deletedTask.id,
        notifiable_type: NotifiableType.REMOVE_TASK,
      });
    } catch (error) {
      set.status = 500;
      throw Error("Task was not deleted");
    }
  };
}

export default TaskController;
