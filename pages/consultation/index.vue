<script setup lang="ts">
definePageMeta({ layout: "default" });

useHead({
  title: "Consultations",
});

const route = useRoute();
const id = route.params.id;

// STATE
const searchQuery = ref("");
const filterStatus = ref("All"); // All, Today, Drafts
const activeDropdownId = ref<string | null>(null);

// --- FETCH DATA REAL (Ganti Dummy) ---
const { data: res, pending, refresh } = await useFetch<any>("/api/consultations");

// COMPUTED: Filter & Search Logic
const filteredHistory = computed(() => {
  let items = res.value?.data || [];

  // 1. Filter by Status Tab
  if (filterStatus.value === "Today") {
    const today = new Date().toISOString().split("T")[0];
    items = items.filter((i: any) => i.createdAt && i.createdAt.startsWith(today));
  } else if (filterStatus.value === "Drafts") {
    items = items.filter((i: any) => i.status === "draft");
  }

  // 2. Filter by Search Query
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    items = items.filter((i: any) => (i.patientName && i.patientName.toLowerCase().includes(q)) || (i.diagnosis && i.diagnosis.toLowerCase().includes(q)) || (i.complaint && i.complaint.toLowerCase().includes(q)));
  }

  return items;
});

// UTILS
const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return `Today, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
  }
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "ready":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "processing":
      return "bg-amber-100 text-amber-700 border-amber-200 animate-pulse";
    case "draft":
      return "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return "bg-blue-100 text-blue-700 border-blue-200";
  }
};

// --- ACTION HANDLERS ---
const toggleDropdown = (id: string) => {
  if (activeDropdownId.value === id) {
    activeDropdownId.value = null; // Tutup kalau diklik lagi
  } else {
    activeDropdownId.value = id; // Buka yang baru
  }
};

// Tutup dropdown kalau klik di luar (UX Wajib!)
onMounted(() => {
  document.addEventListener("click", (e: any) => {
    // Kalau yang diklik BUKAN tombol action, tutup dropdown
    if (!e.target.closest(".action-btn")) {
      activeDropdownId.value = null;
    }
  });
});

// Fungsi Navigasi & Aksi
const onViewDetail = (id: string) => navigateTo(`/consultation/${id}`);

const onPrint = (item: any) => {
  activeDropdownId.value = null;
  alert(`🖨️ Generating PDF for ${item.patientName}...\n(Fitur ini akan di-connect ke PDF Generator nanti)`);
};

const onEmail = (item: any) => {
  activeDropdownId.value = null;
  alert(`📧 Sending email summary to ${item.patientName}...\n(Aman! Data sensitif akan disensor)`);
};

const onEditDraft = (id: string) => {
  // Arahkan kembali ke halaman Live Record dengan ID konsultasi
  navigateTo({
    path: "/consultation/live-record",
    query: { consultationId: id, mode: "resume" },
  });
};

// Auto Refresh data setiap masuk halaman ini
onActivated(() => refresh());
</script>

<template>
  <div class="min-h-screen" @click.stop>
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Consultations</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Manage patient history and AI summaries.</p>
      </div>

      <NuxtLink to="/patients" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition transform active:scale-95">
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
          v-model="searchQuery"
          type="text"
          placeholder="Search by patient name, diagnosis, or symptoms..."
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
        />
      </div>

      <div class="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
        <button
          v-for="tab in ['All', 'Today', 'Drafts']"
          :key="tab"
          @click="filterStatus = 'tab'"
          :class="filterStatus === 'tab' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-300 hover:text-slate-800'"
          class="px-4 py-1.5 rounded-lg text-sm font-bold transition"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- LOADING STATE -->
    <div v-if="pending" class="py-20 text-center">
      <Icon name="svg-spinners:ring-resize" class="w-10 h-10 text-slate-300 mx-auto mb-2" />
      <p class="text-slate-400">Loading records...</p>
    </div>

    <!-- EMPTY STATE -->
    <div v-else-if="filteredHistory.length === 0" class="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
      <Icon name="heroicons:clipboard-document-list" class="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h3 class="text-lg font-bold text-slate-600 dark:text-slate-400">No Consultations Found</h3>
      <p class="text-sm text-slate-400">Start a new visit to create records.</p>
    </div>

    <!-- Table List (DATA REAL) -->
    <div v-else class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden animate-fade-in">
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th class="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
            <th class="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Complaint & Diagnosis</th>
            <th class="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
            <th class="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
            <th class="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
          <tr v-for="item in filteredHistory" :key="item.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition cursor-pointer group">
            <td @click="onViewDetail(item.id)" class="p-4 align-top cursor-pointer">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm uppercase">
                  {{ item.patientName ? item.patientName.charAt(0) : "?" }}
                </div>
                <div>
                  <div class="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">{{ item.patientName || "Unknown Patient" }}</div>
                  <div class="text-xs text-slate-400 font-mono">{{ item.pid || "NO-ID" }}</div>
                </div>
              </div>
            </td>

            <td @click="onViewDetail(item.id)" class="p-4 align-top cursor-pointer">
              <div class="font-medium text-slate-800 dark:text-slate-200">{{ item.diagnosis || "No Diagnosis" }}</div>
              <div class="text-sm text-slate-500 line-clamp-1 italic">"{{ item.complaint || "No complaint recorded" }}"</div>
            </td>

            <td @click="onViewDetail(item.id)" class="p-4 align-top text-sm text-slate-500 cursor-pointer">{{ formatDate(item.createdAt) }}</td>

            <td @click="onViewDetail(item.id)" class="p-4 align-top cursor-pointer">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize" :class="getStatusColor(item.status)">
                {{ item.status }}
              </span>
            </td>

            <td class="p-4 align-top text-right relative">
              <button @click.stop="toggleDropdown(item.id)" class="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-600 transition">
                <Icon name="heroicons:ellipsis-vertical" class="w-5 h-5" />
              </button>

              <div v-if="activeDropdownId === item.id" class="absolute right-8 top-10 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-600 z-50 overflow-hidden animate-fade-in-up">
                <button @click="onViewDetail(item.id)" class="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                  <Icon name="heroicons:eye" class="w-4 h-4 text-slate-400" /> View Detail
                </button>

                <button @click="onPrint(item)" class="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                  <Icon name="heroicons:printer" class="w-4 h-4 text-slate-400" /> Print / PDF
                </button>

                <button @click="onEmail(item)" class="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                  <Icon name="heroicons:envelope" class="w-4 h-4 text-slate-400" /> Email Patient
                </button>

                <div v-if="item.status === 'draft'" class="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                <button v-if="item.status === 'draft'" @click="onEditDraft(item.id)" class="w-full text-left px-4 py-3 text-sm font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 flex items-center gap-2">
                  <Icon name="heroicons:pencil-square" class="w-4 h-4" /> Resume Draft
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Animasi halus buat dropdown */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.2s ease-out forwards;
}
</style>
