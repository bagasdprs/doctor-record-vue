import { db } from "../../utils/db";
import { consultations } from "../../database/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Kita butuh ID Pasien untuk membuat sesi
  if (!body.patientId) {
    throw createError({ statusCode: 400, statusMessage: "Patient ID wajib dikirim." });
  }

  try {
    // Buat data konsultasi baru (Status: draft)
    // Waktunya otomatis NOW() / Hari ini
    const newSession = await db
      .insert(consultations)
      .values({
        patientId: body.patientId,
        // Nanti doctorId bisa diambil dari session login (sementara hardcode/null gpp)
        // doctorId: user.id
        status: "draft", // Status awal
        transcript: "",
        summary: "",
      })
      .returning();

    return {
      success: true,
      message: "Sesi konsultasi dibuat!",
      data: newSession[0],
    };
  } catch (error) {
    console.error("Create Consultation Error:", error);
    throw createError({ statusCode: 500, statusMessage: "Gagal membuat sesi konsultasi." });
  }
});
