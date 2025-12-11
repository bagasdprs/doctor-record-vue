<script setup lang="ts">
definePageMeta({ layout: "default" });

const route = useRoute();
const patientId = route.params.id as string;

// STATE
const isLoading = ref(true);
const patient = ref<any>(null);
const activeTab = ref("visit-timeline");
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
  if (!patient.value) isLoading.value = true;
  try {
    const res = await $fetch<any>(`/api/patients/${patientId}`);
    if (res.success) {
      const rawData = res.data;

      if (rawData.history && rawData.history.length > 0) {
        rawData.history.sort((a: any, b: any) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      }
      patient.value = rawData;
    }
  } catch (err) {
    console.error(err);
    alert("Gagal memuat data pasien.");
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

// Check-In Langsung dari sini
const startVisit = () => {
  // alert("Fitur Check-In dari halaman detail akan segera aktif!");
  navigateTo(`/consultation/live-record?patientId=${patientId}`);
};

const goBack = () => {
  const source = route.query.source;

  if (source === "dashboard") {
    navigateTo("/dashboard");
  } else {
    navigateTo("/patients");
  }
};

// --- KAMUS SAKU ALERGI (The Smart Dictionary) 🧠 ---
const allergyDictionary: Record<string, string> = {
  // 15 FOOD ALLERGIES 🍔
  peanuts: "Risiko anafilaksis tinggi. Hindari semua produk olahan kacang, minyak kacang, dan kontaminasi silang.",
  kacang: "Risiko anafilaksis tinggi. Hindari semua produk olahan kacang, minyak kacang, dan kontaminasi silang.",
  seafood: "Reaksi terhadap protein laut. Hindari udang, kepiting, kerang, dan area pengolahan seafood.",
  fish: "Alergi ikan bersirip. Waspadai uap masakan ikan dan minyak ikan (omega-3).",
  milk: "Intoleransi Laktosa atau Alergi Protein Susu Sapi. Gunakan formula hidrolisat atau berbasis kedelai.",
  susu: "Intoleransi Laktosa atau Alergi Protein Susu Sapi. Gunakan formula hidrolisat atau berbasis kedelai.",
  eggs: "Hindari albumin/kuning telur. Waspada pada vaksin tertentu (missal: Influenza) yang berbasis telur.",
  telur: "Hindari albumin/kuning telur. Waspada pada vaksin tertentu (missal: Influenza) yang berbasis telur.",
  wheat: "Sensitivitas Gluten/Celiac. Hindari roti, pasta, dan produk tepung terigu. Pilih diet Gluten-Free.",
  gandum: "Sensitivitas Gluten/Celiac. Hindari roti, pasta, dan produk tepung terigu. Pilih diet Gluten-Free.",
  soy: "Alergi kedelai. Hindari tahu, tempe, kecap, dan lesitin kedelai dalam makanan olahan.",
  kedelai: "Alergi kedelai. Hindari tahu, tempe, kecap, dan lesitin kedelai dalam makanan olahan.",
  corn: "Alergi jagung. Cek sirup jagung (corn syrup) dalam minuman kemasan dan obat-obatan sirup.",
  jagung: "Alergi jagung. Cek sirup jagung (corn syrup) dalam minuman kemasan dan obat-obatan sirup.",
  shellfish: "Alergi kerang-kerangan (Crustacea). Reaksi bisa fatal. Hindari terasi dan saus tiram.",
  sesame: "Alergi biji wijen. Waspada pada roti burger, minyak wijen, dan masakan Asia.",
  wijen: "Alergi biji wijen. Waspada pada roti burger, minyak wijen, dan masakan Asia.",
  chocolate: "Sensitivitas Kakao atau kafein. Bisa memicu migrain atau gatal-gatal.",
  coklat: "Sensitivitas Kakao atau kafein. Bisa memicu migrain atau gatal-gatal.",
  msg: "Chinese Restaurant Syndrome. Gejala: pusing, dada sesak, wajah panas setelah konsumsi penyedap.",
  gluten: "Penyakit Celiac atau NCGS. Wajib diet bebas gluten seumur hidup untuk mencegah kerusakan usus.",
  strawberries: "Alergi buah beri. Bisa menyebabkan gatal mulut (OAS) atau urtikaria.",
  kiwi: "Reaksi silang dengan lateks (Latex-Fruit Syndrome). Waspada gatal di mulut.",

  // 15 ENVIRONMENTAL ALLERGIES 🌳
  dust: "Alergi tungau debu rumah. Sarankan sprei anti-tungau, hindari karpet, dan rutin vakum.",
  debu: "Alergi tungau debu rumah. Sarankan sprei anti-tungau, hindari karpet, dan rutin vakum.",
  pollen: "Hay Fever (Rhinitis Alergi). Gejala memburuk saat musim bunga/angin kencang. Gunakan masker.",
  serbuk: "Hay Fever (Rhinitis Alergi). Gejala memburuk saat musim bunga/angin kencang. Gunakan masker.",
  cats: "Alergi dander (serpihan kulit) kucing. Bukan bulunya. Hindari kontak langsung.",
  kucing: "Alergi dander (serpihan kulit) kucing. Bukan bulunya. Hindari kontak langsung.",
  dogs: "Alergi dander anjing/air liur. Mandikan hewan rutin jika dipelihara di dalam rumah.",
  anjing: "Alergi dander anjing/air liur. Mandikan hewan rutin jika dipelihara di dalam rumah.",
  mold: "Alergi jamur/spora. Hindari ruangan lembab, AC kotor, dan tumpukan kertas tua.",
  jamur: "Alergi jamur/spora. Hindari ruangan lembab, AC kotor, dan tumpukan kertas tua.",
  latex: "Alergi karet alam. GUNAKAN SARUNG TANGAN NON-LATEX (Nitrile/Vinyl) saat pemeriksaan medis!",
  lateks: "Alergi karet alam. GUNAKAN SARUNG TANGAN NON-LATEX (Nitrile/Vinyl) saat pemeriksaan medis!",
  penicillin: "Alergi Antibiotik Beta-laktam. JANGAN BERIKAN Amoxicillin/Ampicillin. Cek alternatif (Makrolida).",
  antibiotic: "Cek riwayat spesifik. Hindari golongan obat penyebab reaksi sebelumnya.",
  nsaids: "Alergi Aspirin/Ibuprofen. Berisiko asma atau gatal. Gunakan Paracetamol sebagai alternatif nyeri.",
  aspirin: "Alergi Aspirin/Ibuprofen. Berisiko asma atau gatal. Gunakan Paracetamol sebagai alternatif nyeri.",
  insect: "Alergi sengatan lebah/tawon. Risiko syok anafilaksis. Pasien perlu sedia EpiPen.",
  lebah: "Alergi sengatan lebah/tawon. Risiko syok anafilaksis. Pasien perlu sedia EpiPen.",
  sun: "Photosensitivity (Alergi Matahari). Kulit melepuh jika kena sinar UV. Wajib Sunscreen SPF 50+.",
  matahari: "Photosensitivity (Alergi Matahari). Kulit melepuh jika kena sinar UV. Wajib Sunscreen SPF 50+.",
  cold: "Urtikaria Dingin. Kulit bentol saat kena air/udara dingin. Hindari infus cairan dingin.",
  dingin: "Urtikaria Dingin. Kulit bentol saat kena air/udara dingin. Hindari infus cairan dingin.",
  perfume: "Sensitivitas wewangian kimia. Bisa memicu asma atau migrain. Hindari pewangi ruangan di kamar rawat.",
  parfum: "Sensitivitas wewangian kimia. Bisa memicu asma atau migrain. Hindari pewangi ruangan di kamar rawat.",
  smoke: "Hipersensitif asap rokok/kendaraan. Pemicu utama serangan Asma akut.",
  asap: "Hipersensitif asap rokok/kendaraan. Pemicu utama serangan Asma akut.",
};

// --- LOGIC DETEKSI ALERGI ---
const detectedAllergies = computed(() => {
  if (!patient.value?.allergies) return [];

  // Pecah string alergi (misal "Seafood, Debu") jadi array
  const inputs = patient.value.allergies.split(/[,.\n]+/).map((s: string) => s.trim().toLowerCase());

  // Cari kecocokan di kamus
  return inputs.map((input: string) => {
    // Cek apakah ada kata kunci di kamus yang cocok dengan input user
    const matchedKey = Object.keys(allergyDictionary).find((key) => input.includes(key));

    return {
      name: input.charAt(0).toUpperCase() + input.slice(1), // Capitalize
      info: matchedKey ? allergyDictionary[matchedKey] : "Reaksi hipersensitivitas. Pantau tanda-tanda anafilaksis dan catat reaksi spesifik.", // Default Info
      isCritical: !!matchedKey, // Tandai merah banget kalau ada di kamus
    };
  });
});

// --- 🧪 DATA DUMMY LAB RESULTS ("VERSI SULTAN") ---
// Ini data bohong-bohongan yang cerdas (ada status High/Normal)
const labReports = ref([
  {
    id: 101,
    title: "Comprehensive Metabolic Panel",
    date: "15 May 2024",
    items: [
      { name: "Glucose", value: 95, unit: "mg/dL", range: "70-99", status: "Normal" },
      { name: "Calcium", value: 9.2, unit: "mg/dL", range: "8.5-10.2", status: "Normal" },
      { name: "Sodium", value: 148, unit: "mEq/L", range: "135-145", status: "High" }, // Merah!
      { name: "Potassium", value: 4.1, unit: "mEq/L", range: "3.5-5.0", status: "Normal" },
    ],
  },
  {
    id: 102,
    title: "Lipid Profile",
    date: "10 Feb 2024",
    items: [
      { name: "Cholesterol, Total", value: 210, unit: "mg/dL", range: "<200", status: "High" }, // Merah!
      { name: "HDL Cholesterol", value: 45, unit: "mg/dL", range: ">40", status: "Normal" },
      { name: "LDL Cholesterol", value: 130, unit: "mg/dL", range: "<100", status: "High" }, // Merah!
    ],
  },
]);

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
            <div class="absolute top-0 left-0 w-full h-28 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-800 z-0"></div>
            <div class="relative z-10">
              <img :src="patient.avatarUrl || 'https://i.pravatar.cc/150?u=default'" class="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md mx-auto mb-3 bg-white" />
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">{{ patient.name }}</h2>
              <div class="flex items-center justify-center gap-2 mb-6">
                <svg class="w-12 h-6 text-emerald-500" viewBox="0 0 50 20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M0 10 H10 L15 0 L25 20 L30 10 H50" />
                </svg>
                <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100"> {{ patient.history?.length || 0 }} Visits </span>
              </div>

              <!-- Demographics -->
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
                <button @click="startVisit" class="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition">Start Visit</button>
              </div>
            </div>
          </div>

          <!-- === SMART ALLERGY ALERT (Kamus Saku UI) 🔥 === -->
          <div v-if="detectedAllergies.length > 0" class="space-y-3">
            <div v-for="(alergi, index) in detectedAllergies" :key="index" class="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
              <div class="bg-red-100 dark:bg-red-800 p-2 rounded-lg text-red-600 dark:text-red-200 shrink-0">
                <Icon name="heroicons:exclamation-triangle" class="w-6 h-6" />
              </div>
              <div>
                <h4 class="font-bold text-red-700 dark:text-red-400 text-sm uppercase tracking-wider mb-1">Allergy: {{ alergi.name }}</h4>
                <p class="font-bold text-slate-800 dark:text-white text-md leading-tight mb-1">
                  {{ alergi.info }}
                </p>
                <span class="text-[10px] bg-white dark:bg-red-900/50 px-2 py-0.5 rounded border border-red-100 dark:border-red-800 text-red-500 font-mono"> CLINICAL ALERT </span>
              </div>
            </div>
          </div>

          <!-- 3. VITALS WIDGET (Tanda Vital Terakhir) -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <h4 class="font-bold text-slate-900 dark:text-white flex items-center gap-2"><Icon name="heroicons:heart" class="w-5 h-5 text-pink-500" /> Latest Vitals</h4>
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
          <div class="flex border-b border-slate-200 dark:border-slate-700 mb-6 gap-6 overflow-x-auto">
            <button
              v-for="tab in ['visit-timeline', 'medical-history', 'lab-results']"
              :key="tab"
              @click="activeTab = tab"
              class="pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap capitalize"
              :class="activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'"
            >
              {{ tab.replace("-", " ") }}
            </button>
          </div>

          <!-- 1. VISIT TIMELINE -->
          <div v-if="activeTab === 'visit-timeline'" class="space-y-8 relative pl-4 pb-12">
            <div class="absolute left-[26px] top-4 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 z-0"></div>
            <div v-for="visit in patient.history" :key="visit.id" class="relative z-10 pl-10 group">
              <div
                class="absolute left-0 top-0 w-[54px] h-[54px] flex flex-col items-center justify-center bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm text-center group-hover:border-blue-500 group-hover:text-blue-600 transition-colors z-20"
              >
                <span class="text-[10px] font-bold text-slate-400 uppercase leading-none mb-0.5">{{ new Date(visit.createdAt).toLocaleString("default", { month: "short" }) }}</span>
                <span class="text-xl font-black text-slate-800 dark:text-white leading-none">{{ new Date(visit.createdAt).getDate() }}</span>
              </div>
              <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition cursor-pointer group-hover:border-blue-200 dark:group-hover:border-blue-900">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h4 class="font-bold text-slate-900 dark:text-white text-lg">{{ visit.assessment ? visit.assessment : "Routine Consultation" }}</h4>
                    <p class="text-xs text-slate-400 mt-1">Dr. {{ visit.doctorName || "Unknown" }} • {{ visit.doctorSpecialization || "GP" }}</p>
                  </div>
                  <button class="text-blue-600 text-xs font-bold bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full hover:bg-blue-100 transition">View Details</button>
                </div>
                <div class="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Symptoms</span>
                  <p class="text-sm text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">{{ visit.subjective || "No specific symptoms recorded." }}</p>
                </div>
              </div>
            </div>
            <div v-if="!patient.history || patient.history.length === 0" class="text-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 ml-10">
              <Icon name="heroicons:clock" class="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 class="font-bold text-slate-600 dark:text-slate-400">No Medical History</h4>
              <p class="text-sm text-slate-400">This patient hasn't visited the clinic yet.</p>
            </div>
          </div>

          <!-- 2. MEDICAL HISTORY -->
          <div v-if="activeTab === 'medical-history'" class="space-y-4 animate-fade-in">
            <div class="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/30">
              <div class="flex items-center gap-3 mb-4">
                <div class="bg-indigo-100 dark:bg-indigo-800 p-2 rounded-lg text-indigo-600 dark:text-indigo-200"><Icon name="heroicons:heart-solid" class="w-5 h-5" /></div>
                <h3 class="font-bold text-slate-900 dark:text-white">Chronic Conditions</h3>
              </div>
              <ul class="list-disc list-inside text-sm text-slate-700 dark:text-slate-300 ml-2 space-y-2">
                <li v-if="patient.chronicConditions">{{ patient.chronicConditions }}</li>
                <li v-else class="italic text-slate-500">No chronic conditions recorded.</li>
              </ul>
            </div>
          </div>

          <!-- 3. LAB RESULTS "SULTAN UI" 🧪 -->
          <div v-if="activeTab === 'lab-results'" class="space-y-6 animate-fade-in">
            <div class="flex justify-between items-center">
              <h3 class="font-bold text-slate-800 dark:text-white">Recent Lab Results</h3>
              <button class="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">View All Reports <Icon name="heroicons:arrow-right" class="w-4 h-4" /></button>
            </div>

            <!-- Loop Card Report -->
            <div v-for="report in labReports" :key="report.id" class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div class="flex justify-between items-start mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Icon name="heroicons:beaker" class="w-6 h-6" />
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 dark:text-white">{{ report.title }}</h4>
                    <p class="text-xs text-slate-400">{{ report.date }}</p>
                  </div>
                </div>
                <!-- Tombol Dummy PDF -->
                <button class="text-xs font-bold text-slate-500 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition">Original PDF</button>
              </div>

              <!-- Grid Item Tests -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="item in report.items"
                  :key="item.name"
                  class="p-4 rounded-2xl border transition hover:shadow-md"
                  :class="item.status === 'High' ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-slate-50 border-slate-100 dark:bg-slate-700/30 dark:border-slate-700'"
                >
                  <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-bold uppercase tracking-wider opacity-70" :class="item.status === 'High' ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'">
                      {{ item.name }}
                    </span>

                    <!-- Badge Status -->
                    <span
                      class="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                      :class="item.status === 'High' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200'"
                    >
                      {{ item.status }}
                    </span>
                  </div>

                  <div class="flex items-end gap-1">
                    <span class="text-2xl font-black text-slate-800 dark:text-white">{{ item.value }}</span>
                    <span class="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">{{ item.unit }}</span>
                  </div>

                  <p class="text-[10px] text-slate-400 mt-1">Range: {{ item.range }}</p>
                </div>
              </div>

              <button class="w-full mt-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border-t border-slate-100 dark:border-slate-700 transition">VIEW DETAILED REPORT</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- EDIT PROFILE MODAL -->
    <PatientFormModal :is-open="showEditModal" :is-editing="true" :editing-id="patientId" :initial-data="patient" @close="showEditModal = false" @refresh="handleRefresh" />
  </div>
</template>
