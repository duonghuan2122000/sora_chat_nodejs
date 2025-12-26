import { getCurrentTime } from "#src/utils/common.util.js";
import { Schema, model } from "mongoose";

const conversationMemberSchema = new Schema(
  {
    /**
     * Khóa chính
     */
    _id: {
      type: String,
      required: true,
    },

    /**
     * Id cuộc trò chuyện
     */
    conversation_id: {
      type: String,
      required: true,
    },

    /**
     * Id người dùng
     */
    user_id: {
      type: String,
      required: true,
    },

    /**
     * Id tin nhắn cuối cùng
     */
    last_read_message_id: {
      type: String,
    },

    /**
     * Thời gian đọc tin nhắn cuối
     */
    last_read_at: {
      type: Date,
    },

    /**
     * Tổng số tin nhắn chưa đọc
     */
    un_read_count: {
      type: Number,
      default: 0,
    },

    /**
     * Có mute không
     */
    mute: {
      type: Boolean,
      default: false,
    },

    /**
     * Timestamps
     */
    timestamps: {
      joined_at: {
        type: Date,
        default: getCurrentTime(),
      },

      /**
       * Thời gian cập nhật
       */
      updated_at: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: false,
  }
);

export const conversationMemberModel = model(
  "sora_conversation_members",
  conversationMemberSchema
);
