import { db } from "../../utils/db";
import { eq } from "drizzle-orm";
import { consultations, patients } from "../../database/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.patientId) {
    throw createError({ statusCode: 400, statusMessage: "Patient ID wajib dikirim." });
  }

  try {
    // --- 🛡️ TAMBAHAN: CEK PASIEN DULU ---
    const patientCheck = await db.select().from(patients).where(eq(patients.id, body.patientId)).limit(1);

    if (patientCheck.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Data Pasien tidak ditemukan di Database. Mohon kembali ke menu Pasien.",
      });
    }
    // ------------------------------------

    const newSession = await db
      .insert(consultations)
      .values({
        patientId: body.patientId,
        transcript: body.transcript || "",
        subjective: body.subjective || "",
        objective: body.objective || "",
        assessment: body.assessment || "",
        plan: body.plan || "",
        summary: body.summary || `${body.assessment} - ${body.plan}`,
        status: "ready",
        duration: body.duration || 0,
      })
      .returning();

    return {
      success: true,
      message: "Consultation Success Saved!",
      data: newSession[0],
    };
  } catch (error) {
    console.error("Create Consultation Error:", error);
    throw createError({ statusCode: 500, statusMessage: "Gagal membuat sesi konsultasi." });
  }
});
