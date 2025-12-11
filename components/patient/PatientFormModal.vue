<script setup lang="ts">
const { $swal } = useNuxtApp();

// PROPS: Data yang diterima dari luar (Induk)
const props = defineProps({
  isOpen: Boolean, // Apakah modal harus tampil?
  isEditing: Boolean, // Apakah mode Edit?
  editingId: String, // ID Pasien yang diedit (kalau ada)
  initialData: Object, // Data awal pasien (kalau mode Edit)
});

// EMITS: Cara lapor balik ke Induk
const emit = defineEmits(["close", "refresh"]);

// State Loading & File
const isLoading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

// State Form Utama
// Kita buat reactive object yang menampung semua field (termasuk medis)
const form = reactive({
  name: "",
  nik: "",
  bpjsNumber: "",
  phone: "",
  gender: "Male",
  birthDate: "",
  address: "",

  // Data Medis (Baru)
  bloodType: "",
  height: "",
  weight: "",
  allergies: "",
  chronicConditions: "",

  avatarUrl: "", // Preview
  avatarFile: null as File | null, // File mentah
});

// WATCHER: Pantau perubahan props 'isOpen'
// Kalau modal dibuka, kita reset atau isi form sesuai mode
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      if (props.isEditing && props.initialData) {
        // MODE EDIT: Isi form dengan data lama
        populateForm(props.initialData);
      } else {
        // MODE ADD: Kosongkan form
        resetForm();
      }
    }
  }
);

// Fungsi Reset Form (Bersih-bersih)
const resetForm = () => {
  form.name = "";
  form.nik = "";
  form.bpjsNumber = "";
  form.phone = "";
  form.gender = "Male";
  form.birthDate = "";
  form.address = "";
  form.bloodType = "";
  form.height = "";
  form.weight = "";
  form.allergies = "";
  form.chronicConditions = "";
  form.avatarUrl = "";
  form.avatarFile = null;
};

// Fungsi Isi Form (Populate)
const populateForm = (data: any) => {
  form.name = data.name;
  form.nik = data.nik || "";
  form.bpjsNumber = data.bpjsNumber || "";
  form.phone = data.phone || "";
  form.gender = data.gender || "Male";
  form.address = data.address || "";
  form.avatarUrl = data.avatarUrl || "";

  // Data Medis
  form.bloodType = data.bloodType || "";
  form.height = data.height ? String(data.height) : "";
  form.weight = data.weight ? String(data.weight) : "";
  form.allergies = data.allergies || "";
  form.chronicConditions = data.chronicConditions || "";

  if (data.birthDate) {
    form.birthDate = new Date(data.birthDate).toISOString().split("T")[0] ?? "";
  }
};

// Fungsi Handle Submit (Simpan)
const handleSubmit = async () => {
  // Validasi sederhana
  if (!form.name || !form.gender) {
    $swal.fire("Data Kurang", "Nama dan Gender wajib diisi.", "warning");
    return;
  }

  isLoading.value = true;

  // Tentukan URL & ID
  const url = props.isEditing ? "/api/patients/update" : "/api/patients/create";
  // Kalau edit, kirim ID. Kalau create, jangan.
  const payload = props.isEditing ? { ...form, id: props.editingId } : { ...form };

  try {
    await $fetch(url, { method: "POST", body: payload });

    // Sukses!
    $swal.fire({
      icon: "success",
      title: props.isEditing ? "Data Diperbarui" : "Pasien Terdaftar",
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });

    emit("refresh"); // Suruh induk refresh data
    emit("close"); // Tutup modal
  } catch (error: any) {
    $swal.fire("Gagal", error.statusMessage || "Gagal menyimpan data.", "error");
  } finally {
    isLoading.value = false;
  }
};

// Helper Upload Foto
const triggerFileInput = () => fileInput.value?.click();
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      $swal.fire("File Besar", "Maksimal 2MB", "warning");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) form.avatarUrl = e.target.result as string;
      // Note: Di sini kita pakai Base64 dulu biar cepet (sama kayak profile).
      // Kalau mau pakai upload file, logikanya mirip profile settings.
    };
    reader.readAsDataURL(file);
  }
};
</script>

<template>
  <!-- BACKDROP & MODAL WRAPPER -->
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
    <div class="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- MODAL HEADER -->
      <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">
            {{ isEditing ? "Edit Patient Details" : "Register New Patient" }}
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            {{ isEditing ? "Update medical & personal information." : "Enter basic information to register." }}
          </p>
        </div>
        <button @click="emit('close')" class="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
          <Icon name="heroicons:x-mark" class="w-6 h-6" />
        </button>
      </div>

      <!-- MODAL BODY (Scrollable) -->
      <div class="p-6 overflow-y-auto custom-scrollbar">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- SECTION 1: IDENTITY & PHOTO -->
          <div class="flex flex-col sm:flex-row items-start gap-6 pb-6 border-b border-slate-100 dark:border-slate-700">
            <!-- Foto Upload -->
            <div class="shrink-0 flex flex-col items-center gap-3">
              <div
                class="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600 relative group cursor-pointer"
                @click="triggerFileInput"
              >
                <img v-if="form.avatarUrl" :src="form.avatarUrl" class="w-full h-full object-cover" />
                <Icon v-else name="heroicons:camera" class="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition" />

                <!-- Hover Overlay -->
                <div class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span class="text-white text-xs font-bold">Change</span>
                </div>
              </div>

              <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleFileChange" />
            </div>

            <!-- Nama & NIK -->
            <div class="flex-1 w-full grid grid-cols-1 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name *</label>
                <input
                  v-model="form.name"
                  required
                  placeholder="e.g. Budi Santoso"
                  class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-1">NIK (ID)</label>
                  <input v-model="form.nik" placeholder="16 digits" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none dark:text-white" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-1">BPJS No</label>
                  <input v-model="form.bpjsNumber" placeholder="Optional" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none dark:text-white" />
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 2: DEMOGRAPHICS -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Gender *</label>
              <select v-model="form.gender" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none dark:text-white">
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Birth Date *</label>
              <input v-model="form.birthDate" type="date" required class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none dark:text-white" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
              <input v-model="form.phone" type="text" placeholder="08..." class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none dark:text-white" />
            </div>
          </div>

          <!-- SECTION 3: MEDICAL PROFILE (Hanya relevan saat Edit, tapi boleh diisi di awal) -->
          <div class="bg-blue-50 dark:bg-slate-900/50 p-4 rounded-xl border border-blue-100 dark:border-slate-700">
            <h4 class="text-sm font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2"><Icon name="heroicons:heart" class="w-4 h-4" /> Medical Profile (Optional)</h4>

            <div class="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Blood Type</label>
                <select v-model="form.bloodType" class="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg outline-none dark:text-white">
                  <option value="">-</option>
                  <option>A</option>
                  <option>B</option>
                  <option>AB</option>
                  <option>O</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Height (cm)</label>
                <input v-model="form.height" type="number" class="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg outline-none dark:text-white" />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Weight (kg)</label>
                <input v-model="form.weight" type="number" class="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg outline-none dark:text-white" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Allergies</label>
                <textarea
                  v-model="form.allergies"
                  rows="2"
                  placeholder="e.g. Penicillin, Peanuts"
                  class="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg outline-none dark:text-white resize-none"
                ></textarea>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Chronic Conditions</label>
                <textarea
                  v-model="form.chronicConditions"
                  rows="2"
                  placeholder="e.g. Diabetes, Hypertension"
                  class="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg outline-none dark:text-white resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Address -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Address</label>
            <textarea v-model="form.address" rows="2" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg outline-none dark:text-white resize-none"></textarea>
          </div>
        </form>
      </div>

      <!-- MODAL FOOTER -->
      <div class="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
        <button
          type="button"
          @click="emit('close')"
          class="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 rounded-xl transition"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          :disabled="isLoading"
          class="px-6 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Icon v-if="isLoading" name="svg-spinners:ring-resize" class="w-4 h-4" />
          <span>{{ isLoading ? "Saving..." : isEditing ? "Update Changes" : "Register Patient" }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scrollbar cantik buat modal */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #475569;
}
</style>
