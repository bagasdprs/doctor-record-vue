import { db } from "../../utils/db";
import { patients } from "../../database/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.name || !body.gender) {
    throw createError({ statusCode: 400, statusMessage: "Nama dan Gender wajib diisi." });
  }

  try {
    const newPatient = await db
      .insert(patients)
      .values({
        name: body.name,
        nik: body.nik || null,
        bpjsNumber: body.bpjsNumber || null,

        // TAMBAHKAN INI:
        phone: body.phone || null,

        avatarUrl: body.avatarUrl || null,
        gender: body.gender,
        address: body.address || null,
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
