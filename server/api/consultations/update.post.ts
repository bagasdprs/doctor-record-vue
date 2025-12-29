import { db } from "../../utils/db";
import { consultations } from "../../database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.id) {
    throw createError({ statusCode: 400, statusMessage: "Consultation ID is required for update." });
  }

  try {
    const updatedData = await db
      .update(consultations)
      .set({
        transcript: body.transcript,
        subjective: body.subjective,
        objective: body.objective,
        assessment: body.assessment,
        plan: body.plan,
        summary: body.summary,
        status: body.status || "draft",
      })
      .where(eq(consultations.id, body.id))
      .returning();

    return {
      success: true,
      message: "Consultation updated successfully!",
      data: updatedData[0],
    };
  } catch (error) {
    console.error("Update Consultation Error:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to update consultation." });
  }
});
