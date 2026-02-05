import { userApi } from "@/apis/users/user.api";
import { HttpStatusCode } from "@/commons/const.common";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async getCurrentUser() {
      let result = await userApi.getCurrentUserAsync();
      if (result.httpStatusCode !== HttpStatusCode.OK) {
        this.user = null;
        return null;
      }
      this.user = result.data?.data;
      return this.user;
    },

    /**
     * Đăng xuất
     * @author 25.01.2026
     */
    async logout() {
      await userApi.logoutAsync();
      this.user = null;
    },

    /**
     * Cập nhật thông tin user
     * @author dbhuan 03.02.2026
     */
    async updateUser(payload) {
      let result = await userApi.updateUserAsync(payload);
      if (result.httpStatusCode === HttpStatusCode.OK) {
        this.user = {
          ...this.user,
          ...result.data?.data,
        };
      }
      return result;
    },
  },
});
