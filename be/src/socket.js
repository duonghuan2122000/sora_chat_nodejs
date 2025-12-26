import { decodeJwt } from "#src/utils/common.util.js";
import { SocketEventName } from "#src/common/const.common.js";
import { messageService } from "#src/services/message.service.js";
import { ConversationType } from "#src/data/entities/conversation.entity.js";
import { conversationService } from "#src/services/conversation.service.js";

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

  // Khi người dùng kết nối socket
  io.on("connection", (socket) => {
    let curUserId = socket.request.userId;

    // Thực hiện join room mặc định của user đó
    socket.join(`user:${curUserId}`);

    socket.on(SocketEventName.CHAT_MESSAGE, async (data) => {
      let dataJson = JSON.parse(data);
      let conversation = await conversationService.getConversation(
        dataJson.conversation_id
      );
      let message = await messageService.createMessage(dataJson);
      // lấy toàn bộ người dùng trong cuộc trò chuyện
      let usersInConversation = conversation.members.map((m) => m.user_id);

      for (let userId of usersInConversation) {
        io.to(`user:${userId}`).emit(SocketEventName.CHAT_MESSAGE, message);
      }
      io.to(`conversation:${conversation._id}`).emit(
        SocketEventName.CHAT_MESSAGE,
        message
      );
    });

    // Sự kiện join cuộc trò chuyện
    socket.on(SocketEventName.CONVERSATION_JOIN, async (data) => {
      let dataJson = JSON.parse(data);
      let conversation = await conversationService.getConversation(
        dataJson.conversation_id
      );
      if (!conversation) {
        return;
      }
      socket.join(`conversation:${conversation._id}`);
    });

    // sự kiện leave cuộc trò chuyện
    socket.on(SocketEventName.CONVERSATION_LEAVE, async (data) => {
      let dataJson = JSON.parse(data);
      let conversation = await conversationService.getConversation(
        dataJson.conversation_id
      );
      if (!conversation) {
        return;
      }
      socket.leave(`conversation:${conversation._id}`);
    });
  });
};
