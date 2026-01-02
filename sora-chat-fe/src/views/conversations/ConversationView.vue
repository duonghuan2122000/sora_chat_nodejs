<!-- 
    Giao diện cuộc trò chuyện
    GET /conversations/:id
    @author dbhuan 31.12.2025
-->
<template>
  <div class="h-screen flex flex-row bg-gray-100">
    <ToolbarComponent />
    <ConversationLeftMenuComponent />
    <ConversationMessageBoxComponent />
  </div>
</template>

<script setup>
import ConversationLeftMenuComponent from "@/views/conversations/ConversationLeftMenuComponent.vue";
import ToolbarComponent from "@/views/conversations/ToolbarComponent.vue";
import ConversationMessageBoxComponent from "@/views/conversations/ConversationMessageBoxComponent.vue";
</script>
