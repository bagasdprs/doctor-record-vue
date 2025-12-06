import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const user = useCookie<{ email?: string }>("user_session");
  const userProfile = ref<any>(null);
  const currentUser = computed(() => userProfile.value || user.value);

  const setUser = (userData: any) => {
    const { avatarUrl: _avatarUrl, bio: _bio, ...lightData } = userData;
    user.value = lightData;
    userProfile.value = userData;
  };

  const fetchUserProfile = async () => {
    if (!user.value?.email) return;

    try {
      const res = await $fetch<any>("/api/doctors/profile", {
        method: "POST",
        body: { email: user.value.email },
      });

      if (res.success) {
        userProfile.value = res.data;
      }
    } catch (err) {
      console.error("Gagal refresh profile:", err);
    }
  };

  const logout = () => {
    user.value = {};
    userProfile.value = null;
    navigateTo("/login");
  };

  const isLoggedIn = computed(() => !!user.value);

  return {
    user: currentUser,
    setUser,
    logout,
    isLoggedIn,
    fetchUserProfile,
  };
});
