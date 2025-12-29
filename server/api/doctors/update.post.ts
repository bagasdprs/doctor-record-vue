import { db } from "../../utils/db";
import { users } from "../../database/schema"; // GANTI 'doctors' JADI 'users'
import { eq } from "drizzle-orm";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event);
  if (!files) {
    throw createError({ statusCode: 400, statusMessage: "Data tidak valid" });
  }

  const getValue = (name: string) => {
    const item = files.find((f) => f.name === name);
    return item?.data.toString();
  };

  const email = getValue("email");
  if (!email) throw createError({ statusCode: 400, statusMessage: "Email wajib ada" });

  const birthDateString = getValue("birthDate");

  const updateData: any = {
    fullName: getValue("fullName"),
    specialization: getValue("specialization"),
    phone: getValue("phone"),
    address: getValue("address"),
    gender: getValue("gender"),
    bio: getValue("bio"),
    birthDate: birthDateString || null,
    updatedAt: new Date(),
  };

  const avatarFile = files.find((f) => f.name === "avatarFile");

  if (avatarFile && avatarFile.filename) {
    const ext = path.extname(avatarFile.filename);
    const fileName = `${randomUUID()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, avatarFile.data);
    updateData.avatarUrl = `/uploads/${fileName}`;
  }

  try {
    const updatedUser = await db.update(users).set(updateData).where(eq(users.email, email)).returning();

    return {
      success: true,
      message: "Profil & Foto berhasil diupdate!",
      data: updatedUser[0],
    };
  } catch (error) {
    console.error("Update Error:", error);
    throw createError({ statusCode: 500, statusMessage: "Gagal update database." });
  }
});
