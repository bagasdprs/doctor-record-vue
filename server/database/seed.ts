import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { users, patients } from "./schema";
import "dotenv/config";
import bcrypt from "bcryptjs";

const runSeed = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  // Koneksi Database
  const connection = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(connection);

  console.log("🌱 Sedang mengisi data dummy Multi-Role (5 Akun)...");

  try {
    // Hash password default "123456"
    const hashedPassword = await bcrypt.hash("123456", 10);

    // 1. Buat DOKTER (Doctor)
    await db
      .insert(users)
      .values({
        email: "dokter@rs.com",
        password: hashedPassword,
        fullName: "Dr. Bagas Dwi",
        role: "doctor",
        specialization: "Dokter Umum",
        medicalId: "DOC-001",
        phone: "081234567890",
      })
      .onConflictDoNothing(); // Mencegah error kalau data udah ada
    console.log("✅ Dokter Created: dokter@rs.com");

    // 2. Buat BIDAN (Midwife)
    await db
      .insert(users)
      .values({
        email: "bidan@rs.com",
        password: hashedPassword,
        fullName: "Bidan Sarah Amd.Keb",
        role: "midwife",
        specialization: "Bidan Kandungan",
        medicalId: "MID-001",
      })
      .onConflictDoNothing();
    console.log("✅ Bidan Created: bidan@rs.com");

    // 3. Buat APOTEKER (Pharmacist)
    await db
      .insert(users)
      .values({
        email: "apotek@rs.com",
        password: hashedPassword,
        fullName: "Apt. Rina S.Farm",
        role: "pharmacist",
        medicalId: "PHAR-001",
      })
      .onConflictDoNothing();
    console.log("✅ Apoteker Created: apotek@rs.com");

    // 4. Buat RESEPSIONIS (Receptionist) -> EMAIL DIGANTI BIAR GAK BINGUNG
    await db
      .insert(users)
      .values({
        email: "resepsionis@rs.com", // Email khusus resepsionis
        password: hashedPassword,
        fullName: "Resepsionis Depan",
        role: "receptionist",
      })
      .onConflictDoNothing();
    console.log("✅ Resepsionis Created: resepsionis@rs.com");

    // 5. Buat ADMIN (Superuser) -> EMAIL ADMIN KHUSUS ADMIN
    await db
      .insert(users)
      .values({
        email: "admin@rs.com", // Email khusus admin
        password: hashedPassword,
        fullName: "Super Admin IT",
        role: "admin",
      })
      .onConflictDoNothing();
    console.log("✅ Admin Created: admin@rs.com");

    // 6. Buat Pasien Dummy
    await db
      .insert(patients)
      .values({
        name: "Budi Santoso",
        nik: "3201234567890001",
        gender: "Male",
        address: "Jl. Sehat Selalu No. 99",
        birthDate: "1990-01-01",
        bloodType: "O",
        allergies: "Seafood, Penicillin",
      })
      .onConflictDoNothing();
    console.log("✅ Pasien Dummy Created");
  } catch (error) {
    console.error("❌ Gagal seeding:", error);
  } finally {
    await connection.end();
    process.exit();
  }
};

runSeed();
