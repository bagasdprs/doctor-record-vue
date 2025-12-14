import { db } from "../../utils/db";
import { consultations, patients } from "../../database/schema";
import { eq, desc } from "drizzle-orm";

// Pastikan export default ada dan membungkus defineEventHandler
export default defineEventHandler(async (_event) => {
  try {
    const result = await db
      .select({
        id: consultations.id,
        patientId: consultations.patientId,

        patientName: patients.name,
        pid: patients.nik,

        // Data Medis
        complaint: consultations.subjective,
        diagnosis: consultations.assessment,
        status: consultations.status,

        // Waktu
        createdAt: consultations.createdAt,
      })
      .from(consultations)
      .leftJoin(patients, eq(consultations.patientId, patients.id))
      .orderBy(desc(consultations.createdAt));

    // Balikkan response
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Get Consultations Error:", error);
    throw createError({ statusCode: 500, statusMessage: "Gagal mengambil data konsultasi." });
  }
});
