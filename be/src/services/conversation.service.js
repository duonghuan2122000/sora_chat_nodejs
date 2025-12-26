import {
  ConversationModel,
  ConversationType,
} from "#src/data/entities/conversation.entity.js";
import { getCurrentTime, getNewUUID } from "#src/utils/common.util.js";

class ConversationService {
  /**
   * Hàm tạo/lấy cuộc trò chuyện
   */
  async create(payload) {
    let conversation = {
      ...payload,
      _id: getNewUUID(),
      timestamps: {
        created_at: getCurrentTime(),
      },
    };

    /**
     * Nếu là cuộc trò chuyện trực tiếp 1 - 1, kiểm tra có cuộc trò chuyện nào trước đó chưa?
     */
    switch (conversation.type) {
      case ConversationType.DIRECT:
        let existConversation = await ConversationModel.findOne({
          members: {
            $all: [
              { $elemMatch: { user_id: conversation.members[0].user_id } },
              { $elemMatch: { user_id: conversation.members[1].user_id } },
            ],
          },
          $expr: { $eq: [{ $size: "$members" }, 2] },
          type: ConversationType.DIRECT,
        }).lean();
        if (existConversation) {
          return existConversation;
        }
        break;
    }

    conversation = await ConversationModel.insertOne(conversation);
    return conversation;
  }

  /**
   * Lấy thông tin conversation
   */
  async getConversation(id) {
    return await ConversationModel.findOne({ _id: id }).lean();
  }
}

export const conversationService = new ConversationService();
