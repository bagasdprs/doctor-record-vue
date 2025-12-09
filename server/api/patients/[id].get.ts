import { db } from "../../utils/db";
import { patients, consultations, doctors } from "../../database/schema";
import { eq, desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  // Tangkap ID dari URL (misal: /api/patients/123-abc)
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "ID Pasien diperlukan" });
  }

  try {
    // 1. Ambil Data Diri Pasien
    const patientData = await db.select().from(patients).where(eq(patients.id, id));

    if (!patientData.length) {
      throw createError({ statusCode: 404, statusMessage: "Pasien tidak ditemukan" });
    }

    // 2. Ambil Riwayat Konsultasi (Join dengan Dokter)
    // Kita butuh nama dokter yang memeriksa di masa lalu
    const history = await db
      .select({
        id: consultations.id,
        createdAt: consultations.createdAt,
        status: consultations.status,
        subjective: consultations.subjective, // Keluhan utama
        assessment: consultations.assessment, // Diagnosa
        doctorName: doctors.fullName,
        doctorSpecialization: doctors.specialization,
      })
      .from(consultations)
      .leftJoin(doctors, eq(consultations.doctorId, doctors.id))
      .where(eq(consultations.patientId, id))
      .orderBy(desc(consultations.createdAt)); // Urutkan dari yang terbaru

    // 3. Gabungkan dan Kirim
    return {
      success: true,
      data: {
        ...patientData[0],
        history: history, // Masukkan riwayat ke dalam object pasien
      },
    };
  } catch (error) {
    console.error("Detail Patient Error:", error);
    throw createError({ statusCode: 500, statusMessage: "Gagal mengambil detail pasien" });
  }
});
