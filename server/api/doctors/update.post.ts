import { db } from "../../utils/db";
import { doctors } from "../../database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.email) {
    throw createError({ statusCode: 400, statusMessage: "Email wajib ada untuk identifikasi user." });
  }

  try {
    const updateData = {
      fullName: body.fullName,
      specialization: body.specialization,
      phone: body.phone,
      bio: body.bio,
      address: body.address,
      gender: body.gender,
      avatarUrl: body.avatarUrl,
      birthDate: body.birthDate ? new Date(body.birthDate) : null,
      updatedAt: new Date(), // Update timestamp
    };

    const updatedUser = await db.update(doctors).set(updateData).where(eq(doctors.email, body.email)).returning();

    return {
      success: true,
      message: "Profil berhasil diperbarui!",
      data: updatedUser[0],
    };
  } catch (error) {
    console.error("Update Error:", error);
    throw createError({ statusCode: 500, statusMessage: "Gagal mengupdate database." });
  }
});
