<script setup lang="ts">
// Menggunakan layout 'auth' (yang polosan)
definePageMeta({
  layout: "auth",
});

// Tipe data untuk Form Register (Biar aman & ada autocomplete)
interface RegisterForm {
  fullName: string;
  email: string;
  password: string;
  strNumber: string;
  specialization: string;
}

// State reactive
const form = reactive<RegisterForm>({
  fullName: "",
  email: "",
  password: "",
  strNumber: "",
  specialization: "Dokter Umum",
});

const isLoading = ref(false);

const handleRegister = async () => {
  // Simulasi validasi sederhana
  if (!form.fullName || !form.email || !form.password) {
    alert("Mohon lengkapi data diri Anda.");
    return;
  }

  isLoading.value = true;

  // Ceritanya kirim ke API...
  setTimeout(() => {
    console.log("Data Register:", form);
    isLoading.value = false;
    alert("Registrasi Berhasil! Silakan Login.");
    navigateTo("/login");
  }, 1500);
};
</script>

<template>
  <div class="w-full">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-slate-800">Daftar Akun Dokter 🩺</h1>
      <p class="text-slate-500 text-sm mt-1">Bergabung untuk kelola rekam medis pasien</p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap & Gelar</label>
        <input v-model="form.fullName" type="text" placeholder="dr. Bagas, Sp.PD" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition" />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input v-model="form.email" type="email" placeholder="dokter@rs.com" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Nomor STR</label>
          <input v-model="form.strNumber" type="text" placeholder="123456..." class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Spesialisasi</label>
          <select v-model="form.specialization" class="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 outline-none transition">
            <option>Dokter Umum</option>
            <option>Sp. Penyakit Dalam</option>
            <option>Sp. Anak</option>
            <option>Sp. Bedah</option>
            <option>Sp. Jantung</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <input v-model="form.password" type="password" placeholder="••••••••" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
      </div>

      <button type="submit" :disabled="isLoading" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-lg transition shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed">
        <span v-if="isLoading">Memproses...</span>
        <span v-else>Daftar Sekarang</span>
      </button>
    </form>

    <div class="mt-6 text-center text-sm text-slate-600">
      Sudah punya akun?
      <NuxtLink to="/login" class="text-teal-600 font-bold hover:underline">Masuk di sini</NuxtLink>
    </div>
  </div>
</template>
