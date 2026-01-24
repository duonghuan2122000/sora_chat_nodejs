<template>
  <ElDialog
    v-model="visible"
    title="Biểu cảm"
    width="500px"
    @closed="handleClosed"
    class="reaction-details-dialog"
  >
    <div class="flex flex-col gap-4">
      <div class="text-lg font-medium">Tổng số reaction: {{ totalCount }}</div>

      <ElTabs v-model="activeTab" @tab-change="handleTabChange">
        <ElTabPane
          v-for="summary in summaries"
          :key="summary.emoji"
          :label="`${summary.emoji} ${summary.count}`"
          :name="summary.emoji"
        >
          <div
            ref="scrollContainer"
            class="max-h-[300px] overflow-y-auto flex flex-col gap-3 pr-2 scrollbar-thin"
            @scroll="handleScroll"
          >
            <div v-for="user in users" :key="user.id" class="flex items-center gap-3 py-1">
              <img
                :src="user.avatar || defaultAvatar"
                class="w-10 h-10 rounded-full object-cover border border-gray-100"
                alt="avatar"
              />
              <span class="text-[15px] font-medium text-gray-700">
                {{ user.last_name }} {{ user.first_name }}
              </span>
            </div>

            <div v-if="loading" class="flex justify-center py-2">
              <span class="text-sm text-gray-500">Đang tải...</span>
            </div>
          </div>
        </ElTabPane>
      </ElTabs>
    </div>
  </ElDialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { ElDialog, ElTabs, ElTabPane } from "element-plus";
import { messageApi } from "@/apis/messages/message.api";

const props = defineProps({
  modelValue: Boolean,
  messageId: String,
  initialEmoji: String,
});

const emit = defineEmits(["update:modelValue"]);

const visible = ref(false);
const activeTab = ref("");
const totalCount = ref(0);
const summaries = ref([]);
const users = ref([]);
const loading = ref(false);
const hasMore = ref(true);
const skip = ref(0);
const limit = 10;
const defaultAvatar =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val;
    if (val) {
      activeTab.value = props.initialEmoji;
      fetchData(true);
    }
  },
);

watch(visible, (val) => {
  emit("update:modelValue", val);
});

const fetchData = async (reset = false) => {
  if (reset) {
    skip.value = 0;
    users.value = [];
    hasMore.value = true;
  }

  if (loading.value || !hasMore.value) return;

  loading.value = true;
  try {
    const response = await messageApi.getMessageReactionsAsync({
      messageId: props.messageId,
      emoji: activeTab.value,
      skip: skip.value,
      limit: limit,
    });

    if (response.data?.success) {
      const { total_count, summaries: s, users: u } = response.data.data;
      totalCount.value = total_count;
      summaries.value = s;

      if (u.length < limit) {
        hasMore.value = false;
      }

      users.value = reset ? u : [...users.value, ...u];
      skip.value += u.length;
    }
  } catch (error) {
    console.error("Failed to fetch reaction details:", error);
  } finally {
    loading.value = false;
  }
};

const handleTabChange = (tabName) => {
  activeTab.value = tabName;
  fetchData(true);
};

const handleScroll = (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target;
  if (scrollHeight - scrollTop - clientHeight < 50) {
    fetchData();
  }
};

const handleClosed = () => {
  totalCount.value = 0;
  summaries.value = [];
  users.value = [];
  activeTab.value = "";
  skip.value = 0;
};
</script>

<style scoped>
.reaction-details-dialog :deep(.el-dialog__body) {
  padding-top: 10px;
}

.reaction-details-dialog :deep(.el-tabs__item) {
  font-size: 16px;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #bbb;
}
</style>
