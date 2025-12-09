import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";

// --- 1. TABEL DOKTER (doctors) ---
export const doctors = pgTable("doctors", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Login Info
  email: text("email").unique().notNull(),
  medicalId: text("medical_id").unique().notNull(), // STR / License Number
  password: text("password").notNull(), // Password terenkripsi

  // Profil Dasar
  fullName: text("full_name").notNull(),
  specialization: text("specialization").default("General Practitioner"),

  // Data Profil Tambahan (Settings)
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  phone: text("phone"),
  address: text("address"),
  gender: text("gender"), // Male/Female
  birthDate: timestamp("birth_date"), // Tanggal Lahir

  // Timestamp Wajib
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- 2. TABEL PASIEN (patients) ---
export const patients = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  nik: text("nik").unique(),
  bpjsNumber: text("bpjs_number"),
  phone: text("phone"),

  avatarUrl: text("avatar_url"),
  gender: text("gender"),
  birthDate: timestamp("birth_date"),
  address: text("address"),

  bloodType: text("blood_type"),
  allergies: text("allergies"),
  chronicConditions: text("chronic_conditions"),
  height: integer("height"),
  weight: integer("weight"),

  doctorId: uuid("doctor_id").references(() => doctors.id),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- 3. TABEL KONSULTASI (consultations) ---
export const consultations = pgTable("consultations", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Data Rekaman Audio
  audioUrl: text("audio_url"), // Link file di cloud
  duration: integer("duration"), // Durasi dalam detik
  transcript: text("transcript"), // Hasil Text-to-Speech (Whisper)

  // Hasil Analisa AI (SOAP)
  subjective: text("subjective"),
  objective: text("objective"),
  assessment: text("assessment"),
  plan: text("plan"),
  summary: text("summary"), // Ringkasan singkat

  // Status Proses AI: 'draft', 'processing', 'done'
  status: text("status").default("draft"),

  // Relasi: Konsultasi ini milik Pasien siapa & Dokter siapa?
  patientId: uuid("patient_id").references(() => patients.id),
  doctorId: uuid("doctor_id").references(() => doctors.id),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
