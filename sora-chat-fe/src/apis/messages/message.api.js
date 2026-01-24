import { BaseApi } from "@/apis/base.api";
import { beBaseRequest } from "@/apis/configs/be.config.api";
import { HttpRequestMethod } from "@/commons/const.common";

class MessageApi extends BaseApi {
  /**
   * Lấy danh sách message theo conversation
   * @author dbhuan 17.01.2026
   */
  async getMessagesByConversation(payload) {
    if (!payload?.skip) {
      payload.skip = 0;
    }
    if (!payload?.limit) {
      payload.limit = 10;
    }
    let result = await this.requestAsync(beBaseRequest, {
      url: `conversations/${payload.conversationId}/messages`,
      method: HttpRequestMethod.POST,
      data: payload,
    });

    return result;
  }

  /**
   * Lấy chi tiết reaction của tin nhắn
   * @author dbhuan 24.01.2026
   */
  async getMessageReactionsAsync(payload) {
    const { messageId, emoji, skip = 0, limit = 10 } = payload;
    let result = await this.requestAsync(beBaseRequest, {
      url: `messages/${messageId}/reactions`,
      method: HttpRequestMethod.POST,
      data: {
        emoji,
        skip,
        limit,
      },
    });

    return result;
  }
}

export const messageApi = new MessageApi();
