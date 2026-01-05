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
  },
});
