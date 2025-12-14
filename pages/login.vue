<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "auth",
});

const authStore = useAuthStore();
const { $swal } = useNuxtApp();

const email = ref("");
const password = ref("");
const isLoading = ref(false);

const handleLogin = async () => {
  if (!email.value || !password.value) {
    $swal.fire({
      icon: "warning",
      title: "Data belum lengkap!",
      text: "Silakan isi email dan password Anda.",
      confirmButtonText: "OK",
      confirmButtonColor: "#10b981",
    });
    return;
  }

  isLoading.value = true;

  try {
    const response = await $fetch<any>("/api/auth/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    authStore.setUser(response.user);

    // Alert Sukses
    $swal.fire({
      icon: "success",
      title: "Login Successful",
      text: `Welcome, ${response.user.name}`,
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });

    // --- 👮‍♂️ LOGIC SATPAM PINTAR (REDIRECT) ---
    const role = response.user.role;
    let targetPath = "/dashboard"; // Default ke Dokter

    switch (role) {
      case "midwife":
        targetPath = "/midwife/dashboard";
        break;
      case "pharmacist":
        targetPath = "/pharmacy/dashboard";
        break;
      case "receptionist":
        targetPath = "/receptionist/dashboard";
        break;
      case "admin":
        targetPath = "/admin/dashboard";
        break;
      default:
        targetPath = "/dashboard"; // Dokter masuk sini
        break;
    }

    setTimeout(() => navigateTo(targetPath), 1500);
  } catch (error: any) {
    // Alert Error
    $swal.fire({
      icon: "error",
      title: "Failed to Login",
      text: error.statusMessage || "Email atau password salah.",
      confirmButtonText: "Coba Lagi",
      confirmButtonColor: "#ef4444",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="w-full max-w-md bg-white dark:bg-slate-900 p-6 md:p-10 rounded-2xl md:rounded-4xl shadow-xl md:shadow-2xl shadow-emerald-900/5 dark:shadow-black/50 border border-emerald-100 dark:border-emerald-900/50 mx-auto relative overflow-hidden"
  >
    <!-- Hiasan Atas Card (Garis Hijau) -->
    <div class="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-emerald-400 to-teal-500"></div>

    <div class="mb-6 md:mb-8 text-center md:text-left">
      <h2 class="text-2xl md:text-3xl font-bold text-emerald-950 dark:text-white mb-2 md:mb-3">Doctor Portal Login</h2>
      <p class="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">Please enter your credentials to securely access your account.</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-5 md:space-y-6">
      <!-- Input Email -->
      <div>
        <label class="block text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-2">Email Address</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="heroicons:envelope-solid" class="text-slate-400 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
          </div>
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email address"
            class="w-full pl-12 pr-4 py-3 md:py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium text-sm md:text-base"
          />
        </div>
      </div>

      <!-- Input Password -->
      <div>
        <label class="block text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-2">Password</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="heroicons:lock-closed-solid" class="text-slate-400 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
          </div>
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full pl-12 pr-4 py-3 md:py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium text-sm md:text-base"
          />
        </div>
      </div>

      <!-- MEDICAL ID SUDAH DIHAPUS DARI SINI -->

      <!-- Tombol Login -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 md:py-4 rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed text-sm md:text-base"
      >
        <Icon v-if="isLoading" name="svg-spinners:ring-resize" class="w-5 h-5" />
        <Icon v-else name="heroicons:shield-check-solid" class="w-5 h-5" />
        <span>{{ isLoading ? "Checking..." : "Secure Login" }}</span>
      </button>

      <div class="flex flex-col md:flex-row items-center justify-between text-sm mt-6 gap-3 md:gap-0">
        <a href="#" class="text-slate-500 hover:text-emerald-600 font-medium transition">Forgot Password?</a>
        <NuxtLink to="/register" class="text-emerald-600 font-bold hover:underline transition">Register Account</NuxtLink>
      </div>
    </form>

    <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center flex flex-col md:flex-row items-center justify-center gap-2 text-slate-400 text-xs font-medium">
      <div class="flex items-center gap-1">
        <Icon name="heroicons:check-badge-solid" class="w-4 h-4 text-emerald-500" />
        <span>HIPAA Compliant</span>
      </div>
      <span class="hidden md:inline">&bull;</span>
      <span>Data Encrypted</span>
    </div>
  </div>
</template>
