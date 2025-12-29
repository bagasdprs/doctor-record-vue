import { db } from "../../utils/db";
import { consultations, patients } from "../../database/schema";
import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body.id;

  if (!id) throw createError({ statusCode: 400, statusMessage: "ID Required" });

  // 1. Ambil Data
  const data = await db
    .select({
      patientName: patients.name,
      patientPhone: patients.phone, // ⚠️ HACK: KARENA BELUM ADA KOLOM EMAIL, KITA PAKAI PHONE DULU BUAT CONTOH, ATAU HARDCODE EMAIL KAMU.
      diagnosis: consultations.assessment,
      summary: consultations.summary,
      date: consultations.createdAt,
    })
    .from(consultations)
    .leftJoin(patients, eq(consultations.patientId, patients.id))
    .where(eq(consultations.id, id))
    .then((res) => res[0]);

  if (!data) throw createError({ statusCode: 404, statusMessage: "Data not found" });

  // ⚠️ TODO: Nanti kamu harus tambah kolom 'email' di tabel patients ya!
  const recipientEmail = "bdwiprasandi@gmail.com"; // GANTI JADI EMAIL KAMU DULU

  // 2. Setup Transporter (Tukang Pos)
  // Sebaiknya taruh user/pass di .env, tapi buat belajar kita taruh sini dulu
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bagasdprs@gmail.com", // GANTI EMAIL PENGIRIM (GMAIL KAMU)
      pass: "xxxx xxxx xxxx xxxx", // GANTI APP PASSWORD GMAIL KAMU
    },
  });

  // 3. Desain Isi Email (HTML)
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #2563eb;">FluxMed Medical Summary</h2>
      <p>Dear <strong>${data.patientName}</strong>,</p>
      <p>Berikut adalah ringkasan kunjungan medis Anda pada tanggal <strong>${data.date ? new Date(data.date).toLocaleDateString() : "Tanggal tidak tersedia"}</strong>:</p>

      <div style="background: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Diagnosis:</strong><br>${data.diagnosis}</p>
        <p><strong>Ringkasan / Resep:</strong><br>${data.summary}</p>
      </div>

      <p style="font-size: 12px; color: #888;">Harap jangan membalas email ini. Ini adalah pesan otomatis dari sistem FluxMed.</p>
    </div>
  `;

  // 4. Kirim!
  try {
    await transporter.sendMail({
      from: '"FluxMed System" <no-reply@fluxmed.com>',
      to: recipientEmail, // Nanti ganti data.patientEmail
      subject: `Medical Summary - ${data.patientName}`,
      html: htmlContent,
    });

    return { success: true, message: "Email berhasil dikirim!" };
  } catch (error) {
    console.error("Email Error:", error);
    throw createError({ statusCode: 500, statusMessage: "Gagal mengirim email." });
  }
});
