CREATE TYPE "public"."role" AS ENUM('doctor', 'midwife', 'pharmacist', 'receptionist', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'inactive', 'archived');--> statement-breakpoint
CREATE TABLE "consultations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"doctor_id" uuid,
	"transcript" text,
	"duration" integer,
	"subjective" text,
	"objective" text,
	"assessment" text,
	"plan" text,
	"summary" text,
	"status" text DEFAULT 'draft',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text,
	"sku" text,
	"stock" integer DEFAULT 0,
	"min_stock" integer DEFAULT 10,
	"unit" text,
	"price" integer,
	"expiry_date" date,
	"batch_number" text,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "inventory_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"patient_id_number" text,
	"age" integer,
	"nik" text,
	"bpjs_number" text,
	"phone" text,
	"address" text,
	"gender" text,
	"birth_date" date,
	"avatar_url" text,
	"blood_type" text,
	"allergies" text,
	"chronic_conditions" text,
	"height" integer,
	"weight" integer,
	"primary_care_id" uuid,
	"type" text DEFAULT 'pregnant',
	"status" text DEFAULT 'Normal',
	"pregnancy_stage" text,
	"baby_weight" text,
	"baby_feeding" text,
	"postpartum_recovery" text,
	"last_visit" text,
	"next_appt" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "patients_nik_unique" UNIQUE("nik")
);
--> statement-breakpoint
CREATE TABLE "pregnancy_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"midwife_id" uuid,
	"hpht" date,
	"hpl" date,
	"gestational_age" integer,
	"weight" integer,
	"blood_pressure" text,
	"fetal_heart_rate" integer,
	"notes" text,
	"risk_status" text DEFAULT 'Low',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "prescription_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prescription_id" uuid,
	"inventory_id" uuid,
	"quantity" integer NOT NULL,
	"dosage" text
);
--> statement-breakpoint
CREATE TABLE "prescriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"consultation_id" uuid,
	"patient_id" uuid,
	"prescribed_by" uuid,
	"status" text DEFAULT 'pending',
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"full_name" text NOT NULL,
	"role" "role" DEFAULT 'doctor',
	"medical_id" text,
	"specialization" text,
	"clinic_name" text,
	"avatar_url" text,
	"phone" text,
	"address" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_medical_id_unique" UNIQUE("medical_id")
);
--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_doctor_id_users_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_primary_care_id_users_id_fk" FOREIGN KEY ("primary_care_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pregnancy_records" ADD CONSTRAINT "pregnancy_records_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pregnancy_records" ADD CONSTRAINT "pregnancy_records_midwife_id_users_id_fk" FOREIGN KEY ("midwife_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription_items" ADD CONSTRAINT "prescription_items_prescription_id_prescriptions_id_fk" FOREIGN KEY ("prescription_id") REFERENCES "public"."prescriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription_items" ADD CONSTRAINT "prescription_items_inventory_id_inventory_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_prescribed_by_users_id_fk" FOREIGN KEY ("prescribed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;