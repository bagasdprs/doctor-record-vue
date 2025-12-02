<script setup lang="ts">
const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "heroicons:home" },
  { name: "Konsultasi", path: "/consultation", icon: "heroicons:microphone" },
  { name: "Data Pasien", path: "/patients", icon: "heroicons:users" },
  // { name: "Riwayat Medis", path: "/history", icon: "heroicons:clipboard-document-list" },
];

const logout = () => {
  navigateTo("/login");
};
</script>

<template>
  <aside class="w-64 bg-slate-900 text-white flex flex-col h-full shadow-xl">
    <div class="p-6 border-b border-slate-800 flex items-center gap-3">
      <div class="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
        <Icon name="heroicons:heart" class="text-white w-5 h-5" />
      </div>
      <span class="text-xl font-bold tracking-wide">MedRecord</span>
    </div>

    <nav class="flex-1 px-4 py-6 space-y-2">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        active-class="bg-teal-600 text-white shadow-lg"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200"
      >
        <Icon :name="item.icon" class="w-5 h-5" />
        <span class="font-medium">{{ item.name }}</span>
      </NuxtLink>
    </nav>

    <div class="p-4 border-t border-slate-800">
      <button @click="logout" class="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition">
        <Icon name="heroicons:arrow-left-on-rectangle" class="w-5 h-5" />
        <span>Keluar</span>
      </button>
    </div>
  </aside>
</template>
