<!-- 
    Giao diện cuộc trò chuyện
    GET /conversations/:id
    @author dbhuan 31.12.2025
-->
<template>
  <div class="h-screen flex flex-row bg-gray-100">
    <ToolbarComponent />
    <ConversationLeftMenuComponent />
    <ConversationMessageBoxComponent :conversation="conversation" :messages="messages" />
  </div>
</template>

<script setup>
import ConversationLeftMenuComponent from "@/views/conversations/ConversationLeftMenuComponent.vue";
import ToolbarComponent from "@/views/conversations/ToolbarComponent.vue";
import ConversationMessageBoxComponent from "@/views/conversations/ConversationMessageBoxComponent.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { conversationApi } from "@/apis/conversations/conversation.api";
import { messageApi } from "@/apis/messages/message.api";

const route = useRoute();
const conversationId = route.params.id;
const conversation = ref(null);
const payloadMessage = ref({
  skip: 0,
  limit: 10,
});
const messages = ref([]);

onMounted(() => {
  getConversation();
});

// Lấy thông tin cuộc trò chuyện
const getConversation = async () => {
  let result = await conversationApi.getConversationAsync(conversationId);
  if (result.data?.success) {
    conversation.value = result.data?.data;
    await getMessagesByConversation({
      ...payloadMessage.value,
      conversationId: conversation.value?.id,
    });
  }
};

/**
 * Lấy danh sách message theo conversation
 * @author dbhuan 17.01.2026
 */
const getMessagesByConversation = async (payload) => {
  let result = await messageApi.getMessagesByConversation(payload);
  console.log(result.data);
  if (result.data?.success) {
    messages.value = [...messages.value, ...(result.data?.data ?? [])];
  }
};
</script>
