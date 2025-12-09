<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useDark } from "@vueuse/core";

useDark({
  initialValue: "light",
  storageKey: "medisecure-theme",
});

const authStore = useAuthStore();
await callOnce(async () => {
  if (authStore.isLoggedIn) {
    await authStore.fetchUserProfile();
  }
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="#10b981" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
