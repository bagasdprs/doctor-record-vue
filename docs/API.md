📚 API Documentation

🔐 Authentication

1. Register Dokter Baru

Mendaftarkan akun dokter baru ke sistem.

Endpoint: POST /api/auth/register

Body (JSON):

{
"fullName": "dr. Budi",
"email": "budi@rs.com",
"password": "rahasia123",
"medicalId": "STR-12345",
"specialization": "Umum"
}

Response (200 OK):

{
"success": true,
"message": "Registrasi berhasil!",
"user": { ... }
}

2. Login Dokter

Masuk ke dashboard.

Endpoint: POST /api/auth/login

Body: { "email": "...", "password": "..." }

👨‍⚕️ Doctors Data

1. Get All Doctors

Mengambil daftar semua dokter.

Endpoint: GET /api/doctors

Response: Array object dokter.
