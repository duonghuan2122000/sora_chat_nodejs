<!-- 
    Trang giao diện đăng nhập
    GET /login
-->
<template>
  <div class="LoginView flex flex-col items-center">
    <Card class="min-w-[400px] max-w-[800px] mt-[50px]">
      <CardHeader>
        <CardTitle> Đăng nhập </CardTitle>
      </CardHeader>
      <CardContent>
        <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
          <VeeField v-slot="{ field, errors }" name="username">
            <Field>
              <FieldLabel>Tên đăng nhập</FieldLabel>
              <Input
                v-bind="field"
                placeholder="Nhập tên đăng nhập"
                autoFocus
                :aria-invalid="!!errors.length"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>
          <VeeField v-slot="{ field, errors }" name="password">
            <Field>
              <FieldLabel>Tên mật khẩu</FieldLabel>
              <Input
                v-bind="field"
                placeholder="Nhập mật khẩu"
                type="password"
                :aria-invalid="!!errors.length"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>
          <div>
            <Button type="submit">Đăng nhập</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toTypedSchema } from "@vee-validate/zod";
import { onMounted } from "vue";
import { z } from "zod";
import { useForm, Field as VeeField } from "vee-validate";
import { userApi } from "@/apis/users/user.api";
import { useRouter } from "vue-router";
import { RouterName } from "@/commons/const.common";

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
</script>
