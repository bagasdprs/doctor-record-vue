<script setup lang="ts">
definePageMeta({
  layout: "default",
});

// State untuk Tab Aktif
const activeTab = ref("profile");

// Data Dummy Profile
const form = reactive({
  fullName: "Dr. Emily Carter",
  title: "Cardiologist",
  email: "emily.carter@medclinic.com",
  phone: "+1 (555) 123-4567",
  bio: "Dr. Emily Carter is a board-certified cardiologist with over 15 years of experience in diagnosing and treating cardiovascular diseases. She is dedicated to providing compassionate and comprehensive care to her patients.",
  license: "G29834792",
});

const menuItems = [
  { id: "profile", label: "My Profile", icon: "heroicons:user" },
  { id: "preferences", label: "Preferences", icon: "heroicons:adjustments-horizontal" },
  { id: "security", label: "Security", icon: "heroicons:shield-check" },
  { id: "integrations", label: "Integrations", icon: "heroicons:puzzle-piece" },
];

const isLoading = ref(false);

const saveChanges = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    alert("Profile updated successfully!");
  }, 1000);
};
</script>

<template>
  <div class="min-h-screen">
    <!-- Header Page -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-1">Manage your personal info, preferences, and security.</p>
    </div>

    <!-- Layout Grid: Kiri Menu, Kanan Konten -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- SIDEBAR MENU SETTINGS -->
      <div class="lg:col-span-1">
        <nav class="space-y-1">
          <button
            v-for="item in menuItems"
            :key="item.id"
            @click="activeTab = item.id"
            class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all"
            :class="
              activeTab === item.id ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm ring-1 ring-blue-200 dark:ring-blue-800' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            "
          >
            <Icon :name="item.icon" class="w-5 h-5" />
            {{ item.label }}
          </button>
        </nav>
      </div>

      <!-- MAIN CONTENT AREA -->
      <div class="lg:col-span-3 space-y-6">
        <!-- === TAB: MY PROFILE === -->
        <div v-if="activeTab === 'profile'" class="space-y-6">
          <!-- Card 1: Foto & Info Dasar -->
          <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <img src="https://i.pravatar.cc/150?u=doctor" class="w-24 h-24 rounded-full object-cover border-4 border-slate-50 dark:border-slate-700" alt="Profile" />
            <div class="flex-1 text-center md:text-left">
              <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ form.fullName }}</h3>
              <p class="text-slate-500 dark:text-slate-400 text-sm">{{ form.email }}</p>
              <div class="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">License: {{ form.license }}</div>
            </div>
            <button class="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition">Upload New Picture</button>
          </div>

          <!-- Card 2: Form Input -->
          <div class="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">Personal Information</h3>

            <form @submit.prevent="saveChanges" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Full Name -->
                <div>
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                  <input
                    v-model="form.fullName"
                    type="text"
                    class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
                  />
                </div>
                <!-- Professional Title -->
                <div>
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Professional Title</label>
                  <input
                    v-model="form.title"
                    type="text"
                    class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Email -->
                <div>
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                  <input
                    v-model="form.email"
                    type="email"
                    class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
                  />
                </div>
                <!-- Phone -->
                <div>
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                  <input
                    v-model="form.phone"
                    type="text"
                    class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
                  />
                </div>
              </div>

              <!-- Bio -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Professional Bio</label>
                <textarea
                  v-model="form.bio"
                  rows="4"
                  class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white resize-none"
                ></textarea>
                <p class="text-xs text-slate-400 mt-2 text-right">240/500 characters</p>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button type="button" class="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition">Cancel</button>
                <button type="submit" class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 transition flex items-center gap-2" :disabled="isLoading">
                  <Icon v-if="isLoading" name="svg-spinners:ring-resize" class="w-5 h-5" />
                  <span>{{ isLoading ? "Saving..." : "Save Changes" }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- === TAB: PREFERENCES (Placeholder) === -->
        <div v-if="activeTab === 'preferences'" class="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center py-20">
          <div class="bg-blue-50 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="heroicons:adjustments-horizontal" class="w-8 h-8 text-blue-500" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Preferences Settings</h3>
          <p class="text-slate-500">Theme and notification settings will go here.</p>
        </div>

        <!-- === TAB: SECURITY (Placeholder) === -->
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
