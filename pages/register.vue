<script setup lang="ts">
definePageMeta({
  layout: "auth-register",
});

useHead({
  title: "Register Clinic Account",
});

// Interface disesuaikan untuk Owner Klinik
interface RegisterForm {
  fullName: string;
  clinicName: string; // Field Baru
  email: string;
  password: string;
}

const form = reactive<RegisterForm>({
  fullName: "",
  clinicName: "",
  email: "",
  password: "",
});

const isLoading = ref(false);

const handleRegister = async () => {
  // Validasi sederhana
  if (!form.fullName || !form.email || !form.password || !form.clinicName) {
    alert("Mohon lengkapi semua data pendaftaran klinik.");
    return;
  }

  isLoading.value = true;

  try {
    // Kirim data ke API Register
    // Note: Backend register.post.ts nanti perlu disesuaikan biar nangkep 'clinicName'
    const response = await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        clinicName: form.clinicName, // Data baru
        role: "admin", // Otomatis jadi Admin/Owner
      },
    });

    alert("Registrasi Klinik Berhasil! Silakan Login.");
    navigateTo("/login");
  } catch (error: any) {
    console.error(error);
    alert(error.statusMessage || "Terjadi kesalahan saat registrasi.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="w-full max-w-lg bg-white dark:bg-slate-900 p-6 md:p-10 rounded-2xl md:rounded-4xl shadow-xl md:shadow-2xl shadow-emerald-900/5 dark:shadow-black/50 border border-emerald-100 dark:border-emerald-900/50 mx-auto relative overflow-hidden"
  >
    <!-- Hiasan Atas Card -->
    <div class="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-500 to-indigo-500"></div>

    <div class="mb-6 md:mb-8 text-center md:text-left">
      <h2 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">Daftarkan Klinik Anda</h2>
      <p class="text-slate-500 dark:text-slate-400 text-sm md:text-base">Mulai transformasi digital klinik Anda dengan FluxMed.</p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-4 md:space-y-5">
      <!-- Nama Lengkap Pemilik/Admin -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Nama Pemilik / Admin</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="heroicons:user-circle-solid" class="text-slate-400 group-focus-within:text-blue-500 w-5 h-5 transition-colors" />
          </div>
          <input
            v-model="form.fullName"
            type="text"
            placeholder="Contoh: Budi Santoso"
            class="w-full pl-12 pr-4 py-3 md:py-3.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium text-sm md:text-base"
          />
        </div>
      </div>

      <!-- Nama Klinik (Baru) -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Nama Klinik</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="heroicons:building-office-2-solid" class="text-slate-400 group-focus-within:text-blue-500 w-5 h-5 transition-colors" />
          </div>
          <input
            v-model="form.clinicName"
            type="text"
            placeholder="Contoh: Klinik Sehat Selalu"
            class="w-full pl-12 pr-4 py-3 md:py-3.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium text-sm md:text-base"
          />
        </div>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Email Bisnis</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="heroicons:envelope-solid" class="text-slate-400 group-focus-within:text-blue-500 w-5 h-5 transition-colors" />
          </div>
          <input
            v-model="form.email"
            type="email"
            placeholder="admin@kliniksehat.com"
            class="w-full pl-12 pr-4 py-3 md:py-3.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium text-sm md:text-base"
          />
        </div>
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Password</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="heroicons:lock-closed-solid" class="text-slate-400 group-focus-within:text-blue-500 w-5 h-5 transition-colors" />
          </div>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            class="w-full pl-12 pr-4 py-3 md:py-3.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium text-sm md:text-base"
          />
        </div>
      </div>

      <!-- Tombol Daftar -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 md:py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6 text-sm md:text-base"
      >
        <Icon v-if="!isLoading" name="heroicons:rocket-launch-solid" class="w-5 h-5" />
        <Icon v-else name="svg-spinners:ring-resize" class="w-5 h-5 animate-spin" />
        <span>{{ isLoading ? "Mendaftarkan Klinik..." : "Buat Akun Klinik" }}</span>
      </button>
    </form>

    <div class="mt-8 text-center text-sm text-slate-500 flex flex-col md:flex-row items-center justify-center gap-1">
      <span>Sudah punya akun?</span>
      <NuxtLink to="/login" class="text-blue-600 font-bold hover:underline hover:text-blue-700"> Login Now </NuxtLink>
    </div>
  </div>
</template>
