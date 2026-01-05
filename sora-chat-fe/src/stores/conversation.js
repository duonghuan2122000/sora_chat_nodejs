import { conversationApi } from "@/apis/conversations/conversation.api";
import { userApi } from "@/apis/users/user.api";
import { defineStore } from "pinia";

export const useConversationStore = defineStore("conversation", {
  state: () => ({
    conversations: [],
    key_search: "",
    skip: 0,
    limit: 10,
  }),
  getters: {},
  actions: {
    /**
     * Hàm lấy danh sách cuộc trò chuyện gần nhất
     * @author 03.01.2026
     */
    async getLatestConversationsAsync({ skip = 0, limit = 10 } = {}) {
      let result = await conversationApi.getLatestConversationsAsync({ skip, limit });
      this.conversations = result.data?.data || [];
      return this.conversations;
    },

    /**
     * Tìm kiếm user, cuộc trò chuyện
     * @author 03.01.2026
     */
    async getSearchResultAsync({ key_search = "" }) {
      if (key_search !== this.key_search) {
        this.key_search = key_search;
        this.skip = 0;
      } else {
        this.skip += this.limit;
      }
      let result = await Promise.all([
        (async () => {
          let res = await conversationApi.getLatestConversationsAsync({
            skip: this.skip,
            limit: this.limit,
            key_search: this.key_search,
          });
          return {
            type: "conversations",
            data: res,
          };
        })(),
        (async () => {
          let res = await userApi.searchUsersAsync({
            skip: this.skip,
            limit: this.limit,
            key_search: this.key_search,
          });
          return {
            type: "users",
            data: res,
          };
        })(),
      ]);

      console.log(result);

      let conversations =
        result.find((item) => item.type === "conversations")?.data?.data?.data || [];
      let users = result.find((item) => item.type === "users")?.data?.data?.data?.items || [];
      let newConversationsState = [...this.conversations, ...conversations, ...users];
      this.conversations = newConversationsState;
      return this.conversations;
    },
  },
});
