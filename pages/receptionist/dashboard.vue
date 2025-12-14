<script setup lang="ts">
definePageMeta({ layout: "default" });

// Mock Provider Status
const doctors = ref([
  { name: "Dr. Sarah Smith", poli: "Umum", status: "Online" },
  { name: "Dr. James Lee", poli: "Anak", status: "Busy" },
  { name: "Dr. Anika Patel", poli: "Kulit", status: "Away" },
]);

// Mock Queue
const queue = ref([
  { no: "A-01", name: "Alice Johnson", poli: "Umum", status: "Waiting", time: "09:00" },
  { no: "B-05", name: "Mark Doe", poli: "Anak", status: "In Progress", time: "09:15" },
  { no: "A-02", name: "Sarah Connor", poli: "Umum", status: "Completed", time: "09:30" },
]);
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Front Desk</h1>
        <p class="text-slate-500">Wednesday, Oct 24th • Shift 08:00 - 16:00</p>
      </div>
      <div class="flex gap-3">
        <button class="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50">Print Schedule</button>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2"><Icon name="heroicons:plus" class="w-5 h-5" /> New Appointment</button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- LEFT COL: STATS & QUEUE -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="text-slate-500 text-xs font-bold uppercase mb-1">Total Appointments</div>
            <div class="text-2xl font-black text-slate-800 dark:text-white">42</div>
          </div>
          <div class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="text-slate-500 text-xs font-bold uppercase mb-1">Checked In</div>
            <div class="text-2xl font-black text-emerald-600">18</div>
          </div>
          <div class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="text-slate-500 text-xs font-bold uppercase mb-1">Waiting Room</div>
            <div class="text-2xl font-black text-orange-500">8</div>
          </div>
          <div class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="text-slate-500 text-xs font-bold uppercase mb-1">Cancellations</div>
            <div class="text-2xl font-black text-red-500">3</div>
          </div>
        </div>

        <!-- Patient Queue -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h3 class="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Icon name="heroicons:users" class="w-5 h-5 text-blue-500" /> Patient Queue</h3>
            <button class="text-sm text-blue-600 font-bold hover:underline">View All</button>
          </div>
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase">
              <tr>
                <th class="px-6 py-3">No</th>
                <th class="px-6 py-3">Name</th>
                <th class="px-6 py-3">Poli</th>
                <th class="px-6 py-3">Status</th>
                <th class="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
              <tr v-for="p in queue" :key="p.no" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                <td class="px-6 py-4 font-mono font-bold text-slate-400">{{ p.no }}</td>
                <td class="px-6 py-4 font-bold text-slate-800 dark:text-white">
                  {{ p.name }}
                  <div class="text-xs font-normal text-slate-400">{{ p.time }}</div>
                </td>
                <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ p.poli }}</td>
                <td class="px-6 py-4">
                  <span
                    class="px-2 py-1 rounded text-xs font-bold"
                    :class="{
                      'bg-orange-100 text-orange-600': p.status === 'Waiting',
                      'bg-blue-100 text-blue-600': p.status === 'In Progress',
                      'bg-green-100 text-green-600': p.status === 'Completed',
                    }"
                  >
                    {{ p.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button v-if="p.status === 'Waiting'" class="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm">Call In</button>
                  <button v-else class="text-slate-400 hover:text-slate-600">Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- RIGHT COL: SIDE WIDGETS -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="grid grid-cols-2 gap-4">
          <button class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center gap-2 hover:bg-slate-50 transition shadow-sm">
            <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Icon name="heroicons:user-plus" class="w-6 h-6" /></div>
            <span class="text-xs font-bold text-slate-600 dark:text-slate-300">Register</span>
          </button>
          <button class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center gap-2 hover:bg-slate-50 transition shadow-sm">
            <div class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Icon name="heroicons:check-circle" class="w-6 h-6" /></div>
            <span class="text-xs font-bold text-slate-600 dark:text-slate-300">Check-In</span>
          </button>
          <button class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center gap-2 hover:bg-slate-50 transition shadow-sm">
            <div class="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><Icon name="heroicons:currency-dollar" class="w-6 h-6" /></div>
            <span class="text-xs font-bold text-slate-600 dark:text-slate-300">Billing</span>
          </button>
          <button class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center gap-2 hover:bg-slate-50 transition shadow-sm">
            <div class="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Icon name="heroicons:calendar-days" class="w-6 h-6" /></div>
            <span class="text-xs font-bold text-slate-600 dark:text-slate-300">Reschedule</span>
          </button>
        </div>

        <!-- Provider Status -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 class="font-bold text-slate-800 dark:text-white mb-4 text-sm uppercase tracking-wider">Doctor Status</h3>
          <div class="space-y-4">
            <div v-for="doc in doctors" :key="doc.name" class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">DR</div>
                <div>
                  <div class="text-sm font-bold text-slate-800 dark:text-white">{{ doc.name }}</div>
                  <div class="text-xs text-slate-400">{{ doc.poli }}</div>
                </div>
              </div>
              <div
                class="w-2.5 h-2.5 rounded-full"
                :class="{
                  'bg-green-500': doc.status === 'Online',
                  'bg-red-500': doc.status === 'Busy',
                  'bg-yellow-500': doc.status === 'Away',
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
