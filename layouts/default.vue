<script setup lang="ts">
import Sidebar from "~/components/Sidebar.vue";
import { useAuthStore } from "~/stores/auth";
import { storeToRefs } from "pinia";
import { computed } from "vue";

// --- 1. AMBIL DATA USER DARI PINIA ---
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

// --- 2. LOGIKA WARNA BACKGROUND UTAMA ---
// Kita kasih warna yang sangaaaaat tipis (/30 atau /50) biar kontennya tetep enak dibaca
const mainBackground = computed(() => {
  const role = user.value?.role || "doctor";

  switch (role) {
    case "midwife": // 🤰 BIDAN (Nuansa Ungu Misterius)
      return "bg-purple-50/40 dark:bg-[#0f0518]";

    case "pharmacist": // 💊 APOTEKER (Nuansa Hijau Segar)
      return "bg-emerald-50/40 dark:bg-[#021f12]";

    case "receptionist": // 💁‍♀️ RESEPSIONIS (Nuansa Hangat)
      return "bg-orange-50/40 dark:bg-[#1f1205]";

    case "admin": // 🛠️ ADMIN (Netral)
      return "bg-slate-50 dark:bg-slate-950";

    default: // 👨‍⚕️ DOKTER (Nuansa Biru Profesional)
      return "bg-blue-50/40 dark:bg-[#050f1f]";
  }
});
</script>

<template>
  <!-- Class background statis dihapus, diganti dynamic binding :class -->
  <div class="flex h-screen overflow-hidden transition-colors duration-300" :class="mainBackground">
    <!-- Sidebar tetep di kiri -->
    <Sidebar />

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto w-full relative scrollbar-thin">
      <div class="p-4 md:p-8 pb-24 min-h-full">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Opsional: Kustomisasi Scrollbar biar makin cantik */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}
</style>
