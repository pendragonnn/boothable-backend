# Events Module API Spec

## 1. Events Module (User POV - Vendor & Public)

### Get All Public Events

Endpoint: GET `/events`
Akses: Public
Tujuan: Mengambil daftar semua acara yang tersedia dengan fitur Search.

Query Parameters:
- `search` (optional)
- `location` (optional)
- `startDate` (optional)
- `endDate` (optional)
- `page` (optional)
- `limit` (optional)

Response Body (Success): 
```json
{
  "data": [
    {
      "id": 1,
      "eventName": "Tech Expo 2026",
      "organizerId": 2,
      "location": "Jakarta Convention Center",
      "startDate": "2026-08-10",
      "endDate": "2026-08-12",
      "description": "Pameran teknologi terbesar di Indonesia",
      "eventBoothMap": "https://storage.example.com/map/1.jpg",
      "paymentVa": "8077-1234-5678",
      "createdAt": "2026-04-21T00:00:00.000Z",
      "updatedAt": "2026-04-21T00:00:00.000Z"
    }
  ],
  "paging": {
    "page": 1,
    "totalPage": 2,
    "totalData": 15
  }
}
```

---

### Get Event Detail

Endpoint: GET `/events/:id`
Akses: Public
Tujuan: Melihat detail lengkap satu acara.

Response Body (Success): 
```json
{
  "data": {
    "id": 1,
    "eventName": "Tech Expo 2026",
    "organizerId": 2,
    "location": "Jakarta Convention Center",
    "startDate": "2026-08-10",
    "endDate": "2026-08-12",
    "description": "Pameran teknologi terbesar di Indonesia",
    "eventBoothMap": "https://storage.example.com/map/1.jpg",
    "paymentVa": "8077-1234-5678",
    "createdAt": "2026-04-21T00:00:00.000Z",
    "updatedAt": "2026-04-21T00:00:00.000Z"
  }
}
```

---

### Get Booths by Event

Endpoint: GET `/events/:id/booths`
Akses: Public
Tujuan: Melihat daftar semua booth yang terdaftar di dalam acara tersebut beserta status ketersediaannya.

Response Body (Success): 
```json
{
  "data": [
    {
      "id": 1,
      "eventId": 1,
      "boothCode": "A1",
      "type": "Standard",
      "size": "3x3",
      "pricePerDay": 500000,
      "status": "Available",
      "availableStartDate": "2026-08-10",
      "availableEndDate": "2026-08-12",
      "description": "Dekat pintu masuk",
      "createdAt": "2026-04-21T00:00:00.000Z",
      "updatedAt": "2026-04-21T00:00:00.000Z"
    }
  ]
}
```

---

## 2. Events Module (User POV - Organizer)

### Create Event

Endpoint: POST `/organizer/events`
Akses: Authenticated (Organizer)
Tujuan: Membuat acara baru. `organizer_id` otomatis terisi dari token yang sedang login.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Request Body: 
```json
{
  "eventName": "Food Festival 2026",
  "location": "GBK Senayan",
  "startDate": "2026-09-01",
  "endDate": "2026-09-05",
  "description": "Festival kuliner nusantara",
  "paymentVa": "8077-0000-1111"
}
```

Response Body (Success): 
```json
{
  "data": {
    "id": 2,
    "organizerId": 2,
    "eventName": "Food Festival 2026",
    "location": "GBK Senayan",
    "startDate": "2026-09-01",
    "endDate": "2026-09-05",
    "description": "Festival kuliner nusantara",
    "eventBoothMap": null,
    "paymentVa": "8077-0000-1111",
    "createdAt": "2026-04-21T10:00:00.000Z",
    "updatedAt": "2026-04-21T10:00:00.000Z"
  }
}
```

---

### Get Organizer Events

Endpoint: GET `/organizer/events`
Akses: Authenticated (Organizer)
Tujuan: Melihat daftar acara yang hanya dibuat oleh organizer milik ID token terkait.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Query Parameters:
- `page` (optional)
- `limit` (optional)

Response Body (Success): 
```json
{
  "data": [
    {
      "id": 2,
      "eventName": "Food Festival 2026",
      "organizerId": 2,
      "location": "GBK Senayan",
      "startDate": "2026-09-01",
      "endDate": "2026-09-05",
      "description": "Festival kuliner nusantara",
      "eventBoothMap": null,
      "paymentVa": "8077-0000-1111",
      "createdAt": "2026-04-21T10:00:00.000Z",
      "updatedAt": "2026-04-21T10:00:00.000Z"
    }
  ],
  "paging": {
    "page": 1,
    "totalPage": 1,
    "totalData": 1
  }
}
```

---

### Update Organizer Event

Endpoint: PATCH `/organizer/events/:id`
Akses: Authenticated (Organizer)
Tujuan: Memperbarui data acara. (Sistem memvalidasi relasi `organizer_id`).

Request Headers:
```
Authorization: Bearer <accessToken>
```

Request Body (Partial Update): 
```json
{
  "location": "Senayan Park"
}
```

Response Body (Success): 
```json
{
  "data": {
    "id": 2,
    "organizerId": 2,
    "eventName": "Food Festival 2026",
    "location": "Senayan Park",
    "startDate": "2026-09-01",
    "endDate": "2026-09-05",
    "description": "Festival kuliner nusantara",
    "eventBoothMap": null,
    "paymentVa": "8077-0000-1111",
    "createdAt": "2026-04-21T10:00:00.000Z",
    "updatedAt": "2026-04-21T11:00:00.000Z"
  }
}
```

---

### Delete Organizer Event

Endpoint: DELETE `/organizer/events/:id`
Akses: Authenticated (Organizer)
Tujuan: Menghapus acara milik sendiri.

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

---

### Upload Event Booth Map

Endpoint: POST `/organizer/events/:id/map`
Akses: Authenticated (Organizer)
Tujuan: Mengunggah URL gambar/berkas `event_booth_map` secara multipart.

Request Headers:
```
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

Request Body:
- `file`: (Image binary)

Response Body (Success): 
```json
{
  "data": {
    "eventBoothMap": "https://storage.example.com/map/2.jpg"
  }
}
```

---

## 3. Events Module (Admin POV)

*(Pencocokan ERD: Field verified tidak ada di ERD database sehingga endpoint verify event dihapus untuk menjaga kesesuaian)*

### Admin Create Event (Optional)

Endpoint: POST `/admin/events`
Akses: Authenticated (Admin)
Tujuan: Membuat acara baru langsung oleh Admin (menyematkan `organizerId` secara manual).

Request Headers:
```
Authorization: Bearer <accessToken>
```

Request Body: 
```json
{
  "eventName": "Official Expo 2026",
  "organizerId": 3,
  "location": "Jakarta",
  "startDate": "2026-10-01",
  "endDate": "2026-10-05",
  "description": "Acara resmi platform",
  "paymentVa": "8077-9999-8888"
}
```

Response Body (Success): 
```json
{
  "data": {
    "id": 3,
    "eventName": "Official Expo 2026",
    "organizerId": 3,
    "location": "Jakarta",
    "startDate": "2026-10-01",
    "endDate": "2026-10-05",
    "description": "Acara resmi platform",
    "eventBoothMap": null,
    "paymentVa": "8077-9999-8888",
    "createdAt": "2026-04-21T12:00:00.000Z",
    "updatedAt": "2026-04-21T12:00:00.000Z"
  }
}
```

---

### Get All Events (Monitoring)

Endpoint: GET `/admin/events`
Akses: Authenticated (Admin)
Tujuan: Melihat seluruh daftar acara dari semua organizer.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Query Parameters:
- `page`
- `limit`

Response Body (Success): 
```json
{
  "data": [
    {
      "id": 1,
      "eventName": "Tech Expo",
      "organizerId": 2,
      "location": "JCC",
      "startDate": "2026-10-01",
      "endDate": "2026-10-05",
      "description": "Acara Tech",
      "eventBoothMap": null,
      "paymentVa": "8077-9999-8888",
      "createdAt": "2026-04-21T12:00:00.000Z",
      "updatedAt": "2026-04-21T12:00:00.000Z"
    }
  ],
  "paging": {
    "page": 1,
    "totalPage": 10,
    "totalData": 100
  }
}
```

---

### Update Any Event (Admin Moderation)

Endpoint: PATCH `/admin/events/:id`
Akses: Authenticated (Admin)
Tujuan: Melakukan perubahan paksa.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Request Body: 
```json
{
  "description": "[Moderated] Deskripsi dihapus karena melanggar aturan komunitas."
}
```

Response Body (Success): 
```json
{
  "data": {
    "id": 2,
    "eventName": "Official Expo 2026",
    "organizerId": 3,
    "location": "Jakarta",
    "startDate": "2026-10-01",
    "endDate": "2026-10-05",
    "description": "[Moderated] Deskripsi dihapus karena melanggar aturan komunitas.",
    "eventBoothMap": null,
    "paymentVa": "8077-9999-8888",
    "createdAt": "2026-04-21T12:00:00.000Z",
    "updatedAt": "2026-04-21T13:00:00.000Z"
  }
}
```

---

### Delete Any Event (Admin Moderation)

Endpoint: DELETE `/admin/events/:id`
Akses: Authenticated (Admin)
Tujuan: Menghapus acara sistem.

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
