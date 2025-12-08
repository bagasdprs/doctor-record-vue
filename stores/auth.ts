import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  // 1. COOKIE: Tempat simpan tiket masuk (Hanya Email & ID)
  // Max Age: 7 Hari
  const userSession = useCookie("user_session", {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });

  // 2. MEMORY (RAM): Tempat simpan data lengkap (Foto, Bio, dll)
  // Ini hilang pas refresh, nanti diisi ulang sama fetchUserProfile
  const userProfile = ref<any>(null);

  // 3. GETTER: Gabungan cerdas
  const user = computed(() => {
    // Gabung data cookie dan memory
    const raw = { ...userSession.value, ...userProfile.value };

    if (!raw.email) return null;

    return {
      ...raw,
      // Prioritas Foto:
      // 1. Data Profile dari DB (avatarUrl) -> Saat refresh/fetch
      // 2. Data dari Login awal (avatar) -> Saat baru login
      // 3. Fallback null
      avatar: userProfile.value?.avatarUrl || userProfile.value?.avatar || raw.avatar,
      name: userProfile.value?.fullName || raw.name || "Doctor",
    };
  });

  const isLoggedIn = computed(() => !!userSession.value?.email);

  // --- ACTIONS ---

  // LOGIN: Simpan data
  const setUser = (userData: any) => {
    // ⚠️ PENTING: Walaupun sekarang pakai URL pendek (bukan Base64),
    // tetap lebih aman jangan simpan avatar di cookie biar ringan & konsisten.
    const sessionData = {
      id: userData.id,
      email: userData.email,
      name: userData.fullName || userData.name,
    };

    // Simpan yang kecil ke Cookie
    userSession.value = sessionData;

    // Simpan yang lengkap ke Memory
    userProfile.value = userData;
  };

  // REFRESH: Ambil ulang data dari DB
  const fetchUserProfile = async () => {
    if (!userSession.value?.email) return;

    try {
      console.log("🔄 [Auth Store] Mengambil profil dari DB...");
      const res = await $fetch<any>("/api/doctors/profile", {
        method: "POST",
        body: { email: userSession.value.email },
      });

      if (res.success && res.data) {
        // Masukkan data DB ke Memory
        userProfile.value = res.data;

        // Update nama di cookie kalau ada perubahan di DB
        if (res.data.fullName) {
          const currentCookie = userSession.value || {};
          userSession.value = { ...currentCookie, name: res.data.fullName };
        }
      }
    } catch (err) {
      console.error("❌ Gagal refresh profile:", err);
    }
  };

  const logout = () => {
    userSession.value = null;
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
