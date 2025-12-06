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

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

// 2. PERBAIKAN UTAMA:
const currentUser = computed(() => user.value as User | null);

// Data Statistik
const stats = [
  { title: "Total Patients", value: "284", icon: "", bg: "bg-slate-50" },
  { title: "Consultations Today", value: "12", icon: "", bg: "bg-slate-50" },
  { title: "Pending AI Summaries", value: "3", icon: "", bg: "bg-slate-50" },
];

const appointments = [
  { id: 1, name: "Olivia Chen", pid: "ID: PT789012", time: "10:30 AM", image: "https://i.pravatar.cc/150?u=olivia", status: "Upcoming" },
  { id: 2, name: "Benjamin Carter", pid: "ID: PT456789", time: "11:15 AM", image: "https://i.pravatar.cc/150?u=ben", status: "Upcoming" },
  { id: 3, name: "Sophia Rodriguez", pid: "Last seen: 2023-10-15", time: null, image: "https://i.pravatar.cc/150?u=sophia", status: "None" },
];
</script>

<template>
  <div class="min-h-screen">
    <!-- 1. TOP BAR -->
    <header class="flex justify-between items-center mb-10">
      <div class="relative w-96">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="heroicons:magnifying-glass" class="text-slate-400 w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder="Search for patients..."
          class="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-700 text-slate-800 dark:text-white transition"
        />
      </div>

      <div class="flex items-center gap-4">
        <button class="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
          <Icon name="heroicons:bell" class="w-6 h-6" />
          <span class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        <div class="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
          <!-- AVATAR -->
          <!-- Sekarang TypeScript tidak akan error karena sudah tau tipe User punya field avatar -->
          <img :src="currentUser?.avatar || 'https://i.pravatar.cc/150?u=default'" class="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-700" alt="Doctor" />
          <div class="hidden md:block">
            <!-- NAMA -->
            <h4 class="text-sm font-bold text-slate-800 dark:text-white">
              {{ currentUser?.name || "Doctor" }}
            </h4>
            <!-- SPESIALISASI -->
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ currentUser?.specialization || "Specialist" }}
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- 2. WELCOME HEADER -->
    <div class="flex justify-between items-end mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back, {{ currentUser?.name || "Doc" }}</h1>
        <p class="text-slate-500 dark:text-slate-400">Here's a summary of your activities for today.</p>
      </div>
      <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-800">
        <Icon name="heroicons:lock-closed-solid" class="w-3 h-3" />
        <span>Secure Connection</span>
      </div>
    </div>

    <!-- 3. STATS CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.title" class="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
        <p class="text-slate-500 dark:text-slate-400 font-medium mb-1">{{ stat.title }}</p>
        <h3 class="text-4xl font-bold text-slate-800 dark:text-white">{{ stat.value }}</h3>
      </div>
    </div>

    <!-- 4. ACTION BANNER -->
    <div class="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-100 dark:border-blue-800/50 mb-10 flex flex-col items-center justify-center text-center">
      <NuxtLink to="/consultation/live-record" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition transform active:scale-95">
        <Icon name="heroicons:plus-circle-solid" class="w-5 h-5" />
        <span>Start New Consultation</span>
      </NuxtLink>
    </div>

    <!-- 5. APPOINTMENTS SECTION -->
    <div class="mb-6 flex justify-between items-center">
      <h3 class="text-xl font-bold text-slate-800 dark:text-white">Today's Appointments</h3>
      <button class="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-slate-600 dark:text-slate-400 transition">
        <Icon name="heroicons:adjustments-horizontal" class="w-5 h-5" />
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="patient in appointments" :key="patient.id" class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition">
        <div class="flex items-start gap-4 mb-4">
          <img :src="patient.image" class="w-12 h-12 rounded-full object-cover" />
          <div>
            <h4 class="font-bold text-slate-900 dark:text-white">{{ patient.name }}</h4>
            <p class="text-xs text-slate-400 font-mono">{{ patient.pid }}</p>
          </div>
          <button class="ml-auto text-slate-400 hover:text-blue-600">
            <Icon name="heroicons:user" class="w-5 h-5" />
          </button>
        </div>

        <div v-if="patient.time" class="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 mb-4">
          <Icon name="heroicons:clock" class="w-4 h-4" />
          <span>Appointment at {{ patient.time }}</span>
        </div>
        <div v-else class="bg-slate-50 dark:bg-slate-700/50 text-slate-400 px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 mb-4">
          <Icon name="heroicons:calendar" class="w-4 h-4" />
          <span>No upcoming appointment</span>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button class="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition">View Profile</button>

          <NuxtLink v-if="patient.time" to="/consultation/live-record" class="flex justify-center items-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium text-sm hover:bg-teal-700 shadow-sm transition"> Start </NuxtLink>
          <button v-else class="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-400 rounded-lg font-medium text-sm cursor-not-allowed">Start</button>
        </div>
      </div>
    </div>
  </div>
</template>
