<script setup lang="ts">
import { ref, computed } from "vue";

// --- 1. DATA KONEKSI (Ambil Data Bayi dari Database) ---
const { data: response, pending } = await useFetch("/api/midwife/patients");

// Filter hanya pasien tipe 'baby' untuk menu Imunisasi
const babyPatients = computed(() => {
  if (!response.value?.data) return [];

  return response.value.data
    .filter((p: any) => p.type === "baby")
    .map((p: any) => ({
      ...p,
      // Mock data karena tabel log imunisasi belum ada
      lastVaccine: "Hepatitis B0",
      nextDue: "BCG, Polio 1",
    }));
});

// --- Summary Cards Data (Mock Logic for UI) ---
const summaryCards = computed(() => [
  {
    title: "Vaccinated Today",
    value: "5",
    trend: "+2 from yesterday",
    icon: "heroicons:check-badge",
    color: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
  },
  {
    title: "Overdue Patient",
    value: "3",
    trend: "Need Follow Up",
    icon: "heroicons:clock",
    color: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
  },
  {
    title: "Upcoming This Week",
    value: "12",
    trend: "Prepare Stock",
    icon: "heroicons:calendar",
    color: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
  },
]);

// --- 2. MODAL STATE & FORM ---
const isModalOpen = ref(false);
const selectedPatient = ref<any>(null);

const form = ref({
  vaccineType: "BCG",
  date: new Date().toISOString().slice(0, 10),
  batchNo: "",
  notes: "",
});

// --- 3. ACTIONS ---
const openLogModal = (patient: any) => {
  selectedPatient.value = patient;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedPatient.value = null;
  form.value = {
    vaccineType: "BCG",
    date: new Date().toISOString().slice(0, 10),
    batchNo: "",
    notes: "",
  };
};

const saveLog = () => {
  alert(`Data Imunisasi ${form.value.vaccineType} untuk ${selectedPatient.value.name} berhasil disimpan!`);
  closeModal();
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 lg:p-8 transition-colors duration-300">
    <!-- HEADER SECTION (REVISI: Tombol + Log Vaccination) -->
    <div class="flex justify-between items-end mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Icon name="heroicons:shield-check" class="w-8 h-8 text-purple-600" />
          Imunisasi
        </h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Jadwal & Pencatatan Vaksinasi Bayi</p>
      </div>

      <!-- TOMBOL UTAMA (YANG KAMU MINTA) -->
      <button @click="openLogModal(null)" class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-purple-500/30 flex items-center gap-2 transition transform active:scale-95">
        <Icon name="heroicons:plus" class="w-5 h-5" />
        Log Vaccination
      </button>
    </div>

    <!-- SUMMARY CARDS (REVISI: 3 KARTU SPESIFIK) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div v-for="(card, idx) in summaryCards" :key="idx" class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{{ card.title }}</p>
          <h3 class="text-3xl font-black text-slate-800 dark:text-white">{{ card.value }}</h3>
          <p class="text-xs mt-2 font-medium" :class="card.text">{{ card.trend }}</p>
        </div>
        <div class="p-4 rounded-xl" :class="card.color">
          <Icon :name="card.icon" class="w-8 h-8" :class="card.text" />
        </div>
      </div>
    </div>

    <!-- LOADING STATE -->
    <div v-if="pending" class="py-20 text-center text-slate-400 animate-pulse">Memuat data bayi...</div>

    <!-- EMPTY STATE -->
    <div v-else-if="babyPatients.length === 0" class="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
      <Icon name="heroicons:face-frown" class="w-12 h-12 text-slate-300 mb-2 mx-auto" />
      <p class="text-slate-500">Belum ada data bayi yang terdaftar.</p>
      <NuxtLink to="/midwife/patients" class="text-purple-600 font-bold hover:underline mt-2 inline-block">Daftarkan Bayi Baru</NuxtLink>
    </div>

    <!-- CARD GRID (List Pasien Bayi) -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="patient in babyPatients"
        :key="patient.id"
        class="group bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-900 transition-all duration-300 relative overflow-hidden"
      >
        <!-- Hiasan Background -->
        <div class="absolute top-0 right-0 w-24 h-24 bg-purple-50 dark:bg-purple-900/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

        <!-- Header Kartu -->
        <div class="flex items-center gap-4 mb-6 relative z-10">
          <img :src="patient.avatar" class="w-14 h-14 rounded-full border-2 border-white dark:border-slate-700 shadow-md object-cover" />
          <div>
            <h3 class="font-bold text-lg text-slate-900 dark:text-white leading-tight">{{ patient.name }}</h3>
            <span class="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
              {{ patient.age }}
            </span>
          </div>
        </div>

        <!-- Info Vaksin -->
        <div class="space-y-3 text-sm mb-6 relative z-10 bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
          <div class="flex justify-between items-center">
            <span class="text-slate-400 text-xs uppercase font-bold tracking-wider">Terakhir</span>
            <span class="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1"> <Icon name="heroicons:check-circle" class="w-4 h-4 text-green-500" /> {{ patient.lastVaccine }} </span>
          </div>
          <div class="w-full h-px bg-slate-200 dark:bg-slate-600/50"></div>
          <div class="flex justify-between items-center">
            <span class="text-slate-400 text-xs uppercase font-bold tracking-wider">Jadwal</span>
            <span class="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1"> <Icon name="heroicons:clock" class="w-4 h-4" /> {{ patient.nextDue }} </span>
          </div>
        </div>

        <!-- Tombol Aksi (Di Kartu) -->
        <button
          @click="openLogModal(patient)"
          class="w-full py-3 bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 rounded-xl font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 transition flex items-center justify-center gap-2 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 shadow-sm"
        >
          <Icon name="heroicons:plus" class="w-5 h-5" /> Catat Vaksin
        </button>
      </div>
    </div>

    <!-- MODAL POPUP (Design Sesuai Request) -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop Gelap -->
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

      <!-- Panel Modal -->
      <div class="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl transform transition-all overflow-hidden border border-slate-200 dark:border-slate-700 animate-fade-in-up">
        <!-- 1. Header Modal -->
        <div class="bg-purple-50 dark:bg-purple-900/20 px-6 py-4 border-b border-purple-100 dark:border-purple-800/50 flex justify-between items-center">
          <div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white">Catat Imunisasi</h3>
            <p class="text-xs text-purple-600 dark:text-purple-300 font-medium mt-0.5">
              {{ selectedPatient ? `Pasien: ${selectedPatient.name}` : "Pilih Pasien Manual" }}
            </p>
          </div>
          <button @click="closeModal" class="p-1 rounded-full hover:bg-white/50 text-slate-400 hover:text-slate-600 transition">
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>

        <!-- 2. Body Form -->
        <div class="p-6 space-y-5">
          <!-- Pilih Pasien (Jika klik tombol header) -->
          <div v-if="!selectedPatient">
            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Cari Pasien</label>
            <select v-model="selectedPatient" class="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white outline-none">
              <option :value="null">-- Pilih Bayi --</option>
              <option v-for="p in babyPatients" :key="p.id" :value="p">{{ p.name }}</option>
            </select>
          </div>

          <!-- Jenis Vaksin -->
          <div>
            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Jenis Vaksin</label>
            <div class="relative">
              <select
                v-model="form.vaccineType"
                class="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none transition"
              >
                <option>BCG</option>
                <option>Hepatitis B</option>
                <option>Polio 1</option>
                <option>DPT-HB-Hib 1</option>
                <option>PCV 1</option>
                <option>Rotavirus</option>
                <option>Campak Rubella</option>
              </select>
              <Icon name="heroicons:chevron-down" class="w-5 h-5 absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Tanggal -->
            <div>
              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Tanggal</label>
              <input
                type="date"
                v-model="form.date"
                class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </div>
            <!-- No Batch -->
            <div>
              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">No. Batch</label>
              <input
                type="text"
                v-model="form.batchNo"
                placeholder="Contoh: A24X"
                class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </div>
          </div>

          <!-- Catatan -->
          <div>
            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Catatan / Reaksi</label>
            <textarea
              v-model="form.notes"
              rows="2"
              placeholder="Kondisi bayi sehat, suhu normal..."
              class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none transition"
            ></textarea>
          </div>
        </div>

        <!-- 3. Footer Actions -->
        <div class="p-6 pt-0 flex gap-3">
          <button @click="closeModal" class="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition">Batal</button>
          <button
            @click="saveLog"
            class="flex-1 py-3.5 rounded-xl bg-purple-600 text-white font-bold shadow-lg shadow-purple-500/30 hover:bg-purple-700 hover:shadow-purple-500/50 transition transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Icon name="heroicons:check" class="w-5 h-5" /> Simpan Data
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animasi Modal biar smooth kayak aplikasi native */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.2s ease-out forwards;
}
</style>
