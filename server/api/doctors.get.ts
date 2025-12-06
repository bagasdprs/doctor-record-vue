import { db } from "../utils/db";
import { doctors } from "../database/schema";
import { desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const allDoctors = await db
      .select({
        id: doctors.id,
        fullName: doctors.fullName,
        email: doctors.email,
        medicalId: doctors.medicalId,
        specialization: doctors.specialization,
        createdAt: doctors.createdAt,
      })
      .from(doctors)
      .orderBy(desc(doctors.createdAt));

    return {
      success: true,
      total: allDoctors.length,
      data: allDoctors,
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal mengambil data dokter",
      error: error,
    };
  }
});
