<script setup lang="ts">
definePageMeta({
  layout: "auth", // Nanti kita buat layout ini
});

const handleLogin = () => {
  // Simulasi login sukses
  navigateTo("/dashboard");
};
</script>

<template>
  <div class="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
    <h1 class="text-2xl font-bold text-center text-teal-800 mb-6">Login Dokter 🩺</h1>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <input type="email" placeholder="dokter@rs.com" class="w-full p-2 border rounded" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Password</label>
        <input type="password" placeholder="••••" class="w-full p-2 border rounded" />
      </div>
      <button class="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700">Masuk</button>
    </form>

    <div class="text-center mt-4 text-sm">Belum punya akun? <NuxtLink to="/register" class="text-teal-600 font-bold">Daftar</NuxtLink></div>
  </div>
</template>
