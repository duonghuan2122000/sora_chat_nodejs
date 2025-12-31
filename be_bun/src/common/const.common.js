/**
 * HttpStatusCode
 * @author dbhuan 23.12.2025
 */
export const HttpStatusCode = {
  // 200
  OK: 200,
  // 201
  CREATED: 201,
  // 400
  BAD_REQUEST: 400,
  // 401
  UNAUTHORIZED: 401,
  // 403
  FORBIDDEN: 403,
  // 404
  NOT_FOUND: 404,
  // 500
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * ErrorInfo tạo user
 * @author dbhuan 23.12.2025
 */
export const CreateUserErrorInfo = {
  Code: {
    BAD_REQUEST: "BAD_REQUEST",
  },
  Message: {
    BAD_REQUEST: "Thông tin request không hợp lệ",
  },
};

export const LoginErrorInfo = {
  Code: {
    BAD_REQUEST: "BAD_REQUEST",
    USERNAME_PASSWORD_INVALID: "USERNAME_PASSWORD_INVALID",
  },
  Message: {
    BAD_REQUEST: "Thông tin request không hợp lệ",
    USERNAME_PASSWORD_INVALID: "Tài khoản hoặc mật khẩu không chính xác",
  },
};

export const SearchUserErrorInfo = {
  Code: {
    BAD_REQUEST: "BAD_REQUEST",
  },
  Message: {
    BAD_REQUEST: "Thông tin request không hợp lệ",
  },
};

export const CreateConversationErrorInfo = {
  Code: {
    BAD_REQUEST: "BAD_REQUEST",
  },
  Message: {
    BAD_REQUEST: "Thông tin request không hợp lệ",
  },
};

export const GetMessagesByConversationErrorInfo = {
  Code: {
    BAD_REQUEST: "BAD_REQUEST",
  },
  Message: {
    BAD_REQUEST: "Thông tin request không hợp lệ",
  },
};

export const ChatMessageErrorInfo = {
  Code: {
    CONVERSATION_NOT_FOUND: "CONVERSATION_NOT_FOUND",
  },
  Message: {
    CONVERSATION_NOT_FOUND: "Cuộc trò chuyện không tồn tại",
  },
};

/**
 * Url path định nghĩa chung
 * @author 24.12.2025
 */
export const AppUrlPath = {
  Healthz: {
    BASE: "/healthz",
  },
  Users: {
    BASE: "/users",
    CREATE: "/",
    LOGIN: "/login",
    SEARCH: "/search",
    ME: "/me",
  },
  Conversations: {
    BASE: "/conversations",
    CREATE: "/",
    MESSAGES_BY_CONVERSATION_ID: "/:conversation_id/messages",
    GET_CONVERSATION: "/:conversation_id",
  },
};

export const SocketEventName = {
  CONNECTION: "connection",

  CHAT_MESSAGE_DIRECT: "chat:message:direct",

  CHAT_MESSAGE: "chat:message",

  CONVERSATION_JOIN: "conversation:join",

  CONVERSATION_LEAVE: "conversation:leave",
};
