import "@/assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import { ElLoading } from "element-plus";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(ElLoading);
app.use(createPinia());
app.use(router);

app.mount("#app");
