export const HttpRequestMethod = {
  GET: "GET",
  POST: "POST",
};

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

export const RouterName = {
  Home: "home",
  Login: "login",
  Conversation: "conversation",
};

export const EMPTY_UUID = "00000000-0000-0000-0000-000000000000";

export const ConversationType = {
  // chat trực tiếp
  DIRECT: "direct",

  // Nhóm chat
  GROUP: "group",
};
