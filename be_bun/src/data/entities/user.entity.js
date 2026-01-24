/**
 * File định nghĩa entity user
 * @author dbhuan 23.12.2025
 */
import { getCurrentTime } from "#src/utils/common.util.js";
import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    /**
     * Khóa chính
     */
    _id: {
      type: String,
      required: true,
    },

    /**
     * Tên đăng nhập
     */
    username: {
      type: String,
      required: true,
    },

    /**
     * Mật khẩu
     */
    password_hashed: {
      type: String,
      default: null,
    },

    /**
     * Họ và tên đệm
     */
    last_name: String,

    /**
     * Tên
     */
    first_name: String,

    /**
     * Ảnh đại diện
     */
    avatar: {
      type: String,
      default: null,
    },

    /**
     * Thời gian tạo
     */
    created_date: {
      type: Date,
      default: getCurrentTime(),
    },

    /**
     * Thời gian cập nhật
     */
    updated_date: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: false,
  },
);

// Đánh index cho trường username
userSchema.index({ username: 1 });

export const UserModel = model("sora_users", userSchema);
