<!-- 
    Giao diện từng dòng tin nhắn
    @author dbhuan 01.01.2026
-->
<template>
  <div class="flex flex-row items-end gap-3" :class="{ 'flex-row-reverse': isMessageCurrentUser }">
    <div class="flex-none w-[28px] h-[28px]">
      <div class="relative">
        <img
          src="https://cdn2.tuoitre.vn/zoom/515_322/471584752817336320/data/teen360/news/2020/09/01/59881/1598972593_118265345_2621091828152910_2700791632228574126_n.jpg"
          alt=""
          class="w-[28px] h-[28px] rounded-[50%]"
          title="Dương Huân"
        />
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div v-if="!isMessageCurrentUser" class="text-sm text-gray-400">Dương Huân</div>
      <div
        class="flex flex-row items-center gap-2"
        :class="{ 'flex-row-reverse': isMessageCurrentUser }"
      >
        <div
          class="border border-gray-200 rounded-[8px] px-3 py-2 inline-block max-w-[400px]"
          :class="{ 'bg-green-100': isMessageCurrentUser, 'bg-gray-100': !isMessageCurrentUser }"
        >
          <div class="relative">
            <div class="whitespace-pre-line">
              <ElTooltip :content="timeSentFormatted" effect="dark" placement="top-start">
                <span>
                  <template v-for="(block, index) in props.message?.message?.blocks" :key="index">
                    <span v-if="block.type === 'text'">{{ block.value }}</span>
                    <b v-else-if="block.type === 'bold'">{{ block.value }}</b>
                    <i v-else-if="block.type === 'italic'">{{ block.value }}</i>
                    <u v-else-if="block.type === 'underline'">{{ block.value }}</u>
                    <br v-else-if="block.type === 'newline'" />
                  </template>
                </span>
              </ElTooltip>
            </div>
            <div class="absolute bottom-[-20px] right-[-5px] flex flex-row">
              <div
                v-if="false"
                class="border border-gray-100 rounded-[50%] cursor-pointer bg-white"
              >
                😂
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDateTime } from "@/commons/fn.common";
import { useAuthStore } from "@/stores/auth";
import { computed } from "vue";

// Components
import { ElTooltip } from "element-plus";

const props = defineProps({
  /**
   * Thông tin message
   * @author dbhuan 17.01.2026
   */
  message: {
    type: Object,
    default: null,
  },
});

let authStore = useAuthStore();

const isMessageCurrentUser = computed(() => {
  return props.message?.sender?.user_id === authStore.user?.id;
});

const timeSentFormatted = computed(() => {
  if (props.message?.timestamps?.created_at) {
    return formatDateTime(props.message?.timestamps?.created_at);
  }
  return "";
});
</script>
