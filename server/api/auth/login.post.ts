import { db } from "../../utils/db";
import { doctors } from "../../database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.email || !body.password) {
    throw createError({ statusCode: 400, statusMessage: "Email dan Password wajib diisi" });
  }

  const users = await db.select().from(doctors).where(eq(doctors.email, body.email));
  const user = users[0];

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Email tidak ditemukan" });
  }

  const isMatch = await bcrypt.compare(body.password, user.password);

  if (!isMatch) {
    throw createError({ statusCode: 401, statusMessage: "Password salah" });
  }

  return {
    success: true,
    message: "Login berhasil!",
    user: {
      id: user.id,
      email: user.email,
      name: user.fullName,
      specialization: user.specialization,
      avatar: user.avatarUrl,
    },
  };
});
