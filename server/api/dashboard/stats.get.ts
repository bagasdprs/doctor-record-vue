import { db } from "../../utils/db";
import { patients, consultations } from "../../database/schema";
import { sql } from "drizzle-orm";

export default defineEventHandler(async (_event) => {
  try {
    // 1. Hitung Total Pasien & Konsultasi Hari Ini
    const totalPatientsResult = await db.select({ count: sql<number>`count(*)` }).from(patients);
    const totalPatients = Number(totalPatientsResult[0].count);

    // Hitung konsultasi hari ini
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const consultationsTodayResult = await db.execute(sql`SELECT COUNT(*) as count FROM ${consultations} WHERE DATE(created_at) = ${today}`);
    const consultationsToday = Number(consultationsTodayResult[0].count);

    // Hitung Pending (Status != 'done')
    const pendingResult = await db.execute(sql`SELECT COUNT(*) as count FROM ${consultations} WHERE status != 'Done' AND status != 'Ready'`);
    const pendingSummary = Number(pendingResult[0].count);

    // 2. DATA CHART 7 HARI TERAKHIR (The Real Logic) 🔥
    // Kita ambil data 7 hari ke belakang
    const chartData = await db.execute(sql`
      WITH last_7_days AS (
        SELECT generate_series(
          current_date - interval '6 days',
          current_date,
          '1 day'
        )::date AS date
      )
      SELECT
        to_char(d.date, 'Dy') as day_name, -- Mon, Tue, Wed
        (SELECT COUNT(*) FROM ${patients} WHERE DATE(created_at) = d.date) as new_patients,
        (SELECT COUNT(*) FROM ${consultations} WHERE DATE(created_at) = d.date) as consultations
      FROM last_7_days d
      ORDER BY d.date ASC;
    `);

    // Format data biar gampang dibaca frontend
    // Mapping hasil query ke array angka
    const newPatientsTrend = chartData.map((row: any) => Number(row.new_patients));
    const consultationsTrend = chartData.map((row: any) => Number(row.consultations));
    const labels = chartData.map((row: any) => row.day_name);

    // 3. Ambil Appointment Hari Ini (List Bawah)
    const appointmentsResult = await db.execute(sql`
      SELECT
        c.id,
        p.name as "patientName",
        p.nik as "patientId",
        p.avatar_url as "avatarUrl",
        c.created_at as time
      FROM ${consultations} c
      JOIN ${patients} p ON c.patient_id = p.id
      WHERE DATE(c.created_at) = ${today}
      ORDER BY c.created_at DESC
      LIMIT 5
    `);

    return {
      success: true,
      stats: {
        totalPatients,
        consultationsToday,
        pendingSummary,
      },
      chart: {
        labels, // ['Mon', 'Tue', ...]
        newPatients: newPatientsTrend, // [0, 2, 1, ...]
        recurring: consultationsTrend, // [5, 8, 3, ...]
      },
      appointments: appointmentsResult,
    };
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    throw createError({ statusCode: 500, statusMessage: "Gagal memuat statistik." });
  }
});
