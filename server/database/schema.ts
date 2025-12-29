import { pgTable, text, timestamp, uuid, integer, date, pgEnum, serial } from "drizzle-orm/pg-core";

// --- 0. ENUMS (Pilihan Tetap) ---
export const roleEnum = pgEnum("role", ["doctor", "midwife", "pharmacist", "receptionist", "admin"]);
export const statusEnum = pgEnum("status", ["active", "inactive", "archived"]);

// --- 1. TABEL USER (Dulu 'doctors', sekarang untuk SEMUA Staff) ---
export const users = pgTable("users", {
  id: text("id")
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  birthDate: date("birth_date"),
  gender: text("gender"),
  role: roleEnum("role").default("doctor"),
  medicalId: text("medical_id").unique(),
  specialization: text("specialization"),
  clinicName: text("clinic_name"),
  avatarUrl: text("avatar_url"),
  phone: text("phone"),
  address: text("address"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // id: uuid("id").defaultRandom().primaryKey(),
});

// --- 2. TABEL PASIEN (patients) ---
export const patients = pgTable("patients", {
  id: text("id")
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  name: text("name").notNull(),
  patientId: text("patient_id_number"), // No RM (Misal: #PT-8921)
  age: integer("age"),
  nik: text("nik").unique(),
  bpjsNumber: text("bpjs_number"),
  phone: text("phone"),
  address: text("address"),
  gender: text("gender"),
  birthDate: date("birth_date"),
  avatarUrl: text("avatar_url"),
  bloodType: text("blood_type"),
  allergies: text("allergies"),
  chronicConditions: text("chronic_conditions"),
  height: integer("height"),
  weight: integer("weight"),
  primaryCareId: text("primary_care_id").references(() => users.id),
  type: text("type").default("pregnant"),
  status: text("status").default("Normal"),
  pregnancyStage: text("pregnancy_stage"),
  babyWeight: text("baby_weight"),
  babyFeeding: text("baby_feeding"),
  postpartumRecovery: text("postpartum_recovery"),
  lastVisit: text("last_visit"),
  nextAppt: timestamp("next_appt"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // primaryCareId: uuid("primary_care_id").references(() => users.id),
  // id: uuid("id").defaultRandom().primaryKey(),
});

// --- 3. TABEL KONSULTASI (consultations) - Wilayah Dokter ---
export const consultations = pgTable("consultations", {
  // id: uuid("id").defaultRandom().primaryKey(),
  id: serial("id").primaryKey(),
  patientId: text("patient_id").references(() => patients.id),
  doctorId: text("doctor_id").references(() => users.id),
  transcript: text("transcript"),
  duration: integer("duration"),
  subjective: text("subjective"),
  objective: text("objective"),
  assessment: text("assessment"),
  plan: text("plan"),
  summary: text("summary"),
  status: text("status").default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- 4. TABEL KEHAMILAN (pregnancy_records) - Wilayah Bidan 🤰 ---
export const pregnancyRecords = pgTable("pregnancy_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  patientId: text("patient_id").references(() => patients.id),
  midwifeId: text("midwife_id").references(() => users.id),
  hpht: date("hpht"),
  hpl: date("hpl"),
  gestationalAge: integer("gestational_age"),
  weight: integer("weight"),
  bloodPressure: text("blood_pressure"),
  fetalHeartRate: integer("fetal_heart_rate"),
  notes: text("notes"),
  riskStatus: text("risk_status").default("Low"),
  createdAt: timestamp("created_at").defaultNow(),
  // patientId: uuid("patient_id")
  //   .references(() => patients.id)
  //   .notNull(),
  // midwifeId: uuid("midwife_id").references(() => users.id),
});

// --- 5. TABEL OBAT (inventory) - Wilayah Apoteker 💊 ---
export const inventory = pgTable("inventory", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  category: text("category"),
  sku: text("sku").unique(),
  stock: integer("stock").default(0),
  minStock: integer("min_stock").default(10),
  unit: text("unit"),
  price: integer("price"),
  expiryDate: date("expiry_date"),
  batchNumber: text("batch_number"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- 6. TABEL RESEP (prescriptions) - Jembatan Dokter & Apoteker ---
export const prescriptions = pgTable("prescriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  consultationId: integer("consultation_id").references(() => consultations.id),
  patientId: text("patient_id").references(() => patients.id),
  prescribedBy: text("prescribed_by").references(() => users.id),
  status: text("status").default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  // consultationId: uuid("consultation_id").references(() => consultations.id),
  // patientId: uuid("patient_id").references(() => patients.id),
  // prescribedBy: uuid("prescribed_by").references(() => users.id),
});

// --- 7. ITEM RESEP (prescription_items) ---
export const prescriptionItems = pgTable("prescription_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  prescriptionId: uuid("prescription_id").references(() => prescriptions.id),
  inventoryId: uuid("inventory_id").references(() => inventory.id),
  quantity: integer("quantity").notNull(),
  dosage: text("dosage"),
});
