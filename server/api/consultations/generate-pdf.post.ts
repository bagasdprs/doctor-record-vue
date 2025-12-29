import { db } from "../../utils/db";
import { consultations, patients } from "../../database/schema";
import { eq } from "drizzle-orm";
import PDFDocument from "pdfkit";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body.id;

  if (!id) throw createError({ statusCode: 400, statusMessage: "ID Required" });

  // 1. GET Data Consultation + Patient
  const data = await db
    .select({
      createdAt: consultations.createdAt,
      subjective: consultations.subjective,
      objective: consultations.objective,
      assessment: consultations.assessment,
      plan: consultations.plan,

      // Patient Data
      patientName: patients.name,
      patientNik: patients.nik,
      patientAge: patients.age,
      patientGender: patients.gender,
      patientAddress: patients.address,
    })
    .from(consultations)
    .leftJoin(patients, eq(consultations.patientId, patients.id))
    .where(eq(consultations.id, id))
    .then((res) => res[0]);

  if (!data) throw createError({ statusCode: 404, statusMessage: "Data not found" });

  // 2. Setup Header Response
  setResponseHeader(event, "Content-Type", "application/pdf");
  setResponseHeader(event, "Content-Disposition", `attachment; filename="Record-${data.patientName}.pdf"`);

  // 3. Create Document PDF
  const doc = new PDFDocument({ margin: 50 });
  const stream = doc.pipe(event.node.res);

  // --- DESAIN PDF ---

  // Header Klinik
  doc.fontSize(20).text("FluxMed Clinic", { align: "center" });
  doc.fontSize(10).text("Jl. Programmer Sejati No. 1, Jakarta Selatan", { align: "center" });
  doc.moveDown();
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  // Info Pasien (Kiri) & Info Dokter (Kanan)
  const startY = doc.y;
  doc.fontSize(10).font("Helvetica-Bold").text("Patient Info:", 50, startY);
  doc.font("Helvetica").text(`Name: ${data.patientName}`);
  doc.text(`NIK: ${data.patientNik || "-"}`);
  doc.text(`Details: ${data.patientAge} yo / ${data.patientGender}`);
  doc.text(`Address: ${data.patientAddress || "-"}`);

  doc.font("Helvetica-Bold").text("Consultation Detail:", 300, startY);
  doc.font("Helvetica").text(`Date: ${data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "-"}`);
  // doc.text(`Doc ID: ${data.doctorName ? String(data.doctorName) : "-"}`); // Ensure doctorName is valid

  doc.moveDown(2);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).dash(5, { space: 5 }).stroke(); // Garis putus
  doc.undash();
  doc.moveDown(2);

  // ISI SOAP (Core Content)
  const printSection = (title: string, content: string) => {
    doc.font("Helvetica-Bold").fontSize(12).text(title, { underline: true });
    doc.moveDown(0.5);
    doc
      .font("Helvetica")
      .fontSize(10)
      .text(content || "-", { align: "justify" });
    doc.moveDown(1.5);
  };

  // Undisturbing dash for formatting
  printSection("S (Subjective)", data.subjective || "");
  printSection("O (Objective)", data.objective || "");
  printSection("A (Assessment)", data.assessment || "");
  printSection("P (Plan)", data.plan || "");

  // Footer
  doc.moveDown(2);
  doc.fontSize(8).text("Generated automatically by FluxMed AI System.", { align: "center", oblique: true });

  // 4. Finalisasi PDF
  doc.end();

  // Kita return stream-nya (biar Nuxt nungguin sampe kelar)
  return stream;
});
