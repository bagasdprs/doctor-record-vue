import { db } from "../../utils/db";
import { patients } from "../../database/schema";
import { eq } from "drizzle-orm";

const calculateAge = (birthDateString: string) => {
  if (!birthDateString) return null;
  const birthDate = new Date(birthDateString);
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

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
      bloodType: body.bloodType || null,
      allergies: body.allergies || null,
      chronicConditions: body.chronicConditions || null,
      height: body.height ? parseInt(body.height) : null,
      weight: body.weight ? parseInt(body.weight) : null,
      birthDate: body.birthDate ? new Date(body.birthDate).toISOString() : null,
      age: body.birthDate ? calculateAge(body.birthDate) : undefined,
      updatedAt: new Date(), // Update timestamp
    };

    const updatedPatient = await db.update(patients).set(updateData).where(eq(patients.id, body.id)).returning();

    return {
      success: true,
      message: "Data pasien berhasil diperbarui!",
      data: updatedPatient[0],
    };
    // ------------------------------------------------
  } catch (error: any) {
    if (error.code === "23505") {
      throw createError({ statusCode: 409, statusMessage: "NIK sudah terdaftar oleh pasien lain." });
    }
    console.error("Update Patient Error:", error);
    throw createError({ statusCode: 500, statusMessage: "Gagal mengupdate pasien." });
  }
});
