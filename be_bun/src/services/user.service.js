import { LoginErrorInfo, RegisterErrorInfo } from "#src/common/const.common.js";
import { UserModel } from "#src/data/entities/user.entity.js";
import {
  comparePassword,
  genJwt,
  getCurrentTime,
  getNewUUID,
  hashPassword,
  decodeJwt,
} from "#src/utils/common.util.js";
import { ResponseUtil } from "#src/utils/request.util.js";

class UserService {
  /**
   * Hàm tạo người dùng
   */
  async createUser(payload) {
    let user = {
      ...payload,
      _id: getNewUUID(),
      created_date: getCurrentTime(),
      password_hashed: await hashPassword(payload.password),
    };

    user = await UserModel.insertOne(user);
    return user;
  }

  /**
   * Hàm đăng ký người dùng
   * @author dbhuan 31.01.2026
   */
  async registerUser(payload) {
    // 1. Kiểm tra username tồn tại chưa
    let userExist = await UserModel.findOne({ username: payload.username })
      .select("_id")
      .lean();
    if (userExist) {
      return ResponseUtil.error(
        RegisterErrorInfo.Code.USERNAME_ALREADY_EXISTS,
        RegisterErrorInfo.Message.USERNAME_ALREADY_EXISTS,
      );
    }

    // 2. Tạo user mới
    let newUser = await this.createUser(payload);

    return ResponseUtil.success({
      user_id: newUser._id,
    });
  }

  /**
   * Hàm login user
   */
  async login(payload) {
    let user = await UserModel.findOne({ username: payload.username }).lean();
    // verify mật khẩu
    let validPass = await comparePassword(
      payload.password,
      user.password_hashed,
    );
    if (!validPass) {
      return ResponseUtil.error(
        LoginErrorInfo.Code.USERNAME_PASSWORD_INVALID,
        LoginErrorInfo.Message.USERNAME_PASSWORD_INVALID,
      );
    }
    let expiresIn = parseInt(process.env.JWT_EXPIRES_IN); // 1 ngày
    let token = await genJwt(
      {
        sub: user._id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        v: parseInt(process.env.JWT_VERSION ?? "1"),
      },
      expiresIn,
    );
    return ResponseUtil.success({ token, expires_in: expiresIn });
  }

  /**
   * Hàm tìm kiếm user bằng username, firstname, lastname
   * @author dbhuan 25.12.2025
   */
  async searchUser(payload) {
    let filters = {};
    if (payload.key_search) {
      filters["$or"] = [
        { username: { $regex: payload.key_search, $options: "i" } },
        { first_name: { $regex: payload.key_search, $options: "i" } },
        { last_name: { $regex: payload.key_search, $options: "i" } },
      ];
    }
    if (payload.user_ids?.length > 0) {
      filters["_id"] = {
        $in: payload.user_ids,
      };
    }
    let totalCount = await UserModel.countDocuments(filters).lean();
    if (totalCount == 0) {
      return {
        total_count: 0,
        items: [],
      };
    }
    let users = await UserModel.find(filters)
      .skip(payload.skip)
      .limit(payload.limit)
      .lean();
    return {
      total_count: totalCount,
      items: users.map((u) => {
        return {
          id: u._id,
          first_name: u.first_name,
          last_name: u.last_name,
          username: u.username,
        };
      }),
    };
  }

  async getCurUser(token) {
    let payload = await decodeJwt(token);
    return {
      id: payload.sub,
      first_name: payload.first_name,
      last_name: payload.last_name,
      username: payload.username,
    };
  }
}

export const userService = new UserService();
