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
}

export const conversationApi = new ConversationApi();
