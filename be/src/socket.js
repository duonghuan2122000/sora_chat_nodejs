import {
  decodeJwt,
  getConversationRoom,
  getUserRoom,
} from "#src/utils/common.util.js";
import {
  ChatMessageErrorInfo,
  SocketEventName,
} from "#src/common/const.common.js";
import { messageService } from "#src/services/message.service.js";
import { conversationService } from "#src/services/conversation.service.js";
import { ResponseUtil } from "#src/utils/request.util.js";
import { MessageBlockType } from "#src/data/entities/message.entity.js";

export const handleSocket = async (io) => {
  io.engine.use(async (req, res, next) => {
    const token = req._query.token;
    if (!token) {
      const err = new Error("not authorized");
      err.data = { content: "Please retry later" }; // additional details
      return next(err);
    }
    let payload = await decodeJwt(token);
    req.userId = payload.sub;
    next();
  });

  let chatIoNamespace = io.of("/chat");

  // Khi người dùng kết nối socket
  chatIoNamespace.on(SocketEventName.CONNECTION, async (socket) => {
    let curUserId = socket.request.userId;

    // Thực hiện join room mặc định của user đó
    socket.join(await getUserRoom(curUserId));

    socket.on(SocketEventName.CHAT_MESSAGE, async (data) => {
      let conversation = await conversationService.getConversation(
        data.conversation_id
      );
      if (!conversation) {
        socket.emit(
          SocketEventName.CHAT_MESSAGE,
          ResponseUtil.error(
            ChatMessageErrorInfo.Code.CONVERSATION_NOT_FOUND,
            ChatMessageErrorInfo.Message.CONVERSATION_NOT_FOUND
          )
        );
        return;
      }

      let createMessagePayload = {
        ...data,
        conversation_type: conversation.type,
        sender: {
          // gắn người gửi là id người dùng hiện tại
          user_id: curUserId,
        },
      };

      // tạo plain text cho message
      createMessagePayload.message.plain_text =
        createMessagePayload.message.blocks.reduce((t, b) => {
          switch (b.type) {
            case MessageBlockType.TEXT:
              return t + b.value;

            default:
              return t;
          }
        }, "");

      let message = await messageService.createMessage(createMessagePayload);
      // lấy toàn bộ người dùng trong cuộc trò chuyện
      let usersInConversation = conversation.members.map((m) => m.user_id);

      let result = ResponseUtil.success(message);

      for (let userId of usersInConversation) {
        chatIoNamespace
          .to(await getUserRoom(userId))
          .emit(SocketEventName.CHAT_MESSAGE, result);
      }
      chatIoNamespace
        .to(await getConversationRoom(conversation._id))
        .emit(SocketEventName.CHAT_MESSAGE, result);
    });

    // Sự kiện join cuộc trò chuyện
    socket.on(SocketEventName.CONVERSATION_JOIN, async (data) => {
      let conversation = await conversationService.getConversation(
        data.conversation_id
      );
      if (!conversation) {
        return;
      }
      socket.join(await getConversationRoom(conversation._id));
    });

    // sự kiện leave cuộc trò chuyện
    socket.on(SocketEventName.CONVERSATION_LEAVE, async (data) => {
      let conversation = await conversationService.getConversation(
        data.conversation_id
      );
      if (!conversation) {
        return;
      }
      socket.leave(await getConversationRoom(conversation._id));
    });
  });
};
