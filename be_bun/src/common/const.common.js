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
 * ErrorInfo đăng ký user
 * @author dbhuan 31.01.2026
 */
export const RegisterErrorInfo = {
  Code: {
    BAD_REQUEST: "BAD_REQUEST",
    USERNAME_ALREADY_EXISTS: "USERNAME_ALREADY_EXISTS",
  },
  Message: {
    BAD_REQUEST: "Thông tin request không hợp lệ",
    USERNAME_ALREADY_EXISTS: "Tên đăng nhập đã tồn tại",
  },
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

export const GetLatestConversationsErrorInfo = {
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

export const ImageUploadErrorInfo = {
  Code: {
    BAD_REQUEST: "BAD_REQUEST",
    FILE_TOO_LARGE: "FILE_TOO_LARGE",
    INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
    UPLOAD_FAILED: "UPLOAD_FAILED",
  },
  Message: {
    BAD_REQUEST: "Thông tin request không hợp lệ",
    FILE_TOO_LARGE: "File quá lớn",
    INVALID_FILE_TYPE: "Định dạng file không hợp lệ",
    UPLOAD_FAILED: "Upload file thất bại",
  },
};

export const CurrentUserKey = "sora_current_user";

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
    REGISTER: "/register",
    LOGIN: "/login",
    SEARCH: "/search",
    ME: "/me",
    LOGOUT: "/logout",
    REFRESH_TOKEN: "/refresh-token",
  },
  Conversations: {
    BASE: "/conversations",
    CREATE: "/",
    MESSAGES_BY_CONVERSATION_ID: "/:conversation_id/messages",
    GET_CONVERSATION: "/:conversation_id",
    LATEST_CONVERSATIONS: "/latest",
  },
  Messages: {
    BASE: "/messages",
    REACTIONS: "/:message_id/reactions",
  },
  Images: {
    BASE: "/images",
    UPLOAD: "/upload",
    STREAM: "/:filename",
  },
};

export const SocketEventName = {
  CONNECTION: "connection",

  CLIENT_CONNECTED: "client:connected",

  CHAT_MESSAGE_DIRECT: "chat:message:direct",

  CHAT_MESSAGE: "chat:message",

  CHAT_MESSAGE_REACTION: "chat:message:reaction",

  CONVERSATION_JOIN: "conversation:join",

  CONVERSATION_LEAVE: "conversation:leave",
};
