<!-- 
    Giao diện input nhắn tin
    @author dbhuan 16.01.2026
-->
<template>
  <div class="SoraMessageInput flex flex-col">
    <!-- Reply Preview -->
    <div
      v-if="socketStore.replyingTo"
      class="px-4 py-2 bg-gray-50 border-b border-gray-100 flex flex-row items-center justify-between"
    >
      <div class="flex flex-col overflow-hidden border-l-[3px] border-blue-500 pl-3">
        <div class="text-[12px] font-bold text-blue-600 truncate">
          {{ isReplyingToCurrentUser ? "Bạn" : "Dương Huân" }}
        </div>
        <div class="text-[13px] text-gray-500 truncate">
          {{ replyContentSnippet }}
        </div>
      </div>
      <div
        @click="socketStore.clearReplyingTo"
        class="p-1 hover:bg-gray-200 rounded-full cursor-pointer text-gray-400 bg-white shadow-sm"
      >
        <X :size="14" />
      </div>
    </div>

    <!-- Toolbar -->
    <div class="px-4 py-2 border-b border-gray-100 flex flex-row gap-4 items-center">
      <div
        @click="execAction('bold')"
        class="cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
        :class="{ 'text-blue-500 bg-blue-50': isBold }"
      >
        <ElTooltip content="In đậm (Ctrl + B)" placement="top">
          <Bold :size="18" />
        </ElTooltip>
      </div>
      <div
        @click="execAction('italic')"
        class="cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
        :class="{ 'text-blue-500 bg-blue-50': isItalic }"
      >
        <ElTooltip content="In nghiêng (Ctrl + I)" placement="top">
          <Italic :size="18" />
        </ElTooltip>
      </div>
      <div
        @click="execAction('underline')"
        class="cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
        :class="{ 'text-blue-500 bg-blue-50': isUnderline }"
      >
        <ElTooltip content="Gạch chân (Ctrl + U)" placement="top">
          <UnderlineIcon :size="18" />
        </ElTooltip>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-4 flex flex-row gap-2 items-end">
      <div
        ref="editorRef"
        contenteditable="true"
        class="flex-1 min-h-[40px] max-h-[200px] overflow-y-auto p-2 border border-gray-200 rounded-[8px] outline-none focus:border-blue-400 transition-colors whitespace-pre-wrap"
        placeholder="Nhập tin nhắn..."
        @keydown="handleKeyDown"
        @input="updateState"
        @mouseup="updateState"
      ></div>

      <div class="mb-1 cursor-pointer">
        <ElTooltip content="Gửi" placement="top-end">
          <div
            @click="send"
            class="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            <SendHorizonal :size="20" />
          </div>
        </ElTooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { SendHorizonal, Bold, Italic, Underline as UnderlineIcon, X } from "lucide-vue-next";
// Components
import { ElTooltip } from "element-plus";
import { ref, onMounted, computed } from "vue";
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

const editorRef = ref(null);
const isBold = ref(false);
const isItalic = ref(false);
const isUnderline = ref(false);

const isReplyingToCurrentUser = computed(() => {
  return socketStore.replyingTo?.sender?.user_id === authStore.user?.id;
});

const replyContentSnippet = computed(() => {
  if (!socketStore.replyingTo) return "";
  const plainText = socketStore.replyingTo.message?.plain_text || "";
  const firstLine = plainText.split("\n")[0];
  return plainText.includes("\n") ? firstLine + "..." : firstLine;
});

/**
 * Cập nhật trạng thái toolbar
 */
const updateState = () => {
  isBold.value = document.queryCommandState("bold");
  isItalic.value = document.queryCommandState("italic");
  isUnderline.value = document.queryCommandState("underline");
};

/**
 * Thực hiện action format
 */
const execAction = (command) => {
  document.execCommand(command, false, null);
  editorRef.value?.focus();
  updateState();
};

/**
 * Xử lý phím tắt
 */
const handleKeyDown = (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case "b":
        e.preventDefault();
        execAction("bold");
        break;
      case "i":
        e.preventDefault();
        execAction("italic");
        break;
      case "u":
        e.preventDefault();
        execAction("underline");
        break;
      case "enter":
        e.preventDefault();
        document.execCommand("insertHTML", false, "<br><br>");
        // Fix for contenteditable newline at the end
        break;
    }
  } else if (e.key === "Enter") {
    e.preventDefault();
    send();
  }
};

/**
 * Parse contenteditable to blocks
 */
const parseToBlocks = (element) => {
  const blocks = [];

  const traverse = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent) {
        let parent = node.parentNode;
        let type = "text";

        // Simple check for parent tags - limited by execCommand
        while (parent && parent !== element) {
          const tag = parent.tagName.toLowerCase();
          if (tag === "b" || tag === "strong") type = "bold";
          else if (tag === "i" || tag === "em") type = "italic";
          else if (tag === "u") type = "underline";
          parent = parent.parentNode;
        }

        blocks.push({ type, value: node.textContent });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === "BR") {
        blocks.push({ type: "newline" });
      } else {
        for (let child of node.childNodes) {
          traverse(child);
        }
        // Handle div-wrapped lines which execCommand sometimes creates
        if (node.tagName === "DIV" && node.nextSibling) {
          blocks.push({ type: "newline" });
        }
      }
    }
  };

  for (let node of element.childNodes) {
    traverse(node);
  }

  return blocks;
};

/**
 * Hàm gửi tin nhắn
 */
const send = async () => {
  if (!editorRef.value) return;

  const blocks = parseToBlocks(editorRef.value);
  if (blocks.length === 0) return;

  const plainText = editorRef.value.innerText;

  await socketStore.sendMessage({
    conversation_id: props.conversation?.id,
    conversation_type: props.conversation?.type,
    message: {
      type: "text",
      version: 1,
      blocks: blocks,
      plain_text: plainText,
    },
    reply: socketStore.replyingTo
      ? {
          message_id: socketStore.replyingTo.id,
        }
      : null,
  });

  socketStore.clearReplyingTo();

  // Thực hiện clear message input
  editorRef.value.innerHTML = "";
  updateState();
  editorRef.value.focus();
};

onMounted(() => {
  editorRef.value?.focus();
});
</script>

<style>
.SoraMessageInput textarea {
  resize: none;
}
</style>
