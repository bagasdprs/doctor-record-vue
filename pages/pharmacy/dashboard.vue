<script setup lang="ts">
definePageMeta({ layout: "default" });

// Mock Data Antrian Resep
const prescriptionQueue = ref([
  { id: "RX-001", patient: "Budi Santoso", drug: "Amoxicillin 500mg", status: "Pending", doctor: "Dr. Bagas" },
  { id: "RX-002", patient: "Sarah Wijaya", drug: "Paracetamol Syrup", status: "Processing", doctor: "Dr. Emily" },
  { id: "RX-003", patient: "James Bond", drug: "Ceterizine 10mg", status: "Ready", doctor: "Dr. Mark" },
]);

// Mock Data Alert
const expiryAlerts = ref([
  { name: "Amoxicillin 500mg", batch: "#4492", daysLeft: 2, type: "danger" },
  { name: "Ibuprofen 200mg", batch: "#2011", daysLeft: 15, type: "warning" },
]);
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="mb-8 flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Pharmacy Portal</h1>
        <p class="text-slate-500">Manajemen Stok & Antrian Resep</p>
      </div>
      <div class="flex gap-2">
        <input type="text" placeholder="Scan Barcode / ID..." class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
      </div>
    </div>

    <!-- 1. KPI CARDS (Green Theme) -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="p-6 rounded-2xl bg-emerald-900 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden">
        <div class="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
        <div class="text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">Total Dispensed</div>
        <div class="text-4xl font-black">142</div>
        <div class="text-xs text-emerald-300 mt-2 flex items-center gap-1"><Icon name="heroicons:arrow-trending-up" class="w-3 h-3" /> +12% today</div>
      </div>

      <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div class="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Pending Verification</div>
        <div class="text-3xl font-black text-orange-500">12</div>
        <div class="text-xs text-slate-400 mt-2">Butuh review apoteker</div>
      </div>

      <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div class="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Critical Stock</div>
        <div class="text-3xl font-black text-red-500">8</div>
        <div class="text-xs text-slate-400 mt-2">Items need restock</div>
      </div>

      <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div class="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Expiring Soon</div>
        <div class="text-3xl font-black text-yellow-500">5</div>
        <div class="text-xs text-slate-400 mt-2">In next 30 days</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 2. LIVE PRESCRIPTION QUEUE (Kanban Style List) -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Icon name="heroicons:clipboard-document-list" class="w-5 h-5 text-emerald-500" /> Live Queue</h3>
          <button class="text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-200 transition">Print All</button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="text-slate-400 font-bold uppercase border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th class="pb-3">Patient</th>
                <th class="pb-3">Medication</th>
                <th class="pb-3">Status</th>
                <th class="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
              <tr v-for="rx in prescriptionQueue" :key="rx.id" class="group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                <td class="py-3 font-medium text-slate-800 dark:text-white">
                  {{ rx.patient }}
                  <div class="text-[10px] text-slate-400">{{ rx.id }}</div>
                </td>
                <td class="py-3 text-slate-600 dark:text-slate-300">{{ rx.drug }}</td>
                <td class="py-3">
                  <span
                    class="px-2 py-1 rounded text-xs font-bold"
                    :class="{
                      'bg-orange-100 text-orange-700': rx.status === 'Pending',
                      'bg-blue-100 text-blue-700': rx.status === 'Processing',
                      'bg-emerald-100 text-emerald-700': rx.status === 'Ready',
                    }"
                  >
                    {{ rx.status }}
                  </span>
                </td>
                <td class="py-3 text-right">
                  <button v-if="rx.status === 'Pending'" class="text-emerald-600 hover:underline font-bold">Dispense</button>
                  <button v-else class="text-slate-400 hover:text-slate-600">Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 3. EXPIRY ALERTS -->
      <div class="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
        <h3 class="font-bold mb-4 flex items-center gap-2 text-red-400"><Icon name="heroicons:bell-alert" class="w-5 h-5" /> Expiry Alerts</h3>
        <div class="space-y-3">
          <div v-for="item in expiryAlerts" :key="item.name" class="bg-white/10 p-4 rounded-xl border border-white/5 flex justify-between items-center">
            <div>
              <div class="font-bold text-sm">{{ item.name }}</div>
              <div class="text-xs text-slate-400">Batch: {{ item.batch }}</div>
            </div>
            <div class="text-right">
              <div class="text-xs font-bold" :class="item.type === 'danger' ? 'text-red-400' : 'text-yellow-400'">Exp: {{ item.daysLeft }} days</div>
              <button class="text-[10px] underline text-slate-400 hover:text-white mt-1">Check Shelf</button>
            </div>
          </div>
        </div>
        <button class="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition">View Full Inventory Report</button>
      </div>
    </div>
  </div>
</template>
