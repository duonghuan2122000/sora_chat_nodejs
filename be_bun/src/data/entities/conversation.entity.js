import { getCurrentTime } from "#src/utils/common.util.js";
import { Schema, model } from "mongoose";

export const ConversationType = {
  // chat trực tiếp
  DIRECT: "direct",

  // Nhóm chat
  GROUP: "group",
};

const conversationSchema = new Schema(
  {
    /**
     * Khóa chính
     */
    _id: {
      type: String,
      required: true,
    },

    /**
     * Loại cuộc trò chuyện (chat)
     */
    type: {
      type: String,
      required: true,
    },

    /**
     * tên cuộc trò chuyện, chỉ áp dụng với group chat
     */
    name: {
      type: String,
    },

    /**
     * Thành viên
     */
    members: [
      {
        _id: false,
        /**
         * Id người dùng
         */
        user_id: {
          type: String,
        },
      },
    ],

    /**
     * Tin nhắn cuối cùng
     */
    last_message: {
      /**
       * Id tin nhắn
       */
      message_id: {
        type: String,
      },

      /**
       * Plain text
       */
      plain_text: {
        type: String,
      },

      /**
       * Id người gửi
       */
      sender_id: {
        type: String,
      },

      /**
       * Thời gian gửi
       */
      created_at: {
        type: Date,
      },
    },

    /**
     * Tổng số message
     */
    message_count: {
      type: Number,
    },

    /**
     * Timestamp
     */
    timestamps: {
      /**
       * Thời gian tạo
       */
      created_at: {
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

conversationSchema.index({ "members.user_id": 1 });

export const ConversationModel = model(
  "sora_conversations",
  conversationSchema
);
