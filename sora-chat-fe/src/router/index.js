import { RouterName } from "@/commons/const.common";
import { useAuthStore } from "@/stores/auth";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: RouterName.Login,
      component: () => import("@/views/LoginView.vue"),
      meta: {
        anonymous: true,
      },
    },
    {
      path: "/",
      component: () => import("@/layouts/MainLayout.vue"),
      children: [
        {
          path: "/",
          name: RouterName.Home,
          component: () => import("@/views/HomeView.vue"),
        },
        {
          path: "/conversations/:id",
          name: RouterName.Conversation,
          component: () => import("@/views/conversations/ConversationView.vue"),
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to.meta?.anonymous) {
    return next();
  }

  let authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    await authStore.getCurrentUser();
  }

  if (!authStore.isAuthenticated) {
    return next({ name: RouterName.Login });
  }

  return next();
});

export default router;
