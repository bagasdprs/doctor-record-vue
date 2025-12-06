export default defineEventHandler(async (event) => {
  const headers = getRequestHeaders(event);

  let body;
  try {
    body = await readBody(event);
  } catch (e) {
    body = "Gagal baca body: " + e;
  }

  return {
    status: "DEBUG MODE",
    contentType: headers["content-type"],
    bodyReceived: body || "KOSONG (UNDEFINED)",
  };
});
