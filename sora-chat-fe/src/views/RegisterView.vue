<template>
  <div class="RegisterView flex flex-col items-center">
    <ElCard class="min-w-[400px] max-w-[800px] mt-[50px]">
      <template #header>
        <h2>Đăng ký</h2>
      </template>
      <form class="flex flex-col gap-4" @submit.prevent="handleRegister">
        <!-- Họ và tên đệm -->
        <VeeField v-slot="{ value, handleChange, errors }" name="last_name">
          <div class="flex flex-col gap-2">
            <label for="last_name-input" class="items-center text-sm font-medium select-none"
              >Họ và tên đệm</label
            >
            <ElInput
              id="last_name-input"
              :modelValue="value"
              @update:modelValue="handleChange"
              placeholder="Nhập họ và tên đệm"
              :aria-invalid="!!errors.length"
            />
            <ul v-if="errors.length" class="text-red-500 text-sm list-disc ml-4">
              <li v-for="err in errors" :key="err">{{ err }}</li>
            </ul>
          </div>
        </VeeField>

        <!-- Tên -->
        <VeeField v-slot="{ value, handleChange, errors }" name="first_name">
          <div class="flex flex-col gap-2">
            <label for="first_name-input" class="items-center text-sm font-medium select-none"
              >Tên</label
            >
            <ElInput
              id="first_name-input"
              :modelValue="value"
              @update:modelValue="handleChange"
              placeholder="Nhập tên"
              :aria-invalid="!!errors.length"
            />
            <ul v-if="errors.length" class="text-red-500 text-sm list-disc ml-4">
              <li v-for="err in errors" :key="err">{{ err }}</li>
            </ul>
          </div>
        </VeeField>

        <!-- Tên đăng nhập -->
        <VeeField v-slot="{ value, handleChange, errors }" name="username">
          <div class="flex flex-col gap-2">
            <label for="username-input" class="items-center text-sm font-medium select-none"
              >Tên đăng nhập</label
            >
            <ElInput
              id="username-input"
              :modelValue="value"
              @update:modelValue="handleChange"
              placeholder="Nhập tên đăng nhập"
              :aria-invalid="!!errors.length"
            />
            <ul v-if="errors.length" class="text-red-500 text-sm list-disc ml-4">
              <li v-for="err in errors" :key="err">{{ err }}</li>
            </ul>
          </div>
        </VeeField>

        <!-- Mật khẩu -->
        <VeeField v-slot="{ value, handleChange, errors }" name="password">
          <div class="flex flex-col gap-2">
            <label for="password-input" class="items-center text-sm font-medium select-none"
              >Mật khẩu</label
            >
            <ElInput
              id="password-input"
              :modelValue="value"
              @update:modelValue="handleChange"
              placeholder="Nhập mật khẩu"
              type="password"
              show-password
              :aria-invalid="!!errors.length"
            />
            <ul v-if="errors.length" class="text-red-500 text-sm list-disc ml-4">
              <li v-for="err in errors" :key="err">{{ err }}</li>
            </ul>
          </div>
        </VeeField>

        <div class="mt-2 text-sm">
          Đã có tài khoản?
          <ElButton type="primary" link @click="goToLogin">Đăng nhập ngay</ElButton>
        </div>

        <div>
          <ElButton type="primary" native-type="submit" :loading="isSubmitting">Đăng ký</ElButton>
        </div>
      </form>
    </ElCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useTitle } from "@vueuse/core";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useForm, Field as VeeField } from "vee-validate";
import { userApi } from "@/apis/users/user.api";
import { useRouter } from "vue-router";
import { RouterName } from "@/commons/const.common";
import { ElInput, ElButton, ElCard, ElMessage } from "element-plus";

const router = useRouter();
const isSubmitting = ref(false);

const registerSchema = toTypedSchema(
  z.object({
    last_name: z.string().nonempty("Vui lòng nhập họ và tên đệm"),
    first_name: z.string().nonempty("Vui lòng nhập tên"),
    username: z
      .string()
      .nonempty("Vui lòng nhập tên đăng nhập")
      .min(6, "Tên đăng nhập phải có ít nhất 6 ký tự"),
    password: z
      .string()
      .nonempty("Vui lòng nhập mật khẩu")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .regex(/[A-Za-z0-9]/, "Mật khẩu phải chứa ký tự A-Za-z0-9")
      .regex(/[^A-Za-z0-9]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt"),
  }),
);

const { handleSubmit, setErrors } = useForm({
  validationSchema: registerSchema,
  initialValues: {
    last_name: "",
    first_name: "",
    username: "",
    password: "",
  },
});

onMounted(() => {
  useTitle("Register | Sora Chat");
});

const handleRegister = handleSubmit(async (values) => {
  try {
    isSubmitting.value = true;
    const response = await userApi.registerAsync(values);

    if (response.data?.success) {
      ElMessage.success("Đăng ký thành công!");
      router.push({ name: RouterName.Login });
    } else {
      if (response.data?.code === "USERNAME_ALREADY_EXISTS") {
        setErrors({ username: response.data.message || "Tên đăng nhập đã tồn tại" });
      } else {
        ElMessage.error(response.data?.message || "Đăng ký thất bại");
      }
    }
  } catch (error) {
    ElMessage.error("Đã có lỗi xảy ra");
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
});

const goToLogin = () => {
  router.push({ name: RouterName.Login });
};
</script>
