<!-- 
  Left menu component của cuộc trò chuyện
  @author dbhuan 01.01.2026
-->
<template>
  <div class="flex-none w-[320px] py-4">
    <div class="bg-white flex flex-col h-[100%] rounded-[12px]">
      <div class="flex-0 p-4 border-b border-gray-200 flex flex-col gap-2">
        <ElInput
          placeholder="Tìm kiếm user, nhóm"
          v-model="keySearch"
          @keyup.enter="handleSearch"
          clearable
          @clear="handleClearSearch"
        />
        <div v-if="!isSearching">
          <CreateGroupComponent />
        </div>
      </div>

      <!-- Hiển thị danh sách cuộc trò chuyện khi không tìm kiếm -->
      <div v-if="!isSearching" class="flex-1 overflow-y-auto px-2 py-2">
        <ConversationItemComponent
          v-for="conversation in conversationStore.conversations"
          :key="conversation.id"
          :active="conversation.id === route.params.id"
          :currentUser="authStore.user"
          :conversation="conversation"
          @choose-conversation="handleChooseConversation"
        />
      </div>

      <!-- Hiển thị kết quả tìm kiếm khi đang tìm kiếm -->
      <div v-else class="flex-1 overflow-hidden flex flex-col">
        <ElTabs v-model="activeTab" class="search-tabs h-full flex flex-col">
          <ElTabPane label="User" name="user" class="h-full overflow-y-auto px-2 py-2">
            <template v-if="conversationStore.searchedUsers.length > 0">
              <ConversationItemComponent
                v-for="user in conversationStore.searchedUsers"
                :key="user.id"
                :active="user.id === route.params.id"
                :currentUser="authStore.user"
                :conversation="{
                  id: user.id,
                  type: 'direct', // ConversationType.DIRECT
                  members: [
                    { ...authStore.user, user_id: authStore.user.id },
                    { ...user, user_id: user.id },
                  ],
                }"
                @choose-conversation="handleChooseConversationResult"
              />
            </template>
            <div v-else class="text-center text-gray-400 py-10">Không tìm thấy user</div>
          </ElTabPane>
          <ElTabPane label="Nhóm" name="group" class="h-full overflow-y-auto px-2 py-2">
            <div class="text-center text-gray-400 py-10">Không tìm thấy nhóm</div>
          </ElTabPane>
        </ElTabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElInput, ElTabs, ElTabPane, ElMessage } from "element-plus";
import CreateGroupComponent from "@/views/conversations/CreateGroupComponent.vue";
import ConversationItemComponent from "@/views/conversations/ConversationItemComponent.vue";
import { onMounted, ref, watch } from "vue";
import { useConversationStore } from "@/stores/conversation";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
import { RouterName } from "@/commons/const.common";

const route = useRoute();

const keySearch = ref("");
const isSearching = ref(false);
const activeTab = ref("user");

const router = useRouter();
let authStore = useAuthStore();
const conversationStore = useConversationStore();

onMounted(() => {
  conversationStore.getLatestConversationsAsync();
});

/**
 * Xử lý khi chọn cuộc trò chuyện từ danh sách
 * @author dbhuan 02.02.2026
 */
const handleChooseConversation = (conversation) => {
  router.push({
    name: RouterName.Conversation,
    params: {
      id: conversation.id,
    },
  });
};

/**
 * Xử lý khi chọn user/group từ kết quả tìm kiếm
 * @author dbhuan 02.02.2026
 */
const handleChooseConversationResult = async (conversation) => {
  try {
    // 1. Kiểm tra/Tạo cuộc trò chuyện
    const payload = {
      type: conversation.type,
      members: conversation.members.map((m) => ({ user_id: m.user_id })),
    };

    const result = await conversationStore.createConversationAsync(payload);

    if (result && result._id) {
      // 2. Chuyển sang màn hình cuộc trò chuyện
      router.push({
        name: RouterName.Conversation,
        params: {
          id: result._id,
        },
      });

      // 3. Xóa kết quả tìm kiếm
      handleClearSearch();
      keySearch.value = "";
    }
  } catch (error) {
    console.error(error);
    ElMessage.error("Có lỗi xảy ra khi tạo cuộc trò chuyện");
  }
};

/**
 * Xử lý tìm kiếm khi nhấn enter
 * @author dbhuan 02.02.2026
 */
const handleSearch = async () => {
  const query = keySearch.value.trim();

  // Validate
  if (!query) {
    ElMessage.warning("Nội dung tìm kiếm không được để trống");
    return;
  }

  if (query.length < 2 || query.length > 30) {
    ElMessage.warning("Nội dung tìm kiếm phải từ 2 đến 30 ký tự");
    return;
  }

  // Regex check special characters (allow alphanumeric and space)
  const specialCharsRegex =
    /^[a-zA-Z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]+$/;
  if (!specialCharsRegex.test(query)) {
    ElMessage.warning("Nội dung tìm kiếm không được chứa ký tự đặc biệt");
    return;
  }

  isSearching.value = true;
  await conversationStore.getSearchResultAsync({ key_search: query });
};

/**
 * Xử lý xóa tìm kiếm
 */
const handleClearSearch = () => {
  isSearching.value = false;
  conversationStore.resetSearch();
};

// Theo dõi keySearch, nếu xóa trắng thì quay lại danh sách gốc
watch(keySearch, (newVal) => {
  if (!newVal) {
    handleClearSearch();
  }
});
</script>

<style scoped>
:deep(.search-tabs .el-tabs__header) {
  margin-bottom: 0;
  padding: 0 16px;
}
:deep(.search-tabs .el-tabs__content) {
  flex: 1;
}
</style>
