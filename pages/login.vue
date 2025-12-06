<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "auth",
});

const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const medicalId = ref("");
const isLoading = ref(false);

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert("Isi email & password dulu ya, Dok!");
    return;
  }

  isLoading.value = true;

  try {
    const response = await $fetch<any>("/api/auth/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
        // medicalId opsional tergantung kebutuhan API login kamu
      },
    });

    authStore.setUser(response.user);

    console.log("Login Sukses, User:", authStore.user);
    navigateTo("/dashboard");
  } catch (error: any) {
    alert(error.statusMessage || "Login Gagal.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <!--
      RESPONSIVE CARD CONTAINER:
      - w-full: Lebar penuh di HP.
      - max-w-md: Batas lebar di Tablet/Desktop biar gak gepeng.
      - p-6 (HP) -> md:p-10 (Desktop): Padding membesar di layar besar.
      - rounded-2xl (HP) -> md:rounded-4xl (Desktop): Sudut lebih tumpul di layar besar.
    -->
  <div class="w-full max-w-md bg-white p-6 md:p-10 rounded-2xl md:rounded-4xl shadow-xl md:shadow-2xl shadow-slate-200/50 border border-slate-100 mx-auto">
    <!-- HEADER -->
    <div class="mb-6 md:mb-8 text-center md:text-left">
      <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-2 md:mb-3">Doctor Portal Login</h2>
      <p class="text-slate-500 text-sm md:text-base leading-relaxed">Please enter your credentials to securely access your account.</p>
    </div>

    <!-- FORM -->
    <form @submit.prevent="handleLogin" class="space-y-5 md:space-y-6">
      <!-- Input Email -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="heroicons:envelope-solid" class="text-slate-400 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
          </div>
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email address"
            class="w-full pl-12 pr-4 py-3 md:py-4 bg-slate-50 border-0 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium text-sm md:text-base"
          />
        </div>
      </div>

      <!-- Input Password -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">Password</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="heroicons:lock-closed-solid" class="text-slate-400 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
          </div>
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full pl-12 pr-4 py-3 md:py-4 bg-slate-50 border-0 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium text-sm md:text-base"
          />
        </div>
      </div>

      <!-- Input Medical ID (Opsional di Login, tapi kalau mau ada) -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">Medical ID / License</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="heroicons:identification-solid" class="text-slate-400 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
          </div>
          <input
            v-model="medicalId"
            type="text"
            placeholder="Enter your medical ID"
            class="w-full pl-12 pr-4 py-3 md:py-4 bg-slate-50 border-0 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium text-sm md:text-base"
          />
        </div>
      </div>

      <!-- Tombol Login -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 md:py-4 rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed text-sm md:text-base"
      >
        <Icon v-if="isLoading" name="svg-spinners:ring-resize" class="w-5 h-5" />
        <Icon v-else name="heroicons:shield-check-solid" class="w-5 h-5" />
        <span>{{ isLoading ? "Checking..." : "Secure Login" }}</span>
      </button>

      <!-- Footer Links -->
      <div class="flex flex-col md:flex-row items-center justify-between text-sm mt-6 gap-3 md:gap-0">
        <a href="#" class="text-slate-500 hover:text-emerald-600 font-medium transition">Forgot Password?</a>
        <NuxtLink to="/register" class="text-emerald-600 font-bold hover:underline transition">Register Account</NuxtLink>
      </div>
    </form>

    <!-- Badge Bawah -->
    <div class="mt-8 pt-6 border-t border-slate-100 text-center flex flex-col md:flex-row items-center justify-center gap-2 text-slate-400 text-xs font-medium">
      <div class="flex items-center gap-1">
        <Icon name="heroicons:check-badge-solid" class="w-4 h-4 text-emerald-500" />
        <span>HIPAA Compliant</span>
      </div>
      <span class="hidden md:inline">&bull;</span>
      <span>Data Encrypted</span>
    </div>
  </div>
</template>
