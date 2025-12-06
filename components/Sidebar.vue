<script setup lang="ts">
import { useDark, useToggle, useWindowSize } from "@vueuse/core";
import { useAuthStore } from "~/stores/auth";

// Setup
const isDark = useDark();
const toggleDark = useToggle(isDark);
const authStore = useAuthStore();
const route = useRoute();

// State
const isCollapsed = ref(false);
const isMobileOpen = ref(false);

// Window Resize Logic
const { width } = useWindowSize();
const isMobile = computed(() => width.value < 1024);

// Otomatis tutup sidebar mobile saat pindah halaman
watch(
  () => route.path,
  () => {
    isMobileOpen.value = false;
  }
);

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "heroicons:squares-2x2" },
  { name: "Patients", path: "/patients", icon: "heroicons:users" },
  { name: "Consultations", path: "/consultation", icon: "heroicons:folder-open" },
  { name: "Settings", path: "/settings", icon: "heroicons:cog-6-tooth" },
];

const logout = () => authStore.logout();
const toggleSidebar = () => (isCollapsed.value = !isCollapsed.value);
const toggleMobileMenu = () => (isMobileOpen.value = !isMobileOpen.value);
</script>

<template>
  <!-- TOMBOL MOBILE (Hanya muncul di HP) -->
  <button v-if="isMobile && !isMobileOpen" @click="toggleMobileMenu" class="fixed z-50 bottom-6 right-6 lg:hidden bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all active:scale-90">
    <Icon name="heroicons:bars-3" class="w-6 h-6" />
  </button>

  <!--
      SIDEBAR LOGIC BARU (ANTI BENTROK)
      1. !isMobile: Atur lebar w-20 atau w-64.
      2. isMobile: Pakai fixed position & width tetap w-64.
      3. Transisi: translate-x buat efek slide di HP.
    -->
  <aside
    class="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 flex flex-col h-full transition-all duration-300 ease-in-out z-40"
    :class="[
      // LOGIKA DESKTOP (Width Dinamis)
      !isMobile ? (isCollapsed ? 'w-20' : 'w-64') : '',

      // LOGIKA MOBILE (Posisi & Width Tetap)
      isMobile ? 'fixed inset-y-0 left-0 shadow-2xl w-64' : '',

      // LOGIKA BUKA/TUTUP (Slide Animation)
      isMobile ? (isMobileOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0',
    ]"
  >
    <!-- HEADER -->
    <div class="flex items-center justify-between p-6 h-20">
      <!-- Logo Area -->
      <div class="flex items-center gap-3 overflow-hidden whitespace-nowrap">
        <div class="bg-blue-600 text-white p-1.5 rounded-lg shrink-0 transition-all shadow-md shadow-blue-500/20">
          <Icon name="heroicons:shield-check-solid" class="w-7 h-7" />
        </div>
        <span v-show="!isCollapsed || isMobile" class="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight transition-opacity duration-300"> MediSecure </span>
      </div>

      <!-- Toggle Button (Desktop Only) -->
      <button v-if="!isMobile" @click="toggleSidebar" class="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition-colors">
        <Icon :name="isCollapsed ? 'heroicons:chevron-double-right' : 'heroicons:bars-3-bottom-left'" class="w-5 h-5" />
      </button>

      <!-- Close Button (Mobile Only) -->
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
        active-class="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold shadow-sm"
        class="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 group whitespace-nowrap"
        :class="isCollapsed && !isMobile ? 'justify-center' : ''"
        :title="isCollapsed ? item.name : ''"
      >
        <Icon :name="item.icon" class="w-6 h-6 shrink-0 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />
        <span v-show="!isCollapsed || isMobile" class="font-medium transition-opacity duration-300">
          {{ item.name }}
        </span>
      </NuxtLink>
    </nav>

    <!-- FOOTER -->
    <div class="p-4 space-y-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
      <button
        @click="toggleDark()"
        class="flex items-center gap-3 w-full px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all font-medium whitespace-nowrap"
        :class="isCollapsed && !isMobile ? 'justify-center' : ''"
        :title="isDark ? 'Switch to Light' : 'Switch to Dark'"
      >
        <Icon :name="isDark ? 'heroicons:moon-solid' : 'heroicons:sun-solid'" class="w-6 h-6 shrink-0 text-orange-500 dark:text-blue-400" />
        <span v-show="!isCollapsed || isMobile">
          {{ isDark ? "Dark Mode" : "Light Mode" }}
        </span>
      </button>

      <button
        @click="logout"
        class="flex items-center gap-3 w-full px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-medium whitespace-nowrap"
        :class="isCollapsed && !isMobile ? 'justify-center' : ''"
        title="Log Out"
      >
        <Icon name="heroicons:arrow-left-on-rectangle" class="w-6 h-6 shrink-0" />
        <span v-show="!isCollapsed || isMobile">Log Out</span>
      </button>
    </div>
  </aside>

  <!-- OVERLAY GELAP (Saat Menu Mobile Terbuka) -->
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
