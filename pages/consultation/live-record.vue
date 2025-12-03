<script setup lang="ts">
// Layout default
definePageMeta({
  layout: "default",
});

// State
const isRecording = ref(false);
const isPaused = ref(false);
const transcript = ref("");

// State untuk Timer
const totalSeconds = ref(0);
let timerInterval: NodeJS.Timeout | null = null;

// --- COMPUTED TIMER (Jam:Menit:Detik) ---
const displayHours = computed(() => {
  const hrs = Math.floor(totalSeconds.value / 3600);
  return hrs.toString().padStart(2, "0");
});

const displayMinutes = computed(() => {
  const mins = Math.floor((totalSeconds.value % 3600) / 60);
  return mins.toString().padStart(2, "0");
});

const displaySeconds = computed(() => {
  const secs = totalSeconds.value % 60;
  return secs.toString().padStart(2, "0");
});

// --- TIMER LOGIC ---
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

// 1. Tombol Merah (Start / Stop & Reset)
const toggleRecording = () => {
  if (!isRecording.value) {
    // === START RECORDING ===
    isRecording.value = true;
    isPaused.value = false;
    transcript.value = ""; // Bersihkan teks lama
    startTimer();

    // Simulasi transkrip masuk
    setTimeout(() => {
      if (isRecording.value) transcript.value = "Halo, selamat pagi Dok. Keluhan saya hari ini adalah sakit kepala berdenyut...";
    }, 2000);
  } else {
    // === STOP & RESET ===
    isRecording.value = false;
    isPaused.value = false;
    stopTimer();
    totalSeconds.value = 0;
  }
};

// 2. Tombol Pause (Pause / Resume)
const togglePause = () => {
  if (!isRecording.value) return;

  if (!isPaused.value) {
    isPaused.value = true;
    stopTimer();
  } else {
    isPaused.value = false;
    startTimer();
  }
};

onUnmounted(() => {
  stopTimer();
});
</script>

<template>
  <div class="min-h-screen">
    <!-- Back Navigation -->
    <div class="mb-6">
      <NuxtLink to="/consultation" class="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition text-sm">
        <Icon name="heroicons:arrow-left" class="w-4 h-4" />
        Back to Consultation List
      </NuxtLink>
    </div>

    <!-- Header Section -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-1">Consultation with John Appleseed</h1>
        <div class="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
          <span class="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">ID: 987654</span>
          <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>DOB: 01/15/1980 (45 yo)</span>
        </div>
      </div>

      <!-- TIMER CARD -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-2xl shadow-sm flex items-center gap-6">
        <div class="text-center">
          <div class="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {{ displayHours }}
          </div>
          <div class="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Hours</div>
        </div>

        <div class="text-2xl font-bold text-slate-300">:</div>

        <div class="text-center">
          <div class="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {{ displayMinutes }}
          </div>
          <div class="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Minutes</div>
        </div>

        <div class="text-2xl font-bold text-slate-300">:</div>

        <div class="text-center">
          <!-- Detik berkedip HANYA jika Recording dan TIDAK Pause -->
          <div class="text-2xl font-bold font-mono transition-colors" :class="isRecording && !isPaused ? 'text-red-500 animate-pulse' : 'text-slate-900 dark:text-white'">
            {{ displaySeconds }}
          </div>
          <div class="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Seconds</div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="space-y-6">
        <!-- Live Recording Card -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="heroicons:microphone" class="w-5 h-5 text-blue-500" />
            Live Recording
          </h3>

          <!-- Visualizer Area -->
          <div class="bg-slate-900 h-48 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden border border-slate-800">
            <!-- Animasi Waveform -->
            <!-- Kita hide animasi kalau lagi Pause atau Stop -->
            <div class="flex items-center gap-1.5 h-full opacity-80" :class="!isRecording || isPaused ? 'opacity-20' : ''">
              <!-- Style: animation-play-state: paused; kalau lagi pause -->
              <div class="w-1.5 bg-emerald-500 rounded-full h-8" :class="!isRecording || isPaused ? '' : 'animate-bounce'"></div>
              <div class="w-1.5 bg-emerald-400 rounded-full h-16" :class="!isRecording || isPaused ? '' : 'animate-[bounce_1.2s_infinite]'"></div>
              <div class="w-1.5 bg-emerald-500 rounded-full h-10" :class="!isRecording || isPaused ? '' : 'animate-[bounce_0.8s_infinite]'"></div>
              <div class="w-1.5 bg-emerald-400 rounded-full h-20" :class="!isRecording || isPaused ? '' : 'animate-[bounce_1.1s_infinite]'"></div>
              <div class="w-1.5 bg-emerald-500 rounded-full h-12" :class="!isRecording || isPaused ? '' : 'animate-[bounce_0.9s_infinite]'"></div>
              <div class="w-1.5 bg-emerald-400 rounded-full h-4" :class="!isRecording || isPaused ? '' : 'animate-[bounce_1.3s_infinite]'"></div>
            </div>

            <!-- Overlay Text Start -->
            <div v-if="!isRecording" class="absolute inset-0 flex items-center justify-center bg-white/5 dark:bg-slate-900/60 backdrop-blur-sm z-10">
              <span class="text-white font-medium bg-slate-900/80 px-4 py-2 rounded-lg">Click Red Button to Start</span>
            </div>
            <!-- Overlay Text Paused -->
            <div v-else-if="isPaused" class="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-10">
              <span class="text-white font-bold tracking-widest bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-600">PAUSED</span>
            </div>
          </div>

          <!-- Control Buttons -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="relative flex h-3 w-3">
                <span v-if="isRecording && !isPaused" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span :class="isRecording && !isPaused ? 'bg-red-500' : 'bg-slate-400'" class="relative inline-flex rounded-full h-3 w-3"></span>
              </span>
              <span class="text-sm font-medium text-slate-600 dark:text-slate-300">
                <span v-if="!isRecording">Ready to record</span>
                <span v-else-if="isPaused">Recording Paused</span>
                <span v-else>Recording in progress...</span>
              </span>
            </div>

            <div class="flex items-center gap-4">
              <!-- PAUSE BUTTON -->
              <button
                @click="togglePause"
                :disabled="!isRecording"
                class="w-12 h-12 rounded-full flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                :class="isPaused ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white hover:bg-slate-200'"
                :title="isPaused ? 'Resume' : 'Pause'"
              >
                <!-- Ganti icon Play kalau Pause, Pause kalau jalan -->
                <Icon :name="isPaused ? 'heroicons:play-solid' : 'heroicons:pause-solid'" class="w-6 h-6" />
              </button>

              <!-- RECORD / STOP BUTTON -->
              <button
                @click="toggleRecording"
                class="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl shadow-red-500/30 transition-all transform active:scale-90 hover:scale-105"
                :class="isRecording ? 'bg-white border-4 border-red-500 text-red-500' : 'bg-red-500 hover:bg-red-600'"
              >
                <Icon :name="isRecording ? 'heroicons:stop-solid' : 'heroicons:microphone-solid'" class="w-8 h-8" />
              </button>
            </div>
          </div>
        </div>

        <!-- AI Summary Action -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm transition-opacity duration-300" :class="isRecording ? 'opacity-60 pointer-events-none' : 'opacity-100'">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-slate-900 dark:text-white">AI-Generated Summary</h3>
            <Icon v-if="isRecording" name="heroicons:lock-closed" class="w-4 h-4 text-slate-400" />
            <Icon v-else name="heroicons:sparkles" class="w-4 h-4 text-blue-500" />
          </div>
          <button
            :disabled="isRecording"
            class="w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
            :class="isRecording ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'"
          >
            <Icon name="heroicons:document-text" class="w-5 h-5" />
            <span>Generate SOAP Notes</span>
          </button>
        </div>
      </div>

      <!-- Live Transcript -->
      <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full min-h-[500px]">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Live Transcript</h3>
          <span class="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">WHISPER-V3</span>
        </div>

        <div class="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 overflow-y-auto">
          <p v-if="!transcript" class="text-slate-400 text-center mt-20 text-sm italic">"Suara percakapan akan muncul di sini secara real-time..."</p>
          <div v-else class="space-y-4">
            <p class="text-slate-700 dark:text-slate-300 leading-relaxed text-lg transition-opacity" :class="isPaused ? 'opacity-50' : 'opacity-100'">
              {{ transcript }}
              <span v-if="!isPaused" class="inline-block w-2 h-5 bg-blue-500 ml-1 animate-pulse align-middle rounded-full"></span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
