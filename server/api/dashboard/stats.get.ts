import { db } from "../../utils/db";
import { patients, consultations } from "../../database/schema";
import { eq, gte, sql, desc } from "drizzle-orm";

export default defineEventHandler(async (_event) => {
  try {
    const patientCountResult = await db.select({ count: sql<number>`count(*)` }).from(patients);
    const totalPatients = Number(patientCountResult[0].count);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysAppointments = await db
      .select({
        id: consultations.id,
        time: consultations.createdAt,
        status: consultations.status,
        patientName: patients.name,
        patientId: patients.nik,
        avatarUrl: patients.avatarUrl,
      })
      .from(consultations)
      .innerJoin(patients, eq(consultations.patientId, patients.id))
      .where(gte(consultations.createdAt, today))
      .orderBy(desc(consultations.createdAt));

    const consultationsToday = todaysAppointments.length;

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
