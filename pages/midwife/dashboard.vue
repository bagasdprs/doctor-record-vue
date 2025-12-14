<script setup lang="ts">
definePageMeta({ layout: "default" });

// Mock Data Ibu Hamil Risiko Tinggi
const highRiskPatients = ref([
  { id: 1, name: "Siti Aminah", age: 38, week: 32, issue: "Preeklampsia Ringan", status: "Monitor", nextCheck: "Besok, 09:00" },
  { id: 2, name: "Rina Hartono", age: 24, week: 38, issue: "Posisi Sungsang", status: "Rujuk", nextCheck: "Hari ini, 14:00" },
]);

// Mock Jadwal Hari Ini
const todaysSchedule = ref([
  { id: 101, name: "Dewi Santoso", type: "ANC Rutin", time: "09:00 AM" },
  { id: 102, name: "Bayi Ny. Linda", type: "Imunisasi BCG", time: "10:30 AM" },
  { id: 103, name: "Lina Basuki", type: "KB Suntik 3 Bulan", time: "11:15 AM" },
]);
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Midwife Dashboard</h1>
      <p class="text-slate-500">Monitoring Kesehatan Ibu & Anak (KIA)</p>
    </div>

    <!-- 1. STATS CARDS (Purple Theme) -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-900/30 shadow-sm flex flex-col justify-between">
        <div class="text-purple-900 dark:text-purple-200 text-sm font-bold uppercase tracking-wider mb-2">Total Ibu Hamil</div>
        <div class="text-4xl font-black text-purple-600 dark:text-purple-400">42</div>
      </div>
      <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-pink-100 dark:border-pink-900/30 shadow-sm flex flex-col justify-between">
        <div class="text-pink-900 dark:text-pink-200 text-sm font-bold uppercase tracking-wider mb-2">Bayi Baru Lahir</div>
        <div class="text-4xl font-black text-pink-500">15</div>
      </div>
      <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
        <div class="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Jadwal Minggu Ini</div>
        <div class="text-4xl font-black text-slate-700 dark:text-slate-300">8</div>
      </div>
      <div class="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 shadow-sm flex flex-col justify-between">
        <div class="text-red-800 dark:text-red-200 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Icon name="heroicons:exclamation-triangle" class="w-4 h-4" /> Critical Alerts</div>
        <div class="text-4xl font-black text-red-600 dark:text-red-400">2</div>
      </div>
    </div>

    <!-- 2. HIGH RISK MONITORING (Hero Widget) -->
    <div class="bg-linear-to-br from-purple-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl shadow-purple-900/20 mb-8 relative overflow-hidden">
      <!-- Dekorasi -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

      <div class="relative z-10">
        <h2 class="text-xl font-bold mb-1 flex items-center gap-2"><Icon name="heroicons:heart" class="w-6 h-6 text-pink-400 animate-pulse" /> High Risk Monitoring</h2>
        <p class="text-purple-200 text-sm mb-6">Pasien berikut memerlukan perhatian khusus hari ini.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="patient in highRiskPatients" :key="patient.id" class="bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-xl flex items-center justify-between hover:bg-white/20 transition cursor-pointer">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center font-bold text-pink-200">{{ patient.name.charAt(0) }}</div>
              <div>
                <h4 class="font-bold text-lg">
                  {{ patient.name }} <span class="text-xs font-normal opacity-70">({{ patient.age }} th)</span>
                </h4>
                <p class="text-xs text-purple-200">{{ patient.week }} Minggu • {{ patient.issue }}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-200 border border-red-500/30">{{ patient.status }}</span>
              <p class="text-[10px] mt-1 opacity-70">Check: {{ patient.nextCheck }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. MAIN CONTENT GRID -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Jadwal Hari Ini -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-bold text-slate-800 dark:text-white">Jadwal Hari Ini</h3>
          <button class="text-sm text-purple-600 font-bold hover:underline">Lihat Kalender</button>
        </div>
        <div class="space-y-4">
          <div v-for="item in todaysSchedule" :key="item.id" class="flex items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
            <div class="w-16 text-center border-r border-slate-200 dark:border-slate-600 pr-4 mr-4">
              <span class="block text-lg font-bold text-slate-700 dark:text-white">{{ item.time.split(" ")[0] }}</span>
              <span class="text-xs text-slate-400 uppercase">{{ item.time.split(" ")[1] }}</span>
            </div>
            <div>
              <h4 class="font-bold text-slate-800 dark:text-white">{{ item.name }}</h4>
              <p class="text-sm text-purple-500 font-medium">{{ item.type }}</p>
            </div>
            <button class="ml-auto p-2 bg-white dark:bg-slate-600 rounded-lg text-slate-400 hover:text-purple-600 shadow-sm border border-slate-100 dark:border-slate-500">
              <Icon name="heroicons:chevron-right" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="space-y-4">
        <button class="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transition transform active:scale-95">
          <Icon name="heroicons:user-plus" class="w-5 h-5" /> Pasien Baru (KIA)
        </button>

        <div class="grid grid-cols-2 gap-4">
          <button class="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition group">
            <div class="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center group-hover:scale-110 transition">
              <Icon name="heroicons:heart" class="w-6 h-6" />
            </div>
            <span class="text-xs font-bold text-slate-600 dark:text-slate-300">Input Vital</span>
          </button>
          <button class="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition group">
            <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
              <Icon name="heroicons:face-smile" class="w-6 h-6" />
            </div>
            <span class="text-xs font-bold text-slate-600 dark:text-slate-300">Kelahiran</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
