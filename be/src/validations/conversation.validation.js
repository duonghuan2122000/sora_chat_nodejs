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
