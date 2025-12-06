# 🩺 Doctor Record Apps

**Doctor Record Apps** is a modern web application designed to streamline the documentation process for medical professionals.

The core focus of this application is the **AI Medical Scribe** feature. Doctors can simply record their consultation sessions, and the system uses advanced AI to automatically transcribe (Speech-to-Text) and summarize the conversation into standard **SOAP (Subjective, Objective, Assessment, Plan)** notes.

## 🚀 Tech Stack

Built with high-performance modern frontend technologies:

- **Framework:** [Nuxt 3](https://nuxt.com) (Vue.js 3 Framework)
- **Language:** TypeScript (Strict Typing)
- **Styling:** Tailwind CSS v4 (via Vite Plugin)
- **State Management:** Pinia
- **Audio Handling:** VueUse (Media Controls)
- **Icons:** Nuxt Icon (Iconify)
- **Backend:** Nuxt Server Routes (Nitro)
- **Database:** PostgreSQL (Local / Supabase ready)
- **ORM:** Drizzle ORM (Type-safe SQL)
- **Security:** Bcrypt.js (Password Hashing)

**Planned AI Integrations:**

- 🤖 **Speech-to-Text:** OpenAI Whisper
- 🧠 **Summarizer:** Google Gemini AI

## ✨ Key Features (In Development)

- [x] **Doctor Authentication:** Secure Login & Register with professional validation (STR Number & Specialization).
- [x] **Interactive Dashboard:** Real-time daily patient summary and queue status.
- [x] **Patient Management:** Comprehensive patient list and medical history details.
- [ ] **Voice Recorder:** Integrated browser-based audio recording for consultations.
- [ ] **AI SOAP Generator:** Automated voice-to-text conversion into structured SOAP notes.
- [ ] **Medical Export:** Print diagnosis results or prescriptions as PDF.

## ✨ Fitur Utama (Progress Update)

- [x] **Autentikasi Dokter:**
  - Login & Register Aman (Encrypted Password).
  - Validasi Data Profesi (STR & Spesialisasi).
- [x] **Manajemen Profil:** (BARU)
  - Update Biodata Dokter via Settings.
  - Upload Foto Profil (Base64 Storage).
- [x] **Dashboard Interaktif:**
  - Dark Mode / Light Mode Toggle. (BARU)
  - Collapsible Sidebar dengan Animasi. (BARU)
  - Real-time User Data Binding (Pinia Store).
- [x] **Konsultasi UI:** (BARU - Sebelumnya Voice Recorder masih kosong)
  - List Riwayat Pasien.
  - Live Recording Interface (Timer & Waveform Visualizer).
- [ ] **Voice Recorder & AI:** Integrasi Whisper & Gemini (Masih Pending).
- [ ] **Medical Export:** Print diagnosis results (Masih Pending).

## 📂 Project Structure

This project follows the standard Nuxt 3 root-level structure for better maintainability:

```bash
doctor-record-apps/
├── assets/             # CSS (Tailwind) & Global Assets
├── components/         # Reusable UI Components
├── layouts/            # Layouts (Auth & Dashboard Sidebar)
├── middleware/         # Route Guards
├── pages/              # Application Routes
├── server/
│   ├── api/            # Backend Endpoints (Auth, Doctors, etc.)
│   ├── database/       # Drizzle Schema & Seeding
│   └── utils/          # Database Connection
├── stores/             # Pinia State Management
├── app.vue             # Root Component
├── drizzle.config.ts   # Database Configuration
└── nuxt.config.ts      # Nuxt Configuration
```

🛠️ Getting Started (Installation)
Ensure you have Node.js (version 18+ recommended) installed.

1. Clone the Repository:

```bash
git clone [https://github.com/bagasdprs/doctor-record-vue.git](https://github.com/bagasdprs/doctor-record-vue.git)
cd doctor-record-apps
```

2. Install Dependencies:

```bash
npm install
```

3. Buat file _.env_ dan isi URL Database:

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5433/doctor_record_apps"
```

4. Setup Database (Drizzle):

```bash
# Membuat Tabel
npx drizzle-kit push

# Mengisi Data Dummy (Optional)
npx tsx server/database/seed.ts
```

5. Run Development Server:

```bash
npm run dev
```

6. Open in Browser: Visit http://localhost:3000

---

## 📝 Important Notes

This project utilizes Tailwind CSS v4 with the Vite Plugin configuration in Nuxt. Please ensure you do not modify the assets folder structure or nuxt.config.ts arbitrarily, as it may break the styling system.

Made with ❤️ and a lot of coffee by Bagas Dwiprasandi.

---
