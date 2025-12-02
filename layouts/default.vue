<script setup lang="ts">
// Kita belum import Sidebar karena belum dibuat, sabar ya!
</script>

<template>
  <div class="flex h-screen bg-slate-50 font-sans">
    <Sidebar />

    <main class="flex-1 overflow-y-auto p-8">
      <header class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold text-slate-800">Doctor Record Apps 🩺</h2>
        <div class="flex items-center gap-2">
          <span class="text-sm text-slate-500">dr. Bagas</span>
          <div class="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">B</div>
        </div>
      </header>

      <slot />
    </main>
  </div>
</template>
