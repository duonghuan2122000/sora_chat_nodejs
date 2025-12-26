/**
 * Validation cho request tạo user
 * @author dbhuan 23.12.2025
 */
import * as z from "zod";

export const createUserValidationSchema = z.object({
  /**
   * Tên đăng nhập
   */
  username: z.string().nonempty().min(6),

  /**
   * Mật khẩu
   */
  password: z.string().nonempty().min(6),

  /**
   * Họ và tên đệm
   */
  last_name: z.string().nonempty(),

  /**
   * Tên
   */
  first_name: z.string().nonempty(),
});

export const loginValidationSchema = z.object({
  /**
   * Tên đăng nhập
   */
  username: z.string().nonempty().min(6),
  /**
   * Mật khẩu
   */
  password: z.string().nonempty().min(6),
});

export const searchUserValidationSchema = z.object({
  /**
   * vị trí bắt đầu
   * Mặc định: 0
   */
  skip: z.number().min(0).default(0),

  /**
   * Số bản ghi
   * Mặc định: 10
   */
  limit: z.number().min(1).default(10),

  /**
   * Key tìm kiếm
   */
  key_search: z.string().nonempty().min(1),
});
