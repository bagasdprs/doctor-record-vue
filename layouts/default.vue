<script setup lang="ts">
import Sidebar from "~/components/Sidebar.vue";
</script>

<template>
  <div class="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
    <Sidebar />

    <main class="flex-1 overflow-y-auto w-full relative">
      <div class="p-4 md:p-8 pb-24">
        <slot />
      </div>
    </main>
  </div>
</template>
