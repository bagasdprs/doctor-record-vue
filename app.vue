<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useDark } from "@vueuse/core";

useDark({
  initialValue: "light",
  storageKey: "medisecure-theme",
});

const authStore = useAuthStore();
await callOnce(async () => {
  try {
    await authStore.fetchUserProfile();
  } catch (error) {
    console.error("Error fetching user profile on app load:", error);
  }
});

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | FluxMed` : "FluxMed - AI Medical Scribe";
  },
  title: "FluxMed - AI Medical Scribe",
  meta: [{ name: "description", content: "FluxMed – The AI-Powered Medical Scribe for Modern Clinics. Streamline patient documentation, automate SOAP notes, and focus on care, not paperwork." }],
  htmlAttrs: {
    lang: "en",
  },
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
