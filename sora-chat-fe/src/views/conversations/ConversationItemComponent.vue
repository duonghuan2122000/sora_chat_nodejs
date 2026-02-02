<!-- 
    Giao diện cuộc trò chuyện ở left menu
    @author dbhuan 01.01.2026
-->
<template>
  <div
    class="flex flex-row px-4 py-4 gap-2 items-center cursor-pointer hover:bg-gray-100 mb-[1px] rounded-[8px]"
    :class="{ 'bg-gray-100': active }"
    @click="handleChooseConversation"
  >
    <div class="flex-none w-[36px] h-[36px]">
      <div class="relative">
        <img :src="avatarUrl" alt="" class="w-[36px] h-[36px] rounded-[50%]" />
        <div
          v-if="online"
          class="absolute h-[12px] w-[12px] bg-green-500 rounded-[50%] bottom-[-2px] right-[-2px] border border-gray-200"
        ></div>
      </div>
    </div>
    <div class="flex-1 truncate overflow-hidden text-ellipsis">{{ conversationName }}</div>
    <div class="flex-0 pl-2">
      <div
        v-if="props.unReadMessage > 0"
        class="flex flex-row items-center justify-center bg-red-300 text-center w-[28px] h-[28px] rounded-[50%] text-white text-sm"
      >
        {{ unReadMessageText }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ConversationType, RouterName } from "@/commons/const.common";
import { computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  /**
   * Cờ cho biết phần tử có đang được chọn không?
   * Mặc định: false
   */
  active: {
    type: Boolean,
    default: false,
  },

  /**
   * Cho biết cuộc trò chuyện có user đang ở trạng thái online
   * Mặc định: false
   */
  online: {
    type: Boolean,
    default: false,
  },

  /**
   * Số lượng tin nhắn chưa đọc
   * Mặc định: 0
   */
  unReadMessage: {
    type: Number,
    default: 0,
  },

  /**
   * Thông tin cuộc trò chuyện
   */
  conversation: {
    type: Object,
    default: null,
  },

  /**
   * Thông tin user hiện tại
   */
  currentUser: {
    type: Object,
    default: null,
  },
});

const router = useRouter();

const unReadMessageText = computed(() => {
  if (props.unReadMessage > 10) {
    return "10+";
  }
  return props.unReadMessage.toString();
});

// Tên cuộc trò chuyện
const conversationName = computed(() => {
  if (
    props.conversation?.type === "direct" ||
    props.conversation?.type === ConversationType.DIRECT
  ) {
    const currentId = props.currentUser?.id || props.currentUser?.user_id;
    const otherUser = props.conversation?.members?.find((m) => (m.user_id || m.id) !== currentId);
    if (otherUser) {
      return (
        `${otherUser?.last_name || ""} ${otherUser?.first_name || ""}`.trim() ||
        otherUser?.username ||
        "Người dùng"
      );
    }
  }
  return props.conversation?.name || "Cuộc trò chuyện";
});

// Avatar của cuộc trò chuyện
const avatarUrl = computed(() => {
  if (props.conversation?.avatar_url) return props.conversation.avatar_url;

  if (
    props.conversation?.type === "direct" ||
    props.conversation?.type === ConversationType.DIRECT
  ) {
    const currentId = props.currentUser?.id || props.currentUser?.user_id;
    const otherUser = props.conversation?.members?.find((m) => (m.user_id || m.id) !== currentId);
    if (otherUser?.avatar) {
      if (otherUser.avatar.startsWith("http")) return otherUser.avatar;
      return `${window._apis.beBaseUrl}/images/${otherUser.avatar}`;
    }
  }

  // Mặc định
  return "https://cdn2.tuoitre.vn/zoom/515_322/471584752817336320/data/teen360/news/2020/09/01/59881/1598972593_118265345_2621091828152910_2700791632228574126_n.jpg";
});

/**
 * Sự kiện chọn cuộc trò chuyện
 * @author dbhuan 14.01.2026
 */
const handleChooseConversation = async () => {
  router.push({
    name: RouterName.Conversation,
    params: {
      id: props.conversation.id,
    },
  });
};
</script>
