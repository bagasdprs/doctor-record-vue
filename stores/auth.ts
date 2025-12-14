import { defineStore } from "pinia";
import { useDark } from "@vueuse/core";

export const useAuthStore = defineStore("auth", () => {
  const _isDark = useDark({
    storageKey: "medisecure-theme",
  });

  // Tambahkan 'role' ke dalam tipe data cookie
  const userSession = useCookie<{ id?: any; email?: string; name?: string; role?: string }>("user_session", {
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
      role: userProfile.value?.role || raw.role, // Pastikan role terbaca
    };
  });

  const isLoggedIn = computed(() => !!userSession.value?.email);

  const setUser = (userData: any) => {
    const sessionData = {
      id: userData.id,
      email: userData.email,
      name: userData.fullName || userData.name,
      role: userData.role, // Simpan role saat login
    };
    userSession.value = { ...sessionData };
    userProfile.value = userData;
  };

  const logout = () => {
    userSession.value = {}; // Hapus cookie
    userProfile.value = null;
    navigateTo("/login");
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
        // Update cookie jika ada perubahan nama/role
        if (res.data.fullName || res.data.role) {
          const currentCookie = userSession.value || {};
          userSession.value = {
            ...currentCookie,
            name: res.data.fullName || currentCookie.name,
            role: res.data.role || currentCookie.role,
          };
        }
      }
    } catch (err: any) {
      console.error("❌ Gagal refresh profile:", err);

      // 🔥 FIX LOGIC: Auto-Logout jika User Hilang/Basi 🔥
      if (err.statusCode === 404 || err.statusCode === 401) {
        console.warn("⚠️ Sesi tidak valid atau user tidak ditemukan. Melakukan logout otomatis...");
        logout();
      }
    }
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
