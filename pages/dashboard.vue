<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { storeToRefs } from "pinia";

// 1. Definisikan Interface User
interface User {
  id?: string;
  name: string;
  email: string;
  specialization: string;
  avatar?: string;
}

// 2. Interface Response API
interface DashboardResponse {
  success: boolean;
  stats?: {
    totalPatients: number;
    consultationsToday: number;
    pendingSummary: number;
  };
  appointments?: any[];
}

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

// Casting tipe data user
const currentUser = computed(() => authStore.user as User | null);

// --- USER LOADING STATE ---
const isUserLoading = ref(true);

onMounted(() => {
  if (currentUser.value?.avatar) {
    isUserLoading.value = false;
  } else {
    authStore.fetchUserProfile().finally(() => {
      isUserLoading.value = false;
    });
    setTimeout(() => {
      isUserLoading.value = false;
    }, 3000);
  }
  fetchDashboardData();
});

// --- REAL-TIME DATA LOGIC ---
const isDashboardLoading = ref(true);

// Definisikan tipe array stats biar TS gak bingung
// const stats = ref<{ title: string; value: string; icon: string; bg: string }[]>([
//   { title: "Total Patients", value: "0", icon: "heroicons:users", bg: "bg-blue-50 dark:bg-blue-900/20" },
//   { title: "Consultations Today", value: "0", icon: "heroicons:chat-bubble-left-right", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
//   { title: "Pending AI Summaries", value: "0", icon: "heroicons:cpu-chip", bg: "bg-purple-50 dark:bg-purple-900/20" },
// ]);
const stats = ref([
  {
    title: "Total Patients",
    value: "0",
    icon: "heroicons:users-solid",
    cssClass: "from-emerald-50 to-white border-emerald-100 dark:from-emerald-900/30 dark:to-slate-800 dark:border-emerald-800",
    textClass: "text-emerald-900 dark:text-emerald-100",
    iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  },
  {
    title: "Consultations Today",
    value: "0",
    icon: "heroicons:clipboard-document-check-solid",
    cssClass: "from-teal-50 to-white border-teal-100 dark:from-teal-900/30 dark:to-slate-800 dark:border-teal-800",
    textClass: "text-teal-900 dark:text-teal-100",
    iconBg: "bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400",
  },
  {
    title: "Pending AI Summaries",
    value: "0",
    icon: "heroicons:sparkles-solid",
    cssClass: "from-green-50 to-white border-green-100 dark:from-green-900/30 dark:to-slate-800 dark:border-green-800",
    textClass: "text-green-900 dark:text-green-100",
    iconBg: "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",
  },
]);

const appointments = ref<any[]>([]);

const fetchDashboardData = async () => {
  isDashboardLoading.value = true;
  try {
    const res = await $fetch<DashboardResponse>("/api/dashboard/stats");

    if (res.success && res.stats) {
      // Update nilai stats dengan aman
      stats.value[0].value = String(res.stats.totalPatients ?? 0);
      stats.value[1].value = String(res.stats.consultationsToday ?? 0);
      stats.value[2].value = String(res.stats.pendingSummary ?? 0);

      appointments.value = res.appointments || [];
    }
  } catch (error) {
    console.error("Gagal load dashboard:", error);
  } finally {
    isDashboardLoading.value = false;
  }
};

const formatTime = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};
</script>

<template>
  <div class="min-h-screen">
    <!-- 1. TOP BAR -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-10">
      <div class="relative w-full md:w-96">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="heroicons:magnifying-glass" class="text-slate-400 w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder="Search for patients..."
          class="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-700 text-slate-800 dark:text-white transition"
        />
      </div>

      <div class="flex items-center justify-between w-full md:w-auto gap-4">
        <button class="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition">
          <Icon name="heroicons:bell" class="w-6 h-6" />
          <span class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <div class="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
          <!-- SKELETON LOADER (Muncul saat isUserLoading = true) -->
          <div v-if="isUserLoading" class="flex items-center gap-3 animate-pulse">
            <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            <div class="space-y-2">
              <div class="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div class="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>

          <!-- DATA ASLI -->
          <div v-else class="flex items-center gap-3">
            <img :src="currentUser?.avatar || 'https://i.pravatar.cc/150?u=default'" class="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm" alt="Doctor" />
            <div class="hidden sm:block text-right md:text-left">
              <h4 class="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                {{ currentUser?.name || "Doctor" }}
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ currentUser?.specialization || "Specialist" }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 2. WELCOME HEADER -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2 flex items-center gap-2">
          Welcome back,
          <span v-if="isUserLoading" class="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse inline-block"></span>
          <span v-else>{{ currentUser?.name || "Doc" }}</span>
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm md:text-base">Here's a summary of your activities for today.</p>
      </div>

      <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-800 self-start md:self-auto">
        <Icon name="heroicons:lock-closed-solid" class="w-3 h-3" />
        <span>Secure Connection</span>
      </div>
    </div>

    <!-- 3. STATS CARDS -->
    <!-- <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.title" class="bg-slate-50 dark:bg-slate-800 p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between transition hover:shadow-md">
        <div>
          <p class="text-slate-500 dark:text-slate-400 font-medium mb-1 text-sm">{{ stat.title }}</p>
          <div v-if="isDashboardLoading" class="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          <h3 v-else class="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">{{ stat.value }}</h3>
        </div>
        <div :class="`w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 shadow-sm ${stat.bg}`">
          <Icon :name="stat.icon" class="w-6 h-6" />
        </div>
      </div>
    </div> -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.title" class="relative p-5 md:p-6 rounded-2xl border shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:scale-[1.01] bg-gradient-to-br" :class="stat.cssClass">
        <div>
          <p class="font-semibold mb-1 text-sm opacity-90" :class="stat.textClass">{{ stat.title }}</p>
          <!-- Skeleton Loader -->
          <div v-if="isDashboardLoading" class="h-8 w-16 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse"></div>
          <h3 v-else class="text-3xl md:text-4xl font-extrabold tracking-tight" :class="stat.textClass">{{ stat.value }}</h3>
        </div>

        <!-- Icon Container -->
        <div :class="`w-14 h-14 rounded-full flex items-center justify-center shadow-sm ${stat.iconBg}`">
          <Icon :name="stat.icon" class="w-7 h-7" />
        </div>
      </div>
    </div>

    <!-- 4. ACTION BANNER -->
    <div class="bg-blue-50 dark:bg-blue-900/20 p-6 md:p-8 rounded-2xl border border-blue-100 dark:border-blue-800/50 mb-10 flex flex-col items-center justify-center text-center">
      <h3 class="text-blue-900 dark:text-blue-100 font-bold text-lg mb-2 block md:hidden">Ready for consultation?</h3>
      <NuxtLink
        to="/consultation/live-record"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition transform active:scale-95 w-full md:w-auto justify-center"
      >
        <Icon name="heroicons:plus-circle-solid" class="w-5 h-5" />
        <span>Start New Consultation</span>
      </NuxtLink>
    </div>

    <!-- 5. APPOINTMENTS SECTION -->
    <div class="mb-4 md:mb-6 flex justify-between items-center">
      <h3 class="text-lg md:text-xl font-bold text-slate-800 dark:text-white">Today's Appointments</h3>
      <button @click="fetchDashboardData" class="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-slate-600 dark:text-slate-400 transition" title="Refresh Data">
        <Icon name="heroicons:arrow-path" class="w-5 h-5" :class="{ 'animate-spin': isDashboardLoading }" />
      </button>
    </div>

    <!-- Appointments Grid -->
    <div v-if="isDashboardLoading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      <div v-for="i in 3" :key="i" class="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
    </div>

    <div v-else-if="appointments.length === 0" class="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
      <Icon name="heroicons:calendar" class="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <p class="text-slate-500">No appointments scheduled for today.</p>
      <NuxtLink to="/patients" class="text-blue-600 font-bold hover:underline text-sm mt-2 block">Check In a Patient</NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 pb-20 md:pb-0">
      <div v-for="apt in appointments" :key="apt.id" class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition">
        <div class="flex items-start gap-4 mb-4">
          <img :src="apt.avatarUrl || 'https://i.pravatar.cc/150?u=default'" class="w-12 h-12 rounded-full object-cover" />
          <div>
            <h4 class="font-bold text-slate-900 dark:text-white">{{ apt.patientName }}</h4>
            <p class="text-xs text-slate-400 font-mono">ID: {{ apt.patientId || "-" }}</p>
          </div>
        </div>

        <div class="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 mb-4">
          <Icon name="heroicons:clock" class="w-4 h-4" />
          <span>Checked In at {{ formatTime(apt.time) }}</span>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button class="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition">View</button>

          <NuxtLink :to="`/consultation/live-record?sessionId=${apt.id}`" class="flex justify-center items-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium text-sm hover:bg-teal-700 shadow-sm transition"> Continue </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
