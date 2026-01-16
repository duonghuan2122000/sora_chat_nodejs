<!-- 
    Giao diện chat của cuộc trò chuyện
    @author dbhuan 01.01.2026
-->
<template>
  <div class="flex-1 py-4 px-4">
    <div class="flex flex-col h-[100%] bg-white rounded-[12px]">
      <div
        class="flex-0 p-4 border-b border-gray-200 flex flex-row items-center justify-between gap-3"
      >
        <div class="flex flex-row items-center gap-3">
          <div class="flex-none w-[36px] h-[36px]">
            <div class="relative">
              <img
                src="https://cdn2.tuoitre.vn/zoom/515_322/471584752817336320/data/teen360/news/2020/09/01/59881/1598972593_118265345_2621091828152910_2700791632228574126_n.jpg"
                alt=""
                class="w-[36px] h-[36px] rounded-[50%]"
              />
              <div
                class="absolute h-[12px] w-[12px] bg-green-500 rounded-[50%] bottom-[-2px] right-[-2px] border border-gray-200"
              ></div>
            </div>
          </div>
          <div class="flex-1 flex flex-col">
            <div class="truncate overflow-hidden text-ellipsis font-semibold">Dương Huân</div>
            <div v-if="false" class="text-sm text-gray-400">Đang hoạt động</div>
          </div>
        </div>
        <div>
          <ElButton :icon="Ellipsis"> </ElButton>
        </div>
      </div>
      <div class="flex-1 overflow-y-auto">
        <div v-if="false" class="h-[100%] flex flex-col justify-center items-center">
          <div>Chưa có tin nhắn. Hãy bắt đầu ngay với "Xin chào"</div>
        </div>
        <div v-else class="flex flex-col gap-10 px-4 py-4">
          <div class="flex flex-row justify-center">
            <div v-loading="true" class="h-[28px] w-[28px]"></div>
          </div>
          <MessageComponent v-for="n in 10" :isMessageCurrentUser="n == 1 ? true : false" />
        </div>
      </div>
      <div class="flex-0">
        <div class="p-4 pb-0 mb-4 flex flex-row justify-between border-t border-gray-200">
          <div class="flex flex-col gap-1">
            <div class="font-semibold">Đang trả lời Dương Huân</div>
            <div>Xin chào</div>
          </div>
          <div class="cursor-pointer">&#10006;</div>
        </div>
        <div class="p-4">
          <ElInput placeholder="Nhập tin nhắn" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Ellipsis } from "lucide-vue-next";
import MessageComponent from "@/views/conversations/MessageComponent.vue";

// Components
import { ElButton, ElInput } from "element-plus";
</script>
