<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { storeToRefs } from "pinia";

useHead({
  title: "Dashboard Overview",
});

// Interface User
interface User {
  id?: string;
  name: string;
  email: string;
  specialization: string;
  avatar?: string;
}

// Interface Response API
interface DashboardResponse {
  success: boolean;
  stats?: {
    totalPatients: number;
    consultationsToday: number;
    pendingSummary: number;
  };
  chart?: {
    labels: string[];
    newPatients: number[];
    recurring: number[];
  };
  appointments?: any[];
}

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const currentUser = computed(() => authStore.user as User | null);
const isUserLoading = ref(true);

// --- CHART STATE ---
const chartLabels = ref<string[]>([]);
const chartNewData = ref<number[]>([]);
const chartRecurringData = ref<number[]>([]);
const maxChartValue = ref(10);

onMounted(() => {
  if (currentUser.value?.avatar) {
    isUserLoading.value = false;
  } else {
    authStore.fetchUserProfile().finally(() => {
      isUserLoading.value = false;
    });
  }
  fetchDashboardData();
});

const isDashboardLoading = ref(true);
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
      stats.value[0].value = String(res.stats.totalPatients ?? 0);
      stats.value[1].value = String(res.stats.consultationsToday ?? 0);
      stats.value[2].value = String(res.stats.pendingSummary ?? 0);
      appointments.value = res.appointments || [];

      // Update Chart Data
      if (res.chart) {
        chartLabels.value = res.chart.labels;
        chartNewData.value = res.chart.newPatients;
        chartRecurringData.value = res.chart.recurring;

        // Cari nilai tertinggi biar grafik gak kepotong
        const maxVal = Math.max(...res.chart.newPatients, ...res.chart.recurring, 5);
        maxChartValue.value = maxVal + 2;
      }
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

const getSvgPath = (dataPoints: number[], color: string) => {
  if (!dataPoints.length) return "";

  const width = 500;
  const height = 150;
  const stepX = width / (dataPoints.length - 1);

  const points = dataPoints.map((val, index) => {
    const x = index * stepX;
    const y = height - (val / maxChartValue.value) * height;
    return `${x},${y}`;
  });

  return `M ${points.join(" L ")}`;
};

const getAreaPath = (dataPoints: number[]) => {
  if (!dataPoints.length) return "";
  const linePath = getSvgPath(dataPoints, "");
  return `${linePath} L 500,150 L 0,150 Z`;
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
          <div v-if="isUserLoading" class="flex items-center gap-3 animate-pulse">
            <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            <div class="space-y-2">
              <div class="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div class="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
          <div v-else class="flex items-center gap-3">
            <img :src="currentUser?.avatar || 'https://i.pravatar.cc/150?u=default'" class="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm" alt="Doctor" />
            <div class="hidden sm:block text-right md:text-left">
              <h4 class="text-sm font-bold text-slate-800 dark:text-white leading-tight">{{ currentUser?.name || "Doctor" }}</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ currentUser?.specialization || "General Practitioner" }}</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 2. WELCOME HEADER -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2 flex items-center gap-2">
          Welcome back, <span v-if="isUserLoading" class="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse inline-block"></span><span v-else>{{ currentUser?.name || "Doc" }}</span>
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm md:text-base">Here's a summary of your clinic activities.</p>
      </div>
      <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-800 self-start md:self-auto">
        <Icon name="heroicons:lock-closed-solid" class="w-3 h-3" />
        <span>Secure Connection</span>
      </div>
    </div>

    <!-- 3. STATS CARDS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.title" class="relative p-5 md:p-6 rounded-2xl border shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:scale-[1.01] bg-linear-to-br" :class="stat.cssClass">
        <div>
          <p class="font-semibold mb-1 text-sm opacity-90" :class="stat.textClass">{{ stat.title }}</p>
          <div v-if="isDashboardLoading" class="h-8 w-16 bg-slate-200/50 dark:bg-slate-700/50 rounded animate-pulse"></div>
          <h3 v-else class="text-3xl md:text-4xl font-extrabold tracking-tight" :class="stat.textClass">{{ stat.value }}</h3>
        </div>
        <div :class="`w-14 h-14 rounded-full flex items-center justify-center shadow-sm ${stat.iconBg}`">
          <Icon :name="stat.icon" class="w-7 h-7" />
        </div>
      </div>
    </div>

    <!-- 🔥 4. REAL DYNAMIC CHART: PATIENT TRENDS 🔥 -->
    <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mb-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- CHART AREA (Left) -->
        <div class="flex-1">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-lg text-slate-800 dark:text-white">Patient Activity (7 Days)</h3>
            <div class="flex gap-4 text-xs font-bold">
              <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span> New Patients</div>
              <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400"><span class="w-2.5 h-2.5 rounded-full bg-teal-500"></span> Consultations</div>
            </div>
          </div>

          <!-- DYNAMIC SVG CHART -->
          <div class="relative h-48 w-full">
            <svg viewBox="0 0 500 150" class="w-full h-full overflow-visible" preserveAspectRatio="none">
              <!-- Grid Lines -->
              <line x1="0" y1="0" x2="500" y2="0" stroke="currentColor" class="text-slate-100 dark:text-slate-700" stroke-width="1" />
              <line x1="0" y1="50" x2="500" y2="50" stroke="currentColor" class="text-slate-100 dark:text-slate-700" stroke-width="1" stroke-dasharray="4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="currentColor" class="text-slate-100 dark:text-slate-700" stroke-width="1" stroke-dasharray="4" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="currentColor" class="text-slate-100 dark:text-slate-700" stroke-width="1" />

              <!-- Line 1: New Patients (Blue) -->
              <path :d="getSvgPath(chartNewData, '')" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-sm transition-all duration-1000 ease-out" />
              <!-- Area Fill -->
              <path :d="getAreaPath(chartNewData)" fill="url(#gradBlue)" opacity="0.1" />

              <!-- Line 2: Consultations (Teal) -->
              <path :d="getSvgPath(chartRecurringData, '')" fill="none" stroke="#14b8a6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-sm transition-all duration-1000 ease-out" />

              <!-- Gradients Definitions -->
              <defs>
                <linearGradient id="gradBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color: #3b82f6; stop-opacity: 1" />
                  <stop offset="100%" style="stop-color: #3b82f6; stop-opacity: 0" />
                </linearGradient>
              </defs>
            </svg>

            <!-- X-Axis Labels (Dynamic) -->
            <div class="flex justify-between text-xs text-slate-400 font-medium mt-2 px-2">
              <span v-for="label in chartLabels" :key="label">{{ label }}</span>
            </div>
          </div>
        </div>

        <!-- STATS AREA (Right) -->
        <div class="lg:w-72 flex flex-col gap-6 pt-4 lg:pt-0 lg:border-l border-slate-100 dark:border-slate-700 lg:pl-8">
          <!-- Weekly Total -->
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Weekly Consultations</p>
            <div class="flex items-center gap-3">
              <span class="text-4xl font-black text-slate-900 dark:text-white">
                {{ chartRecurringData.reduce((a, b) => a + b, 0) }}
              </span>
              <span class="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-lg flex items-center gap-1"> <Icon name="heroicons:arrow-trending-up" class="w-3 h-3" /> Live </span>
            </div>
          </div>

          <!-- Insight Box -->
          <div class="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex gap-3">
            <Icon name="heroicons:light-bulb" class="w-5 h-5 text-yellow-500 shrink-0" />
            <div>
              <span class="font-bold text-slate-800 dark:text-white">Insight:</span>
              Data ini diambil real-time dari aktivitas klinik Anda selama 7 hari terakhir.
            </div>
          </div>
        </div>
      </div>
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
          <NuxtLink
            :to="{ path: `/patients/${apt.patientId}`, query: { source: 'dashboard' } }"
            class="flex justify-center items-center px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >View Patient</NuxtLink
          >
          <NuxtLink
            :to="`/consultation/live-record?patientId=${apt.patientId}&patientName=${apt.patientName}`"
            class="flex justify-center items-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium text-sm hover:bg-teal-700 shadow-sm transition"
          >
            Continue
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
