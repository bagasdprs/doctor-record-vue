import { db } from "../../utils/db";
import { patients, consultations } from "../../database/schema";
import { eq, gte, sql, desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    // 1. Hitung Total Pasien
    // Menggunakan raw SQL count untuk performa
    const patientCountResult = await db.select({ count: sql<number>`count(*)` }).from(patients);
    const totalPatients = Number(patientCountResult[0].count);

    // 2. Tentukan Rentang Waktu "HARI INI" (Mulai jam 00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 3. Ambil Konsultasi Hari Ini (Join dengan data Pasien)
    // Kita cari konsultasi yang dibuat (createdAt) >= Hari Ini jam 00:00
    const todaysAppointments = await db
      .select({
        id: consultations.id,
        time: consultations.createdAt, // Waktu dibuat
        status: consultations.status,
        // Ambil data pasien lewat Join
        patientName: patients.name,
        patientId: patients.nik, // Kita pakai NIK atau ID database sebagai display ID
        avatarUrl: patients.avatarUrl,
      })
      .from(consultations)
      .innerJoin(patients, eq(consultations.patientId, patients.id))
      .where(gte(consultations.createdAt, today))
      .orderBy(desc(consultations.createdAt));

    // 4. Hitung Statistik Lainnya
    const consultationsToday = todaysAppointments.length;

    // Hitung yang statusnya masih 'draft' (Pending AI)
    const pendingSummary = todaysAppointments.filter((c) => c.status === "draft").length;

    return {
      success: true,
      stats: {
        totalPatients,
        consultationsToday,
        pendingSummary,
      },
      appointments: todaysAppointments,
    };
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return {
      success: false,
      message: "Gagal memuat data dashboard",
      stats: { totalPatients: 0, consultationsToday: 0, pendingSummary: 0 },
      appointments: [],
    };
  }
});
