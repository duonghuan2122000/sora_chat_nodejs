<!-- 
    Layout chính của ứng dụng
    @author dbhuan 14.01.2026
-->
<template>
  <router-view />
</template>

<script setup>
import { useSocketStore } from "@/stores/socket";
import { onMounted } from "vue";

const socketStore = useSocketStore();

onMounted(() => {
  socketStore.initSocket();
});
</script>
