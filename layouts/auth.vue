<script setup lang="ts"></script>

<template>
  <div class="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <!-- BAGIAN KIRI: Branding & Teks -->
    <!-- hidden: Sembunyi di HP -->
    <!-- lg:flex: Muncul di Desktop (Lebar 50%) -->
    <div class="hidden lg:flex w-1/2 bg-slate-50 dark:bg-slate-900 items-center justify-center p-12 relative overflow-hidden">
      <!-- Dekorasi Background Abstrak (Opsional) -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>

      <div class="max-w-xl z-10 relative">
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-8">
          <div class="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-2.5 rounded-xl shadow-lg">
            <Icon name="heroicons:shield-check-solid" class="w-8 h-8" />
          </div>
          <span class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">MediSecure</span>
        </div>

        <!-- Headline -->
        <h1 class="text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.15] mb-6">
          Secure Medical <br />
          <span class="text-blue-600 dark:text-blue-400">Intelligence</span> Platform
        </h1>

        <!-- Deskripsi -->
        <p class="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">Your trusted partner in managing patient data with the highest standards of security, AI efficiency, and HIPAA compliance.</p>

        <!-- Testimoni Kecil (Opsional) -->
        <div class="mt-10 flex items-center gap-4 text-sm text-slate-400 dark:text-slate-500 font-medium">
          <div class="flex -space-x-2">
            <img class="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900" src="https://i.pravatar.cc/100?img=1" alt="" />
            <img class="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900" src="https://i.pravatar.cc/100?img=2" alt="" />
            <img class="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900" src="https://i.pravatar.cc/100?img=3" alt="" />
          </div>
          <p>Trusted by 10,000+ Doctors</p>
        </div>
      </div>
    </div>

    <!-- BAGIAN KANAN: Area Form (Slot) -->
    <!-- w-full: Penuh di HP -->
    <!-- lg:w-1/2: Setengah di Desktop -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 bg-white dark:bg-slate-950">
      <div class="w-full max-w-[480px]">
        <slot />
      </div>
    </div>
  </div>
</template>
