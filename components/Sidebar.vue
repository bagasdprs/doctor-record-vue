<!-- <script setup lang="ts">
// State Sidebar
const isCollapsed = ref(false);

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "heroicons:squares-2x2" },
  { name: "Patients", path: "/patients", icon: "heroicons:users" },
  { name: "Consultations", path: "/consultation", icon: "heroicons:folder-open" },
  { name: "AI Tools", path: "/ai-tools", icon: "heroicons:cpu-chip" },
  { name: "Settings", path: "/settings", icon: "heroicons:cog-6-tooth" },
];

const logout = () => {
  navigateTo("/login");
};

// Fungsi Toggle
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<template>
  <aside class="bg-white border-r border-slate-200 text-slate-600 flex flex-col h-full transition-all duration-300 ease-in-out" :class="isCollapsed ? 'w-20' : 'w-64'">
    <div class="flex transition-all duration-300" :class="isCollapsed ? 'flex-col items-center justify-center gap-4 py-6' : 'flex-row items-center justify-between p-6'">
      <div class="flex items-center gap-3 overflow-hidden whitespace-nowrap">
        <div class="bg-blue-600 text-white p-1.5 rounded-lg shrink-0 transition-all shadow-md shadow-blue-500/20">
          <Icon name="heroicons:shield-check-solid" class="w-7 h-7" />
        </div>

        <span v-show="!isCollapsed" class="text-xl font-extrabold text-slate-800 tracking-tight transition-opacity duration-300"> MediSecure </span>
      </div>

      <button
        @click="toggleSidebar"
        class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors border border-transparent hover:border-slate-200"
        :title="isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
      >
        <Icon :name="isCollapsed ? 'heroicons:chevron-double-right' : 'heroicons:bars-3-bottom-left'" class="w-5 h-5" />
      </button>
    </div>

    <nav class="flex-1 px-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        active-class="bg-blue-50 text-blue-700 font-semibold shadow-sm border-blue-100"
        class="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-slate-50 border border-transparent group whitespace-nowrap"
        :class="isCollapsed ? 'justify-center' : ''"
      >
        <Icon :name="item.icon" class="w-6 h-6 shrink-0 transition-colors group-hover:text-blue-600" />

        <span v-show="!isCollapsed" class="transition-opacity duration-300 font-medium">
          {{ item.name }}
        </span>
      </NuxtLink>
    </nav>

    <div class="p-4 space-y-4 border-t border-slate-100">
      <transition name="fade">
        <div v-if="!isCollapsed" class="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 w-16 h-16 bg-blue-100 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>

          <div class="flex items-start gap-3 relative z-10">
            <div class="bg-white text-blue-600 p-2 rounded-full shrink-0 shadow-sm">
              <Icon name="heroicons:light-bulb" class="w-5 h-5" />
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-800">Need Help?</h4>
              <p class="text-xs text-slate-500 mt-1">Check docs.</p>
            </div>
          </div>
        </div>
      </transition>

      <button @click="logout" class="flex items-center gap-3 w-full px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium whitespace-nowrap" :class="isCollapsed ? 'justify-center' : ''">
        <Icon name="heroicons:arrow-left-on-rectangle" class="w-6 h-6 shrink-0" />
        <span v-show="!isCollapsed">Log Out</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
  max-height: 100px;
  opacity: 1;
}

.fade-enter-from,
.fade-leave-to {
  max-height: 0;
  opacity: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* Hide Scrollbar but keep functionality */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style> -->

<script setup lang="ts">
// Import fitur Dark Mode dari VueUse
import { useDark, useToggle } from "@vueuse/core";

// Setup Dark Mode
const isDark = useDark();
const toggleDark = useToggle(isDark);

// State Sidebar (Collapse)
const isCollapsed = ref(false);

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "heroicons:squares-2x2" },
  { name: "Patients", path: "/patients", icon: "heroicons:users" },
  { name: "Consultations", path: "/consultation", icon: "heroicons:folder-open" },
  { name: "AI Tools", path: "/ai-tools", icon: "heroicons:cpu-chip" },
  { name: "Settings", path: "/settings", icon: "heroicons:cog-6-tooth" },
];

const logout = () => {
  navigateTo("/login");
};

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<template>
  <aside class="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 flex flex-col h-full transition-all duration-300 ease-in-out" :class="isCollapsed ? 'w-20' : 'w-64'">
    <div class="flex transition-all duration-300" :class="isCollapsed ? 'flex-col items-center justify-center gap-4 py-6' : 'flex-row items-center justify-between p-6'">
      <div class="flex items-center gap-3 overflow-hidden whitespace-nowrap">
        <div class="bg-blue-600 text-white p-1.5 rounded-lg shrink-0 transition-all shadow-md shadow-blue-500/20">
          <Icon name="heroicons:shield-check-solid" class="w-7 h-7" />
        </div>
        <span v-show="!isCollapsed" class="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight transition-opacity duration-300"> MediSecure </span>
      </div>

      <button @click="toggleSidebar" class="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition-colors">
        <Icon :name="isCollapsed ? 'heroicons:chevron-double-right' : 'heroicons:bars-3-bottom-left'" class="w-5 h-5" />
      </button>
    </div>

    <nav class="flex-1 px-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        active-class="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold"
        class="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 group whitespace-nowrap"
        :class="isCollapsed ? 'justify-center' : ''"
      >
        <Icon :name="item.icon" class="w-6 h-6 shrink-0 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />
        <span v-show="!isCollapsed" class="transition-opacity duration-300 font-medium">
          {{ item.name }}
        </span>
      </NuxtLink>
    </nav>

    <div class="p-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
      <button
        @click="toggleDark()"
        class="flex items-center gap-3 w-full px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all font-medium whitespace-nowrap"
        :class="isCollapsed ? 'justify-center' : ''"
      >
        <Icon :name="isDark ? 'heroicons:moon-solid' : 'heroicons:sun-solid'" class="w-6 h-6 shrink-0 text-orange-500 dark:text-blue-400" />
        <span v-show="!isCollapsed">
          {{ isDark ? "Dark Mode" : "Light Mode" }}
        </span>
      </button>

      <button
        @click="logout"
        class="flex items-center gap-3 w-full px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-medium whitespace-nowrap"
        :class="isCollapsed ? 'justify-center' : ''"
      >
        <Icon name="heroicons:arrow-left-on-rectangle" class="w-6 h-6 shrink-0" />
        <span v-show="!isCollapsed">Log Out</span>
      </button>
    </div>
  </aside>
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
