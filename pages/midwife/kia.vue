<script setup lang="ts">
  import { ref, computed } from 'vue';

  // --- Types ---
  type Patient = {
    id: string;
    name: string;
    age: number;
    husband: string;
    gpa: string; // Gravida Partus Abortus
    hpht: string;
    hpl: string; // Taksiran Persalinan
    uk: number; // Usia Kehamilan (Minggu)
    status: 'Resiko Tinggi' | 'Normal' | 'Pantau';
    lastVisit: string;
    phone: string;
    avatar: string;
  };

  // --- State ---
  const viewMode = ref<'list' | 'detail'>('list');
  const selectedPatient = ref<Patient | null>(null);
  const activeTab = ref<'pemeriksaan' | 'riwayat' | 'grafik'>('pemeriksaan');
  const isRecording = ref(false);
  const transcript = ref('');

  // --- Dummy Data ---
  const patients = ref<Patient[]>([
    {
      id: 'P001', name: 'Ibu Siti Aminah', age: 28, husband: 'Bpk. Budi',
      gpa: 'G2P1A0', hpht: '2025-01-10', hpl: '2025-10-17', uk: 32,
      status: 'Normal', lastVisit: '2025-09-10', phone: '08123456789',
      avatar: 'https://i.pravatar.cc/150?u=siti'
    },
    {
      id: 'P002', name: 'Ibu Dewi Sartika', age: 35, husband: 'Bpk. Kurniawan',
      gpa: 'G4P2A1', hpht: '2025-02-15', hpl: '2025-11-22', uk: 28,
      status: 'Resiko Tinggi', lastVisit: '2025-09-20', phone: '08198765432',
      avatar: 'https://i.pravatar.cc/150?u=dewi'
    },
    {
      id: 'P003', name: 'Ibu Rina Wati', age: 24, husband: 'Bpk. Tono',
      gpa: 'G1P0A0', hpht: '2025-04-01', hpl: '2026-01-08', uk: 20,
      status: 'Pantau', lastVisit: '2025-09-01', phone: '08567890123',
      avatar: 'https://i.pravatar.cc/150?u=rina'
    }
  ]);

  // --- Actions ---
  const selectPatient = (patient: Patient) => {
    selectedPatient.value = patient;
    viewMode.value = 'detail';
  };

  const backToList = () => {
    viewMode.value = 'list';
    selectedPatient.value = null;
    isRecording.value = false;
    transcript.value = '';
  };

  // Simulasi AI Recording
  const toggleRecord = () => {
    isRecording.value = !isRecording.value;
    if (isRecording.value) {
      transcript.value = "Mendengarkan percakapan...";
      setTimeout(() => {
        transcript.value = "Ibu mengeluh sering pusing saat bangun tidur, gerakan janin aktif...";
      }, 2000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resiko Tinggi': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'Normal': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Pantau': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  </script>

  <template>
    <div class="min-h-screen p-6 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">

      <!-- HEADER SECTION -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold dark:text-white flex items-center gap-3">
            <button v-if="viewMode === 'detail'" @click="backToList" class="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition">
              <Icon name="heroicons:arrow-left" class="w-6 h-6" />
            </button>
            <span>{{ viewMode === 'list' ? 'KIA Registry' : 'Digital Buku KIA' }}</span>
          </h1>
          <p class="text-slate-500 dark:text-slate-400 mt-1">
            {{ viewMode === 'list' ? 'Database lengkap Ibu Hamil & Riwayat Kehamilan' : 'Pemeriksaan ANC & Pemantauan Janin' }}
          </p>
        </div>
        <div v-if="viewMode === 'list'" class="flex gap-3">
          <div class="relative">
            <Icon name="heroicons:magnifying-glass" class="w-5 h-5 absolute left-3 top-3 text-slate-400" />
            <input type="text" placeholder="Cari nama / No. RM..." class="pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 w-64" />
          </div>
          <button class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-purple-500/30 transition flex items-center gap-2">
            <Icon name="heroicons:user-plus" class="w-5 h-5" /> Registrasi Bumil
          </button>
        </div>
      </div>

      <!-- MODE 1: LIST VIEW (Registry) -->
      <div v-if="viewMode === 'list'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="patient in patients" :key="patient.id"
             @click="selectPatient(patient)"
             class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition cursor-pointer group relative overflow-hidden">

          <!-- Status Badge -->
          <span class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border" :class="getStatusColor(patient.status)">
            {{ patient.status }}
          </span>

          <div class="flex items-center gap-4 mb-6">
            <div class="relative">
              <img :src="patient.avatar" class="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md" />
              <div class="absolute -bottom-1 -right-1 bg-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                {{ patient.uk }} W
              </div>
            </div>
            <div>
              <h3 class="font-bold text-lg dark:text-white group-hover:text-purple-500 transition">{{ patient.name }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ patient.gpa }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 text-sm border-t border-slate-100 dark:border-slate-700 pt-4">
            <div>
              <p class="text-slate-400 text-xs uppercase font-bold tracking-wider">HPL (Taksiran)</p>
              <p class="font-medium dark:text-slate-200">{{ patient.hpl }}</p>
            </div>
            <div>
              <p class="text-slate-400 text-xs uppercase font-bold tracking-wider">Terakhir Periksa</p>
              <p class="font-medium dark:text-slate-200">{{ patient.lastVisit }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- MODE 2: DETAIL VIEW (Digital Buku KIA) -->
      <div v-else-if="selectedPatient" class="flex flex-col lg:flex-row gap-6 animate-fade-in">

        <!-- LEFT PANEL: PATIENT IDENTITY (Sticky) -->
        <aside class="w-full lg:w-80 shrink-0 space-y-6">
          <!-- Profile Card -->
          <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
             <div class="absolute top-0 left-0 w-full h-24 bg-linear-to-r from-purple-500 to-pink-500 opacity-20"></div>
             <div class="relative flex flex-col items-center text-center mt-4">
               <img :src="selectedPatient.avatar" class="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-lg mb-4" />
               <h2 class="text-xl font-bold dark:text-white">{{ selectedPatient.name }}</h2>
               <p class="text-sm text-slate-500">{{ selectedPatient.age }} Tahun • Istri {{ selectedPatient.husband }}</p>
               <span class="mt-3 px-4 py-1.5 rounded-full text-xs font-bold border" :class="getStatusColor(selectedPatient.status)">
                 {{ selectedPatient.status }}
               </span>
             </div>

             <div class="mt-8 space-y-4">
               <div class="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                 <span class="text-slate-500 text-sm">GPA</span>
                 <span class="font-bold font-mono text-purple-600 dark:text-purple-400 text-lg">{{ selectedPatient.gpa }}</span>
               </div>
               <div class="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                 <span class="text-slate-500 text-sm">HPHT</span>
                 <span class="font-medium dark:text-slate-200">{{ selectedPatient.hpht }}</span>
               </div>
               <div class="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                 <span class="text-slate-500 text-sm">HPL</span>
                 <span class="font-bold text-pink-500">{{ selectedPatient.hpl }}</span>
               </div>
               <div class="flex justify-between items-center py-2">
                 <span class="text-slate-500 text-sm">Usia Kandungan</span>
                 <span class="font-bold dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{{ selectedPatient.uk }} Minggu</span>
               </div>
             </div>

             <div class="mt-6 flex gap-2">
               <button class="flex-1 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-medium text-sm hover:bg-green-100 transition">WhatsApp</button>
               <button class="flex-1 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-100 transition">Detail</button>
             </div>
          </div>

          <!-- Riwayat Singkat -->
          <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 class="font-bold dark:text-white mb-4 flex items-center gap-2">
              <Icon name="heroicons:clock" class="w-5 h-5 text-slate-400" /> Riwayat Kunjungan
            </h3>
            <div class="space-y-4 relative pl-4 border-l-2 border-slate-100 dark:border-slate-700">
              <div class="relative">
                <div class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-white dark:ring-slate-800"></div>
                <p class="text-xs text-slate-400 mb-1">10 Sep 2025</p>
                <p class="font-medium text-sm dark:text-slate-200">Kontrol Rutin (30W)</p>
                <p class="text-xs text-slate-500">Keluhan: Kaki bengkak</p>
              </div>
              <div class="relative opacity-60">
                <div class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600 ring-4 ring-white dark:ring-slate-800"></div>
                <p class="text-xs text-slate-400 mb-1">10 Aug 2025</p>
                <p class="font-medium text-sm dark:text-slate-200">USG Trimester 2</p>
              </div>
            </div>
          </div>
        </aside>

        <!-- RIGHT PANEL: WORKSPACE (ANC) -->
        <main class="flex-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">

          <!-- Tabs -->
          <div class="flex border-b border-slate-200 dark:border-slate-700">
            <button @click="activeTab = 'pemeriksaan'" class="px-6 py-4 font-medium text-sm border-b-2 transition-colors"
              :class="activeTab === 'pemeriksaan' ? 'border-purple-500 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'">
              🩺 Pemeriksaan Hari Ini
            </button>
            <button @click="activeTab = 'grafik'" class="px-6 py-4 font-medium text-sm border-b-2 transition-colors"
              :class="activeTab === 'grafik' ? 'border-purple-500 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'">
              📈 Grafik (KMS Ibu)
            </button>
            <button @click="activeTab = 'riwayat'" class="px-6 py-4 font-medium text-sm border-b-2 transition-colors"
              :class="activeTab === 'riwayat' ? 'border-purple-500 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'">
              📂 Dokumen & Lab
            </button>
          </div>

          <!-- Content Area -->
          <div class="p-6 md:p-8 overflow-y-auto flex-1 relative">

            <!-- TAB 1: PEMERIKSAAN (FORM & AI) -->
            <div v-if="activeTab === 'pemeriksaan'" class="max-w-3xl mx-auto space-y-8 pb-20">

              <!-- AI Section -->
              <div class="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-2xl p-6 border border-purple-100 dark:border-purple-900/20 relative group">
                 <div class="flex justify-between items-start mb-4">
                   <div>
                     <h3 class="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-2">
                       <Icon name="heroicons:sparkles" class="w-5 h-5" /> FluxMed AI Scribe
                     </h3>
                     <p class="text-sm text-purple-600 dark:text-purple-400 opacity-80">Rekam percakapan untuk isi SOAP otomatis.</p>
                   </div>
                   <button @click="toggleRecord"
                     class="flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all shadow-lg"
                     :class="isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white dark:bg-slate-800 text-purple-600 hover:bg-purple-50 border border-purple-200'">
                     <span v-if="isRecording" class="w-2 h-2 bg-white rounded-full"></span>
                     <Icon v-else name="heroicons:microphone" class="w-5 h-5" />
                     {{ isRecording ? 'Merekam... (Klik Stop)' : 'Mulai Rekam' }}
                   </button>
                 </div>

                 <!-- Transcript Placeholder -->
                 <div v-if="transcript" class="bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-purple-100 dark:border-purple-900/20 text-sm text-slate-600 dark:text-slate-300 italic min-h-[60px]">
                   "{{ transcript }}"
                 </div>
              </div>

              <!-- Vital Signs Grid -->
              <div>
                <h4 class="font-bold text-slate-800 dark:text-white mb-4 border-l-4 border-purple-500 pl-3">Tanda Vital (Objective)</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="space-y-1">
                    <label class="text-xs font-bold text-slate-500 uppercase">BB (kg)</label>
                    <input type="number" class="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg p-3 font-bold focus:ring-2 focus:ring-purple-500 outline-none" placeholder="0" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-bold text-slate-500 uppercase">TD (mmHg)</label>
                    <input type="text" class="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg p-3 font-bold focus:ring-2 focus:ring-purple-500 outline-none" placeholder="120/80" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-bold text-slate-500 uppercase">TFU (cm)</label>
                    <input type="number" class="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg p-3 font-bold focus:ring-2 focus:ring-purple-500 outline-none" placeholder="0" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-bold text-slate-500 uppercase">DJJ (bpm)</label>
                    <input type="number" class="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg p-3 font-bold text-pink-500 focus:ring-2 focus:ring-pink-500 outline-none" placeholder="140" />
                  </div>
                </div>
              </div>

              <!-- SOAP Form -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Keluhan Utama (Subjective)</label>
                  <textarea rows="4" class="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none" placeholder="Tulis keluhan pasien..."></textarea>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Analisa & Diagnosa (Assessment)</label>
                  <textarea rows="4" class="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none" placeholder="G2P1A0 Hamil 32 Minggu..."></textarea>
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Rencana & Terapi (Plan)</label>
                  <div class="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-4">
                    <div class="flex flex-wrap gap-2 mb-3">
                      <span class="px-3 py-1 bg-white dark:bg-slate-600 border rounded-full text-xs font-medium cursor-pointer hover:border-purple-500">+ Tablet Fe</span>
                      <span class="px-3 py-1 bg-white dark:bg-slate-600 border rounded-full text-xs font-medium cursor-pointer hover:border-purple-500">+ Kalsium</span>
                      <span class="px-3 py-1 bg-white dark:bg-slate-600 border rounded-full text-xs font-medium cursor-pointer hover:border-purple-500">+ Edukasi Gizi</span>
                    </div>
                    <textarea rows="2" class="w-full bg-transparent outline-none text-sm resize-none" placeholder="Ketik instruksi tambahan..."></textarea>
                  </div>
                </div>
              </div>

              <!-- Floating Save Action -->
              <div class="fixed bottom-6 right-6 lg:absolute lg:bottom-0 lg:right-0 lg:p-6 flex gap-3 z-20">
                 <button class="bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-50 transition">
                   Simpan Draft
                 </button>
                 <button class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold shadow-xl shadow-purple-500/30 transition flex items-center gap-2">
                   <Icon name="heroicons:check-circle" class="w-5 h-5" /> Selesai Periksa
                 </button>
              </div>
            </div>

            <!-- TAB 2: GRAFIK (Placeholder) -->
            <div v-else-if="activeTab === 'grafik'" class="h-full flex flex-col items-center justify-center text-center opacity-60">
               <Icon name="heroicons:chart-bar-square" class="w-20 h-20 text-slate-300 dark:text-slate-600 mb-4" />
               <h3 class="text-xl font-bold dark:text-white">Grafik KMS Digital</h3>
               <p class="text-slate-500">Visualisasi kenaikan berat badan ibu & janin akan muncul di sini.</p>
            </div>

          </div>
        </main>
      </div>

    </div>
  </template>

  <style>
  /* Custom Animation */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
  </style>