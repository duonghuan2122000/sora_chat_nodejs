export const useAuth = () => {
  const user = useState("auth_user", () => null);
  const isLoggedIn = computed(() => !!user.value);
  const fetchUser = async () => {
    try {
      user.value = await $fetch(`/api/users/me`, {
        method: "GET",
        credentials: "include",
      });
    } catch {
      user.value = null;
    }
  };

  return { user, isLoggedIn, fetchUser };
};
