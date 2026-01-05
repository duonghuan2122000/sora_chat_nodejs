<!-- 
    Giao diện cuộc trò chuyện
    GET /
    @author dbhuan 31.12.2025
-->
<template>
  <div class="h-screen flex flex-row bg-gray-100">
    <ToolbarComponent />
    <ConversationLeftMenuComponent />
    <div class="flex-1 py-4 px-4">
      <div class="flex flex-col h-[100%] bg-white rounded-[12px]">
        <div class="h-[100%] flex flex-col justify-center items-center">
          <div>Chưa có tin nhắn. Hãy bắt đầu ngay với "Xin chào"</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ConversationLeftMenuComponent from "@/views/conversations/ConversationLeftMenuComponent.vue";
import ToolbarComponent from "@/views/conversations/ToolbarComponent.vue";
</script>
