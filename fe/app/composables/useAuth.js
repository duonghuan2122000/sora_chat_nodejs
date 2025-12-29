export const useAuth = () => {
  const user = useState("auth_user", () => null);
  const isLoggedIn = computed(() => !!user.value);
  const ready = useState("auth_ready", () => false);
  const fetchUser = async () => {
    if (process.client) {
      try {
        const response = await $fetch(`/api/users/me`, {
          method: "GET",
          credentials: "include",
          server: false,
        });
        user.value = response.data;
        ready.value = true;
      } catch (error) {
        user.value = null;
      }
    }
  };

  return { user, isLoggedIn, ready, fetchUser };
};
