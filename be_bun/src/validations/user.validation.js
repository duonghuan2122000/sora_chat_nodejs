/**
 * Validation cho request tạo user
 * @author dbhuan 23.12.2025
 */
import * as z from "zod";

export const registerValidationSchema = z.object({
  /**
   * Tên đăng nhập
   */
  username: z
    .string()
    .nonempty("Tên đăng nhập không được bỏ trống")
    .min(6, "Tên đăng nhập phải có ít nhất 6 ký tự"),

  /**
   * Mật khẩu
   */
  password: z
    .string()
    .nonempty("Mật khẩu không được bỏ trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .regex(/[A-Za-z0-9]/, "Mật khẩu phải chứa ký tự A-Za-z0-9")
    .regex(/[^A-Za-z0-9]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt"),

  /**
   * Họ và tên đệm
   */
  last_name: z.string().nonempty("Họ và tên đệm không được bỏ trống"),

  /**
   * Tên
   */
  first_name: z.string().nonempty("Tên không được bỏ trống"),
});

export const createUserValidationSchema = registerValidationSchema;

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
  key_search: z.string(),

  /**
   * Danh sách id người dùng
   */
  user_ids: z.array(z.string()),
});

export const updateUserValidationSchema = z.object({
  /**
   * Họ và tên đệm
   */
  last_name: z.string().optional(),

  /**
   * Tên
   */
  first_name: z.string().optional(),

  /**
   * Ảnh đại diện
   */
  avatar: z.string().optional(),
});
