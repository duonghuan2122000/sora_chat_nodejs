<!-- 
    Layout chính của ứng dụng
    @author dbhuan 14.01.2026
-->
<template>
  <router-view />
</template>

<script setup>
import { io } from "socket.io-client";
import { onMounted } from "vue";

onMounted(() => {
  handleConnectSocket();
});

/**
 * Xử lý kết nối socket server
 */
const handleConnectSocket = () => {
  const socket = io("/chat", {
    path: "/api/v1/socket.io/",
    transports: ["websocket"], // nên bật
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("socket connected");
  });

  socket.on("client:connected", (data) => {
    console.log(data);
  });
};
</script>
