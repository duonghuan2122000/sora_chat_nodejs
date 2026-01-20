<!-- 
    Giao diện input nhắn tin
    @author dbhuan 16.01.2026
-->
<template>
  <div class="SoraMessageInput">
    <div v-if="false" class="p-4 pb-0 mb-4 flex flex-row justify-between border-t border-gray-200">
      <div class="flex flex-col gap-1">
        <div class="font-semibold">Đang trả lời Dương Huân</div>
        <div>Xin chào</div>
      </div>
      <div class="cursor-pointer">&#10006;</div>
    </div>
    <div class="p-4 flex flex-row gap-2">
      <ElInput
        placeholder="Nhập tin nhắn"
        v-model="messageVal"
        type="textarea"
        autosize
        @keydown.enter.exact.prevent="send"
        @keydown.enter.shift.exact
      />
      <div class="mt-1.5 cursor-pointer">
        <ElTooltip content="Gửi" placement="top-end">
          <SendHorizonal :size="20" />
        </ElTooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { SendHorizonal } from "lucide-vue-next";
// Components
import { ElInput, ElTooltip } from "element-plus";
import { ref } from "vue";
import { useSocketStore } from "@/stores/socket";
import { useAuthStore } from "@/stores/auth";

const props = defineProps({
  /**
   * Thông tin cuộc trò chuyện
   * @author dbhuan 18.01.2026
   */
  conversation: {
    type: Object,
    default: null,
  },
});

const socketStore = useSocketStore();
const authStore = useAuthStore();

// message value
const messageVal = ref("");

/**
 * Hàm gửi tin nhắn
 */
const send = async () => {
  // xử lý message trước khi gửi lên server
  let messageRaw = messageVal.value;
  // Phân tách thành các blocks
  let blocks = messageRaw
    .split("\n")
    .map((b) => b.trim())
    .filter((b) => b)
    .map((b) => {
      return {
        type: "text",
        value: b,
      };
    });

  // giữa các block cần thêm block xuống dòng
  let newBlocks = [];
  if (blocks.length > 1) {
    for (let i = 0; i <= blocks.length - 2; i++) {
      newBlocks.push(blocks[i]);
      newBlocks.push({ type: "newline" });
    }
    newBlocks.push(blocks[blocks.length - 1]);
  } else {
    newBlocks = [...blocks];
  }

  console.log(newBlocks);
  await socketStore.sendMessage({
    conversation_id: props.conversation?.id,
    conversation_type: props.conversation?.type,
    message: {
      type: "text",
      version: 1,
      blocks: newBlocks,
      plain_text: messageRaw.replace("\n", " "),
    },
  });

  // Thực hiện clear message input
  messageVal.value = "";
};
</script>

<style>
.SoraMessageInput textarea {
  resize: none;
}
</style>
