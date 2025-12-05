import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
// Import schema yang sudah kita buat biar Drizzle kenal tabelnya
import * as schema from "../database/schema";

// 1. Cek apakah URL database ada di .env (Wajib ada!)
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL tidak ditemukan di file .env");
}

// 2. Buat client koneksi ke PostgreSQL
const client = postgres(process.env.DATABASE_URL);

// 3. Inisialisasi Drizzle dengan schema
export const db = drizzle(client, { schema });
