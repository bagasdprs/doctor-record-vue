<!-- <script setup lang="ts"></script>
<template>
  <div class="flex h-screen bg-white">
    <Sidebar />
    <main class="flex-1 overflow-y-auto p-8">
      <slot />
    </main>
  </div>
</template> -->
<script setup lang="ts"></script>

<template>
  <div class="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <Sidebar />

    <main class="flex-1 overflow-y-auto p-8 text-slate-800 dark:text-slate-200">
      <slot />
    </main>
  </div>
</template>
