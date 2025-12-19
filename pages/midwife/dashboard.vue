<script setup lang="ts">
import { computed } from "vue";
definePageMeta({ layout: "default" });

// --- CONNECT KE API NO. 1 ---
const { data: dashboardData, pending, error, refresh } = await useFetch("/api/midwife/stats");

// --- COMPUTED DATA (Mapping API ke Template) ---
// Kita ambil data dari response API dan petakan ke variabel yang dipanggil di template

const stats = computed(
  () =>
    dashboardData.value?.data?.stats || {
      totalPregnant: 0,
      totalBaby: 0,
      weeklySchedule: 0,
      criticalAlerts: 0,
    }
);

const highRiskPatients = computed(() => {
  return (
    dashboardData.value?.data?.highRiskPatients?.map((p: any) => ({
      id: p.id,
      name: p.name,
      age: p.age,
      // Mapping nama kolom database ke nama yang dipakai di template
      week: p.pregnancyWeek || "-",
      issue: p.medicalIssue || "Unknown",
      status: p.riskStatus || "Normal",
      nextCheck: p.nextCheckup ? formatDate(p.nextCheckup) : "-", // Format tanggalnya
    })) || []
  );
});

const todaysSchedule = computed(() => {
  return (
    dashboardData.value?.data?.todaysSchedule?.map((item: any) => ({
      id: item.id,
      name: item.name,
      type: item.type === "pregnant" ? "Pemeriksaan Kandungan" : "Imunisasi Bayi", // Translate tipe
      // Format waktu untuk display (misal: 09:00 AM)
      time: item.nextCheckup ? new Date(item.nextCheckup).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "-",
    })) || []
  );
});

// Helper Formatter
const formatTime = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};
const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
};
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="mb-8 flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Midwife Dashboard</h1>
        <p class="text-slate-500">Monitoring Kesehatan Ibu & Anak (KIA)</p>
      </div>
      <!-- Tombol Refresh -->
      <button @click="refresh()" class="p-2 text-slate-400 hover:text-purple-600 transition" title="Refresh Data">
        <Icon name="heroicons:arrow-path" class="w-5 h-5" :class="{ 'animate-spin': pending }" />
      </button>
    </div>

    <!-- LOADING STATE -->
    <div v-if="pending" class="py-20 text-center text-slate-400 animate-pulse">Memuat data dashboard...</div>

    <!-- ERROR STATE -->
    <div v-else-if="error" class="p-6 bg-red-50 text-red-600 rounded-xl border border-red-200">Gagal memuat data. <button @click="refresh()" class="underline font-bold">Coba lagi</button></div>

    <div v-else class="animate-fade-in">
      <!-- 1. STATS CARDS (Purple Theme) -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-900/30 shadow-sm flex flex-col justify-between">
          <div class="text-purple-900 dark:text-purple-200 text-sm font-bold uppercase tracking-wider mb-2">Total Ibu Hamil</div>
          <div class="text-4xl font-black text-purple-600 dark:text-purple-400">
            {{ stats.totalPregnant }}
          </div>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-pink-100 dark:border-pink-900/30 shadow-sm flex flex-col justify-between">
          <div class="text-pink-900 dark:text-pink-200 text-sm font-bold uppercase tracking-wider mb-2">Bayi Baru Lahir</div>
          <div class="text-4xl font-black text-pink-500">
            {{ stats.totalBaby }}
          </div>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div class="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Jadwal Minggu Ini</div>
          <div class="text-4xl font-black text-slate-700 dark:text-slate-300">
            {{ stats.weeklySchedule }}
          </div>
        </div>
        <div class="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 shadow-sm flex flex-col justify-between">
          <div class="text-red-800 dark:text-red-200 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Icon name="heroicons:exclamation-triangle" class="w-4 h-4" /> Critical Alerts</div>
          <div class="text-4xl font-black text-red-600 dark:text-red-400">
            {{ stats.criticalAlerts }}
          </div>
        </div>
      </div>

      <!-- 2. HIGH RISK MONITORING (Hero Widget) -->
      <div class="bg-linear-to-br from-purple-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl shadow-purple-900/20 mb-8 relative overflow-hidden">
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
                  <p class="text-xs text-purple-200">
                    <span v-if="patient.week">{{ patient.week }} Minggu •</span> {{ patient.issue || "Perlu Observasi" }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-200 border border-red-500/30">{{ patient.status }}</span>
                <p class="text-[10px] mt-1 opacity-70 flex items-center justify-end gap-1">
                  <Icon name="heroicons:calendar" class="w-3 h-3" />
                  {{ patient.nextCheck }}
                </p>
              </div>
            </div>

            <div v-if="highRiskPatients.length === 0" class="col-span-2 text-center py-4 text-purple-200 italic border border-white/10 rounded-xl bg-white/5">Tidak ada pasien risiko tinggi saat ini.</div>
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
                <span class="text-xs text-slate-400 uppercase">{{ item.time.split(" ")[1] || "WIB" }}</span>
              </div>
              <div>
                <h4 class="font-bold text-slate-800 dark:text-white">{{ item.name }}</h4>
                <p class="text-sm text-purple-500 font-medium">{{ item.type }}</p>
              </div>
              <button class="ml-auto p-2 bg-white dark:bg-slate-600 rounded-lg text-slate-400 hover:text-purple-600 shadow-sm border border-slate-100 dark:border-slate-500">
                <Icon name="heroicons:chevron-right" class="w-5 h-5" />
              </button>
            </div>

            <div v-if="todaysSchedule.length === 0" class="text-center py-8 text-slate-400">Belum ada jadwal kunjungan hari ini.</div>
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
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
