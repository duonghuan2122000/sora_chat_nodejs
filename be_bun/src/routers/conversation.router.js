import { Hono } from "hono";
import {
  createConversationValidationSchema,
  getLatestConversationsValidationSchema,
  getMessagesByConversationValidationSchema,
} from "#src/validations/conversation.validation.js";
import { AppUrlPath, CurrentUserKey } from "#src/common/const.common";
import { validator } from "hono/validator";
import { conversationService } from "#src/services/conversation.service";
import { authMiddleware } from "#src/middlewares/auth.middleware";
import { ResponseUtil } from "#src/utils/request.util";
import { messageService } from "#src/services/message.service";

const app = new Hono();

// POST /conversations
app.post(
  AppUrlPath.Conversations.CREATE,
  validator("json", (value, c) => {
    const parsed = createConversationValidationSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        ResponseUtil.error(
          CreateConversationErrorInfo.Code.BAD_REQUEST,
          CreateConversationErrorInfo.Message.BAD_REQUEST,
        ),
      );
    }
    return parsed.data;
  }),
  async (c) => {
    let body = c.req.valid("json");
    return c.json(ResponseUtil.success(await conversationService.create(body)));
  },
);

// POST /conversations/:conversation_id/messages
app.post(
  AppUrlPath.Conversations.MESSAGES_BY_CONVERSATION_ID,
  validator("json", (value, c) => {
    const parsed = getMessagesByConversationValidationSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        ResponseUtil.error(
          GetMessagesByConversationErrorInfo.Code.BAD_REQUEST,
          GetMessagesByConversationErrorInfo.Message.BAD_REQUEST,
        ),
      );
    }
    return parsed.data;
  }),
  async (c) => {
    let body = c.req.valid("json");
    let result = await messageService.getMessagesByConversation({
      ...body,
      conversation_id: c.req.param("conversation_id"),
    });

    return c.json(ResponseUtil.success(result));
  },
);

// GET /conversations/:conversation_id
app.get(AppUrlPath.Conversations.GET_CONVERSATION, async (c) => {
  let conversation = await conversationService.getConversation(
    c.req.param("conversation_id"),
  );
  if (conversation) {
    conversation.id = conversation._id;
    delete conversation._id;
    delete conversation.__v;
  }
  return c.json(ResponseUtil.success(conversation));
});

// POST /conversations/latest
app.post(
  AppUrlPath.Conversations.LATEST_CONVERSATIONS,
  authMiddleware,
  validator("json", (value, c) => {
    const parsed = getLatestConversationsValidationSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        ResponseUtil.error(
          GetLatestConversationsErrorInfo.Code.BAD_REQUEST,
          GetLatestConversationsErrorInfo.Message.BAD_REQUEST,
        ),
      );
    }
    return parsed.data;
  }),
  async (c) => {
    let body = c.req.valid("json");
    let user = c.get(CurrentUserKey);
    let result = await conversationService.getLatestConversations({
      ...body,
      user_id: user.sub,
    });

    result = result.map((c) => {
      c.id = c._id;
      delete c._id;
      return c;
    });
    return c.json(ResponseUtil.success(result));
  },
);

export default app;
