import { db } from "../../utils/db";
import { users } from "../../database/schema"; // UBAH: Pakai 'users'
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.email || !body.password || !body.fullName || !body.clinicName) {
    throw createError({ statusCode: 400, statusMessage: "Mohon lengkapi data klinik anda." });
  }

  try {
    // 1. Cek apakah email sudah terdaftar di tabel 'users'
    const existingUser = await db.select().from(users).where(eq(users.email, body.email)).limit(1);

    if (existingUser.length > 0) {
      throw createError({ statusCode: 400, statusMessage: "Email sudah terdaftar." });
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // 3. Simpan User Baru ke Database (Tabel 'users')
    const newUser = await db
      .insert(users)
      .values({
        email: body.email,
        password: hashedPassword,
        fullName: body.fullName,

        // PENTING: Set role default jadi 'admin' karena ini register dari halaman publik
        role: "admin",

        clinicName: body.clinicName,

        specialization: body.specialization || "General Practitioner",
        medicalId: body.medicalId,
      })
      .returning();

    return {
      success: true,
      message: "Registrasi Klinik Berhasil!",
      data: {
        id: newUser[0].id,
        email: newUser[0].email,
        name: newUser[0].fullName,
        role: newUser[0].role,
      },
    };
  } catch (error: any) {
    console.error("Register Error:", error);
    if (error.code === "23505") {
      throw createError({ statusCode: 409, statusMessage: "Email sudah digunakan." });
    }
    throw createError({ statusCode: 500, statusMessage: "Gagal menyimpan ke database." });
  }
});
