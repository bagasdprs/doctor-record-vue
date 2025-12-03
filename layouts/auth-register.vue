<script setup lang="ts"></script>

<template>
  <div class="min-h-screen w-full flex bg-slate-50">
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50 lg:bg-white/50">
      <div class="w-full max-w-[550px]"><slot /></div>
    </div>

    <div class="hidden lg:flex w-1/2 bg-slate-50 items-center justify-center p-12 relative border-l border-slate-100">
      <div class="max-w-xl z-10 text-right">
        <div class="flex items-center gap-3 mb-8 justify-end">
          <span class="text-3xl font-bold text-slate-900 tracking-tight">MediSecure</span>
          <div class="bg-emerald-600 text-white p-2.5 rounded-xl">
            <Icon name="heroicons:user-group-solid" class="w-8 h-8" />
          </div>
        </div>

        <h1 class="text-5xl font-extrabold text-slate-900 leading-[1.15] mb-6">
          Join the Future of <br />
          Medical Records
        </h1>

        <p class="text-slate-500 text-lg leading-relaxed">Create your account today and start managing patient data with AI-powered efficiency and top-tier security.</p>
      </div>
    </div>
  </div>
</template>
