import { db } from "../../utils/db";
import { patients, consultations, users } from "../../database/schema"; // GANTI 'doctors' JADI 'users'
import { eq, desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "ID Pasien diperlukan" });
  }

  try {
    const patientData = await db.select().from(patients).where(eq(patients.id, id));

    if (!patientData.length) {
      throw createError({ statusCode: 404, statusMessage: "Pasien tidak ditemukan" });
    }

    // Join dengan tabel users (bukan doctors)
    const history = await db
      .select({
        id: consultations.id,
        createdAt: consultations.createdAt,
        status: consultations.status,
        subjective: consultations.subjective,
        assessment: consultations.assessment,
        doctorName: users.fullName, // Ambil dari users
        doctorSpecialization: users.specialization, // Ambil dari users
      })
      .from(consultations)
      .leftJoin(users, eq(consultations.doctorId, users.id)) // Join users
      .where(eq(consultations.patientId, id))
      .orderBy(desc(consultations.createdAt));

    return {
      success: true,
      data: {
        ...patientData[0],
        history: history,
      },
    };
  } catch (error) {
    console.error("Detail Patient Error:", error);
    throw createError({ statusCode: 500, statusMessage: "Gagal mengambil detail pasien" });
  }
});
