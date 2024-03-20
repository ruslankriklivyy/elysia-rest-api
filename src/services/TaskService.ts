import { PrismaClient } from "@prisma/client";

import type { CreateTaskPayload } from "@/types/entities/task/CreateTaskPayload";
import type { UpdateTaskPayload } from "@/types/entities/task/UpdateTaskPayload";

interface FindOneTaskPayload {
  taskId: number;
  userId?: number;
}

interface FindAllTasksPayload {
  userId?: number;
}

class TaskService {
  private readonly prisma = new PrismaClient();

  findOne({ taskId, userId }: FindOneTaskPayload) {
    let where: Record<string, any> = {};

    if (userId) {
      where["user_id"] = userId;
    }

    return this.prisma.task.findUnique({ where: { ...where, id: taskId } });
  }

  findAll(payload: FindAllTasksPayload) {
    const where: Record<string, any> = {};

    if (payload?.userId) {
      where["user_id"] = payload.userId;
    }

    return this.prisma.task.findMany({ where });
  }

  async createOne(payload: CreateTaskPayload) {
    try {
      return await this.prisma.task.create({
        data: { ...payload, end_date: new Date(payload.end_date) },
      });
    } catch (error) {
      throw new Error("Task was not created");
    }
  }

  async updateOne(taskId: number, payload: UpdateTaskPayload) {
    try {
      return await this.prisma.task.update({
        where: { id: taskId },
        data: { ...payload, end_date: new Date(payload.end_date) },
      });
    } catch (error) {
      throw new Error("Task was not updated");
    }
  }

  async deleteOne(taskId: number) {
    try {
      return await this.prisma.task.delete({ where: { id: taskId } });
    } catch (error) {
      throw new Error("Task was not deleted");
    }
  }
}

export default new TaskService();
