import ChatService from "@/services/ChatService";
import ChatsUsersService from "@/services/ChatsUsersService";
import { ExtendedContext } from "@/types/common/ExtendedContext";
import { CreateChatPayload } from "@/types/entities/chat/CreateChatPayload";
import NotificationService from "@/services/NotificationService";
import { NotifiableType } from "@/enums/NotifiableType";
import { UpdateChatPayload } from "@/types/entities/chat/UpdateChatPayload";

class ChatController {
  private readonly notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  findAll = async ({ user, set }: ExtendedContext) => {
    try {
      return await ChatService.findAllByUser(user.id);
    } catch (error) {
      set.status = 500;
      throw Error("Chats not found");
    }
  };

  findOne = async ({ params, user, set }: ExtendedContext) => {
    try {
      const chatId = +params["id"];
      return await ChatService.findOne(chatId, user.id);
    } catch (error) {
      set.status = 500;
      throw Error("Chat not found");
    }
  };

  createOne = async ({ body, set, user }: ExtendedContext) => {
    try {
      const newChat = await ChatService.createOne({
        name: (body as CreateChatPayload).name,
      });

      await ChatsUsersService.createMany({
        chatId: newChat.id,
        membersIds: (body as CreateChatPayload).members_ids,
      });
      await this.notificationService.createOne({
        body: `Chat #${newChat.id} was created`,
        user_id: user.id,
        notifiable_id: newChat.id,
        notifiable_type: NotifiableType.NEW_CHAT,
      });

      return newChat;
    } catch (error) {
      set.status = 500;
      throw Error("Chat not created");
    }
  };

  updateOne = async ({ body, set, params, user }: ExtendedContext) => {
    try {
      const chatId = +params["id"];
      return await ChatService.updateOne(chatId, {
        name: (body as UpdateChatPayload).name,
      });
    } catch (error) {
      set.status = 500;
      throw Error("Chat not updated");
    }
  };

  deleteOne = async ({ set, params }: ExtendedContext) => {
    try {
      const chatId = +params["id"];
      return await ChatService.deleteOne(chatId);
    } catch (error) {
      set.status = 500;
      throw Error("Chat not deleted");
    }
  };
}

export default ChatController;
