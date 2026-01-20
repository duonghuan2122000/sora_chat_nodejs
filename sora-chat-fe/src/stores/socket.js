import { io } from "socket.io-client";
import { defineStore } from "pinia";

export const useSocketStore = defineStore("socket", {
  state: () => ({
    socket: null,
  }),
  actions: {
    /**
     * Khởi tạo socket
     */
    async initSocket() {
      const _this = this;
      _this.socket = io("/chat", {
        path: "/api/v1/socket.io/",
        transports: ["websocket"],
        withCredentials: true,
      });

      _this.socket.on("connect", () => {
        console.log("socket connected");
      });
    },

    /**
     * Thực hiện gửi message
     * @author dbhuan 18.01.2026
     */
    async sendMessage(payload) {
      this.socket.emit("chat:message", payload);
    },

    /**
     * Xử lý lắng nghe sự kiện có message mới
     * @author dbhuan 18.01.2026
     */
    async onNewMessage(callback = async () => {}) {
      const _this = this;
      if (!_this.socket) {
        await _this.initSocket();
      }

      _this.socket.on("chat:message", async (payload) => {
        await callback(payload);
      });
    },
  },
});
