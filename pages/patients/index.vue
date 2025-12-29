<script setup lang="ts">
definePageMeta({ layout: "default" });

useHead({
  title: "Patient",
});

// State
const patients = ref<any[]>([]);
const search = ref("");
const showModal = ref(false);

// State loading
const isLoading = ref(true);
const isSaving = ref(false);

const fileInput = ref<HTMLInputElement | null>(null);
const activeMenuId = ref<string | null>(null);

// Form State
const form = reactive({
  name: "",
  nik: "",
  bpjsNumber: "",
  phone: "",
  gender: "Male",
  birthDate: "",
  address: "",
  avatarUrl: "",
});

const fetchPatients = async () => {
  isLoading.value = true;
  try {
    const res = await $fetch<any>("/api/patients");
    if (res.success) {
      patients.value = res.data;
    }
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const filteredPatients = computed(() => {
  if (!search.value) return patients.value;
  const q = search.value.toLowerCase();
  return patients.value.filter((p) => p.name.toLowerCase().includes(q) || (p.nik && p.nik.includes(q)) || (p.bpjsNumber && p.bpjsNumber.includes(q)) || (p.phone && p.phone.includes(q)));
});

// Toggle Menu
const toggleMenu = (id: string) => {
  activeMenuId.value = activeMenuId.value === id ? null : id;
};
const closeMenu = () => {
  activeMenuId.value = null;
};

// Check-In Logic
const createSession = async (patientId: string, patientName: string) => {
  closeMenu();
  if (!confirm(`Buat sesi konsultasi baru untuk ${patientName}?`)) return;

  try {
    const res = await $fetch<any>("/api/consultations/create", {
      method: "POST",
      body: { patientId },
    });

    if (res.success) {
      alert(`Sesi untuk ${patientName} berhasil dibuat!`);
      navigateTo("/dashboard");
    }
  } catch (error: any) {
    alert(error.statusMessage || "Gagal membuat sesi.");
  }
};

// Delete Logic
// 2. Optimasi Hapus Pasien (Instant Delete)
const deletePatient = async (id: string, name: string) => {
  closeMenu();
  if (!confirm(`Hapus pasien: ${name}?`)) return;

  const backupData = [...patients.value];
  patients.value = patients.value.filter((p) => p.id !== id);

  try {
    const res = await $fetch<any>("/api/patients/delete", {
      method: "POST",
      body: { id },
    });
  } catch (error: any) {
    alert(error.statusMessage || "Gagal menghapus.");
    patients.value = backupData;
  }
};

// Form Logic
// / 1. Optimasi Tambah Pasien (Instant Feedback)
const handleSubmit = async () => {
  isSaving.value = true;
  try {
    const res = await $fetch<any>("/api/patients/create", {
      method: "POST",
      body: { ...form },
    });

    if (res.success) {
      patients.value.unshift(res.data);
      showModal.value = false;
      resetForm();
    }
  } catch (error: any) {
    alert(error.statusMessage || "Gagal menyimpan.");
  } finally {
    isSaving.value = false;
  }
};

const triggerFileInput = () => fileInput.value?.click();
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) return alert("Max 2MB");
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) form.avatarUrl = e.target.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const resetForm = () => {
  form.name = "";
  form.nik = "";
  form.bpjsNumber = "";
  form.phone = "";
  form.gender = "Male";
  form.birthDate = "";
  form.address = "";
  form.avatarUrl = "";
};

// Function for generate avatar
const getPatientAvatar = (patient: { name: string; avatarUrl?: string }) => {
  if (patient.avatarUrl) return patient.avatarUrl;
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`;
};

onMounted(() => fetchPatients());
</script>

<template>
  <div class="min-h-screen relative">
    <!-- Backdrop Menu -->
    <div v-if="activeMenuId" @click="closeMenu" class="fixed inset-0 z-0 cursor-default"></div>

    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Patient Management</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Manage patient records, admission, and insurance data.</p>
      </div>
      <button @click="showModal = true" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition transform active:scale-95">
        <Icon name="heroicons:user-plus" class="w-5 h-5" />
        <span>Add New Patient</span>
      </button>
    </div>

    <!-- Search -->
    <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6 relative z-10">
      <div class="relative">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="heroicons:magnifying-glass" class="text-slate-400 w-5 h-5" />
        </span>
        <input
          v-model="search"
          type="text"
          placeholder="Search by Name, NIK, Phone, or BPJS..."
          class="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
        />
      </div>
    </div>

    <!-- Loading section -->
    <div v-if="isLoading" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm min-h-100 flex flex-col items-center justify-center animate-pulse relative z-10">
      <Icon name="svg-spinners:ring-resize" class="w-12 h-12 text-blue-500 mb-4" />
      <p class="text-slate-500 font-bold">Loading Patients Data...</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden relative z-10 animate-fade-in">
      <div class="overflow-x-auto min-h-100">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th class="p-4 text-xs font-bold text-slate-500 uppercase">Patient Info</th>
              <th class="p-4 text-xs font-bold text-slate-500 uppercase">NIK / Identity</th>
              <th class="p-4 text-xs font-bold text-slate-500 uppercase">Insurance</th>
              <th class="p-4 text-xs font-bold text-slate-500 uppercase">Phone</th>
              <th class="p-4 text-xs font-bold text-slate-500 uppercase">Gender / Age</th>
              <th class="p-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
            <tr v-for="p in filteredPatients" :key="p.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
              <!-- Patient Info (CLICKABLE NOW!) -->
              <td class="p-4 align-top">
                <div class="flex items-center gap-3">
                  <NuxtLink :to="{ path: `/patients/${p.id}`, query: { source: 'list' } }">
                    <img :src="getPatientAvatar(p)" class="w-10 h-10 rounded-full object-cover border bg-slate-100 hover:opacity-80 transition" />
                  </NuxtLink>
                  <div>
                    <NuxtLink :to="{ path: `/patients/${p.id}`, query: { source: 'list' } }" class="font-bold text-slate-900 dark:text-white hover:text-blue-600 hover:underline transition">
                      {{ p.name }}
                    </NuxtLink>
                    <div class="text-xs text-slate-400 line-clamp-1">{{ p.address || "No address" }}</div>
                  </div>
                </div>
              </td>

              <!-- Other Columns -->
              <td class="p-4 align-top font-mono text-sm text-slate-600 dark:text-slate-300">{{ p.nik || "-" }}</td>
              <td class="p-4 align-top">
                <span v-if="p.bpjsNumber" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <Icon name="heroicons:credit-card" class="w-3 h-3" /> {{ p.bpjsNumber }}
                </span>
                <span v-else class="text-slate-400 text-xs italic">General</span>
              </td>
              <td class="p-4 align-top text-sm text-slate-600 dark:text-slate-300">{{ p.phone || "-" }}</td>
              <td class="p-4 align-top">
                <span class="text-sm font-medium" :class="p.gender === 'Male' ? 'text-blue-600' : 'text-pink-600'">{{ p.gender }}</span>
                <div class="text-xs text-slate-400">
                  <span v-if="p.age">{{ p.age }} Years</span>
                  <span v-else-if="p.birthDate"> {{ new Date().getFullYear() - new Date(p.birthDate).getFullYear() }} Years </span>
                  <span v-else>-</span>
                </div>
              </td>

              <!-- Action Menu -->
              <td class="p-4 align-top text-right relative">
                <div class="flex justify-end gap-2">
                  <button v-if="!p.isCheckedIn" @click="createSession(p.id, p.name)" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 transition">
                    <Icon name="heroicons:play-circle" class="w-4 h-4" /> Check-In
                  </button>
                  <span v-else class="bg-slate-100 dark:bg-slate-700 text-slate-500 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-not-allowed border border-slate-200 dark:border-slate-600">
                    <Icon name="heroicons:clock" class="w-4 h-4" /> In Queue
                  </span>
                  <button @click.stop="toggleMenu(p.id)" class="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-600 transition">
                    <Icon name="heroicons:ellipsis-vertical" class="w-5 h-5" />
                  </button>
                </div>

                <!-- Dropdown -->
                <div
                  v-if="activeMenuId === p.id"
                  class="absolute right-10 top-10 z-50 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col text-left animate-fade-in"
                >
                  <!-- View Profile di Menu juga -->
                  <NuxtLink
                    :to="{ path: `/patients/${p.id}`, query: { source: 'list' } }"
                    @click="closeMenu"
                    class="w-full text-left px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700/50"
                  >
                    <Icon name="heroicons:user" class="w-4 h-4 text-blue-500" /> View Profile
                  </NuxtLink>
                  <button @click="deletePatient(p.id, p.name)" class="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3">
                    <Icon name="heroicons:trash" class="w-4 h-4" /> Delete Patient
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredPatients.length === 0">
              <td colspan="6" class="p-8 text-center text-slate-500">No patients found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form (Tetap sama seperti sebelumnya) -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">Register New Patient</h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-red-500"><Icon name="heroicons:x-mark" class="w-6 h-6" /></button>
        </div>
        <div class="p-6 overflow-y-auto">
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600">
                <img v-if="form.avatarUrl" :src="form.avatarUrl" class="w-full h-full object-cover" />
                <Icon v-else name="heroicons:camera" class="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleFileChange" />
                <button type="button" @click="triggerFileInput" class="text-sm font-bold text-blue-600 hover:underline">Upload Photo</button>
                <p class="text-xs text-slate-500">Optional. Max 2MB.</p>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Full Name *</label
                ><input v-model="form.name" required class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white" />
              </div>
              <div>
                <label class="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">NIK</label
                ><input v-model="form.nik" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white" />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Gender *</label
                ><select v-model="form.gender" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white">
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Birth Date *</label
                ><input v-model="form.birthDate" type="date" required class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white" />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">BPJS</label
                ><input v-model="form.bpjsNumber" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white" />
              </div>
              <div>
                <label class="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Phone</label
                ><input v-model="form.phone" type="text" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Address</label
              ><textarea v-model="form.address" rows="2" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg dark:text-white"></textarea>
            </div>
            <div class="pt-4 flex justify-end gap-3">
              <button type="button" @click="showModal = false" class="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" :disabled="isLoading" class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50">{{ isLoading ? "Saving..." : "Save Patient" }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
