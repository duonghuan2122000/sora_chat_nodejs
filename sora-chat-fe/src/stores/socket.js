import { io } from "socket.io-client";
import { defineStore } from "pinia";

export const useSocketStore = defineStore("socket", {
  state: () => ({
    socket: null,
    replyingTo: null, // Tin nhắn đang được trả lời
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

    /**
     * Thực hiện gửi reaction
     * @author dbhuan 24.01.2026
     */
    async sendReaction(payload) {
      this.socket.emit("chat:message:reaction", payload);
    },

    /**
     * Xử lý lắng nghe sự kiện có reaction mới
     * @author dbhuan 24.01.2026
     */
    async onMessageReaction(callback = async () => {}) {
      const _this = this;
      if (!_this.socket) {
        await _this.initSocket();
      }

      _this.socket.on("chat:message:reaction", async (payload) => {
        await callback(payload);
      });
    },

    /**
     * Set tin nhắn đang được trả lời
     */
    setReplyingTo(message) {
      this.replyingTo = message;
    },

    /**
     * Xóa tin nhắn đang trả lời
     */
    clearReplyingTo() {
      this.replyingTo = null;
    },
  },
});
