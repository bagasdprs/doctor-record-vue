import { db } from "../../utils/db";
import { consultations } from "../../database/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.patientId) {
    throw createError({ statusCode: 400, statusMessage: "Patient ID wajib dikirim." });
  }

  try {
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
        status: "Ready",
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
