<script setup lang="ts">
navigateTo("/login");
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-emerald-50 dark:bg-emerald-950">
    <div class="text-center">
      <!-- Spinner Hijau -->
      <Icon name="svg-spinners:ring-resize" class="w-12 h-12 text-emerald-600 dark:text-emerald-400 mb-4 mx-auto" />
      <p class="text-emerald-700 dark:text-emerald-200 font-medium tracking-wide animate-pulse">Redirecting to MediSecure...</p>
    </div>
  </div>
</template>
