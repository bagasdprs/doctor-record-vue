import { db } from "../../utils/db";
import { users } from "../../database/schema"; // GANTI 'doctors' JADI 'users'
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.AUTH_SECRET || "rahasia-super-aman-2025";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.email || !body.password) {
    throw createError({ statusCode: 400, statusMessage: "Email dan Password wajib diisi." });
  }

  try {
    // 1. Cari user berdasarkan email di tabel 'users' (BUKAN doctors lagi)
    const result = await db.select().from(users).where(eq(users.email, body.email)).limit(1);

    if (result.length === 0) {
      throw createError({ statusCode: 401, statusMessage: "Email atau Password salah." });
    }

    const user = result[0];

    // 2. Cek Password
    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      throw createError({ statusCode: 401, statusMessage: "Email atau Password salah." });
    }

    // 3. Buat Token JWT (Sekarang bawa info ROLE)
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: user.role, // PENTING: Masukkan role ke dalam token
      },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    // 4. Return Data User + Token
    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role, // Kirim role ke frontend
        specialization: user.specialization,
        avatar: user.avatarUrl,
      },
    };
  } catch (error: any) {
    console.error("Login Error:", error);
    throw createError({ statusCode: error.statusCode || 500, statusMessage: error.statusMessage || "Internal Server Error" });
  }
});
