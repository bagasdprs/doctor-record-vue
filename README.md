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

## 📂 Project Structure

This project follows the standard Nuxt 3 root-level structure for better maintainability:

```bash
doctor-record-apps/
├── assets/             # CSS (Tailwind) & Global Assets
├── components/         # Reusable UI Components
├── layouts/            # Layouts (Auth & Dashboard Sidebar)
├── middleware/         # Route Guards
├── pages/              # Application Routes (File-based Routing)
├── server/             # API Routes & Backend Logic
├── stores/             # Pinia State Management
├── app.vue             # Root Component
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

3. Run Development Server:

```bash
npm run dev
```

4. Open in Browser: Visit http://localhost:3000

---

## 📝 Important Notes

This project utilizes Tailwind CSS v4 with the Vite Plugin configuration in Nuxt. Please ensure you do not modify the assets folder structure or nuxt.config.ts arbitrarily, as it may break the styling system.

Made with ❤️ and a lot of coffee by Bagas Dwiprasandi.

---

### Final Steps:

1.  Update the file.
2.  Run these commands to update your GitHub:

```bash
git add README.md
git commit -m "Docs: Update README to English version"
git push
```
