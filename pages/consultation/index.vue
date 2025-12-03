<script setup lang="ts">
// Data Dummy Riwayat Konsultasi
const history = [
  {
    id: 1,
    patientName: "Olivia Chen",
    pid: "PT789012",
    date: "Today, 10:30 AM",
    complaint: "Sakit kepala migrain sebelah kanan",
    diagnosis: "Migraine w/o Aura",
    status: "Ready", // Ready, Processing, Draft
  },
  {
    id: 2,
    patientName: "Benjamin Carter",
    pid: "PT456789",
    date: "Today, 09:15 AM",
    complaint: "Nyeri sendi lutut pasca lari",
    diagnosis: "Patellar Tendonitis",
    status: "Processing",
  },
  {
    id: 3,
    patientName: "Ahmad Dani",
    pid: "PT123456",
    date: "Yesterday",
    complaint: "Kontrol gula darah rutin",
    diagnosis: "Type 2 Diabetes",
    status: "Ready",
  },
  {
    id: 4,
    patientName: "Sarah Wijaya",
    pid: "PT998877",
    date: "Oct 24, 2023",
    complaint: "Demam tinggi 3 hari",
    diagnosis: "Dengue Fever",
    status: "Draft",
  },
];

// Helper warna status
const getStatusColor = (status: string) => {
  switch (status) {
    case "Ready":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Processing":
      return "bg-amber-100 text-amber-700 border-amber-200 animate-pulse";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};
</script>

<template>
  <div class="min-h-screen">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Consultations</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Manage patient history and AI summaries.</p>
      </div>

      <NuxtLink to="/consultation/live-record" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition transform active:scale-95">
        <Icon name="heroicons:plus" class="w-5 h-5" />
        <span>New Consultation</span>
      </NuxtLink>
    </div>

    <!-- Search & Filter -->
    <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
      <div class="relative flex-1">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="heroicons:magnifying-glass" class="text-slate-400 w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder="Search by patient name, diagnosis, or symptoms..."
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
        />
      </div>

      <div class="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
        <button class="px-4 py-1.5 rounded-lg bg-white dark:bg-slate-600 shadow-sm text-sm font-bold text-slate-800 dark:text-white">All</button>
        <button class="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-300 hover:text-slate-800">Today</button>
        <button class="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-300 hover:text-slate-800">Drafts</button>
      </div>
    </div>

    <!-- Table List -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th class="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
            <th class="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Complaint & Diagnosis</th>
            <th class="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
            <th class="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">AI Status</th>
            <th class="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
          <tr v-for="item in history" :key="item.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition cursor-pointer group">
            <td class="p-4 align-top">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {{ item.patientName.charAt(0) }}
                </div>
                <div>
                  <div class="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">{{ item.patientName }}</div>
                  <div class="text-xs text-slate-400 font-mono">{{ item.pid }}</div>
                </div>
              </div>
            </td>

            <td class="p-4 align-top">
              <div class="font-medium text-slate-800 dark:text-slate-200">{{ item.diagnosis }}</div>
              <div class="text-sm text-slate-500 line-clamp-1">"{{ item.complaint }}"</div>
            </td>

            <td class="p-4 align-top text-sm text-slate-500">{{ item.date }}</td>

            <td class="p-4 align-top">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border" :class="getStatusColor(item.status)">
                {{ item.status === "Processing" ? "Generating AI..." : item.status + " SOAP" }}
              </span>
            </td>

            <td class="p-4 align-top text-right">
              <button class="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-600 transition">
                <Icon name="heroicons:chevron-right" class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
