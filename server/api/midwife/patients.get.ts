import { db } from "../../utils/db";
import { patients } from "../../database/schema";
import { desc, inArray } from "drizzle-orm"; // Tambahkan 'inArray'

export default defineEventHandler(async (_event) => {
  try {
    // --- 🔍 FILTER KHUSUS BIDAN ---
    // Bidan cuma boleh liat: Ibu Hamil, Bayi, dan Ibu Nifas
    const midwifePatientTypes = ["pregnant", "baby", "postpartum"];

    // Query Database dengan Filter
    const rawPatients = await db
      .select()
      .from(patients)
      .where(inArray(patients.type, midwifePatientTypes)) // <--- INI KUNCINYA!
      .orderBy(desc(patients.createdAt));

    // Mapping data ke format Frontend (Sama kayak sebelumnya)
    const formattedData = rawPatients.map((p) => ({
      id: p.id,
      name: p.name,
      patientId: p.patientId || "#-",
      avatar: p.avatarUrl || `https://ui-avatars.com/api/?name=${p.name}&background=random`,
      age: p.age ? `${p.age} th` : "-",

      type: p.type as "pregnant" | "baby" | "postpartum",
      status: p.status as "High Risk" | "Normal" | "Newborn" | "Monitoring" | "Overdue",

      stage: p.pregnancyStage || "-",
      weight: p.babyWeight || "-",
      feeding: p.babyFeeding || "-",
      recovery: p.postpartumRecovery || "-",

      lastVisit: p.lastVisit || "Belum ada",
      nextAppt: p.nextAppt ? new Date(p.nextAppt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Belum dijadwalkan",
    }));

    return {
      success: true,
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching midwife patients:", error);
    return {
      success: false,
      message: "Gagal mengambil data pasien",
      data: [],
    };
  }
});
