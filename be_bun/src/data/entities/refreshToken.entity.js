/**
 * File định nghĩa entity refresh token
 */
import { Schema, model } from "mongoose";

const refreshTokenSchema = new Schema(
  {
    /**
     * Khóa chính
     */
    _id: {
      type: String,
      required: true,
    },

    /**
     * ID người dùng
     */
    user_id: {
      type: String,
      required: true,
      ref: "sora_users",
    },

    /**
     * Refresh Token
     */
    token: {
      type: String,
      required: true,
    },

    /**
     * Thời gian hết hạn
     */
    expires_at: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Đánh index cho trường token để tìm kiếm nhanh
refreshTokenSchema.index({ token: 1 });
// Đánh index cho trường user_id
refreshTokenSchema.index({ user_id: 1 });
// Tự động xóa token khi hết hạn (TTL index)
refreshTokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = model(
  "sora_refresh_tokens",
  refreshTokenSchema,
);
