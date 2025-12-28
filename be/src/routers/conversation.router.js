import {
  AppUrlPath,
  CreateConversationErrorInfo,
  GetMessagesByConversationErrorInfo,
  HttpStatusCode,
} from "#src/common/const.common.js";
import { conversationService } from "#src/services/conversation.service.js";
import { messageService } from "#src/services/message.service.js";
import { ResponseUtil } from "#src/utils/request.util.js";
import {
  createConversationValidationSchema,
  getMessagesByConversationValidationSchema,
} from "#src/validations/conversation.validation.js";
import express from "express";

const router = express.Router();

router.post(AppUrlPath.Conversations.CREATE, async (req, res) => {
  let resultParser = await createConversationValidationSchema.safeParseAsync(
    req.body
  );
  if (!resultParser.success) {
    return res
      .status(HttpStatusCode.OK)
      .json(
        ResponseUtil.error(
          CreateConversationErrorInfo.Code.BAD_REQUEST,
          CreateConversationErrorInfo.Message.BAD_REQUEST
        )
      );
  }

  return res
    .status(HttpStatusCode.OK)
    .json(
      ResponseUtil.success(await conversationService.create(resultParser.data))
    );
});

router.post(
  AppUrlPath.Conversations.MESSAGES_BY_CONVERSATION_ID,
  async (req, res) => {
    let resultParser =
      await getMessagesByConversationValidationSchema.safeParseAsync(req.body);
    if (!resultParser.success) {
      return res
        .status(HttpStatusCode.OK)
        .json(
          ResponseUtil.error(
            GetMessagesByConversationErrorInfo.Code.BAD_REQUEST,
            GetMessagesByConversationErrorInfo.Message.BAD_REQUEST
          )
        );
    }

    let result = await messageService.getMessagesByConversation({
      ...resultParser.data,
      conversation_id: req.params.conversation_id,
    });

    if (result?.length > 0) {
      result = result.map((message) => {
        message.id = message._id;
        delete message._id;
        delete message.__v;
        return message;
      });
    }

    return res.status(HttpStatusCode.OK).json(ResponseUtil.success(result));
  }
);

router.get(AppUrlPath.Conversations.GET_CONVERSATION, async (req, res) => {
  let conversation = await conversationService.getConversation(
    req.params.conversation_id
  );
  if (conversation) {
    conversation.id = conversation._id;
    delete conversation._id;
    delete conversation.__v;
  }
  return res.status(HttpStatusCode.OK).json(ResponseUtil.success(conversation));
});

export default router;
