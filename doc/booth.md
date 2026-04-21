# Booths Module API Spec

## 1. Booths Module (User POV - Vendor & Public)

### Get Booths by Event

Endpoint: GET `/events/:eventId/booths`
Akses: Public
Tujuan: Mengambil semua daftar booth yang ada di satu acara tertentu.

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
      "description": "Dekat Pintu Utama",
      "createdAt": "2026-04-21T10:00:00.000Z",
      "updatedAt": "2026-04-21T10:00:00.000Z"
    },
    {
      "id": 2,
      "eventId": 1,
      "boothCode": "A2",
      "type": "VIP",
      "size": "5x5",
      "pricePerDay": 1500000,
      "status": "Booked",
      "availableStartDate": "2026-08-10",
      "availableEndDate": "2026-08-12",
      "description": "Tengah ruangan",
      "createdAt": "2026-04-21T10:00:00.000Z",
      "updatedAt": "2026-04-21T10:00:00.000Z"
    }
  ]
}
```

---

### Get Booth Detail

Endpoint: GET `/booths/:id`
Akses: Public
Tujuan: Melihat detail spesifik satu booth.

Response Body (Success): 
```json
{
  "data": {
    "id": 1,
    "eventId": 1,
    "boothCode": "A1",
    "type": "Standard",
    "size": "3x3",
    "pricePerDay": 500000,
    "status": "Available",
    "availableStartDate": "2026-08-10",
    "availableEndDate": "2026-08-12",
    "description": "Dekat Pintu Utama",
    "createdAt": "2026-04-21T10:00:00.000Z",
    "updatedAt": "2026-04-21T10:00:00.000Z"
  }
}
```

---

## 2. Booths Module (User POV - Organizer)

### Create Booth

Endpoint: POST `/organizer/events/:eventId/booths`
Akses: Authenticated (Organizer)
Tujuan: Menambahkan satu booth baru ke acara milik mereka.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Request Body: 
```json
{
  "boothCode": "A1",
  "type": "Standard",
  "size": "3x3",
  "pricePerDay": 500000,
  "status": "Available",
  "availableStartDate": "2026-08-10",
  "availableEndDate": "2026-08-12",
  "description": "Dekat Pintu Utama"
}
```

Response Body (Success): 
```json
{
  "data": {
    "id": 1,
    "eventId": 1,
    "boothCode": "A1",
    "type": "Standard",
    "size": "3x3",
    "pricePerDay": 500000,
    "status": "Available",
    "availableStartDate": "2026-08-10",
    "availableEndDate": "2026-08-12",
    "description": "Dekat Pintu Utama",
    "createdAt": "2026-04-21T10:00:00.000Z",
    "updatedAt": "2026-04-21T10:00:00.000Z"
  }
}
```

---

### Bulk Create Booths

Endpoint: POST `/organizer/events/:eventId/booths/bulk`
Akses: Authenticated (Organizer)
Tujuan: Menambahkan banyak booth sekaligus.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Request Body: 
```json
{
  "booths": [
    {
      "boothCode": "A2",
      "type": "Standard",
      "size": "3x3",
      "pricePerDay": 500000,
      "status": "Available",
      "availableStartDate": "2026-08-10",
      "availableEndDate": "2026-08-12",
      "description": "Blok A nomor 2"
    },
    {
      "boothCode": "A3",
      "type": "VIP",
      "size": "5x5",
      "pricePerDay": 1500000,
      "status": "Available",
      "availableStartDate": "2026-08-10",
      "availableEndDate": "2026-08-12",
      "description": "Blok A nomor 3"
    }
  ]
}
```

Response Body (Success): 
```json
{
  "data": {
    "count": 2,
    "message": "2 booths created successfully"
  }
}
```

---

### Update Booth

Endpoint: PATCH `/organizer/booths/:id`
Akses: Authenticated (Organizer)
Tujuan: Mengubah informasi booth.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Request Body (Partial Update): 
```json
{
  "pricePerDay": 550000,
  "status": "Unavailable"
}
```

Response Body (Success): 
```json
{
  "data": {
    "id": 1,
    "eventId": 1,
    "boothCode": "A1",
    "type": "Standard",
    "size": "3x3",
    "pricePerDay": 550000,
    "status": "Unavailable",
    "availableStartDate": "2026-08-10",
    "availableEndDate": "2026-08-12",
    "description": "Dekat Pintu Utama",
    "createdAt": "2026-04-21T10:00:00.000Z",
    "updatedAt": "2026-04-21T11:00:00.000Z"
  }
}
```

---

### Delete Booth

Endpoint: DELETE `/organizer/booths/:id`
Akses: Authenticated (Organizer)

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

## 3. Booths Module (Admin POV)

### Get All Booths Globally

Endpoint: GET `/admin/booths`
Akses: Authenticated (Admin)
Tujuan: Monitoring seluruh data booth.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Query Parameters:
- `page` (optional)
- `limit` (optional)
- `eventId` (optional)
- `status` (optional)

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
      "description": "Dekat Pintu Utama",
      "createdAt": "2026-04-21T10:00:00.000Z",
      "updatedAt": "2026-04-21T10:00:00.000Z"
    }
  ],
  "paging": {
    "page": 1,
    "totalPage": 20,
    "totalData": 200
  }
}
```

---

### Force Update Booth (Admin Moderation)

Endpoint: PATCH `/admin/booths/:id`
Akses: Authenticated (Admin)
Tujuan: Melakukan perubahan darurat.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Request Body (Partial Update): 
```json
{
  "status": "Unavailable",
  "description": "[Moderated] Booth ditutup sementara"
}
```

Response Body (Success): 
```json
{
  "data": {
    "id": 1,
    "eventId": 1,
    "boothCode": "A1",
    "type": "Standard",
    "size": "3x3",
    "pricePerDay": 550000,
    "status": "Unavailable",
    "availableStartDate": "2026-08-10",
    "availableEndDate": "2026-08-12",
    "description": "[Moderated] Booth ditutup sementara",
    "createdAt": "2026-04-21T10:00:00.000Z",
    "updatedAt": "2026-04-21T13:00:00.000Z"
  }
}
```

---

### Delete Any Booth (Admin Moderation)

Endpoint: DELETE `/admin/booths/:id`
Akses: Authenticated (Admin)

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
