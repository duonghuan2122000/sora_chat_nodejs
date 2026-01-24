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
        class="flex flex-row items-center gap-2 group"
        :class="{ 'flex-row-reverse': isMessageCurrentUser }"
      >
        <div
          class="border border-gray-200 rounded-[8px] px-3 py-2 inline-block max-w-[400px] relative"
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
            <!-- Reaction list display -->
            <div
              v-if="props.message?.reactions?.length"
              class="absolute bottom-[-18px] flex flex-row gap-1 bg-white border border-gray-100 rounded-full px-1 py-0.5 shadow-sm z-10"
              :class="{
                'right-[-5px]': isMessageCurrentUser,
                'left-[-5px]': !isMessageCurrentUser,
              }"
            >
              <div
                v-for="reaction in props.message.reactions"
                :key="reaction.emoji"
                class="flex items-center gap-0.5 px-1 cursor-pointer hover:bg-gray-50 rounded-full text-[12px]"
                :class="{ 'bg-blue-50': hasUserReacted(reaction) }"
                @click="handleShowReactionDetails(reaction.emoji)"
              >
                <span>{{ reaction.emoji }}</span>
                <span class="text-gray-500 font-medium">{{ reaction.count }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Reaction trigger button -->
        <div
          class="opacity-0 group-hover:opacity-100 transition-opacity flex flex-row items-center"
        >
          <ElPopover
            v-model:visible="popoverVisible"
            placement="top"
            trigger="click"
            effect="light"
            width="auto"
            popper-class="reaction-popover"
          >
            <template #reference>
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 cursor-pointer text-gray-500"
                title="Bày tỏ cảm xúc"
              >
                <Smile :size="18" />
              </div>
            </template>
            <div class="flex flex-row gap-2 justify-center">
              <div
                v-for="emoji in emojiList"
                :key="emoji"
                class="text-2xl cursor-pointer hover:scale-125 transition-transform p-1 rounded hover:bg-gray-100"
                @click="handleSelectEmoji(emoji)"
              >
                {{ emoji }}
              </div>
            </div>
          </ElPopover>
        </div>
      </div>
    </div>
    <ReactionDetailsDialog
      v-model="showReactionDetails"
      :message-id="props.message?.id"
      :initial-emoji="selectedEmoji"
    />
  </div>
</template>

<script setup>
import { formatDateTime } from "@/commons/fn.common";
import { useAuthStore } from "@/stores/auth";
import { useSocketStore } from "@/stores/socket";
import { computed, ref } from "vue";

// Components
import { ElTooltip, ElPopover } from "element-plus";
import { Smile } from "lucide-vue-next";
import ReactionDetailsDialog from "./ReactionDetailsDialog.vue";

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
let socketStore = useSocketStore();

const emojiList = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🙏", "👏"];

const popoverVisible = ref(false);

const isMessageCurrentUser = computed(() => {
  return props.message?.sender?.user_id === authStore.user?.id;
});

const timeSentFormatted = computed(() => {
  if (props.message?.timestamps?.created_at) {
    return formatDateTime(props.message?.timestamps?.created_at);
  }
  return "";
});

/**
 * Kiểm tra user hiện tại đã reaction emoji này chưa
 * @author dbhuan 24.01.2026
 */
const hasUserReacted = (reaction) => {
  return reaction.user_ids.includes(authStore.user?.id);
};

/**
 * Xử lý chọn emoji từ picker
 * @author dbhuan 24.01.2026
 */
const handleSelectEmoji = (emoji) => {
  socketStore.sendReaction({
    message_id: props.message.id,
    emoji: emoji,
  });
  popoverVisible.value = false;
};

/**
 * Xử lý khi click vào reaction hiện có - Hiển thị popup chi tiết
 * @author dbhuan 24.01.2026
 */
const showReactionDetails = ref(false);
const selectedEmoji = ref("");

const handleShowReactionDetails = (emoji) => {
  selectedEmoji.value = emoji;
  showReactionDetails.value = true;
};
</script>

<style scoped>
:deep(.reaction-popover) {
  padding: 8px !important;
  min-width: unset !important;
}
</style>
