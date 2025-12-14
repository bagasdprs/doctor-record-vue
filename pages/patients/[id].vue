<script setup lang="ts">
definePageMeta({ layout: "default" });

const route = useRoute();
const patientId = route.params.id as string;

// STATE
const isLoading = ref(true);
const isCreatingVisit = ref(false); // State loading khusus tombol visit
const patient = ref<any>(null);
const activeTab = ref("visit-timeline");

// STATE MODAL
const showEditModal = ref(false);

// Fungsi Hitung Umur (Utility)
const calculateAge = (dateString: string) => {
  if (!dateString) return "-";
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

// FORMAT DATE
const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

// Fetch API Actions
const fetchDetail = async () => {
  isLoading.value = true;
  try {
    const res = await $fetch<any>(`/api/patients/${patientId}`);
    if (res.success) {
      patient.value = res.data;
    }
  } catch (err) {
    console.error(err);
    // alert("Gagal memuat data pasien."); // Silent error biar ga ganggu UI
  } finally {
    isLoading.value = false;
  }
};

// Open Modal
const openEditModal = () => {
  showEditModal.value = true;
};

// Handle Refresh From Modal
const handleRefresh = () => {
  fetchDetail();
};

// --- 🔥 LOGIC BARU: START VISIT REAL-TIME 🔥 ---
const startVisit = async () => {
  // Cegah klik ganda
  if (isCreatingVisit.value) return;

  if (!confirm("Mulai sesi konsultasi sekarang? Waktu Check-In akan dicatat.")) return;

  isCreatingVisit.value = true;

  try {
    // 1. Tembak API Create dulu biar WAKTU TERCATAT di Database (Real-time)
    const res = await $fetch<any>("/api/consultations/create", {
      method: "POST",
      body: {
        patientId: patientId,
        // Kita bisa kirim data awal lain jika perlu
      },
    });

    if (res.success) {
      // 2. Sukses! Data masuk DB dengan jam sekarang.
      // 3. Pindah ke Live Record bawa ID pasien & Nama buat header
      navigateTo({
        path: "/consultation/live-record",
        query: {
          patientId: patientId,
          patientName: patient.value.name, // Kirim nama biar header live-record gak 'John Appleseed'
          patientInfo: `${calculateAge(patient.value.birthDate)}yo • ${patient.value.gender}`,
        },
      });
    }
  } catch (error: any) {
    console.error("Gagal start visit:", error);
    alert("Gagal memulai sesi. Cek koneksi atau coba lagi.");
  } finally {
    isCreatingVisit.value = false;
  }
};

const goBack = () => {
  const source = route.query.source;

  if (source === "dashboard") {
    navigateTo("/dashboard");
  } else {
    navigateTo("/patients");
  }
};

onMounted(() => {
  fetchDetail();
});
</script>

<template>
  <div class="min-h-screen">
    <!-- LOADING -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center h-96 gap-4">
      <Icon name="svg-spinners:ring-resize" class="w-10 h-10 text-slate-300" />
      <p class="text-slate-500 font-medium">Loading Medical Record...</p>
    </div>

    <!-- MAIN CONTENT -->
    <div v-else-if="patient" class="animate-fade-in">
      <!-- NAVIGASI BALIK -->
      <div class="mb-6 flex items-center gap-4">
        <button @click="goBack" class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition group">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 text-slate-500 group-hover:text-slate-800 dark:group-hover:text-white transition-colors" />
        </button>
        <h1 class="text-xl font-bold text-slate-900 dark:text-white">Patient Profile</h1>
      </div>

      <!-- GRID LAYOUT -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- === KOLOM KIRI (PROFIL & VITALS) === -->
        <div class="lg:col-span-4 space-y-6">
          <!-- 1. PROFIL CARD -->
          <div class="bg-white dark:bg-slate-800 rounded-4xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 text-center relative overflow-hidden">
            <!-- Hiasan Atas -->
            <div class="absolute top-0 left-0 w-full h-28 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-800 z-0"></div>

            <div class="relative z-10">
              <img :src="patient.avatarUrl || 'https://i.pravatar.cc/150?u=default'" class="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md mx-auto mb-3 bg-white" />

              <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">{{ patient.name }}</h2>

              <!-- HEALTH PULSE -->
              <div class="flex items-center justify-center gap-2 mb-6">
                <svg class="w-12 h-6 text-emerald-500" viewBox="0 0 50 20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M0 10 H10 L15 0 L25 20 L30 10 H50" />
                </svg>
                <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100"> {{ patient.history?.length || 0 }} Visits </span>
              </div>

              <!-- Info Demografi -->
              <div class="flex justify-center gap-4 text-sm text-slate-600 dark:text-slate-300 mb-8 border-t border-b border-slate-100 dark:border-slate-700 py-4">
                <div class="flex flex-col items-center">
                  <span class="font-bold text-slate-900 dark:text-white">{{ formatDate(patient.birthDate) }}</span>
                  <span class="text-[10px] text-slate-400 uppercase tracking-wide">DOB</span>
                </div>
                <div class="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                <div class="flex flex-col items-center">
                  <span class="font-bold text-slate-900 dark:text-white">{{ calculateAge(patient.birthDate) }} Yo</span>
                  <span class="text-[10px] text-slate-400 uppercase tracking-wide">Age</span>
                </div>
                <div class="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                <div class="flex flex-col items-center">
                  <span class="font-bold text-slate-900 dark:text-white">{{ patient.gender }}</span>
                  <span class="text-[10px] text-slate-400 uppercase tracking-wide">Sex</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="grid grid-cols-2 gap-3">
                <button @click="openEditModal" class="py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                  Edit Profile
                </button>

                <!-- TOMBOL START VISIT YANG SUDAH DI-UPDATE -->
                <button
                  @click="startVisit"
                  :disabled="isCreatingVisit"
                  class="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Icon v-if="isCreatingVisit" name="svg-spinners:ring-resize" class="w-4 h-4" />
                  <span>{{ isCreatingVisit ? "Starting..." : "Start Visit" }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 2. CRITICAL ALERT -->
          <div v-if="patient.allergies" class="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-2xl p-5 flex items-start gap-4 shadow-sm animate-pulse">
            <div class="bg-red-100 dark:bg-red-800 p-2 rounded-lg text-red-600 dark:text-red-200 shrink-0">
              <Icon name="heroicons:exclamation-triangle" class="w-6 h-6" />
            </div>
            <div>
              <h4 class="font-bold text-red-700 dark:text-red-400 text-sm uppercase tracking-wider mb-1">Critical Alert</h4>
              <p class="font-bold text-slate-800 dark:text-white text-lg leading-tight">{{ patient.allergies }}</p>
              <p class="text-xs text-red-600/70 dark:text-red-300/70 mt-1">Causes severe reaction. Do not administer.</p>
            </div>
          </div>

          <!-- 3. VITALS WIDGET -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <h4 class="font-bold text-slate-900 dark:text-white flex items-center gap-2"><Icon name="heroicons:heart" class="w-5 h-5 text-pink-500" /> Latest Vitals</h4>
              <span class="text-xs text-slate-400">Recorded: Profile</span>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-600">
                <p class="text-[10px] text-slate-400 uppercase font-bold mb-1">Blood Pressure</p>
                <p class="font-bold text-slate-800 dark:text-white text-lg">120/80</p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-600">
                <p class="text-[10px] text-slate-400 uppercase font-bold mb-1">Weight</p>
                <p class="font-bold text-slate-800 dark:text-white text-lg">{{ patient.weight || "-" }} <span class="text-sm font-normal text-slate-400">kg</span></p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-600">
                <p class="text-[10px] text-slate-400 uppercase font-bold mb-1">Height</p>
                <p class="font-bold text-slate-800 dark:text-white text-lg">{{ patient.height || "-" }} <span class="text-sm font-normal text-slate-400">cm</span></p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-600">
                <p class="text-[10px] text-slate-400 uppercase font-bold mb-1">Blood Type</p>
                <p class="font-bold text-slate-800 dark:text-white text-lg">{{ patient.bloodType || "-" }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- === KOLOM KANAN (TABS & HISTORY) === -->
        <div class="lg:col-span-8">
          <!-- Tabs Navigation -->
          <div class="flex border-b border-slate-200 dark:border-slate-700 mb-6 gap-8">
            <button
              @click="activeTab = 'visit-timeline'"
              class="pb-3 text-sm font-bold border-b-2 transition-all"
              :class="activeTab === 'visit-timeline' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'"
            >
              Visit Timeline
            </button>
            <button
              @click="activeTab = 'medical-history'"
              class="pb-3 text-sm font-bold border-b-2 transition-all"
              :class="activeTab === 'medical-history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'"
            >
              Medical History
            </button>
          </div>

          <!-- CONTENT: VISIT TIMELINE -->
          <div v-if="activeTab === 'visit-timeline'" class="space-y-8 relative pl-4 pb-12">
            <!-- Garis Vertikal -->
            <div class="absolute left-[26px] top-4 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 z-0"></div>

            <!-- Loop Riwayat -->
            <div v-for="visit in patient.history" :key="visit.id" class="relative z-10 pl-10 group">
              <!-- Dot Tanggal -->
              <div
                class="absolute left-0 top-0 w-[54px] h-[54px] flex flex-col items-center justify-center bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm text-center group-hover:border-blue-500 group-hover:text-blue-600 transition-colors z-20"
              >
                <span class="text-[10px] font-bold text-slate-400 uppercase leading-none mb-0.5">{{ new Date(visit.createdAt).toLocaleString("default", { month: "short" }) }}</span>
                <span class="text-xl font-black text-slate-800 dark:text-white leading-none">{{ new Date(visit.createdAt).getDate() }}</span>
              </div>

              <!-- Card Visit -->
              <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition cursor-pointer group-hover:border-blue-200 dark:group-hover:border-blue-900">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h4 class="font-bold text-slate-900 dark:text-white text-lg">
                      {{ visit.assessment ? visit.assessment : "Routine Consultation" }}
                    </h4>
                    <p class="text-xs text-slate-400 mt-1">Dr. {{ visit.doctorName || "Unknown" }} • {{ visit.doctorSpecialization || "GP" }}</p>
                  </div>
                  <button class="text-blue-600 text-xs font-bold bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full hover:bg-blue-100 transition">View Details</button>
                </div>

                <div class="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div class="mb-2">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Symptoms</span>
                    <p class="text-sm text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">{{ visit.subjective || "No specific symptoms recorded." }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="!patient.history || patient.history.length === 0" class="text-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 ml-10">
              <Icon name="heroicons:clock" class="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 class="font-bold text-slate-600 dark:text-slate-400">No Medical History</h4>
              <p class="text-sm text-slate-400">This patient hasn't visited the clinic yet.</p>
            </div>
          </div>

          <!-- CONTENT: MEDICAL HISTORY -->
          <div v-if="activeTab === 'medical-history'" class="space-y-4 animate-fade-in">
            <!-- Chronic Conditions -->
            <div class="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/30">
              <div class="flex items-center gap-3 mb-4">
                <div class="bg-indigo-100 dark:bg-indigo-800 p-2 rounded-lg text-indigo-600 dark:text-indigo-200">
                  <Icon name="heroicons:heart-solid" class="w-5 h-5" />
                </div>
                <h3 class="font-bold text-slate-900 dark:text-white">Chronic Conditions</h3>
              </div>
              <ul class="list-disc list-inside text-sm text-slate-700 dark:text-slate-300 ml-2 space-y-2">
                <li v-if="patient.chronicConditions">{{ patient.chronicConditions }}</li>
                <li v-else class="italic text-slate-500">No chronic conditions recorded.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL EDIT -->
    <PatientFormModal :is-open="showEditModal" :is-editing="true" :editing-id="patientId" :initial-data="patient" @close="showEditModal = false" @refresh="handleRefresh" />
  </div>
</template>
