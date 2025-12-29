<script setup lang="ts">
definePageMeta({ layout: "default" });

const route = useRoute();
const patientId = computed(() => route.params.id as string);

const {
  data: patient,
  status,
  refresh,
  error,
} = await useFetch<any>(`/api/patients/${patientId.value}`, {
  key: `patient-${patientId.value}`,
  transform: (res: any) => res.data || null,
});

// Computed loading dari status useFetch
const isLoading = computed(() => status.value === "pending");

// Set Title Dinamis (SEO Friendly)
useHead({
  title: computed(() => (patient.value ? `${patient.value.name} | Profile` : "Loading Patient...")),
});

// STATE LAINNYA
const isCreatingVisit = ref(false);
const activeTab = ref("visit-timeline");
const showEditModal = ref(false);
const isUpdating = ref(false);

// --- HELPER FUNCTIONS ---
const calculateAge = (dateString: string) => {
  if (!dateString) return "-";
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};
const getPatientAvatar = (p: any) => {
  if (p?.avatarUrl) return p.avatarUrl;
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${p?.name || "User"}`;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

// --- ACTION HANDLERS ---
const startVisit = async () => {
  if (isCreatingVisit.value) return;
  if (!confirm("Mulai sesi konsultasi sekarang?")) return;

  isCreatingVisit.value = true;
  try {
    const res = await $fetch<any>("/api/consultations/create", {
      method: "POST",
      body: { patientId: patientId.value },
    });
    if (res.success) {
      await navigateTo({
        path: "/consultation/live-record",
        query: {
          patientId: patientId.value,
          patientName: patient.value.name,
          patientInfo: `${calculateAge(patient.value.birthDate)}yo • ${patient.value.gender}`,
        },
      });
    }
  } catch (err: any) {
    alert("Gagal memulai sesi: " + (err.statusMessage || "Error Server"));
  } finally {
    isCreatingVisit.value = false;
  }
};

// Fungsi Back yang lebih aman
const goBack = () => {
  const source = route.query.source;
  if (source === "dashboard") navigateTo("/dashboard");
  else navigateTo("/patients");
};

// 1. Siapkan Wadah Form Edit
const editForm = reactive({
  id: "",
  name: "",
  nik: "",
  bpjsNumber: "",
  phone: "",
  gender: "Male",
  birthDate: "",
  address: "",
  allergies: "",
  bloodType: "",
  chronicConditions: "",
});

// 2. Fungsi Ajaib: "Copy Data" (Dipanggil pas tombol Edit diklik)
const openEditModal = () => {
  if (patient.value) {
    // Salin data dari tampilan ke Form
    editForm.id = patient.value.id;
    editForm.name = patient.value.name;
    editForm.nik = patient.value.nik || "";
    editForm.bpjsNumber = patient.value.bpjsNumber || "";
    editForm.phone = patient.value.phone || "";
    editForm.gender = patient.value.gender || "Male";

    // Format tanggal biar masuk ke input type="date" (YYYY-MM-DD)
    if (patient.value.birthDate) {
      editForm.birthDate = new Date(patient.value.birthDate).toISOString().split("T")[0] || "";
    }

    editForm.address = patient.value.address || "";
    editForm.allergies = patient.value.allergies || "";
    editForm.bloodType = patient.value.bloodType || "";
    editForm.chronicConditions = patient.value.chronicConditions || "";

    // Baru munculin modalnya
    showEditModal.value = true;
  }
};

const saveChanges = async () => {
  isUpdating.value = true;
  try {
    const res = await $fetch<any>("/api/patients/update", {
      method: "POST",
      body: editForm,
    });

    if (res.success) {
      showEditModal.value = false;
      refresh(); // Refresh data tanpa reload
      alert("Data berhasil diperbarui!");
    }
  } catch (err) {
    console.error(err);
    alert("Gagal update data!");
  } finally {
    isUpdating.value = false;
  }
};

const handleRefresh = () => refresh();
</script>

<template>
  <div class="min-h-screen relative">
    <div v-if="isLoading" class="flex flex-col items-center justify-center h-96 gap-4 animate-pulse">
      <Icon name="svg-spinners:ring-resize" class="w-12 h-12 text-blue-500" />
      <p class="text-slate-500 font-bold">Mengambil Data Pasien...</p>
    </div>

    <div v-else-if="error || !patient" class="flex flex-col items-center justify-center h-96 gap-4">
      <Icon name="heroicons:exclamation-circle" class="w-16 h-16 text-red-500" />
      <h3 class="text-xl font-bold text-slate-800 dark:text-white">Pasien Tidak Ditemukan</h3>
      <button @click="goBack" class="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg font-bold">Kembali</button>
    </div>

    <div v-else class="animate-fade-in pb-12">
      <div class="mb-6 flex items-center gap-4">
        <button @click="goBack" class="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Medical Record</h1>
          <p class="text-sm text-slate-500">Detail rekam medis dan riwayat kunjungan.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 text-center relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-blue-50 to-white dark:from-slate-700 dark:to-slate-800 z-0"></div>

            <div class="relative z-10 pt-4">
              <img :src="getPatientAvatar(patient)" class="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md mx-auto mb-4 bg-white" />

              <h2 class="text-2xl font-bold text-slate-900 dark:text-white">{{ patient.name }}</h2>
              <p class="text-slate-500 text-sm mb-4">{{ patient.phone || "No Phone" }}</p>

              <div class="flex justify-center gap-4 text-sm mb-6 border-y border-slate-100 dark:border-slate-700 py-4">
                <div class="text-center px-4">
                  <div class="font-bold text-slate-900 dark:text-white text-lg">{{ calculateAge(patient.birthDate) }}</div>
                  <div class="text-[10px] text-slate-400 font-bold uppercase">Years Old</div>
                </div>
                <div class="w-px bg-slate-200 dark:bg-slate-700"></div>
                <div class="text-center px-4">
                  <div class="font-bold text-slate-900 dark:text-white text-lg">{{ patient.bloodType || "-" }}</div>
                  <div class="text-[10px] text-slate-400 font-bold uppercase">Blood</div>
                </div>
                <div class="w-px bg-slate-200 dark:bg-slate-700"></div>
                <div class="text-center px-4">
                  <div class="font-bold text-slate-900 dark:text-white text-lg">{{ patient.gender === "Male" ? "M" : "F" }}</div>
                  <div class="text-[10px] text-slate-400 font-bold uppercase">Sex</div>
                </div>
              </div>

              <div class="flex flex-col gap-3">
                <button @click="startVisit" :disabled="isCreatingVisit" class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2">
                  <Icon v-if="isCreatingVisit" name="svg-spinners:ring-resize" class="w-5 h-5" />
                  <span>{{ isCreatingVisit ? "Memulai Sesi..." : "Start Consultation" }}</span>
                </button>
                <button @click="openEditModal" class="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                  <Icon name="heroicons:pencil-square" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          <div v-if="patient.allergies" class="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-2xl p-5 flex gap-4 animate-pulse">
            <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 text-red-500 shrink-0" />
            <div>
              <h4 class="font-bold text-red-700 dark:text-red-400 text-sm uppercase">Allergy Alert</h4>
              <p class="font-bold text-slate-900 dark:text-white">{{ patient.allergies }}</p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8">
          <div class="flex border-b border-slate-200 dark:border-slate-700 mb-6">
            <button
              @click="activeTab = 'visit-timeline'"
              class="px-6 py-3 text-sm font-bold border-b-2 transition-colors"
              :class="activeTab === 'visit-timeline' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'"
            >
              Visit Timeline
            </button>
            <button
              @click="activeTab = 'medical-history'"
              class="px-6 py-3 text-sm font-bold border-b-2 transition-colors"
              :class="activeTab === 'medical-history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'"
            >
              Conditions & Info
            </button>
          </div>

          <div v-if="activeTab === 'visit-timeline'" class="space-y-6">
            <div v-if="!patient.history || patient.history.length === 0" class="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <p class="text-slate-500">Belum ada riwayat kunjungan.</p>
            </div>

            <div v-else v-for="visit in patient.history" :key="visit.id" class="flex gap-4 group">
              <div class="flex flex-col items-center min-w-15">
                <span class="text-xs font-bold text-slate-400 uppercase">{{ new Date(visit.createdAt).toLocaleString("default", { month: "short" }) }}</span>
                <span class="text-2xl font-black text-slate-800 dark:text-white">{{ new Date(visit.createdAt).getDate() }}</span>
                <div class="w-0.5 h-full bg-slate-200 dark:bg-slate-700 mt-2 group-last:hidden"></div>
              </div>

              <div class="flex-1 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition mb-6">
                <h4 class="font-bold text-lg text-slate-900 dark:text-white">{{ visit.assessment || "Pemeriksaan Rutin" }}</h4>
                <p class="text-xs text-slate-500 mb-3">Dr. {{ visit.doctorName }} • {{ visit.doctorSpecialization }}</p>
                <div class="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                  <span class="font-bold text-slate-400 text-xs uppercase block mb-1">Keluhan (Subjective)</span>
                  {{ visit.subjective || "-" }}
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'medical-history'" class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 class="font-bold text-slate-900 dark:text-white mb-4">Riwayat Penyakit Kronis</h3>
            <p class="text-slate-600 dark:text-slate-300">{{ patient.chronicConditions || "Tidak ada data penyakit kronis." }}</p>

            <h3 class="font-bold text-slate-900 dark:text-white mt-6 mb-4">Alamat Domisili</h3>
            <p class="text-slate-600 dark:text-slate-300">{{ patient.address || "-" }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fade-in">
        <div class="p-4 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
          <h3 class="font-bold text-lg dark:text-white">Edit Data Pasien</h3>
          <button @click="showEditModal = false"><Icon name="heroicons:x-mark" class="w-6 h-6" /></button>
        </div>

        <div class="p-6 overflow-y-auto space-y-4">
          <div>
            <label class="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Nama Lengkap</label>
            <input v-model="editForm.name" type="text" class="w-full border rounded-lg p-2 dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Gol. Darah</label>
              <select v-model="editForm.bloodType" class="w-full border rounded-lg p-2 dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                <option value="">-</option>
                <option>A</option>
                <option>B</option>
                <option>AB</option>
                <option>O</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Alergi</label>
              <input v-model="editForm.allergies" type="text" class="w-full border rounded-lg p-2 dark:bg-slate-900 dark:border-slate-700 dark:text-white" placeholder="Contoh: Udang, Obat..." />
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Alamat</label>
            <textarea v-model="editForm.address" rows="2" class="w-full border rounded-lg p-2 dark:bg-slate-900 dark:border-slate-700 dark:text-white"></textarea>
          </div>
        </div>

        <div class="p-4 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-end gap-2">
          <button @click="showEditModal = false" class="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition">Batal</button>
          <button @click="saveChanges" :disabled="isUpdating" class="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition">
            <Icon v-if="isUpdating" name="svg-spinners:ring-resize" />
            {{ isUpdating ? "Menyimpan..." : "Simpan Perubahan" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
