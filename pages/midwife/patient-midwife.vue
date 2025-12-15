<script setup lang="ts">
import { ref } from "vue";

// --- Types ---
type SummaryCard = {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: string;
  color: string;
  textColor: string;
  trendColor: string;
};

type PatientCard = {
  id: string;
  name: string;
  patientId: string;
  avatar: string;
  age: string;
  stage: string;
  nextAppt: string;
  lastVisit: string;
  status: "High Risk" | "Normal" | "Newborn" | "Monitoring" | "Overdue";
  type: "pregnant" | "baby" | "postpartum";
  weight?: string;
  feeding?: string;
  recovery?: string;
};

// --- Mock Data (Summary Cards) ---
const summaryCards = ref<SummaryCard[]>([
  {
    title: "Total Patients",
    value: "124",
    trend: "+5% this month",
    trendUp: true,
    icon: "heroicons:users",
    color: "bg-purple-50 dark:bg-purple-900/20",
    textColor: "text-purple-600 dark:text-purple-300",
    trendColor: "text-green-600 dark:text-green-400",
  },
  {
    title: "High Risk",
    value: "8",
    trend: "+2 new cases",
    trendUp: true,
    icon: "heroicons:exclamation-triangle",
    color: "bg-red-50 dark:bg-red-900/20",
    textColor: "text-red-600 dark:text-red-300",
    trendColor: "text-red-600 dark:text-red-400",
  },
  { title: "Pregnant Moms", value: "85", trend: "Active pregnancies", icon: "heroicons:heart", color: "bg-pink-50 dark:bg-pink-900/20", textColor: "text-pink-600 dark:text-pink-300", trendColor: "text-slate-500 dark:text-slate-400" },
  { title: "Newborns", value: "39", trend: "Under 6 months", icon: "heroicons:face-smile", color: "bg-indigo-50 dark:bg-indigo-900/20", textColor: "text-indigo-600 dark:text-indigo-300", trendColor: "text-slate-500 dark:text-slate-400" },
]);

// --- Mock Data (Patients) ---
const patients = ref<PatientCard[]>([
  { id: "1", name: "Sarah Jenkins", patientId: "#PT-8921", avatar: "https://i.pravatar.cc/150?u=sarah", age: "28 yrs", stage: "Week 34", nextAppt: "Oct 24, 10:00 AM", lastVisit: "Oct 10", status: "High Risk", type: "pregnant" },
  {
    id: "2",
    name: "Baby Leo",
    patientId: "Mother: Emily Wong",
    avatar: "https://i.pravatar.cc/150?u=leo",
    age: "2 Weeks",
    stage: "",
    nextAppt: "Nov 02, 09:30 AM",
    lastVisit: "",
    status: "Newborn",
    type: "baby",
    weight: "3.8 kg",
    feeding: "Breastfed",
  },
  { id: "3", name: "Maria Rodriguez", patientId: "#PT-9004", avatar: "https://i.pravatar.cc/150?u=maria", age: "31 yrs", stage: "Week 12", nextAppt: "Nov 15, 14:00 PM", lastVisit: "Oct 14", status: "Normal", type: "pregnant" },
  { id: "4", name: "Keisha Adams", patientId: "#PT-9102", avatar: "https://i.pravatar.cc/150?u=keisha", age: "24 yrs", stage: "Week 28", nextAppt: "Oct 30, 11:15 AM", lastVisit: "Oct 01", status: "Normal", type: "pregnant" },
  {
    id: "5",
    name: "Anita Roy",
    patientId: "#PT-8800",
    avatar: "https://i.pravatar.cc/150?u=anita",
    age: "35 yrs",
    stage: "Postpartum",
    nextAppt: "Nov 05, 13:00 PM",
    lastVisit: "Good",
    status: "Monitoring",
    type: "postpartum",
    recovery: "Good",
  },
  { id: "6", name: "Fatima Al-Sayed", patientId: "#PT-8855", avatar: "https://i.pravatar.cc/150?u=fatima", age: "29 yrs", stage: "Week 41", nextAppt: "Tomorrow", lastVisit: "Oct 20", status: "Overdue", type: "pregnant" },
]);

// --- Helper Functions for Styling ---
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
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Patients</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Manage expectant mothers and newborns under your care.</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Search Bar (Hidden on Mobile) -->
        <div class="relative hidden md:block">
          <Icon name="heroicons:magnifying-glass" class="w-5 h-5 absolute left-3 top-3 text-slate-400" />
          <input type="text" placeholder="Quick search..." class="pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 w-64 text-sm" />
        </div>
        <button class="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
          <Icon name="heroicons:bell" class="w-5 h-5" />
        </button>
        <button class="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
          <Icon name="heroicons:chat-bubble-left-right" class="w-5 h-5" />
        </button>
        <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500 dark:border-purple-400 overflow-hidden">
          <img src="https://i.pravatar.cc/150?u=bidan" alt="Profile" class="w-full h-full object-cover" />
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
      <!-- Search & Filters -->
      <div class="flex flex-1 gap-3 w-full md:w-auto">
        <div class="relative flex-1 md:flex-none md:w-72">
          <Icon name="heroicons:magnifying-glass" class="w-5 h-5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID, or phone number..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>
        <div class="flex gap-2">
          <select
            class="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-right-2"
          >
            <option>All Status</option>
            <option>High Risk</option>
            <option>Normal</option>
          </select>
          <select
            class="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-right-2"
          >
            <option>All Stages</option>
            <option>Trimester 1</option>
            <option>Trimester 2</option>
            <option>Trimester 3</option>
          </select>
        </div>
      </div>
      <!-- Add Patient Button -->
      <button class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-purple-500/30 transition flex items-center gap-2 whitespace-nowrap">
        <Icon name="heroicons:plus" class="w-5 h-5" /> Add New Patient
      </button>
    </div>

    <!-- PATIENT CARDS GRID -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="patient in patients"
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
            <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">AGE</p>
            <p class="font-medium text-slate-700 dark:text-slate-200">{{ patient.age }}</p>
          </div>
          <div v-if="patient.type === 'pregnant'">
            <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">STAGE</p>
            <p class="font-medium text-slate-700 dark:text-slate-200">{{ patient.stage }}</p>
          </div>
          <div v-if="patient.type === 'baby'">
            <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">WEIGHT</p>
            <p class="font-medium text-slate-700 dark:text-slate-200">{{ patient.weight }}</p>
          </div>
          <div v-if="patient.type === 'postpartum'">
            <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">STATUS</p>
            <p class="font-medium text-slate-700 dark:text-slate-200">{{ patient.stage }}</p>
          </div>
          <div>
            <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">NEXT APPT</p>
            <p class="font-medium text-slate-700 dark:text-slate-200">{{ patient.nextAppt }}</p>
          </div>
          <div v-if="patient.type === 'pregnant'">
            <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">LAST VISIT</p>
            <p class="font-medium text-slate-700 dark:text-slate-200">{{ patient.lastVisit }}</p>
          </div>
          <div v-if="patient.type === 'baby'">
            <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">FEEDING</p>
            <p class="font-medium text-slate-700 dark:text-slate-200">{{ patient.feeding }}</p>
          </div>
          <div v-if="patient.type === 'postpartum'">
            <p class="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">RECOVERY</p>
            <p class="font-medium text-slate-700 dark:text-slate-200">{{ patient.recovery }}</p>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
          <span class="px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5" :class="getStatusStyles(patient.status)">
            <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotColor(patient.status)"></span>
            {{ patient.status }}
          </span>
          <button class="text-purple-600 dark:text-purple-400 text-sm font-bold hover:underline">View Profile</button>
        </div>
      </div>
    </div>
  </div>
</template>
