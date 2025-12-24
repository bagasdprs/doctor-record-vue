import { db } from "../../utils/db";
import { patients } from "../../database/schema";

// Helper simpel buat hitung umur
const calculateAge = (birthDateString: string) => {
  if (!birthDateString) return null;
  const birthDate = new Date(birthDateString);
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.name || !body.gender) {
    throw createError({ statusCode: 400, statusMessage: "Nama dan Gender wajib diisi." });
  }

  // HITUNG UMUR DISINI
  const calculatedAge = body.birthDate ? calculateAge(body.birthDate) : null;

  try {
    const newPatient = await db
      .insert(patients)
      .values({
        name: body.name,
        nik: body.nik || null,
        bpjsNumber: body.bpjsNumber || null,
        phone: body.phone || null,
        avatarUrl: body.avatarUrl || null,
        gender: body.gender,
        address: body.address || null,

        age: calculatedAge,
        birthDate: body.birthDate ? new Date(body.birthDate).toISOString() : null,
      })
      .returning();

    return {
      success: true,
      message: "Pasien berhasil didaftarkan!",
      data: newPatient[0],
    };
  } catch (error: any) {
    if (error.code === "23505") {
      throw createError({ statusCode: 409, statusMessage: "NIK sudah terdaftar." });
    }
    console.error("Create Patient Error:", error);
    throw createError({ statusCode: 500, statusMessage: "Gagal menyimpan pasien." });
  }
});
