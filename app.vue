<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

// Saat aplikasi dimuat, cek apakah ada sesi tertinggal?
// Kalau ada, langsung tarik data lengkapnya (termasuk foto) dari DB
await callOnce(async () => {
  await authStore.fetchUserProfile();
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
