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
      <div class="mt-1.5 cursor-pointer" title="Gửi">
        <SendHorizonal :size="20" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { SendHorizonal } from "lucide-vue-next";
// Components
import { ElInput } from "element-plus";
import { ref } from "vue";

// message value
const messageVal = ref("");

/**
 * Hàm gửi tin nhắn
 */
const send = async () => {
  alert("gửi");
};
</script>

<style>
.SoraMessageInput textarea {
  resize: none;
}
</style>
