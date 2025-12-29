import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  schema: "./server/database/schema.ts",
  out: "./server/database/migrations",
  dialect: "postgresql", // Kita pakai PostgreSQL
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Ambil URL dari .env
  },
});
