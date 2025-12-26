import { MessageModel } from "#src/data/entities/message.entity.js";
import { getCurrentTime, getNewUUID } from "#src/utils/common.util.js";

class MessageService {
  /**
   * Tạo message
   * @author dbhuan 25.12.2025
   */
  async createMessage(payload) {
    let message = {
      ...payload,
      _id: getNewUUID(),
      timestamps: {
        created_at: getCurrentTime(),
      },
    };

    message = await MessageModel.insertOne(message);
    return message;
  }
}

export const messageService = new MessageService();
