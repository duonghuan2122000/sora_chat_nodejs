<!-- 
    Giao diện chat của cuộc trò chuyện
    @author dbhuan 01.01.2026
-->
<template>
  <div class="flex-1 py-4 px-4">
    <div class="flex flex-col h-[100%] bg-white rounded-[12px]">
      <ConversationHeaderComponent :conversation="props.conversation" />
      <div class="flex-1 overflow-y-auto" ref="refMessages">
        <div v-if="false" class="h-[100%] flex flex-col justify-center items-center">
          <div>Chưa có tin nhắn. Hãy bắt đầu ngay với "Xin chào"</div>
        </div>
        <div v-else class="flex flex-col gap-10 px-4 py-4">
          <div class="flex flex-row justify-center">
            <div v-if="false" v-loading="true" class="h-[28px] w-[28px]"></div>
          </div>
          <MessageComponent
            v-for="message in props.messages.slice().reverse()"
            :message="message"
            :key="message.id"
          />
        </div>
      </div>
      <div class="flex-0">
        <MessageInputComponent :conversation="props.conversation" />
      </div>
    </div>
  </div>
</template>

<script setup>
import MessageComponent from "@/views/conversations/MessageComponent.vue";
import MessageInputComponent from "@/views/conversations/MessageInputComponent.vue";

import ConversationHeaderComponent from "@/views/conversations/ConversationHeaderComponent.vue";
import { nextTick, onMounted, ref } from "vue";

const props = defineProps({
  /**
   * Thông tin cuộc trò chuyện
   * @author dbhuan 17.01.2026
   */
  conversation: {
    type: Object,
    default: null,
  },

  /**
   * Danh sách tin nhắn
   * @author dbhuan 17.01.2026
   */
  messages: {
    type: Object,
    default: () => [],
  },
});

const refMessages = ref(null);

onMounted(() => {
  handleScrollToBottom();
});

const handleScrollToBottom = async () => {
  await nextTick();
  setTimeout(() => {
    refMessages.value.scrollTop = refMessages.value.scrollHeight;
  }, 250);
};

defineExpose({ handleScrollToBottom });
</script>
