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
          <Field>
            <FieldLabel>Tên đăng nhập</FieldLabel>
            <Input placeholder="Nhập tên đăng nhập" autoFocus />
          </Field>
          <Field>
            <FieldLabel>Tên mật khẩu</FieldLabel>
            <Input placeholder="Nhập mật khẩu" type="password" />
          </Field>
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
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { onMounted } from "vue";

onMounted(() => {});

/**
 * Hàm xử lý sự kiện login
 */
const handleLogin = async () => {};
</script>
