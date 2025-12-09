import { defineStore } from "pinia";
import { useDark } from "@vueuse/core";

export const useAuthStore = defineStore("auth", () => {
  const _isDark = useDark({
    storageKey: "medisecure-theme",
  });

  const userSession = useCookie<{ id?: any; email?: string; name?: string }>("user_session", {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });

  const userProfile = ref<any>(null);

  const user = computed(() => {
    const raw = { ...userSession.value, ...userProfile.value };
    if (!raw.email) return null;

    return {
      ...raw,
      avatar: userProfile.value?.avatarUrl || userProfile.value?.avatar || raw.avatar,
      name: userProfile.value?.fullName || raw.name || "Doctor",
    };
  });

  const isLoggedIn = computed(() => !!userSession.value?.email);

  const setUser = (userData: any) => {
    const sessionData = {
      id: userData.id,
      email: userData.email,
      name: userData.fullName || userData.name,
    };
    userSession.value = { ...sessionData };
    userProfile.value = userData;
  };

  const fetchUserProfile = async () => {
    if (!userSession.value || !userSession.value.email) return;

    try {
      console.log("🔄 [Auth Store] Mengambil profil dari DB...");

      const res = await $fetch<any>("/api/doctors/profile", {
        method: "POST",
        body: { email: userSession.value?.email },
      });

      if (res.success && res.data) {
        userProfile.value = res.data;
        if (res.data.fullName) {
          const currentCookie = userSession.value || {};
          userSession.value = { ...currentCookie, name: res.data.fullName || currentCookie.name };
        }
      }
    } catch (err) {
      console.error("❌ Gagal refresh profile:", err);
    }
  };

  const logout = () => {
    userSession.value = {};
    userProfile.value = null;
    navigateTo("/login");
  };

  return {
    user,
    userSession,
    setUser,
    logout,
    isLoggedIn,
    fetchUserProfile,
  };
});
