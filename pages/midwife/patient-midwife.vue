<script setup lang="ts">
import { computed } from "vue";

// --- 🔌 KONEKSI KE API BACKEND ---
// Mengambil data dari endpoint yang sudah kita buat sebelumnya
interface PatientResponse {
  data: Array<{
    id: number;
    name: string;
    patientId: string;
    age: string;
    type: string;
    status: string;
    avatar: string;
    stage?: string;
    weight?: string;
    recovery?: string;
    nextAppt: string;
    lastVisit?: string;
    feeding?: string;
  }>;
}

const { data: response, pending, refresh } = await useFetch<PatientResponse>("/api/midwife/patients");

// --- COMPUTED DATA (Hitung Otomatis) ---
// Menghitung angka-angka untuk kartu ringkasan berdasarkan data asli
const summaryCards = computed(() => {
  const list = response.value?.data || [];
  const total = list.length;
  // Hitung jumlah pasien dengan status tertentu
  const highRisk = list.filter((p: any) => p.status === "High Risk").length;
  const pregnant = list.filter((p: any) => p.type === "pregnant").length;
  const babies = list.filter((p: any) => p.type === "baby").length;

  return [
    {
      title: "Total Pasien",
      value: total.toString(),
      trend: "Data Realtime",
      trendUp: true,
      icon: "heroicons:users",
      color: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-300",
      trendColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Resiko Tinggi",
      value: highRisk.toString(),
      trend: "Perlu Perhatian",
      trendUp: true,
      icon: "heroicons:exclamation-triangle",
      color: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-300",
      trendColor: "text-red-600 dark:text-red-400",
    },
    {
      title: "Ibu Hamil",
      value: pregnant.toString(),
      trend: "Aktif",
      icon: "heroicons:heart",
      color: "bg-pink-50 dark:bg-pink-900/20",
      textColor: "text-pink-600 dark:text-pink-300",
      trendColor: "text-slate-500 dark:text-slate-400",
    },
    {
      title: "Bayi & Balita",
      value: babies.toString(),
      trend: "< 5 Tahun",
      icon: "heroicons:face-smile",
      color: "bg-indigo-50 dark:bg-indigo-900/20",
      textColor: "text-indigo-600 dark:text-indigo-300",
      trendColor: "text-slate-500 dark:text-slate-400",
    },
  ];
});

// --- Helper Functions for Styling (Tetap sama, tidak perlu diubah) ---
const getStatusStyles = (status: string) => {
  switch (status) {
    case "High Risk":
      return "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50";
    case "Normal":
      return "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50";
    case "Newborn":
      return "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50";
    case "Monitoring":
      return "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50";
    case "Overdue":
      return "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/50";
    default:
      return "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
  }
};

const getCardBorderColor = (status: string) => {
  switch (status) {
    case "High Risk":
      return "border-l-red-500";
    case "Normal":
      return "border-l-green-500";
    case "Newborn":
      return "border-l-blue-500";
    case "Monitoring":
      return "border-l-purple-500";
    case "Overdue":
      return "border-l-orange-500";
    default:
      return "border-l-slate-300";
  }
};

const getStatusDotColor = (status: string) => {
  switch (status) {
    case "High Risk":
      return "bg-red-500";
    case "Normal":
      return "bg-green-500";
    case "Newborn":
      return "bg-blue-500";
    case "Monitoring":
      return "bg-purple-500";
    case "Overdue":
      return "bg-orange-500";
    default:
      return "bg-slate-400";
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 lg:p-8 transition-colors duration-300">
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Daftar Pasien (KIA)</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Kelola data ibu hamil, bayi, dan nifas dalam satu tempat.</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Tombol Refresh -->
        <button @click="refresh()" class="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-purple-600 transition" title="Refresh Data">
          <Icon name="heroicons:arrow-path" class="w-5 h-5" :class="{ 'animate-spin': pending }" />
        </button>
        <div class="relative hidden md:block">
          <Icon name="heroicons:magnifying-glass" class="w-5 h-5 absolute left-3 top-3 text-slate-400" />
          <input type="text" placeholder="Cari pasien..." class="pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 w-64 text-sm" />
        </div>
        <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500 dark:border-purple-400 overflow-hidden">
          <img src="https://ui-avatars.com/api/?name=Bidan+Sarah&background=random" alt="Profile" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>

    <!-- SUMMARY CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="(card, idx) in summaryCards" :key="idx" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ card.title }}</h3>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ card.value }}</p>
          </div>
          <div class="p-3 rounded-xl" :class="card.color">
            <Icon :name="card.icon" class="w-6 h-6" :class="card.textColor" />
          </div>
        </div>
        <div class="flex items-center text-sm font-medium" :class="card.trendColor">
          <Icon v-if="card.trendUp" name="heroicons:arrow-trending-up" class="w-4 h-4 mr-1" />
          <span>{{ card.trend }}</span>
        </div>
      </div>
    </div>

    <!-- FILTER & ADD PATIENT -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div class="flex flex-1 gap-3 w-full md:w-auto">
        <div class="relative flex-1 md:flex-none md:w-72 md:hidden">
          <Icon name="heroicons:magnifying-glass" class="w-5 h-5 absolute left-3 top-3 text-slate-400" />
          <input type="text" placeholder="Cari pasien..." class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
        </div>
        <div class="flex gap-2 w-full md:w-auto">
          <select class="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option>Semua Status</option>
            <option>Resiko Tinggi</option>
            <option>Normal</option>
          </select>
        </div>
      </div>
      <button class="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-purple-500/30 transition flex items-center justify-center gap-2 whitespace-nowrap">
        <Icon name="heroicons:plus" class="w-5 h-5" /> Pasien Baru
      </button>
    </div>

    <!-- LOADING STATE -->
    <div v-if="pending" class="py-20 text-center text-slate-400 animate-pulse flex flex-col items-center justify-center">
      <Icon name="svg-spinners:ring-resize" class="w-10 h-10 text-purple-300 mb-4" />
      <p>Mengambil data pasien...</p>
    </div>

    <!-- EMPTY STATE -->
    <div v-else-if="!response?.data?.length" class="text-center py-20 text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
      <Icon name="heroicons:user-group" class="w-12 h-12 mb-2 opacity-50 mx-auto" />
      <p>Belum ada data pasien.</p>
    </div>

    <!-- PATIENT CARDS GRID -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      <div
        v-for="patient in response.data"
        :key="patient.id"
        class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition border-l-4"
        :class="getCardBorderColor(patient.status)"
      >
        <!-- Card Header -->
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-3">
            <img :src="patient.avatar" alt="Avatar" class="w-12 h-12 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700" />
            <div>
              <h3 class="font-bold text-lg text-slate-900 dark:text-white">{{ patient.name }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ patient.patientId }}</p>
            </div>
          </div>
          <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <Icon name="heroicons:ellipsis-vertical" class="w-5 h-5" />
          </button>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">USIA</p>
            <p class="font-medium text-slate-700 dark:text-slate-200">{{ patient.age }}</p>
          </div>

          <!-- Kondisional Render -->
          <div v-if="patient.type === 'pregnant'">
            <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">USIA KANDUNGAN</p>
            <p class="font-medium text-slate-700 dark:text-slate-200">{{ patient.stage }}</p>
          </div>
          <div v-if="patient.type === 'baby'">
            <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">BERAT BADAN</p>
            <p class="font-medium text-slate-700 dark:text-slate-200">{{ patient.weight }}</p>
          </div>
          <div v-if="patient.type === 'postpartum'">
            <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">KONDISI</p>
            <p class="font-medium text-slate-700 dark:text-slate-200">{{ patient.recovery }}</p>
          </div>

          <div>
            <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">JADWAL BERIKUTNYA</p>
            <p class="font-medium text-slate-700 dark:text-slate-200">{{ patient.nextAppt }}</p>
          </div>

          <div v-if="patient.type === 'pregnant'">
            <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">KUNJUNGAN TERAKHIR</p>
            <p class="font-medium text-slate-700 dark:text-slate-200">{{ patient.lastVisit }}</p>
          </div>
          <div v-if="patient.type === 'baby'">
            <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">PEMBERIAN MAKAN</p>
            <p class="font-medium text-slate-700 dark:text-slate-200">{{ patient.feeding }}</p>
          </div>
          <div v-if="patient.type === 'postpartum'">
            <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">PEMULIHAN</p>
            <p class="font-medium text-slate-700 dark:text-slate-200">{{ patient.recovery }}</p>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
          <span class="px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5" :class="getStatusStyles(patient.status)">
            <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotColor(patient.status)"></span>
            {{ patient.status }}
          </span>
          <button class="text-purple-600 dark:text-purple-400 text-sm font-bold hover:underline">Lihat Detail</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>
