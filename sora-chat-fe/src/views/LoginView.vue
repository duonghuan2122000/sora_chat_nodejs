<!-- 
    Trang giao diện đăng nhập
    GET /login
-->
<template>
  <div class="LoginView flex flex-col items-center">
    <ElCard class="min-w-[400px] max-w-[800px] mt-[50px]">
      <template #header>
        <h2>Đăng nhập</h2>
      </template>
      <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
        <VeeField v-slot="{ value, handleChange, errors }" name="username">
          <div class="flex flex-col gap-2">
            <label
              class="items-center text-sm font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4 has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10"
              for="username-input"
              >Tên đăng nhập</label
            >
            <ElInput
              id="username-input"
              :modelValue="value"
              @update:modelValue="handleChange"
              placeholder="Nhập tên đăng nhập"
              autofocus
              :aria-invalid="!!errors.length"
            />
            <ul v-if="errors" class="text-red-500 text-sm list-disc ml-4">
              <li v-for="err in errors">{{ err }}</li>
            </ul>
          </div>
        </VeeField>
        <VeeField v-slot="{ value, handleChange, errors }" name="password">
          <div class="flex flex-col gap-2">
            <label
              for="password-input"
              class="items-center text-sm font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4 has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10"
              >Tên mật khẩu</label
            >
            <ElInput
              :modelValue="value"
              @update:modelValue="handleChange"
              placeholder="Nhập mật khẩu"
              type="password"
              :aria-invalid="!!errors.length"
            />
            <ul v-if="errors" class="text-red-500 text-sm list-disc ml-4">
              <li v-for="err in errors" :key="err">{{ err }}</li>
            </ul>
          </div>
        </VeeField>
        <div class="mt-2 text-sm">
          Chưa có tài khoản?
          <ElButton type="primary" link @click="goToRegister">Đăng ký ngay</ElButton>
        </div>
        <div>
          <ElButton type="primary" native-type="submit">Đăng nhập</ElButton>
        </div>
      </form>
    </ElCard>
  </div>
</template>

<script setup>
import { toTypedSchema } from "@vee-validate/zod";
import { onMounted } from "vue";
import { z } from "zod";
import { useForm, Field as VeeField } from "vee-validate";
import { userApi } from "@/apis/users/user.api";
import { useRouter } from "vue-router";
import { RouterName } from "@/commons/const.common";

// Component
import { ElInput, ElButton, ElCard } from "element-plus";

const router = useRouter();

const loginSchema = toTypedSchema(
  z.object({
    username: z
      .string()
      .nonempty("Vui lòng nhập tên đăng nhập")
      .min(6, "Tên đăng nhập phải có ít nhất 6 ký tự"),
    password: z
      .string()
      .nonempty("Vui lòng nhập mật khẩu")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  }),
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: loginSchema,
  initialValues: {
    username: "",
    password: "",
  },
});

onMounted(() => {});

/**
 * Hàm xử lý sự kiện login
 */
const handleLogin = handleSubmit(async (data) => {
  let result = await userApi.loginAsync(data);
  if (result.data?.success && result.data?.data?.token) {
    router.push({ name: RouterName.Home });
    return;
  }
});

const goToRegister = () => {
  router.push({ name: RouterName.Register });
};
</script>
