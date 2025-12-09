import { db } from "../../utils/db";
import { patients, consultations } from "../../database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.id) {
    throw createError({ statusCode: 400, statusMessage: "ID Pasien diperlukan." });
  }

  try {
    // 1. CEK KEAMANAN: Apakah pasien ini punya riwayat konsultasi?
    const existingConsultations = await db.select().from(consultations).where(eq(consultations.patientId, body.id));

    if (existingConsultations.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Tidak dapat menghapus pasien ini karena memiliki riwayat konsultasi medis. Arsipkan saja.",
      });
    }

    // 2. Kalau bersih, baru hapus
    await db.delete(patients).where(eq(patients.id, body.id));

    return {
      success: true,
      message: "Data pasien berhasil dihapus permanen.",
    };
  } catch (error: any) {
    // Tangkap error yang kita lempar di atas
    if (error.statusCode === 400) throw error;

    console.error("Delete Patient Error:", error);
    throw createError({ statusCode: 500, statusMessage: "Gagal menghapus pasien." });
  }
});
