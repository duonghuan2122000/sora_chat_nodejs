<!-- 
    trang giao diện màn hình đăng nhập
    GET /login
    @author dbhuan 27.12.2025
-->
<template>
  <div class="flex justify-center mt-4">
    <UForm
      :schema="formValidationSchema"
      :state="formPayload"
      class="flex flex-col gap-4 min-w-100"
      @submit="handleLogin"
    >
      <h2>Đăng nhập</h2>
      <USeparator />
      <UAlert v-if="alertLogin" :title="alertLogin" />
      <UFormField label="Tên đăng nhập" name="username">
        <UInput
          class="w-full"
          v-model="formPayload.username"
          placeholder="Nhập tên đăng nhập"
        />
      </UFormField>
      <UFormField label="Mật khẩu" name="password">
        <UInput
          class="w-full"
          v-model="formPayload.password"
          placeholder="Nhập mật khẩu"
          type="password"
        />
      </UFormField>
      <div>
        <UButton type="submit" :loading="isLoading"> Đăng nhập </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup>
import * as z from "zod";
useSeoMeta({
  title: "Đăng nhập - Sora Chat",
});

/**
 * Cờ đánh dấu đang thực hiện loading (xử lý) đăng nhập
 */
const isLoading = ref(false);

/**
 * Thông tin form đăng nhập
 */
const formPayload = reactive({
  username: "",
  password: "",
});

/**
 * Schema validate form
 */
const formValidationSchema = z.object({
  username: z
    .string()
    .nonempty("Vui lòng nhập tên đăng nhập")
    .min(6, "Tên đăng nhập phải có ít nhất 6 ký tự"),
  password: z
    .string()
    .nonempty("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

const alertLogin = ref("");

const delay = async (ms) => new Promise((res) => setTimeout(res, ms));

const handleLogin = async () => {
  alertLogin.value = "";
  isLoading.value = true;

  try {
    const data = await $fetch("/api/users/login", {
      method: "POST",
      body: formPayload,
    });

    if (!data.success) {
      // hiển thị thông báo lỗi
      alertLogin.value = data.message;
      return;
    }
    await navigateTo({ name: "index" });
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>
