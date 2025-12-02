<script setup lang="ts">
const route = useRoute();
// Ambil ID dari URL (misal: /patients/123)
const patientId = route.params.id;
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-slate-800">Detail Pasien</h1>
    <p class="text-slate-500">
      ID Pasien: <span class="font-mono bg-slate-200 px-2 rounded">{{ patientId }}</span>
    </p>

    <div class="mt-6 p-4 border rounded-lg bg-yellow-50 text-yellow-800">🚧 Halaman ini sedang dalam pengembangan.</div>

    <NuxtLink to="/patients" class="mt-4 inline-block text-teal-600 hover:underline"> &larr; Kembali ke List Pasien </NuxtLink>
  </div>
</template>
