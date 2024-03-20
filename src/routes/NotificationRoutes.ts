import { Elysia } from "elysia";
import { Server } from "socket.io";

import NotificationService from "@/services/NotificationService";
import NotificationController from "@/controllers/NotificationController";
import UpdateNotificationValidation from "@/helpers/validations/notifications/UpdateNotificationValidation";

export const createNotificationRoutes = (
  app: Elysia<"/api/notifications">,
  socket: Server
) => {
  const notificationService = new NotificationService(socket);
  const NotificationCtrl = new NotificationController(notificationService);

  return app
    .get("/", NotificationCtrl.findAll)
    .patch("/:id", NotificationCtrl.updateOne, {
      body: UpdateNotificationValidation,
    });
};
