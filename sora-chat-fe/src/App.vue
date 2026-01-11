<template>
  <ElConfigProvider size="default" :z-index="3000">
    <RouterView />
  </ElConfigProvider>
</template>

<script setup>
import { ElConfigProvider } from "element-plus";
import { onMounted } from "vue";
import { userApi } from "@/apis/users/user.api";

onMounted(() => {
  userApi.getCurrentUserAsync();
});
</script>

<style>
html,
body,
* {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    sans-serif;
}
</style>
