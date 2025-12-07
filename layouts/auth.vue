<script setup lang="ts">
// Import komponen Aurora
import AuroraBackground from "~/components/ui/AuroraBackground.vue";
</script>

<template>
  <div class="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 overflow-hidden">
    <!-- BAGIAN KIRI: Branding & Teks (ADA AURORA DI SINI) -->
    <div class="hidden lg:flex w-1/2 items-center justify-center p-12 relative overflow-hidden border-r border-slate-200 dark:border-slate-800">
      <!-- 1. BACKGROUND AURORA (Terkurung di sini) -->
      <ClientOnly>
        <AuroraBackground />
      </ClientOnly>

      <!-- Overlay Putih Tipis (Biar teks lebih kontras) -->
      <div class="absolute inset-0 bg-white/10 dark:bg-black/30 backdrop-blur-[1px] z-0 pointer-events-none"></div>

      <!-- KONTEN BRANDING (z-10 biar di atas aurora) -->
      <div class="max-w-xl relative z-10">
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-10">
          <div class="bg-white/90 dark:bg-emerald-950/80 backdrop-blur-md text-emerald-600 dark:text-emerald-400 p-2.5 rounded-xl shadow-xl border border-white/20">
            <Icon name="heroicons:shield-check-solid" class="w-8 h-8" />
          </div>
          <span class="text-3xl font-bold text-emerald-950 dark:text-white tracking-tight drop-shadow-sm">MediSecure</span>
        </div>

        <!-- Headline -->
        <h1 class="text-5xl font-extrabold text-emerald-950 dark:text-white leading-[1.15] mb-6 drop-shadow-md">
          Secure Medical <br />
          <span class="text-transparent bg-clip-text bg-linear-to-r from-emerald-800 to-teal-600 dark:from-emerald-300 dark:to-teal-200">Intelligence</span> Platform
        </h1>

        <!-- Deskripsi -->
        <p class="text-emerald-900/80 dark:text-emerald-100/90 text-lg leading-relaxed font-medium drop-shadow-sm mb-12">
          Your trusted partner in managing patient data with the highest standards of security, AI efficiency, and HIPAA compliance.
        </p>

        <!-- TESTIMONIAL SECTION (Glassmorphism) -->
        <div class="flex items-center gap-4 p-4 rounded-2xl bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 w-fit shadow-lg">
          <!-- Avatar Group -->
          <div class="flex -space-x-3">
            <img class="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 object-cover" src="https://i.pravatar.cc/100?img=11" alt="Doctor 1" />
            <img class="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 object-cover" src="https://i.pravatar.cc/100?img=12" alt="Doctor 2" />
            <img class="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 object-cover" src="https://i.pravatar.cc/100?img=13" alt="Doctor 3" />
          </div>

          <!-- Teks Testimoni -->
          <div>
            <div class="flex items-center gap-1 mb-0.5">
              <Icon name="heroicons:star-solid" class="w-4 h-4 text-yellow-500" />
              <Icon name="heroicons:star-solid" class="w-4 h-4 text-yellow-500" />
              <Icon name="heroicons:star-solid" class="w-4 h-4 text-yellow-500" />
              <Icon name="heroicons:star-solid" class="w-4 h-4 text-yellow-500" />
              <Icon name="heroicons:star-solid" class="w-4 h-4 text-yellow-500" />
            </div>
            <p class="text-sm font-bold text-emerald-950 dark:text-white">Trusted by 10,000+ Doctors</p>
          </div>
        </div>
      </div>
    </div>

    <!-- BAGIAN KANAN: Area Form (BERSIH / POLOS) -->
    <!-- Background solid, tanpa aurora -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 bg-white dark:bg-slate-950 relative z-20">
      <div class="w-full max-w-[480px]">
        <slot />
      </div>
    </div>
  </div>
</template>
