import { DateTime } from "luxon";
import { sign as signJwt, verify as verifyJwt } from "hono/jwt";

/**
 * Hàm lấy thời gian hiện tại (timezone UTC)
 * @returns Thời gian hiện tại (timezone UTC)
 * @author dbhuan 23.12.2025
 */
export const getCurrentTime = () => DateTime.utc().toJSDate();

/**
 * Hàm cộng thời gian trong lớp DateTime
 * @author dbhuan 02.01.2026
 */
export const addTime = (date, time) =>
  DateTime.fromJSDate(date)
    .plus({
      seconds: time,
    })
    .toJSDate();

/**
 * Hàm tạo uuid
 * @author dbhuan 23.12.2025
 */
export const getNewUUID = () => Bun.randomUUIDv7();

/**
 * Hash mật khẩu
 * @param {string} password Mật khẩu
 * @returns Mật khẩu đã được hash
 */
export const hashPassword = async (password) =>
  await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10,
  });

/**
 * Kiểm tra mật khẩu có hợp lệ?
 * @param {string} password Mật khẩu raw
 * @param {string} hash Mật khẩu đã hash
 * @returns true/false
 */
export const comparePassword = async (password, hash) =>
  await Bun.password.verify(password, hash);

/**
 * Tạo jwt
 * @param {object} payload Payload jwt
 * @returns token
 * @author 24.12.2025
 */
export const genJwt = async (payload, expiresIn = 86400) => {
  if (typeof payload === "object") {
    payload.exp = Math.floor(Date.now() / 1000) + expiresIn;
  }
  let token = await signJwt(payload, process.env.JWT_SECRET);

  return token;
};

/**
 * Hàm decode jwt
 * @param {string} token Token jwt
 * @returns Payload jwt
 * @author dbhuan 23.12.2025
 */
export const decodeJwt = async (token) => {
  let payload = await verifyJwt(token, process.env.JWT_SECRET);
  return payload;
};

/**
 * Hàm lấy room của người dùng
 * @author dbhuan 27.12.2025
 */
export const getUserRoom = async (userId) => `user:${userId}`;

/**
 * Hàm lấy room của cuộc trò chuyện
 * @author dbhuan 27.12.2025
 */
export const getConversationRoom = async (conversationId) =>
  `conversation:${conversationId}`;
