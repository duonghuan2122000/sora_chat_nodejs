<template>
  <RouterView />
</template>

<script setup>
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
