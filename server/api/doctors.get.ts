import { db } from "../utils/db";
import { users } from "../database/schema"; // GANTI 'doctors' JADI 'users'
import { desc, eq } from "drizzle-orm";

export default defineEventHandler(async (_event) => {
  try {
    // Ambil data user yang role-nya 'doctor' saja
    const allDoctors = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        medicalId: users.medicalId,
        specialization: users.specialization,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.role, "doctor")) // Filter: Cuma dokter
      .orderBy(desc(users.createdAt));

    return {
      success: true,
      total: allDoctors.length,
      data: allDoctors,
    };
  } catch (error) {
    console.error("Get Doctors Error:", error);
    return {
      success: false,
      message: "Gagal mengambil data dokter",
      error: error,
    };
  }
});
