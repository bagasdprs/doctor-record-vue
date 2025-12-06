<script setup lang="ts">
// Otomatis pindah ke halaman login
navigateTo("/login");
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="text-center">
      <Icon name="svg-spinners:ring-resize" class="w-10 h-10 text-blue-600 mb-4 mx-auto" />
      <p class="text-slate-500 font-medium">Redirecting to MediSecure...</p>
    </div>
  </div>
</template>
