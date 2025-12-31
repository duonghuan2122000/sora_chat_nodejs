import * as z from "zod";

export const createConversationValidationSchema = z.object({
  /**
   * Loại cuộc trò chuyện
   */
  type: z.enum(["direct"]),

  /**
   * Thành viên
   */
  members: z.array(
    z.object({
      /**
       * Id người dùng
       */
      user_id: z.string().nonempty(),
    })
  ),
});

export const getMessagesByConversationValidationSchema = z.object({
  /**
   * vị trí bắt đầu
   */
  skip: z.number().min(0).default(0),

  /**
   * Số bản ghi muốn lấy
   */
  take: z.number().min(1).default(10),
});
