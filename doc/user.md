# Auth & User Module API Spec

## 1. Auth & User Module (User POV)

### Register User

Endpoint: POST `/auth/register`
Akses: Public
Tujuan: Registrasi akun baru (Vendor/Organizer - default: vendor)

Request Body: 
```json
{
  "email": "vendor@abc.com",
  "name": "Vendor Name",
  "phone": "081234567890",
  "password": "securepassword123",
  "role": "vendor"
}
```

Response Body (Success): 
```json
{
  "data": {
    "id": 1,
    "name": "Vendor Name",
    "email": "vendor@abc.com",
    "phone": "081234567890",
    "role": "vendor",
    "createdAt": "2026-04-21T07:28:24.000Z",
    "updatedAt": "2026-04-21T07:28:24.000Z"
  }
}
```

Response Body (Error): 
```json
{
  "errors": "Email already registered"
}
```

---

### Login User

Endpoint: POST `/auth/login`
Akses: Public
Tujuan: Login dan mendapatkan JWT Token beserta refresh token.

Request Body: 
```json
{
  "email": "vendor@abc.com",
  "password": "securepassword123"
}
```

Response Body (Success): 
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4..."
  }
}
```

Response Body (Error): 
```json
{
  "errors": "Invalid credentials"
}
```

---

### Refresh Token

Endpoint: POST `/auth/refresh`
Akses: Public
Tujuan: Mengirim refreshToken lama untuk mendapatkan accessToken baru.

Request Body: 
```json
{
  "refreshToken": "dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4..."
}
```

Response Body (Success): 
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.bmV3...",
    "refreshToken": "dGhpcy1pcy1hLW5ldy1yZWZyZXNoLXRva2Vu..."
  }
}
```

---

### Logout User

Endpoint: POST `/auth/logout`
Akses: Authenticated
Tujuan: Menghapus `refresh_token` di DB agar tidak bisa digunakan lagi.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Request Body: 
```json
{
  "refreshToken": "dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4..."
}
```

Response Body (Success): 
```json
{
  "data": "OK"
}
```

---

### Get Active User Profile

Endpoint: GET `/users/me`
Akses: Authenticated
Tujuan: Mengambil profil user aktif menggunakan accessToken.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Response Body (Success): 
```json
{
  "data": {
    "id": 1,
    "name": "Vendor Name",
    "email": "vendor@abc.com",
    "phone": "081234567890",
    "role": "vendor",
    "createdAt": "2026-04-21T07:28:24.000Z",
    "updatedAt": "2026-04-21T07:28:24.000Z"
  }
}
```

---

## 2. Auth & User Module (Admin POV)

### Admin Login

Endpoint: POST `/auth/login`
Akses: Public
Tujuan: Login khusus Admin untuk masuk ke dashboard manajemen.

Request Body: 
```json
{
  "email": "admin@boothable.com",
  "password": "supersecretadmin"
}
```

Response Body (Success): 
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "admin-cmVmcmVzaC10b2tlbg..."
  }
}
```

---

### Admin Refresh Token

Endpoint: POST `/auth/refresh`
Akses: Public
Tujuan: Memperbarui accessToken Admin.

Request Body: 
```json
{
  "refreshToken": "admin-cmVmcmVzaC10b2tlbg..."
}
```

Response Body (Success): 
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.bmV3...",
    "refreshToken": "admin-uZXctcmVmcmVzaC10b2tlbg..."
  }
}
```

---

### Admin Logout

Endpoint: POST `/auth/logout`
Akses: Authenticated (Admin)
Tujuan: Keluar dari sesi Admin.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Request Body: 
```json
{
  "refreshToken": "admin-cmVmcmVzaC10b2tlbg..."
}
```

Response Body (Success): 
```json
{
  "data": "OK"
}
```

---

### Get All Users

Endpoint: GET `/admin/users`
Akses: Authenticated (Admin)
Tujuan: Mengambil semua daftar user (`vendor` & `organizer`) untuk monitoring database.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Query Parameters:
- `page` (optional): default `1`
- `limit` (optional): default `10`
- `role` (optional): Filter by role (`vendor` | `organizer`)

Response Body (Success): 
```json
{
  "data": [
    {
      "id": 1,
      "name": "Vendor Name",
      "email": "vendor@abc.com",
      "phone": "081234567890",
      "role": "vendor",
      "createdAt": "2026-04-21T07:28:24.000Z",
      "updatedAt": "2026-04-21T07:28:24.000Z"
    },
    {
      "id": 2,
      "name": "Organizer Name",
      "email": "organizer@abc.com",
      "phone": "089876543211",
      "role": "organizer",
      "createdAt": "2026-04-21T07:29:24.000Z",
      "updatedAt": "2026-04-21T07:29:24.000Z"
    }
  ],
  "paging": {
    "page": 1,
    "totalPage": 5,
    "totalData": 45
  }
}
```

---

### Get Detailed User

Endpoint: GET `/admin/users/:id`
Akses: Authenticated (Admin)
Tujuan: Melihat detail profil spesifik salah satu user secara mendalam.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Response Body (Success): 
```json
{
  "data": {
    "id": 1,
    "name": "Vendor Name",
    "email": "vendor@abc.com",
    "phone": "081234567890",
    "role": "vendor",
    "createdAt": "2026-04-21T07:28:24.000Z",
    "updatedAt": "2026-04-21T07:28:24.000Z"
  }
}
```

---

### Update User Data

Endpoint: PATCH `/admin/users/:id`
Akses: Authenticated (Admin)
Tujuan: Mengubah data user secara manual (misal perubahan name atau role).

Request Headers:
```
Authorization: Bearer <accessToken>
```

Request Body (Partial Update): 
```json
{
  "role": "organizer",
  "name": "New Organizer Name"
}
```

Response Body (Success): 
```json
{
  "data": {
    "id": 1,
    "name": "New Organizer Name",
    "email": "vendor@abc.com",
    "phone": "081234567890",
    "role": "organizer",
    "createdAt": "2026-04-21T07:28:24.000Z",
    "updatedAt": "2026-04-21T07:35:24.000Z"
  }
}
```

---

### Delete User (Soft Delete)

Endpoint: DELETE `/admin/users/:id`
Akses: Authenticated (Admin)
Tujuan: Menghapus akun user jika terdeteksi melakukan pelanggaran.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Response Body (Success): 
```json
{
  "data": "OK"
}
```