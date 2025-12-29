<script setup lang="ts">
import AuroraBackground from "~/components/ui/AuroraBackground.vue";
</script>

<template>
  <div class="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 overflow-hidden">
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white dark:bg-slate-950 relative z-20">
      <div class="w-full max-w-137.5">
        <slot />
      </div>
    </div>

    <!-- BAGIAN KANAN: Branding (ADA AURORA DI SINI) -->
    <div class="hidden lg:flex w-1/2 items-center justify-center p-12 relative overflow-hidden border-l border-slate-200 dark:border-slate-800">
      <!-- 1. BACKGROUND AURORA (Terkurung di sini) -->
      <ClientOnly>
        <AuroraBackground />
      </ClientOnly>

      <!-- Overlay Tipis -->
      <div class="absolute inset-0 bg-white/10 dark:bg-black/30 backdrop-blur-[1px] z-0 pointer-events-none"></div>

      <!-- Konten Branding -->
      <div class="max-w-xl z-10 text-right relative flex flex-col items-end">
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-10 justify-end">
          <span class="text-3xl font-bold text-emerald-950 dark:text-white tracking-tight drop-shadow-sm">MediSecure</span>
          <div class="bg-linear-to-br from-emerald-600 to-teal-500 text-white p-2.5 rounded-xl shadow-lg border border-white/20">
            <Icon name="heroicons:user-group-solid" class="w-8 h-8" />
          </div>
        </div>

        <!-- Headline -->
        <h1 class="text-5xl font-extrabold text-emerald-950 dark:text-white leading-[1.15] mb-6 drop-shadow-md">
          Join the Future of <br />
          <span class="text-transparent bg-clip-text bg-linear-to-l from-emerald-800 to-teal-600 dark:from-emerald-300 dark:to-teal-200">Healthcare</span>
        </h1>

        <!-- Deskripsi -->
        <p class="text-emerald-900/80 dark:text-emerald-100/90 text-lg leading-relaxed font-medium mb-12">Create your account today and start managing patient data with AI-powered efficiency, real-time analytics, and top-tier security.</p>

        <div class="flex items-center gap-4 p-4 rounded-2xl bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 w-fit shadow-lg ml-auto">
          <!-- Teks Testimoni (Kiri) -->
          <div class="text-right">
            <div class="flex items-center justify-end gap-1 mb-0.5">
              <Icon name="heroicons:star-solid" class="w-4 h-4 text-yellow-500" />
              <Icon name="heroicons:star-solid" class="w-4 h-4 text-yellow-500" />
              <Icon name="heroicons:star-solid" class="w-4 h-4 text-yellow-500" />
              <Icon name="heroicons:star-solid" class="w-4 h-4 text-yellow-500" />
              <Icon name="heroicons:star-solid" class="w-4 h-4 text-yellow-500" />
            </div>
            <p class="text-sm font-bold text-emerald-950 dark:text-white">Trusted by 10,000+ Doctors</p>
          </div>

          <!-- Avatar Group (Kanan) -->
          <div class="flex -space-x-3 flex-row-reverse">
            <img class="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 object-cover" src="https://i.pravatar.cc/100?img=11" alt="Doctor 1" />
            <img class="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 object-cover" src="https://i.pravatar.cc/100?img=12" alt="Doctor 2" />
            <img class="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 object-cover" src="https://i.pravatar.cc/100?img=13" alt="Doctor 3" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
