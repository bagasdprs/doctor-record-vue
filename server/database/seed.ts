import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { doctors, patients } from "./schema"; // Import schema yang baru kita buat
import "dotenv/config"; // Biar bisa baca file .env

const runSeed = async () => {
  // Cek apakah URL database ada di .env
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  // Buat koneksi sementara khusus untuk seeding
  const connection = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(connection);

  console.log("🌱 Sedang mengisi data dummy (Seeding)...");

  try {
    // 1. Masukkan Data Dokter Dummy
    // Kita pakai .returning() supaya bisa dapat ID dokter yang baru dibuat
    const newDoctors = await db
      .insert(doctors)
      .values({
        email: "dokter-bagas@rs.com",
        medicalId: "DOC-001",
        password: "123456", // Nanti di register asli ini harus di-hash
        fullName: "Dr. Bagas Dwi",
        specialization: "Dokter Umum",
        phone: "087875210789",
        address: "Jl. Merpati No.3 Jakarta Timur",
        bio: "Dokter spesialis umum.",
        gender: "Male",
        birthDate: new Date("1999-07-20"),
      })
      .returning();

    const doctorId = newDoctors[0].id; // Ambil ID dokter yang baru dibuat
    console.log("✅ Berhasil membuat dokter:", newDoctors[0].fullName);

    // 2. Masukkan Data Pasien Dummy (Dihubungkan ke Dokter tadi)
    await db.insert(patients).values({
      name: "Budi Santoso",
      nik: "3201234567890001",
      gender: "Male",
      address: "Jl. Sehat Selalu No. 99",
      birthDate: new Date("1990-01-01"),
      doctorId: doctorId, // Link ke dokter di atas
    });

    console.log("✅ Berhasil membuat pasien: Budi Santoso");
  } catch (error) {
    console.error("❌ Gagal seeding:", error);
  } finally {
    // Tutup koneksi database setelah selesai
    await connection.end();
    process.exit();
  }
};

// Jalankan fungsi seed
runSeed();
