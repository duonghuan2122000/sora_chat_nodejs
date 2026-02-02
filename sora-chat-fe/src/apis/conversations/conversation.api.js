import { BaseApi } from "@/apis/base.api";
import { beBaseRequest } from "@/apis/configs/be.config.api";
import { HttpRequestMethod } from "@/commons/const.common";

class ConversationApi extends BaseApi {
  /**
   * Lấy danh sách conversation gần nhất
   * @author 03.01.2026
   */
  async getLatestConversationsAsync(payload) {
    if (!payload?.skip) {
      payload.skip = 0;
    }
    if (!payload?.limit) {
      payload.limit = 10;
    }
    let result = await this.requestAsync(beBaseRequest, {
      url: "/conversations/latest",
      method: HttpRequestMethod.POST,
      data: {
        skip: payload.skip,
        limit: payload.limit,
        key_search: payload?.key_search,
      },
    });
    return result;
  }

  /**
   * Lấy thông tin cuộc trò chuyện
   * @author dbhuan 17.01.2026
   */
  async getConversationAsync(id) {
    let result = await this.requestAsync(beBaseRequest, {
      url: `/conversations/${id}`,
      method: HttpRequestMethod.GET,
    });

    return result;
  }

  /**
   * Tạo cuộc trò chuyện
   * @author dbhuan 02.02.2026
   */
  async createConversationAsync(payload) {
    let result = await this.requestAsync(beBaseRequest, {
      url: "/conversations",
      method: HttpRequestMethod.POST,
      data: payload,
    });
    return result;
  }
}

export const conversationApi = new ConversationApi();
