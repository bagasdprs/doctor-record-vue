<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

definePageMeta({ layout: "default" });

useHead({
  title: "Settings",
});

// 1. Panggil Helper SweetAlert dari Plugin Nuxt
const { $swal } = useNuxtApp();

const authStore = useAuthStore();
const activeTab = ref("profile");
const isLoading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

// State Form
const form = reactive({
  id: "",
  fullName: "",
  specialization: "",
  email: "",
  phone: "",
  medicalId: "",
  gender: "Male",
  birthDate: "",
  address: "",
  bio: "",
  avatarUrl: "", // Preview
  avatarFile: null as File | null, // File Mentah
});

// Helper: Trigger klik input file
const triggerFileInput = () => fileInput.value?.click();

// Helper: Handle saat file dipilih
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    // Validasi Ukuran 5MB dengan SweetAlert
    if (file.size > 5 * 1024 * 1024) {
      $swal.fire({
        icon: "warning",
        title: "File Terlalu Besar",
        text: "Maksimal ukuran foto adalah 5MB.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    // Simpan file mentah & Buat Preview
    form.avatarFile = file;
    form.avatarUrl = URL.createObjectURL(file);
  }
};

// Ambil data profil saat load
const fetchProfile = async () => {
  const currentUserEmail = authStore.user?.email;
  if (!currentUserEmail) return;

  try {
    const res = await $fetch<any>("/api/doctors/profile", {
      method: "POST",
      body: { email: currentUserEmail },
    });

    if (res.success && res.data) {
      Object.assign(form, res.data);

      if (res.data.birthDate) {
        form.birthDate = new Date(res.data.birthDate).toISOString().split("T")[0] ?? "";
      }
      form.avatarFile = null;
    }
  } catch (error) {
    console.error("Gagal ambil profil:", error);
  }
};

onMounted(() => {
  fetchProfile();
});

// FUNGSI SAVE DENGAN FORMDATA & SWEETALERT
const saveChanges = async () => {
  isLoading.value = true;

  const formData = new FormData();
  formData.append("id", form.id);
  formData.append("email", form.email);
  formData.append("fullName", form.fullName);
  formData.append("specialization", form.specialization);
  formData.append("phone", form.phone);
  formData.append("bio", form.bio);
  formData.append("address", form.address);
  formData.append("gender", form.gender);
  formData.append("birthDate", form.birthDate);

  if (form.avatarFile) {
    formData.append("avatarFile", form.avatarFile);
  }

  try {
    const res = await $fetch<any>("/api/doctors/update", {
      method: "POST",
      body: formData,
    });

    if (res.success) {
      // Alert Sukses Cantik
      $swal.fire({
        icon: "success",
        title: "Berhasil Disimpan!",
        text: "Profil dokter telah diperbarui.",
        timer: 2000,
        showConfirmButton: false,
      });

      // Refresh data di Store (Header/Sidebar) & Form
      await authStore.fetchUserProfile();
      fetchProfile();
    }
  } catch (error: any) {
    console.error("Gagal update:", error);

    // Alert Error Cantik
    $swal.fire({
      icon: "error",
      title: "Gagal Menyimpan",
      text: error.statusMessage || "Terjadi kesalahan saat update profil.",
      confirmButtonColor: "#ef4444",
    });
  } finally {
    isLoading.value = false;
  }
};

const menuItems = [
  { id: "profile", label: "My Profile", icon: "heroicons:user" },
  { id: "preferences", label: "Preferences", icon: "heroicons:adjustments-horizontal" },
  { id: "security", label: "Security", icon: "heroicons:shield-check" },
  { id: "integrations", label: "Integrations", icon: "heroicons:puzzle-piece" },
];
</script>

<template>
  <div class="min-h-screen">
    <!-- Header Page -->
    <div class="mb-6 md:mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">Manage your personal info, preferences, and security.</p>
    </div>

    <!-- Layout Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
      <!-- SIDEBAR MENU -->
      <div class="lg:col-span-1">
        <nav class="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 lg:gap-2 pb-2 lg:pb-0 scrollbar-hide">
          <button
            v-for="item in menuItems"
            :key="item.id"
            @click="activeTab = item.id"
            class="shrink-0 w-auto lg:w-full flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 text-sm font-medium rounded-xl transition-all whitespace-nowrap"
            :class="
              activeTab === item.id
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm ring-1 ring-blue-200 dark:ring-blue-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-800 lg:bg-transparent'
            "
          >
            <Icon :name="item.icon" class="w-5 h-5" />
            {{ item.label }}
          </button>
        </nav>
      </div>

      <!-- MAIN CONTENT -->
      <div class="lg:col-span-3 space-y-6">
        <!-- === TAB: MY PROFILE === -->
        <div v-if="activeTab === 'profile'" class="space-y-6">
          <!-- Card 1: Header Profile -->
          <div class="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <!-- PREVIEW FOTO -->
            <!-- Kita pakai object-cover biar gak gepeng, dan background slate biar kalau transparan gak aneh -->
            <img :src="form.avatarUrl || 'https://i.pravatar.cc/150?u=default'" class="w-24 h-24 rounded-full object-cover border-4 border-slate-50 dark:border-slate-700 shadow-sm bg-slate-100" alt="Profile" />

            <div class="flex-1">
              <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ form.fullName || "Loading..." }}</h3>
              <p class="text-slate-500 dark:text-slate-400 text-sm">{{ form.email }}</p>
              <div class="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Medical ID: {{ form.medicalId }}</div>
            </div>

            <div>
              <!-- Input File Tersembunyi -->
              <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleFileChange" />

              <button
                @click="triggerFileInput"
                class="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition flex items-center gap-2"
              >
                <Icon name="heroicons:camera" class="w-4 h-4" />
                Change Photo
              </button>
            </div>
          </div>

          <!-- Card 2: Form Input -->
          <div class="bg-white dark:bg-slate-800 p-5 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">Personal Information</h3>

            <form @submit.prevent="saveChanges" class="space-y-5 md:space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                  <input
                    v-model="form.fullName"
                    type="text"
                    class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Specialization</label>
                  <input
                    v-model="form.specialization"
                    type="text"
                    class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
                  />
                </div>
              </div>

              <!-- Email (Disabled) & Phone -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                  <input v-model="form.email" type="email" disabled class="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 cursor-not-allowed" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                  <input
                    v-model="form.phone"
                    type="text"
                    class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
                  />
                </div>
              </div>

              <!-- Medical ID (Disabled) & Gender -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Medical ID / STR</label>
                  <input v-model="form.medicalId" type="text" disabled class="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 cursor-not-allowed" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Gender</label>
                  <select
                    v-model="form.gender"
                    class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white appearance-none"
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>

              <!-- Birth Date -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Birth Date</label>
                <input
                  v-model="form.birthDate"
                  type="date"
                  class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
                />
              </div>

              <!-- Address -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Clinic / Home Address</label>
                <textarea
                  v-model="form.address"
                  rows="2"
                  class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white resize-none"
                ></textarea>
              </div>

              <!-- Bio -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Professional Bio</label>
                <textarea
                  v-model="form.bio"
                  rows="4"
                  class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white resize-none"
                ></textarea>
              </div>

              <!-- Buttons -->
              <div class="flex flex-col-reverse md:flex-row justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button type="button" class="w-full md:w-auto px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                  Cancel
                </button>
                <button type="submit" class="w-full md:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 transition flex justify-center items-center gap-2" :disabled="isLoading">
                  <Icon v-if="isLoading" name="svg-spinners:ring-resize" class="w-5 h-5" />
                  <span>{{ isLoading ? "Saving..." : "Save Changes" }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- ... (Tab Preferences & Security Biarkan Saja) ... -->
        <div v-if="activeTab === 'preferences'" class="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center py-20">
          <div class="bg-blue-50 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="heroicons:adjustments-horizontal" class="w-8 h-8 text-blue-500" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Preferences Settings</h3>
          <p class="text-slate-500">Theme and notification settings will go here.</p>
        </div>

        <div v-if="activeTab === 'security'" class="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center py-20">
          <div class="bg-emerald-50 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="heroicons:shield-check" class="w-8 h-8 text-emerald-500" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Security Settings</h3>
          <p class="text-slate-500">Password change and 2FA settings will go here.</p>
        </div>
      </div>
    </div>
  </div>
</template>
