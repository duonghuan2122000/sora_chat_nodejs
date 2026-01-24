import { MessageModel } from "#src/data/entities/message.entity.js";
import { UserModel } from "#src/data/entities/user.entity";
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

    message.id = message._id;
    delete message._id;
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

    if (messages.length > 0) {
      // Lấy danh sách id của các tin nhắn được trả lời
      const replyMessageIds = messages
        .filter((m) => m.reply?.message_id)
        .map((m) => m.reply.message_id);

      if (replyMessageIds.length > 0) {
        // Lấy thông tin các tin nhắn được trả lời
        let replyMessages = await MessageModel.find({
          _id: { $in: replyMessageIds },
        }).lean();

        // Map id
        replyMessages = replyMessages.map((m) => {
          m.id = m._id;
          delete m._id;
          return m;
        });

        // Gắn thông tin tin nhắn được trả lời vào message gốc
        messages.forEach((m) => {
          if (m.reply?.message_id) {
            m.reply.message = replyMessages.find(
              (rm) => rm.id === m.reply.message_id,
            );
          }
        });
      }

      // Map id cho danh sách message chính
      messages = messages.map((m) => {
        m.id = m._id;
        delete m._id;
        return m;
      });
    }

    return messages;
  }
  /**
   * Cập nhật reaction cho message
   * @author dbhuan 24.01.2026
   */
  async updateMessageReaction(payload) {
    const { message_id, user_id, emoji } = payload;
    let message = await MessageModel.findOne({ _id: message_id });
    if (!message) {
      return null;
    }

    if (!message.reactions) {
      message.reactions = [];
    }

    // Tìm reaction hiện tại với emoji này
    let reactionIndex = message.reactions.findIndex((r) => r.emoji === emoji);

    if (reactionIndex > -1) {
      let reaction = message.reactions[reactionIndex];
      let userIndex = reaction.user_ids.indexOf(user_id);

      if (userIndex > -1) {
        // User đã reaction rồi -> Xóa reaction
        reaction.user_ids.splice(userIndex, 1);
        reaction.count -= 1;

        // Nếu không còn ai reaction emoji này nữa thì xóa luôn entry emoji đó
        if (reaction.count <= 0) {
          message.reactions.splice(reactionIndex, 1);
        }
      } else {
        // User chưa reaction emoji này -> Thêm vào
        reaction.user_ids.push(user_id);
        reaction.count += 1;
      }
    } else {
      // Emoji này chưa có ai reaction -> Tạo mới entry
      message.reactions.push({
        emoji: emoji,
        count: 1,
        user_ids: [user_id],
      });
    }

    await message.save();

    let result = message.toObject();
    result.id = result._id;
    delete result._id;
    return result;
  }

  /**
   * Lấy chi tiết reaction của tin nhắn
   * @author dbhuan 24.01.2026
   */
  async getMessageReactions(payload) {
    const { message_id, emoji, skip = 0, limit = 10 } = payload;
    let message = await MessageModel.findOne({ _id: message_id }).lean();
    if (!message) {
      return null;
    }

    const totalReactions =
      message.reactions?.reduce((sum, r) => sum + r.count, 0) || 0;
    const summaries =
      message.reactions?.map((r) => ({
        emoji: r.emoji,
        count: r.count,
      })) || [];

    let users = [];
    let selectedReaction = (message.reactions || []).find(
      (r) => r.emoji === emoji,
    );
    if (selectedReaction) {
      const userIds = selectedReaction.user_ids.slice(skip, skip + limit);
      users = await UserModel.find({ _id: { $in: userIds } })
        .select("first_name last_name avatar")
        .lean();

      // Map to include id instead of _id for consistency
      users = users.map((u) => ({
        id: u._id,
        first_name: u.first_name,
        last_name: u.last_name,
        avatar: u.avatar,
      }));
    }

    return {
      total_count: totalReactions,
      summaries: summaries,
      users: users,
    };
  }
}

export const messageService = new MessageService();
