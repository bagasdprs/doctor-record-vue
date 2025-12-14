<script setup lang="ts">
import { useDark, useToggle, useWindowSize } from "@vueuse/core";
import { useAuthStore } from "~/stores/auth";
import { storeToRefs } from "pinia";

// Setup
const isDark = useDark();
const toggleDark = useToggle(isDark);
const authStore = useAuthStore();
const route = useRoute();

// Ambil data user dari Pinia biar kita tau role-nya siapa
const { user } = storeToRefs(authStore);

// State Layout
const isCollapsed = ref(false);
const isMobileOpen = ref(false);
const { width } = useWindowSize();
const isMobile = computed(() => width.value < 1024);

watch(
  () => route.path,
  () => {
    isMobileOpen.value = false;
  }
);

// --- 🧠 LOGIKA OTAK SIDEBAR (MENU FACTORY) ---
const menuItems = computed(() => {
  const role = user.value?.role || "doctor"; // Default ke dokter kalau null

  // 1. MENU UMUM (Semua dapet ini)
  const commonMenus = [{ name: "Settings", path: "/settings", icon: "heroicons:cog-6-tooth" }];

  // 2. MENU SPESIFIK PER ROLE
  switch (role) {
    case "midwife": // 🤰 BIDAN
      return [
        { name: "Dashboard", path: "/midwife/dashboard", icon: "heroicons:home" },
        { name: "Patients", path: "/patients", icon: "heroicons:users" }, // Bidan juga butuh liat pasien
        { name: "KIA & ANC", path: "/midwife/kia", icon: "heroicons:heart" },
        { name: "Immunization", path: "/midwife/immunization", icon: "heroicons:shield-check" },
        ...commonMenus,
      ];

    case "pharmacist": // 💊 APOTEKER
      return [
        { name: "Dashboard", path: "/pharmacy/dashboard", icon: "heroicons:squares-2x2" },
        { name: "Inventory", path: "/pharmacy/inventory", icon: "heroicons:cube" },
        { name: "Prescriptions", path: "/pharmacy/prescriptions", icon: "heroicons:clipboard-document-list" },
        ...commonMenus,
      ];

    case "receptionist": // 💁‍♀️ RESEPSIONIS
      return [
        { name: "Dashboard", path: "/receptionist/dashboard", icon: "heroicons:home" },
        { name: "Registration", path: "/patients", icon: "heroicons:user-plus" },
        { name: "Queue", path: "/receptionist/queue", icon: "heroicons:clock" },
        ...commonMenus,
      ];

    case "admin": // 🛠️ ADMIN
      return [{ name: "Dashboard", path: "/admin/dashboard", icon: "heroicons:chart-bar" }, { name: "User Management", path: "/admin/users", icon: "heroicons:user-group" }, ...commonMenus];

    default: // 👨‍⚕️ DOKTER (Default)
      return [
        { name: "Dashboard", path: "/dashboard", icon: "heroicons:squares-2x2" },
        { name: "Patients", path: "/patients", icon: "heroicons:users" },
        { name: "Consultations", path: "/consultation", icon: "heroicons:folder-open" },
        ...commonMenus,
      ];
  }
});

// --- 🎨 LOGIKA WARNA-WARNI (THEME) ---
const themeColor = computed(() => {
  const role = user.value?.role || "doctor";
  switch (role) {
    case "midwife":
      return "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400";
    case "pharmacist":
      return "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400";
    case "receptionist":
      return "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400";
    default:
      return "text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"; // Dokter Biru
  }
});

const logoColor = computed(() => {
  const role = user.value?.role || "doctor";
  switch (role) {
    case "midwife":
      return "bg-purple-600 shadow-purple-500/20";
    case "pharmacist":
      return "bg-emerald-600 shadow-emerald-500/20";
    case "receptionist":
      return "bg-orange-500 shadow-orange-500/20";
    default:
      return "bg-blue-600 shadow-blue-500/20";
  }
});

const logout = () => authStore.logout();
const toggleSidebar = () => (isCollapsed.value = !isCollapsed.value);
const toggleMobileMenu = () => (isMobileOpen.value = !isMobileOpen.value);
</script>

<template>
  <!-- TOMBOL HAMBURGER MOBILE -->
  <button v-if="isMobile && !isMobileOpen" @click="toggleMobileMenu" class="fixed z-50 bottom-6 right-6 lg:hidden bg-slate-800 text-white p-4 rounded-full shadow-2xl hover:bg-slate-700 transition-all active:scale-90">
    <Icon name="heroicons:bars-3" class="w-6 h-6" />
  </button>

  <!-- SIDEBAR CONTAINER -->
  <aside
    class="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 flex flex-col h-full transition-all duration-300 ease-in-out z-40"
    :class="[isMobile ? 'w-64' : isCollapsed ? 'w-20' : 'w-64', isMobile ? 'fixed inset-y-0 left-0 shadow-2xl' : 'static', isMobile ? (isMobileOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0']"
  >
    <!-- HEADER -->
    <div class="flex transition-all duration-300" :class="isCollapsed && !isMobile ? 'flex-col justify-center gap-4 py-6' : 'flex-row items-center justify-between p-6'" :style="{ height: '80px' }">
      <div class="flex items-center gap-3 overflow-hidden whitespace-nowrap">
        <!-- Logo Berubah Warna Sesuai Role -->
        <div class="text-white p-1.5 rounded-lg shrink-0 transition-all shadow-md" :class="logoColor">
          <Icon name="heroicons:shield-check-solid" class="w-7 h-7" />
        </div>
        <span v-show="!isCollapsed || isMobile" class="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight transition-opacity duration-300"> FluxMed </span>
      </div>

      <!-- Toggle Button -->
      <button v-if="!isMobile" @click="toggleSidebar" class="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors">
        <Icon :name="isCollapsed ? 'heroicons:chevron-double-right' : 'heroicons:bars-3-bottom-left'" class="w-5 h-5" />
      </button>

      <!-- Close Button Mobile -->
      <button v-if="isMobile" @click="toggleMobileMenu" class="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500">
        <Icon name="heroicons:x-mark" class="w-6 h-6" />
      </button>
    </div>

    <!-- MENU LIST -->
    <nav class="flex-1 px-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide py-4">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        :active-class="themeColor + ' font-semibold shadow-sm'"
        class="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 group whitespace-nowrap"
        :class="isCollapsed && !isMobile ? 'justify-center' : ''"
        :title="isCollapsed ? item.name : ''"
      >
        <Icon :name="item.icon" class="w-6 h-6 shrink-0 transition-colors" />
        <span v-show="!isCollapsed || isMobile" class="font-medium transition-opacity duration-300">
          {{ item.name }}
        </span>
      </NuxtLink>
    </nav>

    <!-- FOOTER -->
    <div class="p-4 space-y-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div v-show="!isCollapsed || isMobile" class="px-2 text-xs font-bold uppercase text-slate-400">
        Logged in as: <span :class="themeColor.split(' ')[0]">{{ user?.role || "Guest" }}</span>
      </div>

      <ClientOnly>
        <button
          @click="toggleDark()"
          class="flex items-center gap-3 w-full px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all font-medium whitespace-nowrap"
          :class="isCollapsed && !isMobile ? 'justify-center' : ''"
        >
          <Icon :name="isDark ? 'heroicons:moon-solid' : 'heroicons:sun-solid'" class="w-6 h-6 shrink-0 text-orange-500 dark:text-yellow-400" />
          <span v-show="!isCollapsed || isMobile">
            {{ isDark ? "Dark Mode" : "Light Mode" }}
          </span>
        </button>
      </ClientOnly>

      <button
        @click="logout"
        class="flex items-center gap-3 w-full px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-medium whitespace-nowrap"
        :class="isCollapsed && !isMobile ? 'justify-center' : ''"
      >
        <Icon name="heroicons:arrow-left-on-rectangle" class="w-6 h-6 shrink-0" />
        <span v-show="!isCollapsed || isMobile">Log Out</span>
      </button>
    </div>
  </aside>

  <!-- OVERLAY GELAP -->
  <div v-if="isMobile && isMobileOpen" @click="toggleMobileMenu" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"></div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
