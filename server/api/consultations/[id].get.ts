import { db } from "../../utils/db";
import { consultations, patients } from "../../database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "ID Consultation Required" });
  }

  try {
    const result = await db
      .select({
        // Ambil semua kolom konsultasi
        id: consultations.id,
        transcript: consultations.transcript,
        subjective: consultations.subjective,
        objective: consultations.objective,
        assessment: consultations.assessment,
        plan: consultations.plan,
        summary: consultations.summary,
        status: consultations.status,
        createdAt: consultations.createdAt,
        patientId: consultations.patientId,

        // Ambil data pasien juga (JOIN)
        patientName: patients.name,
        patientGender: patients.gender,
        patientBirthDate: patients.birthDate,
      })
      .from(consultations)
      .leftJoin(patients, eq(consultations.patientId, patients.id))
      .where(eq(consultations.id, id));

    if (!result.length) {
      throw createError({ statusCode: 404, statusMessage: "Consultation not found" });
    }

    return {
      success: true,
      data: result[0], // Balikin object langsung, bukan array
    };
  } catch (error) {
    console.error("Get Detail Error:", error);
    throw createError({ statusCode: 500, statusMessage: "Error fetching consultation detail." });
  }
});
