<!-- <script setup lang="ts">
definePageMeta({
  layout: "auth",
});

// Data login dummy
const email = ref("");
const password = ref("");

const handleLogin = () => {
  // Simulasi login
  if (email.value && password.value) {
    navigateTo("/dashboard");
  } else {
    alert("Isi email & password dulu ya, Dok!");
  }
};
</script>

<template>
  <div class="p-8">
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-teal-50 rounded-full mb-4">
        <Icon name="heroicons:heart" class="w-8 h-8 text-teal-600" />
      </div>
      <h1 class="text-2xl font-bold text-slate-800">Doctor Portal</h1>
      <p class="text-slate-500 text-sm mt-2">Silakan masuk untuk akses rekam medis</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1.5">Email Profesi</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="heroicons:envelope" class="text-slate-400 w-5 h-5" />
          </div>
          <input
            v-model="email"
            type="email"
            placeholder="dokter@rs.com"
            class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="heroicons:lock-closed" class="text-slate-400 w-5 h-5" />
          </div>
          <input
            v-model="password"
            type="password"
            placeholder="••••••"
            class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm"
          />
        </div>
      </div>

      <button class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-600/20 transition-all transform active:scale-95 flex items-center justify-center gap-2">
        <span>Masuk Aplikasi</span>
        <Icon name="heroicons:arrow-right" class="w-4 h-4" />
      </button>
    </form>

    <div class="mt-8 text-center">
      <p class="text-sm text-slate-500">
        Belum punya akun?
        <NuxtLink to="/register" class="text-teal-600 font-bold hover:underline">Daftar Dokter</NuxtLink>
      </p>
    </div>
  </div>
</template> -->

<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

// State form
const email = ref("");
const password = ref("");
const medicalId = ref("");

const handleLogin = () => {
  if (!email.value || !password.value || !medicalId.value) {
    alert("Mohon lengkapi semua data kredensial Anda.");
    return;
  }
  navigateTo("/dashboard");
};
</script>

<template>
  <div class="bg-white p-10 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-slate-900 mb-3">Doctor Portal Login</h2>
      <p class="text-slate-500 leading-relaxed">Please enter your credentials to securely access your account.</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
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
            class="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
          />
        </div>
      </div>

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
            class="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">Medical ID / License Number</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="heroicons:identification-solid" class="text-slate-400 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
          </div>
          <input
            v-model="medicalId"
            type="text"
            placeholder="Enter your medical ID"
            class="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
          />
        </div>
      </div>

      <button class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4">
        <Icon name="heroicons:shield-check-solid" class="w-5 h-5" />
        <span>Secure Login</span>
      </button>

      <div class="flex items-center justify-between text-sm mt-6">
        <a href="#" class="text-slate-500 hover:text-emerald-600 font-medium">Forgot Password?</a>
        <a href="/register" class="text-slate-500 hover:text-emerald-600 font-medium">Register Account</a>
      </div>
    </form>

    <div class="mt-8 pt-6 border-t border-slate-100 text-center flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
      <Icon name="heroicons:check-badge-solid" class="w-4 h-4 text-emerald-500" />
      <span>HIPAA Compliant & Data Encrypted</span>
    </div>
  </div>
</template>
