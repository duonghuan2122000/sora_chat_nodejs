import { BaseApi } from "@/apis/base.api";
import { beBaseRequest } from "@/apis/configs/be.config.api";
import { HttpRequestMethod } from "@/commons/const.common";

class GroupApi extends BaseApi {
  /**
   * Tìm kiếm nhóm
   * @author dbhuan 02.02.2026
   */
  async searchGroupsAsync(payload) {
    if (!payload?.skip) {
      payload.skip = 0;
    }
    if (!payload?.limit) {
      payload.limit = 10;
    }
    let result = await this.requestAsync(beBaseRequest, {
      url: "/groups/search",
      method: HttpRequestMethod.POST,
      data: payload,
    });
    return result;
  }
}

export const groupApi = new GroupApi();
