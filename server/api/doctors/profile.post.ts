import { db } from "../../utils/db";
import { users } from "../../database/schema"; // GANTI 'doctors' JADI 'users'
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.email) {
    throw createError({ statusCode: 400, statusMessage: "Email wajib dikirim" });
  }

  // Cari user berdasarkan email
  const result = await db.select().from(users).where(eq(users.email, body.email));

  if (result.length === 0) {
    throw createError({ statusCode: 404, statusMessage: "User tidak ditemukan" });
  }

  const user = result[0];

  return {
    success: true,
    data: {
      fullName: user.fullName,
      email: user.email,
      medicalId: user.medicalId,
      specialization: user.specialization,
      phone: user.phone,
      address: user.address,
      // bio: user.bio, // Hapus jika di schema 'users' tidak ada kolom bio, atau tambahkan di schema
      // gender: user.gender, // Cek schema users, jika tidak ada hapus baris ini
      // birthDate: user.birthDate, // Cek schema users
      avatarUrl: user.avatarUrl,
      role: user.role, // Tambahkan info role
    },
  };
});
