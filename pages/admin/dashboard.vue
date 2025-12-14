<script setup lang="ts">
definePageMeta({ layout: "default" });

// Mock Data Stats
const stats = ref([
  { title: "Total Users", value: "142", trend: "+12%", trendUp: true, icon: "heroicons:users", color: "blue" },
  { title: "Total Consultations", value: "856", trend: "+5%", trendUp: true, icon: "heroicons:document-text", color: "purple" },
  { title: "Pending Approvals", value: "12", trend: "Action Req", trendUp: false, icon: "heroicons:exclamation-circle", color: "orange" },
  { title: "System Uptime", value: "99.9%", trend: "Stable", trendUp: true, icon: "heroicons:server", color: "emerald" },
]);

// Mock Data Users
const users = ref([
  { id: 1, name: "Dr. Sarah Jenkins", email: "sarah.j@medicore.com", role: "doctor", status: "Active", lastActive: "2m ago", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "Nurse Ratched", email: "nurse.r@medicore.com", role: "midwife", status: "Active", lastActive: "1h ago", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Admin User", email: "admin@medicore.com", role: "admin", status: "Active", lastActive: "5h ago", avatar: "https://i.pravatar.cc/150?u=3" },
  { id: 4, name: "Dr. Gregory House", email: "greg.h@medicore.com", role: "doctor", status: "Inactive", lastActive: "2d ago", avatar: "https://i.pravatar.cc/150?u=4" },
  { id: 5, name: "Apt. Budi", email: "budi@medicore.com", role: "pharmacist", status: "Active", lastActive: "10m ago", avatar: "https://i.pravatar.cc/150?u=5" },
]);

// Mock Data Logs
const activityLogs = ref([
  { id: 1, action: "New User Registration", desc: "Dr. Emily Stone added by Admin", time: "Just now", type: "info" },
  { id: 2, action: "System Update", desc: "Pricing module updated", time: "15m ago", type: "warning" },
  { id: 3, action: "Login Failed", desc: "3 attempts from IP 192.168.1.1", time: "2h ago", type: "danger" },
  { id: 4, action: "Backup Completed", desc: "Daily system backup success", time: "5h ago", type: "success" },
]);

// Helper Warna Role
const getRoleBadge = (role: string) => {
  switch (role) {
    case "doctor":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "midwife":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
    case "pharmacist":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "admin":
      return "bg-slate-800 text-white dark:bg-slate-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusColor = (status: string) => {
  return status === "Active" ? "bg-green-500" : "bg-slate-400";
};
</script>

<template>
  <div class="min-h-screen">
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Admin Console</h1>
        <p class="text-slate-500">Superuser Panel & System Overview</p>
      </div>
      <div class="flex gap-3">
        <div class="relative">
          <Icon name="heroicons:magnifying-glass" class="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
          <input type="text" placeholder="Search system..." class="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64" />
        </div>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition"><Icon name="heroicons:plus" class="w-5 h-5" /> Quick Action</button>
      </div>
    </div>

    <!-- 1. STATS CARDS (Top Row) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.title" class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:border-blue-500/50 transition duration-300">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-slate-500 text-xs font-bold uppercase tracking-wider">{{ stat.title }}</p>
            <h3 class="text-3xl font-black text-slate-900 dark:text-white mt-1">{{ stat.value }}</h3>
          </div>
          <div :class="`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400`">
            <Icon :name="stat.icon" class="w-6 h-6" />
          </div>
        </div>
        <div class="flex items-center gap-2 text-xs font-bold">
          <span :class="stat.trendUp ? 'text-green-500' : 'text-red-500 bg-red-100 px-1.5 py-0.5 rounded'">
            {{ stat.trend }}
          </span>
          <span class="text-slate-400 font-normal">vs last month</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 2. USER MANAGEMENT TABLE (Main - Left) -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
        <div class="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white">User Management</h3>
          <div class="flex gap-2">
            <button class="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">Filter</button>
            <button class="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">Export</button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase text-xs">
              <tr>
                <th class="px-6 py-4">Name</th>
                <th class="px-6 py-4">Role</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4">Last Active</th>
                <th class="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
              <tr v-for="u in users" :key="u.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                <td class="px-6 py-4 flex items-center gap-3">
                  <img :src="u.avatar" class="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-600" />
                  <div>
                    <div class="font-bold text-slate-900 dark:text-white">{{ u.name }}</div>
                    <div class="text-xs text-slate-400">{{ u.email }}</div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border border-transparent" :class="getRoleBadge(u.role)">
                    {{ u.role }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full" :class="getStatusColor(u.status)"></span>
                    <span class="text-slate-600 dark:text-slate-300 font-medium">{{ u.status }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-500">{{ u.lastActive }}</td>
                <td class="px-6 py-4 text-right">
                  <button class="text-slate-400 hover:text-blue-600 mr-3"><Icon name="heroicons:pencil-square" class="w-5 h-5" /></button>
                  <button class="text-slate-400 hover:text-red-600"><Icon name="heroicons:trash" class="w-5 h-5" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Mockup -->
        <div class="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs text-slate-500">
          <span>Showing 1-5 of 24 users</span>
          <div class="flex gap-1">
            <button class="px-3 py-1 border rounded hover:bg-slate-50 dark:hover:bg-slate-700">Prev</button>
            <button class="px-3 py-1 border rounded hover:bg-slate-50 dark:hover:bg-slate-700">Next</button>
          </div>
        </div>
      </div>

      <!-- 3. LIVE ACTIVITY LOG & SYSTEM STATUS (Sidebar - Right) -->
      <div class="space-y-8">
        <!-- Live Activity -->
        <div class="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
          <h3 class="font-bold mb-6 text-lg">Live Activity</h3>
          <div class="space-y-6 relative">
            <!-- Garis Timeline -->
            <div class="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-700"></div>

            <div v-for="log in activityLogs" :key="log.id" class="relative pl-6">
              <!-- Dot Indicator -->
              <div
                class="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-slate-900"
                :class="{
                  'bg-blue-500': log.type === 'info',
                  'bg-yellow-500': log.type === 'warning',
                  'bg-red-500': log.type === 'danger',
                  'bg-green-500': log.type === 'success',
                }"
              ></div>

              <p class="text-xs text-slate-400 mb-0.5">{{ log.time }}</p>
              <h4 class="font-bold text-sm">{{ log.action }}</h4>
              <p class="text-xs text-slate-400 mt-1">{{ log.desc }}</p>
            </div>

            <button class="text-xs font-bold text-blue-400 hover:text-blue-300 mt-4 block w-full text-center">VIEW ALL LOGS</button>
          </div>
        </div>

        <!-- Clinic Status -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-slate-900 dark:text-white">System Status</h3>
            <span class="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold flex items-center gap-1"> <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Operational </span>
          </div>

          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"><Icon name="heroicons:lock-closed" class="w-4 h-4" /> Patient Portal</span>
              <div class="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer"><div class="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
            </div>
            <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"><Icon name="heroicons:clock" class="w-4 h-4" /> Auto-Scheduling</span>
              <div class="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer"><div class="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
