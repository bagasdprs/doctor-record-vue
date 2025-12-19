import { db } from "../../utils/db";
import { patients } from "../../database/schema";
import { eq, or, sql, gte, lt, and } from "drizzle-orm";

export default defineEventHandler(async (_event) => {
  try {
    // 1. HITUNG STATISTIK (Cards di atas)
    const statsQuery = await db
      .select({
        totalPregnant: sql<number>`count(*) filter (where ${patients.type} = 'pregnant')`,
        totalBaby: sql<number>`count(*) filter (where ${patients.type} = 'baby')`,
        criticalAlerts: sql<number>`count(*) filter (where ${patients.status} = 'High Risk' OR ${patients.status} = 'Overdue')`,
        weeklySchedule: sql<number>`count(*) filter (where ${patients.nextAppt} >= now() AND ${patients.nextAppt} < now() + interval '7 days')`,
      })
      .from(patients);

    const stats = statsQuery[0];

    // 2. AMBIL LIST PASIEN RISIKO TINGGI (High Risk Widget)
    const highRiskList = await db
      .select()
      .from(patients)
      .where(or(eq(patients.status, "High Risk"), eq(patients.status, "Monitoring"), eq(patients.status, "Overdue")))
      .orderBy(patients.nextAppt)
      .limit(4);

    // 3. AMBIL JADWAL HARI INI
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysSchedule = await db
      .select()
      .from(patients)
      .where(and(gte(patients.nextAppt, today), lt(patients.nextAppt, tomorrow)))
      .orderBy(patients.nextAppt);

    return {
      success: true,
      data: {
        stats: {
          totalPregnant: Number(stats.totalPregnant),
          totalBaby: Number(stats.totalBaby),
          criticalAlerts: Number(stats.criticalAlerts),
          weeklySchedule: Number(stats.weeklySchedule),
        },
        highRiskPatients: highRiskList,
        todaysSchedule: todaysSchedule,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, data: null };
  }
});
