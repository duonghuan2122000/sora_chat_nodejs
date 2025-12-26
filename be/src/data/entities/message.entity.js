import { getCurrentTime } from "#src/utils/common.util.js";
import { model, Schema } from "mongoose";

export const MessageType = {
  // Tin nhắn text
  TEXT: "text",
};

export const MessageBlockType = {
  /**
   * Text đơn thuần
   */
  TEXT: "text",

  /**
   * Đề cập
   */
  MENTION: "mention",

  /**
   * Text in đậm
   */
  BOLD: "bold",
};

const messageSchema = new Schema(
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
     * Loại cuộc trò chuyện (chat)
     */
    conversation_type: {
      type: String,
      required: true,
    },

    /**
     * Người gửi
     */
    sender: {
      /**
       * Id người gửi
       */
      user_id: {
        type: String,
        required: true,
      },
    },

    /**
     * Tin nhắn
     */
    message: {
      /**
       * Loại
       */
      type: {
        type: String,
        required: true,
      },

      // Phiên bản tin nhắn
      version: {
        type: Number,
        required: true,
      },

      /**
       * Block tin nhắn
       */
      blocks: [
        {
          _id: false,
          /**
           * Loại block
           */
          type: {
            type: String,
          },

          /**
           * Giá trị
           */
          value: {
            type: String,
          },
        },
      ],

      /**
       * plain text
       */
      plain_text: {
        type: String,
      },
    },

    /**
     * Tin nhắn trả lời
     */
    reply: {
      /**
       * Id tin nhắn trả lời
       */
      message_id: {
        type: String,
      },
    },

    /**
     * Reaction tin nhắn
     */
    reactions: [
      {
        /**
         * emoji
         */
        emoji: {
          type: String,
        },

        /**
         * Số lượng emoji
         */
        count: {
          type: Number,
        },
        /**
         * Id người reaction
         */
        user_ids: [String],
      },
    ],

    /**
     * Danh sách user được mention
     */
    mentions: [String],

    /**
     * Cờ đánh dấu
     */
    flags: {
      /**
       * Có bị chỉnh sửa không?
       * Mặc định: false
       */
      edited: {
        type: Boolean,
        default: false,
      },

      /**
       * Có bị chỉnh xóa không?
       * Mặc định: false
       */
      deleted: {
        type: Boolean,
        default: false,
      },

      /**
       * Có được ghim không?
       * Mặc định: false
       */
      pinned: {
        type: Boolean,
        default: false,
      },
    },

    /**
     * Thời gian cập nhật/sửa tin nhắn
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

      /**
       * Thời gian bị xóa
       */
      deleted_at: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: false,
  }
);

messageSchema.index({
  conversation_id: 1,
  "timestamps.created_at": -1,
});

messageSchema.index({ "message.plain_text": "text" });

export const MessageModel = model("sora_messages", messageSchema);
