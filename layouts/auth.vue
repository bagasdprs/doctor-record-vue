<script setup lang="ts"></script>

<!-- <template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <slot />
    </div>
  </div>
</template> -->
<template>
  <div class="min-h-screen w-full flex bg-slate-50">
    <div class="hidden lg:flex w-1/2 bg-slate-50 items-center justify-center p-12 relative">
      <div class="max-w-xl z-10">
        <div class="flex items-center gap-3 mb-8">
          <div class="bg-slate-900 text-white p-2.5 rounded-xl">
            <Icon name="heroicons:shield-check-solid" class="w-8 h-8" />
          </div>
          <span class="text-3xl font-bold text-slate-900 tracking-tight">MediSecure</span>
        </div>

        <h1 class="text-5xl font-extrabold text-slate-900 leading-[1.15] mb-6">
          Secure Medical Intelligence <br />
          Platform
        </h1>

        <p class="text-slate-500 text-lg leading-relaxed">Your trusted partner in managing patient data with the highest standards of security and efficiency.</p>
      </div>
    </div>

    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50 lg:bg-white/50">
      <div class="w-full max-w-[480px]">
        <slot />
      </div>
    </div>
  </div>
</template>
