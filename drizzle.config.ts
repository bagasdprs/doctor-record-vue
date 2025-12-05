import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  schema: "./server/database/schema.ts", // Lokasi file schema tadi
  out: "./server/database/migrations", // Folder output migrasi (otomatis dibuat)
  dialect: "postgresql", // Kita pakai PostgreSQL
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Ambil URL dari .env
  },
});
