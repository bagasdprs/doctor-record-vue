<script setup lang="ts"></script>

<template>
  <div class="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <div class="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 bg-white dark:bg-slate-950 relative z-10">
      <div class="w-full max-w-[550px]">
        <slot />
      </div>
    </div>

    <div class="hidden lg:flex w-1/2 bg-slate-50 dark:bg-slate-900 items-center justify-center p-12 relative border-l border-slate-200 dark:border-slate-800 overflow-hidden">
      <!-- Dekorasi -->
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>

      <div class="max-w-xl z-10 text-right relative">
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-8 justify-end">
          <span class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">MediSecure</span>
          <div class="bg-emerald-600 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
            <Icon name="heroicons:user-group-solid" class="w-8 h-8" />
          </div>
        </div>

        <!-- Headline -->
        <h1 class="text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.15] mb-6">
          Join the Future of <br />
          <span class="text-emerald-600 dark:text-emerald-400">Healthcare</span>
        </h1>

        <!-- Deskripsi -->
        <p class="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">Create your account today and start managing patient data with AI-powered efficiency, real-time analytics, and top-tier security.</p>

        <!-- Feature List -->
        <div class="mt-10 flex flex-col items-end gap-4">
          <div class="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
            <span>AI Scribe & Summarization</span>
            <Icon name="heroicons:check-circle-solid" class="w-6 h-6 text-emerald-500" />
          </div>
          <div class="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
            <span>Patient History Tracking</span>
            <Icon name="heroicons:check-circle-solid" class="w-6 h-6 text-emerald-500" />
          </div>
          <div class="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
            <span>Secure Cloud Storage</span>
            <Icon name="heroicons:check-circle-solid" class="w-6 h-6 text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
