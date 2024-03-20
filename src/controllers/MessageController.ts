import MessageService from "@/services/MessageService";
import { ExtendedContext } from "@/types/common/ExtendedContext";
import { CreateMessagePayload } from "@/types/entities/message/CreateMessagePayload";
import NotificationService from "@/services/NotificationService";
import { NotifiableType } from "@/enums/NotifiableType";

class MessageController {
  protected readonly notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  findAllByChat = async ({ query, set }: ExtendedContext) => {
    try {
      const chatId = +query["chat_id"]!;
      return await MessageService.findAllByChat(chatId);
    } catch (error) {
      set.status = 500;
      throw Error("Messages not found");
    }
  };

  createOne = async ({ params, body, user, set }: ExtendedContext) => {
    try {
      const chatId = +params["id"];

      const newMessage = await MessageService.createOne({
        ...(body as CreateMessagePayload),
        chat_id: chatId,
        sender_id: user.id,
      });

      await this.notificationService.createOne({
        body: `Message #${newMessage.id} was created`,
        user_id: user.id,
        notifiable_id: newMessage.id,
        notifiable_type: NotifiableType.NEW_MESSAGE,
      });

      return newMessage;
    } catch (error) {
      set.status = 500;
      throw Error("Message not created");
    }
  };
}

export default MessageController;
