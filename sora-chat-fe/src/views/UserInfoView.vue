<!-- 
    Giao diện thông tin cá nhân
    GET /user/info
    @author dbhuan 03.02.2026
-->
<template>
  <div class="h-screen flex flex-row bg-gray-100">
    <ToolbarComponent />
    <div class="flex-1 flex flex-col">
      <div class="h-[64px] flex-none px-6 flex items-center bg-white border-b border-gray-200">
        <h1 class="text-xl font-bold italic text-blue-600">Sora Chat</h1>
      </div>
      <div class="flex-1 p-6 overflow-auto">
        <div class="max-w-2xl mx-auto bg-white rounded-[12px] shadow-sm">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-xl font-semibold">Thông tin cá nhân</h2>
          </div>
          <div class="p-6 space-y-6">
            <div class="flex items-center space-x-4">
              <div class="w-24 h-24 relative group">
                <img
                  :src="
                    form.avatar ||
                    'https://cdn2.tuoitre.vn/zoom/515_322/471584752817336320/data/teen360/news/2020/09/01/59881/1598972593_118265345_2621091828152910_2700791632228574126_n.jpg'
                  "
                  class="w-full h-full rounded-full object-cover border-2 border-gray-200"
                />
                <div
                  class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer overflow-hidden"
                >
                  <span class="text-white text-xs text-center px-2">Đổi ảnh (URL)</span>
                </div>
              </div>
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Link ảnh đại diện</label
                >
                <ElInput v-model="form.avatar" placeholder="Nhập URL ảnh đại diện" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên đệm</label>
                <ElInput v-model="form.last_name" placeholder="Nhập Họ và tên đệm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                <ElInput v-model="form.first_name" placeholder="Nhập Tên" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
              <ElInput :model-value="authStore.user?.username" disabled />
              <p class="mt-1 text-xs text-gray-400">Tên đăng nhập không thể thay đổi</p>
            </div>

            <div class="flex justify-end pt-4">
              <ElButton type="primary" :loading="loading" @click="handleSave"
                >Lưu thay đổi</ElButton
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import ToolbarComponent from "@/views/conversations/ToolbarComponent.vue";
import { ElInput, ElButton, ElMessage } from "element-plus";
import { useTitle } from "@vueuse/core";
import { HttpStatusCode } from "@/commons/const.common";

useTitle("Thông tin cá nhân | Sora Chat");

const authStore = useAuthStore();
const loading = ref(false);

const form = reactive({
  first_name: "",
  last_name: "",
  avatar: "",
});

onMounted(() => {
  if (authStore.user) {
    form.first_name = authStore.user.first_name || "";
    form.last_name = authStore.user.last_name || "";
    form.avatar = authStore.user.avatar || "";
  }
});

const handleSave = async () => {
  loading.value = true;
  try {
    const result = await authStore.updateUser({
      first_name: form.first_name,
      last_name: form.last_name,
      avatar: form.avatar,
    });

    if (result.httpStatusCode === HttpStatusCode.OK) {
      ElMessage.success("Cập nhật thông tin thành công");
    } else {
      ElMessage.error(result.data?.message || "Cập nhật thất bại");
    }
  } catch {
    ElMessage.error("Có lỗi xảy ra khi cập nhật");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Custom styles if needed */
</style>
