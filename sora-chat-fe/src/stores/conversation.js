import { conversationApi } from "@/apis/conversations/conversation.api";
import { userApi } from "@/apis/users/user.api";
import { groupApi } from "@/apis/groups/group.api";
import { defineStore } from "pinia";

export const useConversationStore = defineStore("conversation", {
  state: () => ({
    conversations: [],
    searchedUsers: [],
    searchedGroups: [],
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
     * Tìm kiếm user, nhóm
     * @author 02.02.2026
     */
    async getSearchResultAsync({ key_search = "" }) {
      if (key_search !== this.key_search) {
        this.key_search = key_search;
        this.skip = 0;
      } else {
        this.skip += this.limit;
      }

      let [userRes, groupRes] = await Promise.all([
        userApi.searchUsersAsync({
          skip: this.skip,
          limit: this.limit,
          key_search: this.key_search,
        }),
        groupApi.searchGroupsAsync({
          skip: this.skip,
          limit: this.limit,
          key_search: this.key_search,
        }),
      ]);

      let users = userRes.data?.data?.items || [];
      let groups = groupRes.data?.data?.items || [];

      if (this.skip === 0) {
        this.searchedUsers = users;
        this.searchedGroups = groups;
      } else {
        this.searchedUsers = [...this.searchedUsers, ...users];
        this.searchedGroups = [...this.searchedGroups, ...groups];
      }

      return {
        users: this.searchedUsers,
        groups: this.searchedGroups,
      };
    },

    /**
     * Reset kết quả tìm kiếm
     */
    resetSearch() {
      this.key_search = "";
      this.skip = 0;
      this.searchedUsers = [];
      this.searchedGroups = [];
    },

    /**
     * Tạo cuộc trò chuyện
     * @author dbhuan 02.02.2026
     */
    async createConversationAsync(payload) {
      let result = await conversationApi.createConversationAsync(payload);
      return result.data?.data;
    },
  },
});
