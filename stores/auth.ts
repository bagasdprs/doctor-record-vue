import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const user = useCookie("user_session");

  const setUser = (userData: any) => {
    user.value = userData;
  };

  const logout = () => {
    user.value = null;
    navigateTo("/login");
  };

  const isLoggedIn = computed(() => !!user.value);

  return {
    user,
    setUser,
    logout,
    isLoggedIn,
  };
});
