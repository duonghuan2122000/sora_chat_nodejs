import { BaseApi } from "@/apis/base.api";
import { beBaseRequest } from "@/apis/configs/be.config.api";
import { HttpRequestMethod } from "@/commons/const.common";
class UserApi extends BaseApi {
  /**
   * Lấy thông tin user hiện tại
   * @author 02.01.2026
   */
  async getCurrentUserAsync() {
    let result = await this.requestAsync(beBaseRequest, {
      url: "/users/me",
      method: HttpRequestMethod.GET,
    });
    return result;
  }

  /**
   * Thực hiện login
   * @author 02.01.2026
   */
  async loginAsync(payload) {
    let result = await this.requestAsync(beBaseRequest, {
      url: "/users/login",
      method: HttpRequestMethod.POST,
      data: payload,
    });
    return result;
  }

  /**
   * Đăng xuất
   * @author 25.01.2026
   */
  async logoutAsync() {
    let result = await this.requestAsync(beBaseRequest, {
      url: "/users/logout",
      method: HttpRequestMethod.POST,
    });
    return result;
  }

  /**
   * Tìm kiếm user
   * @author 03.01.2026
   */
  async searchUsersAsync(payload) {
    if (!payload?.skip) {
      payload.skip = 0;
    }
    if (!payload?.limit) {
      payload.limit = 10;
    }
    if (!Object.hasOwn(payload, "user_ids") || !payload?.user_ids) {
      payload.user_ids = [];
    }
    let result = await this.requestAsync(beBaseRequest, {
      url: "/users/search",
      method: HttpRequestMethod.POST,
      data: payload,
    });
    return result;
  }
}

export const userApi = new UserApi();
