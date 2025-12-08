import { db } from "../../utils/db";
import { doctors } from "../../database/schema";
import { eq } from "drizzle-orm";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

export default defineEventHandler(async (event) => {
  // 1. Baca Data Multipart (File + Teks)
  const files = await readMultipartFormData(event);

  if (!files) {
    throw createError({ statusCode: 400, statusMessage: "Data tidak valid" });
  }

  // Helper function: Ambil value dari field text
  const getValue = (name: string) => {
    const item = files.find((f) => f.name === name);
    return item?.data.toString();
  };

  const email = getValue("email");
  if (!email) throw createError({ statusCode: 400, statusMessage: "Email wajib ada" });

  // 2. Siapkan Object Update
  const updateData: any = {
    fullName: getValue("fullName"),
    specialization: getValue("specialization"),
    phone: getValue("phone"),
    bio: getValue("bio"),
    address: getValue("address"),
    gender: getValue("gender"),
    updatedAt: new Date(),
  };

  // Handle Tanggal Lahir
  const birthDateStr = getValue("birthDate");
  if (birthDateStr) updateData.birthDate = new Date(birthDateStr);

  // 3. LOGIKA UPLOAD FOTO (Simpan ke Folder)
  const avatarFile = files.find((f) => f.name === "avatarFile");

  if (avatarFile && avatarFile.filename) {
    // a. Tentukan ekstensi file (.jpg/.png)
    const ext = path.extname(avatarFile.filename);
    // b. Buat nama file unik (biar gak bentrok)
    const fileName = `${randomUUID()}${ext}`;
    // c. Tentukan folder tujuan (public/uploads)
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Buat folder kalau belum ada
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // d. Simpan file ke hardisk
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, avatarFile.data);

    // e. Simpan URL-nya ke database
    updateData.avatarUrl = `/uploads/${fileName}`;
  }

  try {
    // 4. Update Database
    const updatedUser = await db.update(doctors).set(updateData).where(eq(doctors.email, email)).returning();

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
