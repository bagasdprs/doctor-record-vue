<script setup lang="ts">
// Layout default
definePageMeta({
  layout: "default",
});

useHead({
  title: "Record Live Consultation",
});

const route = useRoute();

// --- STATE DINAMIS ---
const patientId = route.query.patientId as string;
const patientName = ref((route.query.patientName as string) || "Patient");
const patientInfo = ref((route.query.patientInfo as string) || "");

// --- STATE APLIKASI ---
const isRecording = ref(false);
const isPaused = ref(false);
const transcript = ref("");
const isGenerating = ref(false);
const isSaving = ref(false);

// State untuk Modal Popup
const showReviewModal = ref(false);

// State Form SOAP
const soapForm = reactive({
  subjective: "",
  objective: "",
  assessment: "",
  plan: "",
});

// Timer State & Logic (Sama seperti sebelumnya, disingkat biar fokus ke Save)
const totalSeconds = ref(0);
let timerInterval: NodeJS.Timeout | null = null;
const displayHours = computed(() =>
  Math.floor(totalSeconds.value / 3600)
    .toString()
    .padStart(2, "0")
);
const displayMinutes = computed(() =>
  Math.floor((totalSeconds.value % 3600) / 60)
    .toString()
    .padStart(2, "0")
);
const displaySeconds = computed(() => (totalSeconds.value % 60).toString().padStart(2, "0"));

const startTimer = () => {
  timerInterval = setInterval(() => {
    totalSeconds.value++;
  }, 1000);
};
const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

const toggleRecording = () => {
  if (!isRecording.value) {
    isRecording.value = true;
    isPaused.value = false;
    transcript.value = "";
    startTimer();
    // Simulasi Transkrip
    setTimeout(() => {
      if (isRecording.value) transcript.value = "Pasien mengeluh sakit kepala sebelah kanan sejak 2 hari lalu. Terasa berdenyut. Mual jika melihat cahaya terang.";
    }, 1500);
  } else {
    isRecording.value = false;
    isPaused.value = false;
    stopTimer();
  }
};

const togglePause = () => {
  if (!isRecording.value) return;
  isPaused.value = !isPaused.value;
  if (isPaused.value) {
    stopTimer();
  } else {
    startTimer();
  }
};

// GENERATE SOAP
const generateSOAP = () => {
  isGenerating.value = true;
  setTimeout(() => {
    isGenerating.value = false;
    showReviewModal.value = true;

    // Isi Data Dummy SOAP
    soapForm.subjective = transcript.value || "Sakit kepala unilateral, pulsating, photophobia.";
    soapForm.objective = "BP: 120/80 mmHg. Tidak ada defisit neurologis.";
    soapForm.assessment = "Migraine without Aura";
    soapForm.plan = "Paracetamol 500mg, Istirahat di ruang gelap.";
  }, 1500);
};

// 🔥🔥🔥 FUNGSI SAVE YANG SUDAH DIPERBAIKI 🔥🔥🔥
const saveConsultation = async () => {
  if (!patientId) {
    alert("Error: ID Pasien tidak ditemukan. Mohon ulangi dari halaman daftar pasien.");
    return;
  }

  isSaving.value = true;

  try {
    // Kirim Paket ke API Backend
    const res = await $fetch("/api/consultations/create", {
      method: "POST",
      body: {
        patientId: patientId,
        transcript: transcript.value, // Transkrip asli
        duration: totalSeconds.value,

        // Data SOAP Lengkap
        subjective: soapForm.subjective,
        objective: soapForm.objective,
        assessment: soapForm.assessment,
        plan: soapForm.plan,

        // Ringkasan untuk tampilan tabel depan
        summary: `${soapForm.assessment}`,
      },
    });

    if (res.success) {
      showReviewModal.value = false;
      // Redirect balik ke Index (List)
      navigateTo("/consultation");
    }
  } catch (error) {
    console.error(error);
    alert("Gagal menyimpan konsultasi. Cek console.");
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen pb-20 relative">
    <!-- HEADER -->
    <div class="mb-6">
      <NuxtLink to="/consultation" class="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition text-sm"> <Icon name="heroicons:arrow-left" class="w-4 h-4" /> Kembali ke Antrian </NuxtLink>
    </div>

    <!-- PATIENT HEADER INFO -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-1">Konsultasi: {{ patientName }}</h1>
        <div class="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
          <span class="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">{{ patientInfo }}</span>
        </div>
      </div>

      <!-- TIMER -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-2xl shadow-sm flex items-center gap-6">
        <div class="text-center">
          <div class="text-2xl font-bold font-mono text-slate-900 dark:text-white">{{ displayHours }}</div>
        </div>
        <div class="text-2xl font-bold text-slate-300">:</div>
        <div class="text-center">
          <div class="text-2xl font-bold font-mono text-slate-900 dark:text-white">{{ displayMinutes }}</div>
        </div>
        <div class="text-2xl font-bold text-slate-300">:</div>
        <div class="text-center">
          <div class="text-2xl font-bold font-mono transition-colors" :class="isRecording && !isPaused ? 'text-red-500 animate-pulse' : 'text-slate-900 dark:text-white'">{{ displaySeconds }}</div>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      <!-- KOLOM KIRI: KONTROL -->
      <div class="space-y-6">
        <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2"><Icon name="heroicons:microphone" class="w-5 h-5 text-blue-500" /> Rekaman Suara</h3>

          <div class="bg-slate-900 h-48 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden border border-slate-800">
            <div class="flex items-center gap-1.5 h-full opacity-80" :class="!isRecording || isPaused ? 'opacity-20' : ''">
              <div class="w-1.5 bg-emerald-500 rounded-full h-8" :class="!isRecording || isPaused ? '' : 'animate-bounce'"></div>
              <div class="w-1.5 bg-blue-500 rounded-full h-16" :class="!isRecording || isPaused ? '' : 'animate-[bounce_1.2s_infinite]'"></div>
              <div class="w-1.5 bg-purple-500 rounded-full h-10" :class="!isRecording || isPaused ? '' : 'animate-bounce'"></div>
            </div>
            <div v-if="!isRecording" class="absolute text-center text-slate-400">
              <p>Tekan tombol rekam untuk mulai.</p>
            </div>
          </div>

          <div class="flex items-center justify-center gap-4">
            <button @click="togglePause" :disabled="!isRecording" class="w-16 h-16 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
              <Icon :name="isPaused ? 'heroicons:play-solid' : 'heroicons:pause-solid'" class="w-6 h-6" />
            </button>
            <button @click="toggleRecording" class="w-24 h-24 rounded-full flex items-center justify-center text-white transition transform active:scale-90" :class="isRecording ? 'bg-red-600' : 'bg-blue-600'">
              <Icon :name="isRecording ? 'heroicons:stop-solid' : 'heroicons:microphone-solid'" class="w-10 h-10" />
            </button>
            <button
              @click="generateSOAP"
              :disabled="!transcript || isGenerating || isRecording"
              class="w-16 h-16 rounded-full flex flex-col items-center justify-center bg-emerald-600 text-white disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <Icon v-if="isGenerating" name="svg-spinners:ring-resize" class="w-5 h-5 animate-spin" />
              <Icon v-else name="heroicons:sparkles" class="w-5 h-5" />
              <span class="text-[10px] font-bold mt-1">SOAP</span>
            </button>
          </div>
        </div>
      </div>

      <!-- KOLOM KANAN: TRANSKRIP -->
      <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-y-auto max-h-[80vh]">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Transkrip Live</h3>
        <div class="min-h-75 whitespace-pre-wrap text-base leading-relaxed p-4 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
          {{ transcript || "Belum ada percakapan..." }}
        </div>
      </div>
    </div>

    <!-- MODAL POPUP REVIEW SOAP -->
    <Transition name="fade">
      <div v-if="showReviewModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
        <div class="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div class="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-blue-50 dark:bg-blue-900/20">
            <h2 class="text-xl font-bold text-blue-800 dark:text-blue-300">Review SOAP & Finalisasi</h2>
            <button @click="showReviewModal = false"><Icon name="heroicons:x-mark" class="w-6 h-6" /></button>
          </div>

          <div class="p-8 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-900/30 custom-scrollbar">
            <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <label class="block text-xs font-bold uppercase text-slate-500 mb-2">Subjective</label>
              <textarea v-model="soapForm.subjective" rows="3" class="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-800 dark:text-white"></textarea>
            </div>
            <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <label class="block text-xs font-bold uppercase text-slate-500 mb-2">Objective</label>
              <textarea v-model="soapForm.objective" rows="2" class="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-800 dark:text-white"></textarea>
            </div>
            <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <label class="block text-xs font-bold uppercase text-slate-500 mb-2">Assessment</label>
              <input v-model="soapForm.assessment" class="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-800 dark:text-white font-bold" />
            </div>
            <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <label class="block text-xs font-bold uppercase text-slate-500 mb-2">Plan</label>
              <textarea v-model="soapForm.plan" rows="3" class="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-800 dark:text-white font-mono text-sm"></textarea>
            </div>
          </div>

          <div class="p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-end gap-3">
            <button @click="showReviewModal = false" class="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50">Batal</button>
            <button @click="saveConsultation" :disabled="isSaving" class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 disabled:opacity-50">
              <Icon v-if="isSaving" name="svg-spinners:ring-resize" class="w-4 h-4" />
              <span>{{ isSaving ? "Menyimpan..." : "Simpan ke Rekam Medis" }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}
</style>
