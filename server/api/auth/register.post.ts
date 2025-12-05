import { db } from "../../utils/db";
import { doctors } from "../../database/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  console.log("\n\n--- 🚀 NEW REQUEST: /api/auth/register ---");

  // 1. CEK HEADER (Apakah pengirimannya benar?)
  const contentType = getRequestHeader(event, "content-type");
  console.log("📨 Content-Type:", contentType);

  if (!contentType?.includes("application/json")) {
    console.log("❌ Error: Header salah. Dikirim sebagai:", contentType);
    throw createError({
      statusCode: 400,
      statusMessage: `Salah Format! Server butuh JSON, tapi kamu kirim: ${contentType || "Kosong"}`,
    });
  }

  // 2. BACA BODY
  const body = await readBody(event);
  console.log("📦 Data Body:", body);

  // 3. Validasi Body Kosong
  if (!body) {
    console.log("❌ Error: Body undefined/kosong");
    throw createError({
      statusCode: 400,
      statusMessage: 'Body Kosong. Pastikan pilih "raw" -> "JSON" di Postman.',
    });
  }

  // Cek kelengkapan kolom
  if (!body.email || !body.password || !body.fullName || !body.medicalId) {
    console.log("❌ Error: Data tidak lengkap");
    throw createError({ statusCode: 400, statusMessage: "Semua kolom wajib diisi!" });
  }

  // --- LOGIKA UTAMA ---

  // Cek User Lama
  const existingUser = await db
    .select()
    .from(doctors)
    .where(or(eq(doctors.email, body.email), eq(doctors.medicalId, body.medicalId)));

  if (existingUser.length > 0) {
    console.log("❌ Error: User sudah ada");
    throw createError({ statusCode: 409, statusMessage: "Email atau Medical ID sudah terdaftar." });
  }

  // Hash Password
  console.log("🔐 Mengenkripsi password...");
  const hashedPassword = await bcrypt.hash(body.password, 10);

  // Simpan ke Database
  try {
    const newDoctor = await db
      .insert(doctors)
      .values({
        fullName: body.fullName,
        email: body.email,
        medicalId: body.medicalId,
        password: hashedPassword,
        specialization: body.specialization || "General Practitioner",
      })
      .returning();

    console.log(`✅ SUKSES! Dokter baru dibuat: ${newDoctor[0].email}`);

    return {
      success: true,
      message: "Registrasi berhasil!",
      user: {
        email: newDoctor[0].email,
        name: newDoctor[0].fullName,
      },
    };
  } catch (error) {
    console.error("🔥 DATABASE ERROR:", error);
    throw createError({ statusCode: 500, statusMessage: "Gagal menyimpan ke database" });
  }
});
