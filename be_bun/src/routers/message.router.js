import { Hono } from "hono";
import { AppUrlPath } from "#src/common/const.common.js";
import { messageService } from "#src/services/message.service.js";
import { ResponseUtil } from "#src/utils/request.util.js";

const app = new Hono();

// POST /messages/:message_id/reactions
app.post(AppUrlPath.Messages.REACTIONS, async (c) => {
  const message_id = c.req.param("message_id");
  const { emoji, skip = 0, limit = 10 } = await c.req.json();

  const result = await messageService.getMessageReactions({
    message_id,
    emoji,
    skip,
    limit,
  });

  if (!result) {
    return c.json(
      ResponseUtil.error("MESSAGE_NOT_FOUND", "Tin nhắn không tồn tại"),
      404,
    );
  }

  return c.json(ResponseUtil.success(result));
});

export default app;
