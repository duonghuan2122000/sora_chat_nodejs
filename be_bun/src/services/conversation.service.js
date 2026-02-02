import {
  ConversationModel,
  ConversationType,
} from "#src/data/entities/conversation.entity.js";
import { UserModel } from "#src/data/entities/user.entity";
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

    conversation = await ConversationModel.create(conversation);
    return conversation;
  }

  /**
   * Lấy thông tin conversation
   */
  async getConversation(id) {
    let conversation = await ConversationModel.findOne({ _id: id }).lean();
    if (
      conversation &&
      conversation.type === ConversationType.DIRECT &&
      conversation.members?.length > 0
    ) {
      let userIds = conversation.members
        .map((m) => m.user_id)
        .filter((userId) => userId);
      let users = await UserModel.find({ _id: { $in: userIds } })
        .select({ username: 1, first_name: 1, last_name: 1 })
        .lean();
      conversation.members = conversation.members.map((m) => {
        let user = users?.find((u) => u._id === m.user_id) ?? {};
        if (user?._id) {
          delete user._id;
        }
        return { ...m, ...user };
      });
    }
    return conversation;
  }

  /**
   * Lấy danh sách cuộc trò chuyện gần nhất
   * @author 03.01.2026
   */
  async getLatestConversations({
    user_id,
    skip = 0,
    limit = 10,
    key_search = "",
  }) {
    let filters = {
      "members.user_id": user_id,
    };
    if (key_search) {
      filters["name"] = { $regex: key_search, $options: "i" };
    }
    let result = await ConversationModel.find(filters)
      .sort({ "timestamps.updated_at": -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Lấy danh sách user id của người dùng của các cuộc trò chuyện trực tiếp direct
    let userIdsInDirect = result
      .filter((c) => c.type === ConversationType.DIRECT)
      .flatMap((c) =>
        c.members.map((m) => m.user_id).filter((userId) => userId),
      );

    let users = await UserModel.find({
      _id: { $in: userIdsInDirect },
    })
      .select({ username: 1, first_name: 1, last_name: 1 })
      .lean();

    result = result.map((c) => {
      if (c.type !== ConversationType.DIRECT) {
        return c;
      }
      c.members = c.members.map((m) => {
        let user = users?.find((u) => u._id === m.user_id) ?? {};
        if (user?._id) {
          delete user._id;
        }
        return { ...m, ...user };
      });
      return c;
    });

    return result;
  }
}

export const conversationService = new ConversationService();
