import { DateTime } from "luxon";
import { v7 as uuidv7 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Hàm lấy thời gian hiện tại (timezone UTC)
 * @returns Thời gian hiện tại (timezone UTC)
 * @author dbhuan 23.12.2025
 */
export const getCurrentTime = () => DateTime.utc().toJSDate();

/**
 * Hàm tạo uuid
 * @author dbhuan 23.12.2025
 */
export const getNewUUID = () => uuidv7();

/**
 * Hash mật khẩu
 * @param {string} password Mật khẩu
 * @returns Mật khẩu đã được hash
 */
export const hashPassword = async (password) => await bcrypt.hash(password, 10);

/**
 * Kiểm tra mật khẩu có hợp lệ?
 * @param {string} password Mật khẩu raw
 * @param {string} hash Mật khẩu đã hash
 * @returns true/false
 */
export const comparePassword = async (password, hash) =>
  await bcrypt.compare(password, hash);

/**
 * Tạo jwt
 * @param {object} payload Payload jwt
 * @returns token
 * @author 24.12.2025
 */
export const genJwt = async (payload, expiresIn = 86400) => {
  let token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
  return token;
};

/**
 * Hàm decode jwt
 * @param {string} token Token jwt
 * @returns Payload jwt
 * @author dbhuan 23.12.2025
 */
export const decodeJwt = async (token) => {
  let payload = jwt.verify(token, process.env.JWT_SECRET);
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
