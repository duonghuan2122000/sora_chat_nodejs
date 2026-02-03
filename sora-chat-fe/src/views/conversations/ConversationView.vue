<!-- 
    Giao diện cuộc trò chuyện
    GET /conversations/:id
    @author dbhuan 31.12.2025
-->
<template>
  <div class="h-screen flex flex-row bg-gray-100">
    <ToolbarComponent />
    <ConversationLeftMenuComponent />
    <ConversationMessageBoxComponent
      ref="refConversationMessageBoxComponent"
      :conversation="conversation"
      :messages="messages"
    />
  </div>
</template>

<script setup>
import ConversationLeftMenuComponent from "@/views/conversations/ConversationLeftMenuComponent.vue";
import ToolbarComponent from "@/views/conversations/ToolbarComponent.vue";
import ConversationMessageBoxComponent from "@/views/conversations/ConversationMessageBoxComponent.vue";
import { nextTick, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { conversationApi } from "@/apis/conversations/conversation.api";
import { messageApi } from "@/apis/messages/message.api";
import { useSocketStore } from "@/stores/socket";
import { useTitle } from "@vueuse/core";
import { ConversationType } from "@/commons/const.common";
import { useAuthStore } from "@/stores/auth";
import { computed, watch } from "vue";

const socketStore = useSocketStore();
const route = useRoute();
const conversationId = route.params.id;
const conversation = ref(null);
const payloadMessage = ref({
  skip: 0,
  limit: 10,
});
const messages = ref([]);
const refConversationMessageBoxComponent = ref(null);
const authStore = useAuthStore();
const title = useTitle();

// Tên cuộc trò chuyện
const conversationName = computed(() => {
  if (conversation.value?.type === ConversationType.DIRECT) {
    let otherUser = conversation.value?.members?.find((m) => m.user_id !== authStore.user?.id);
    return `${otherUser?.last_name} ${otherUser?.first_name}`;
  }
  return conversation.value?.name;
});

// Cập nhật title trang web
watch(
  conversationName,
  (newName) => {
    if (newName) {
      title.value = `${newName} | Sora Chat`;
    } else {
      title.value = "Sora Chat";
    }
  },
  { immediate: true },
);

onMounted(() => {
  getConversation();
  socketStore.onNewMessage(handleNewMessage);
  socketStore.onMessageReaction(handleMessageReaction);
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

const handleNewMessage = async (payload) => {
  if (payload?.success) {
    messages.value = [payload.data, ...messages.value];
    await nextTick();
    await refConversationMessageBoxComponent.value?.handleScrollToBottom();
  }
};

const handleMessageReaction = async (payload) => {
  if (payload?.success) {
    let updatedMessage = payload.data;
    let index = messages.value.findIndex((m) => m.id === updatedMessage.id);
    if (index > -1) {
      messages.value[index] = updatedMessage;
    }
  }
};
</script>
