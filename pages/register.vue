<script setup lang="ts">
// Menggunakan layout 'auth-register'
definePageMeta({
  layout: "auth-register",
});

// Interface Data
interface RegisterForm {
  fullName: string;
  email: string;
  password: string;
  medicalId: string;
  specialization: string;
}

// State Reactive
const form = reactive<RegisterForm>({
  fullName: "",
  email: "",
  password: "",
  medicalId: "",
  specialization: "Dokter Umum",
});

const isLoading = ref(false);

const handleRegister = async () => {
  // Validasi
  if (!form.fullName || !form.email || !form.password || !form.medicalId) {
    alert("Mohon lengkapi semua data diri Anda.");
    return;
  }

  isLoading.value = true;

  try {
    // Kirim ke API
    const response = await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        medicalId: form.medicalId,
        specialization: form.specialization,
      },
    });

    alert("Registrasi Berhasil! Silakan Login.");
    navigateTo("/login");
  } catch (error: any) {
    console.error(error);
    alert(error.statusMessage || "Terjadi kesalahan saat registrasi.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <!--
      RESPONSIVE CONTAINER:
      - max-w-lg: Sedikit lebih lebar dari login (md) karena ada input yang jejer 2 (Grid).
      - p-6 (HP) -> md:p-10 (Desktop)
      - rounded-2xl (HP) -> md:rounded-[2rem] (Desktop)
    -->
  <div class="w-full max-w-lg bg-white p-6 md:p-10 rounded-2xl md:rounded-4xl shadow-xl md:shadow-2xl shadow-slate-200/50 border border-slate-100 mx-auto">
    <!-- HEADER -->
    <div class="mb-6 md:mb-8 text-center md:text-left">
      <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Daftar Akun Dokter</h2>
      <p class="text-slate-500 text-sm md:text-base">Lengkapi data profesi untuk validasi akun.</p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-4 md:space-y-5">
      <!-- Nama Lengkap -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap & Gelar</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="heroicons:user-circle-solid" class="text-slate-400 group-focus-within:text-emerald-500 w-5 h-5 transition-colors" />
          </div>
          <input
            v-model="form.fullName"
            type="text"
            placeholder="dr. Bagas, Sp.PD"
            class="w-full pl-12 pr-4 py-3 md:py-3.5 bg-slate-50 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium text-sm md:text-base"
          />
        </div>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">Email Profesi</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="heroicons:envelope-solid" class="text-slate-400 group-focus-within:text-emerald-500 w-5 h-5 transition-colors" />
          </div>
          <input
            v-model="form.email"
            type="email"
            placeholder="dokter@rs.com"
            class="w-full pl-12 pr-4 py-3 md:py-3.5 bg-slate-50 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium text-sm md:text-base"
          />
        </div>
      </div>

      <!-- Grid: STR & Spesialisasi (Responsive Grid) -->
      <!-- Di HP jadi 1 kolom (stack), di MD ke atas jadi 2 kolom -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <!-- Nomor STR -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Nomor STR / ID</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon name="heroicons:identification-solid" class="text-slate-400 group-focus-within:text-emerald-500 w-5 h-5 transition-colors" />
            </div>
            <input
              v-model="form.medicalId"
              type="text"
              placeholder="123456..."
              class="w-full pl-12 pr-4 py-3 md:py-3.5 bg-slate-50 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium text-sm md:text-base"
            />
          </div>
        </div>

        <!-- Spesialisasi -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Spesialisasi</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon name="heroicons:academic-cap-solid" class="text-slate-400 group-focus-within:text-emerald-500 w-5 h-5 transition-colors" />
            </div>
            <select
              v-model="form.specialization"
              class="w-full pl-12 pr-4 py-3 md:py-3.5 bg-slate-50 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium appearance-none text-sm md:text-base"
            >
              <option>Dokter Umum</option>
              <option>Sp. Penyakit Dalam</option>
              <option>Sp. Anak</option>
              <option>Sp. Bedah</option>
              <option>Sp. Jantung</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">Password</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="heroicons:lock-closed-solid" class="text-slate-400 group-focus-within:text-emerald-500 w-5 h-5 transition-colors" />
          </div>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            class="w-full pl-12 pr-4 py-3 md:py-3.5 bg-slate-50 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium text-sm md:text-base"
          />
        </div>
      </div>

      <!-- Tombol Submit -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 md:py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6 text-sm md:text-base"
      >
        <Icon v-if="!isLoading" name="heroicons:user-plus-solid" class="w-5 h-5" />
        <Icon v-else name="svg-spinners:ring-resize" class="w-5 h-5 animate-spin" />
        <span>{{ isLoading ? "Sedang Memproses..." : "Daftar Sekarang" }}</span>
      </button>
    </form>

    <!-- Footer Link -->
    <div class="mt-8 text-center text-sm text-slate-500 flex flex-col md:flex-row items-center justify-center gap-1">
      <span>Sudah punya akun dokter?</span>
      <NuxtLink to="/login" class="text-emerald-600 font-bold hover:underline hover:text-emerald-700"> Masuk di sini </NuxtLink>
    </div>
  </div>
</template>
