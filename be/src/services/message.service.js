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

  /**
   * Lấy danh sách message theo conversation
   * @author dbhuan 27.12.2025
   */
  async getMessagesByConversation(payload) {
    let messages = await MessageModel.find({
      conversation_id: payload.conversation_id,
    })
      .sort({ "timestamps.created_at": -1 })
      .skip(payload.skip)
      .limit(payload.limit)
      .lean();

    return messages;
  }
}

export const messageService = new MessageService();
