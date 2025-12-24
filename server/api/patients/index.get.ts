import { db } from "../../utils/db";
import { patients } from "../../database/schema";
import { desc } from "drizzle-orm";

export default defineEventHandler(async (_event) => {
  try {
    // const allPatients = await db.select().from(patients).orderBy(desc(patients.createdAt));
    const allPatients = await db
      .select({
        id: patients.id,
        name: patients.name,
        nik: patients.nik,
        gender: patients.gender,
        age: patients.age,
        address: patients.address,
        phone: patients.phone,
        bpjsNumber: patients.bpjsNumber,
        birthDate: patients.birthDate,
        status: patients.status,
        avatarUrl: patients.avatarUrl,
        lastVisit: patients.lastVisit,
        createdAt: patients.createdAt,
      })
      .from(patients)
      .orderBy(desc(patients.createdAt));

    return {
      success: true,
      data: allPatients,
    };
  } catch (error) {
    console.error("Gagal ambil data pasien:", error);
    return {
      success: false,
      message: "Gagal mengambil data pasien",
      data: [],
    };
  }
});
