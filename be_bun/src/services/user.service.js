import {
  LoginErrorInfo,
  RegisterErrorInfo,
  HttpStatusCode,
} from "#src/common/const.common.js";
import { UserModel } from "#src/data/entities/user.entity.js";
import { RefreshTokenModel } from "#src/data/entities/refreshToken.entity.js";
import {
  comparePassword,
  genJwt,
  getCurrentTime,
  getNewUUID,
  hashPassword,
  decodeJwt,
  addTime,
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

    user = await UserModel.create(user);
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
    let expiresIn = parseInt(process.env.JWT_EXPIRES_IN); // 2 phút (theo .env hiện tại)
    let jwtPayload = {
      sub: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      v: parseInt(process.env.JWT_VERSION ?? "1"),
    };

    let token = await genJwt(jwtPayload, expiresIn);

    // Tạo refresh token
    let refreshExpiresIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN);
    let refreshToken = await genJwt(
      jwtPayload,
      refreshExpiresIn,
      process.env.JWT_REFRESH_SECRET,
    );

    // Lưu refresh token vào DB
    await RefreshTokenModel.create({
      _id: getNewUUID(),
      user_id: user._id,
      token: refreshToken,
      expires_at: addTime(getCurrentTime(), refreshExpiresIn),
    });

    return ResponseUtil.success({
      token,
      expires_in: expiresIn,
      refresh_token: refreshToken,
      refresh_expires_in: refreshExpiresIn,
    });
  }

  /**
   * Hàm làm mới access token
   * @author dbhuan 31.01.2026
   */
  async refreshToken(token) {
    try {
      // 1. Verify refresh token
      let payload = await decodeJwt(token, process.env.JWT_REFRESH_SECRET);
      if (!payload) {
        return ResponseUtil.error(
          HttpStatusCode.UNAUTHORIZED,
          "Refresh token không hợp lệ",
        );
      }

      // 2. Kiểm tra trong DB xem token còn tồn tại không (để tránh reuse token cũ đã rotate)
      let refreshTokenDoc = await RefreshTokenModel.findOne({ token }).lean();
      if (!refreshTokenDoc) {
        return ResponseUtil.error(
          HttpStatusCode.UNAUTHORIZED,
          "Refresh token đã hết hạn hoặc đã được sử dụng",
        );
      }

      // 3. Xóa token cũ (Rotation)
      await RefreshTokenModel.deleteOne({ _id: refreshTokenDoc._id });

      // 4. Tạo token mới
      let user = await UserModel.findById(payload.sub).lean();
      if (!user) {
        return ResponseUtil.error(
          HttpStatusCode.UNAUTHORIZED,
          "Người dùng không tồn tại",
        );
      }

      let jwtPayload = {
        sub: user._id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        v: parseInt(process.env.JWT_VERSION ?? "1"),
      };

      let expiresIn = parseInt(process.env.JWT_EXPIRES_IN);
      let newAccessToken = await genJwt(jwtPayload, expiresIn);

      let refreshExpiresIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN);
      let newRefreshToken = await genJwt(
        jwtPayload,
        refreshExpiresIn,
        process.env.JWT_REFRESH_SECRET,
      );

      // 5. Lưu refresh token mới vào DB
      await RefreshTokenModel.create({
        _id: getNewUUID(),
        user_id: user._id,
        token: newRefreshToken,
        expires_at: addTime(getCurrentTime(), refreshExpiresIn),
      });

      return ResponseUtil.success({
        token: newAccessToken,
        expires_in: expiresIn,
        refresh_token: newRefreshToken,
        refresh_expires_in: refreshExpiresIn,
      });
    } catch (error) {
      console.error(error);
      return ResponseUtil.error(
        HttpStatusCode.UNAUTHORIZED,
        "Refresh token không hợp lệ hoặc đã hết hạn",
      );
    }
  }

  /**
   * Đăng xuất - Xóa hết refresh token của user
   */
  async logout(token) {
    try {
      // Lấy refresh token từ cookie/DB để xóa
      await RefreshTokenModel.deleteOne({ token });
    } catch (error) {
      console.error(error);
    }
    return ResponseUtil.success(null);
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
          user_id: u._id, // Add user_id for frontend consistency
          first_name: u.first_name,
          last_name: u.last_name,
          username: u.username,
          avatar: u.avatar,
        };
      }),
    };
  }

  async getCurUser(token) {
    let payload = await decodeJwt(token);
    let user = await UserModel.findById(payload.sub).lean();
    return {
      id: user._id,
      user_id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      avatar: user.avatar,
    };
  }

  /**
   * Cập nhật thông tin user
   * @author dbhuan 03.02.2026
   */
  async updateUser(userId, payload) {
    let updateData = {};
    if (payload.first_name !== undefined)
      updateData.first_name = payload.first_name;
    if (payload.last_name !== undefined)
      updateData.last_name = payload.last_name;
    if (payload.avatar !== undefined) updateData.avatar = payload.avatar;

    let user = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).lean();
    return {
      id: user._id,
      user_id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      avatar: user.avatar,
    };
  }
}

export const userService = new UserService();
