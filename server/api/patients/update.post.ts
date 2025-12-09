import { db } from "../../utils/db";
import { patients } from "../../database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validasi ID wajib ada untuk update
  if (!body.id) {
    throw createError({ statusCode: 400, statusMessage: "ID Pasien diperlukan." });
  }

  try {
    const updateData = {
      name: body.name,
      nik: body.nik || null,
      bpjsNumber: body.bpjsNumber || null,
      phone: body.phone || null,
      avatarUrl: body.avatarUrl || null,
      gender: body.gender,
      address: body.address || null,
      birthDate: body.birthDate ? new Date(body.birthDate) : null,
      updatedAt: new Date(), // Update timestamp
    };

    // Eksekusi Update
    const updatedPatient = await db.update(patients).set(updateData).where(eq(patients.id, body.id)).returning();

    return {
      success: true,
      message: "Data pasien berhasil diperbarui!",
      data: updatedPatient[0],
    };
  } catch (error: any) {
    // Handle error unik (misal ganti NIK jadi punya orang lain)
    if (error.code === "23505") {
      throw createError({ statusCode: 409, statusMessage: "NIK sudah terdaftar oleh pasien lain." });
    }
    console.error("Update Patient Error:", error);
    throw createError({ statusCode: 500, statusMessage: "Gagal mengupdate pasien." });
  }
});
