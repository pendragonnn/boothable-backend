# Payments Module API Spec

## 1. Payments Module (User POV - Vendor)

### Upload Payment Proof

Endpoint: POST `/bookings/:id/payments`
Akses: Authenticated (Vendor)
Tujuan: Mengunggah bukti transfer bank. Status `paymentStatus` otomatis menjadi `Waiting Verification`.

Request Headers:
```
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

Request Body: 
- `file`: (Image binary)
- `paymentMethod`: "Bank Transfer" (enum)

Response Body (Success): 
```json
{
  "data": {
    "id": 1,
    "bookingId": 1,
    "paymentMethod": "Bank Transfer",
    "paymentStatus": "Waiting Verification",
    "paymentProof": "https://storage.example.com/payments/receipt-1.jpg",
    "createdAt": "2026-04-21T11:00:00.000Z",
    "updatedAt": "2026-04-21T11:00:00.000Z"
  }
}
```

---

### Get Payment Detail

Endpoint: GET `/bookings/:id/payments`
Akses: Authenticated (Vendor)

Request Headers:
```
Authorization: Bearer <accessToken>
```

Response Body (Success): 
```json
{
  "data": {
    "id": 1,
    "bookingId": 1,
    "paymentMethod": "Bank Transfer",
    "paymentStatus": "Waiting Verification",
    "paymentProof": "https://storage.example.com/payments/receipt-1.jpg",
    "createdAt": "2026-04-21T11:00:00.000Z",
    "updatedAt": "2026-04-21T11:00:00.000Z"
  }
}
```

---

## 2. Payments Module (User POV - Organizer)

### Get Managed Payments

Endpoint: GET `/organizer/payments`
Akses: Authenticated (Organizer)
Tujuan: Melihat daftar semua pembayaran (join melalui `booking_id`).

Request Headers:
```
Authorization: Bearer <accessToken>
```

Query Parameters:
- `page` (optional)
- `limit` (optional)
- `eventId` (optional)
- `paymentStatus` (optional)

Response Body (Success): 
```json
{
  "data": [
    {
      "id": 1,
      "bookingId": 1,
      "paymentMethod": "Bank Transfer",
      "paymentStatus": "Waiting Verification",
      "paymentProof": "https://storage.example.com/payments/receipt-1.jpg",
      "createdAt": "2026-04-21T11:00:00.000Z",
      "updatedAt": "2026-04-21T11:00:00.000Z"
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

### Verify Payment

Endpoint: PATCH `/organizer/payments/:id/verify`
Akses: Authenticated (Organizer)
Tujuan: Melakukan validasi pembayaran (`Paid` atau `Rejected`). 

Request Headers:
```
Authorization: Bearer <accessToken>
```

Request Body: 
```json
{
  "paymentStatus": "Paid"
}
```

Response Body (Success): 
```json
{
  "data": {
    "id": 1,
    "bookingId": 1,
    "paymentStatus": "Paid",
    "updatedAt": "2026-04-21T12:30:00.000Z"
  }
}
```

---

### Get Organizer Payment Stats (Revenue Summary)

Endpoint: GET `/organizer/payments/stats`
Akses: Authenticated (Organizer)

Request Headers:
```
Authorization: Bearer <accessToken>
```

Response Body (Success): 
*(Digabungkan dari query sum total_price tabel booking ketika paymentStatus is Paid)*
```json
{
  "data": {
    "totalRevenue": 45000000,
    "totalPaidBookings": 30,
    "pendingVerifications": 5
  }
}
```

---

## 3. Payments Module (Admin POV)

### Monitor Global Payments

Endpoint: GET `/admin/payments`
Akses: Authenticated (Admin)

Request Headers:
```
Authorization: Bearer <accessToken>
```

Query Parameters:
- `page`
- `limit`
- `paymentStatus`

Response Body (Success): 
```json
{
  "data": [
    {
      "id": 1,
      "bookingId": 1,
      "paymentMethod": "Bank Transfer",
      "paymentStatus": "Paid",
      "paymentProof": "https://storage.example.com/payments/receipt-1.jpg",
      "createdAt": "2026-04-21T11:00:00.000Z",
      "updatedAt": "2026-04-21T11:00:00.000Z"
    }
  ],
  "paging": {
    "page": 1,
    "totalPage": 50,
    "totalData": 500
  }
}
```

---

### Get Payment Audit Detail

Endpoint: GET `/admin/payments/:id`
Akses: Authenticated (Admin)

Request Headers:
```
Authorization: Bearer <accessToken>
```

Response Body (Success): 
```json
{
  "data": {
    "id": 1,
    "bookingId": 1,
    "paymentMethod": "Bank Transfer",
    "paymentStatus": "Paid",
    "paymentProof": "https://storage.example.com/payments/receipt-1.jpg",
    "createdAt": "2026-04-21T11:00:00.000Z",
    "updatedAt": "2026-04-21T12:30:00.000Z"
  }
}
```
