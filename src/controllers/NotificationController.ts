import NotificationService from "@/services/NotificationService";
import { ExtendedContext } from "@/types/common/ExtendedContext";
import { UpdateNotificationPayload } from "@/types/entities/notification/UpdateNotificationPayload";

class NotificationController {
  private readonly notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  findAll = () => {
    return this.notificationService.findAll();
  };

  updateOne = ({ params, body }: ExtendedContext) => {
    const notificationId = +params["id"];
    return this.notificationService.updateOne(
      notificationId,
      body as UpdateNotificationPayload
    );
  };
}

export default NotificationController;
