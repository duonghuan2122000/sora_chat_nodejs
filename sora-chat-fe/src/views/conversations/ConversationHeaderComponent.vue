<!-- 
    Giao diện header của cuộc trò chuyện
    @author dbhuan 17.01.2026
-->
<template>
  <div class="flex-0 p-4 border-b border-gray-200 flex flex-row items-center justify-between gap-3">
    <div class="flex flex-row items-center gap-3">
      <div class="flex-none w-[36px] h-[36px]">
        <div class="relative">
          <img
            src="https://cdn2.tuoitre.vn/zoom/515_322/471584752817336320/data/teen360/news/2020/09/01/59881/1598972593_118265345_2621091828152910_2700791632228574126_n.jpg"
            alt=""
            class="w-[36px] h-[36px] rounded-[50%]"
          />
          <div
            v-if="false"
            class="absolute h-[12px] w-[12px] bg-green-500 rounded-[50%] bottom-[-2px] right-[-2px] border border-gray-200"
          ></div>
        </div>
      </div>
      <div class="flex-1 flex flex-col">
        <div class="truncate overflow-hidden text-ellipsis font-semibold">
          {{ conversationName }}
        </div>
        <div v-if="false" class="text-sm text-gray-400">Đang hoạt động</div>
      </div>
    </div>
    <div>
      <ElButton v-if="false" :icon="Ellipsis"> </ElButton>
    </div>
  </div>
</template>

<script setup>
import { Ellipsis } from "lucide-vue-next";

// Components
import { ElButton } from "element-plus";
import { computed } from "vue";
import { ConversationType } from "@/commons/const.common";
import { useAuthStore } from "@/stores/auth";

const props = defineProps({
  /**
   * Thông tin cuộc trò chuyện
   * @author dbhuan 17.01.2026
   */
  conversation: {
    type: Object,
    default: null,
  },
});

let authStore = useAuthStore();

// Tên cuộc trò chuyện
const conversationName = computed(() => {
  if (props.conversation?.type === ConversationType.DIRECT) {
    let otherUser = props.conversation?.members?.find((m) => m.user_id !== authStore.user?.id);
    return `${otherUser?.last_name} ${otherUser?.first_name}`;
  }
  return props.conversation?.name;
});
</script>
