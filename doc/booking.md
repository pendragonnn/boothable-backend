# Booking Module API Spec

## 1. Booking Module (User POV - Vendor)

### Create Booking

Endpoint: POST `/bookings`
Akses: Authenticated (Vendor)
Tujuan: Membuat pesanan booth baru.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Request Body: 
```json
{
  "boothId": 1,
  "rentalStartDate": "2026-08-10",
  "rentalEndDate": "2026-08-12"
}
```

Response Body (Success): 
```json
{
  "data": {
    "id": 1,
    "userId": 3,
    "boothId": 1,
    "rentalStartDate": "2026-08-10",
    "rentalEndDate": "2026-08-12",
    "status": "Pending",
    "totalPrice": 1500000,
    "createdAt": "2026-04-21T10:00:00.000Z",
    "updatedAt": "2026-04-21T10:00:00.000Z"
  }
}
```

---

### Get My Bookings

Endpoint: GET `/bookings`
Akses: Authenticated (Vendor)
Tujuan: Melihat riwayat pemesanan milik sendiri (History).

Request Headers:
```
Authorization: Bearer <accessToken>
```

Query Parameters:
- `page` (optional)
- `limit` (optional)
- `status` (optional): Filter enum

Response Body (Success): 
```json
{
  "data": [
    {
      "id": 1,
      "userId": 3,
      "boothId": 1,
      "rentalStartDate": "2026-08-10",
      "rentalEndDate": "2026-08-12",
      "status": "Pending",
      "totalPrice": 1500000,
      "createdAt": "2026-04-21T10:00:00.000Z",
      "updatedAt": "2026-04-21T10:00:00.000Z"
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

### Get Booking Detail

Endpoint: GET `/bookings/:id`
Akses: Authenticated (Vendor)
Tujuan: Melihat detail pesanan tertentu.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Response Body (Success): 
```json
{
  "data": {
    "id": 1,
    "userId": 3,
    "boothId": 1,
    "rentalStartDate": "2026-08-10",
    "rentalEndDate": "2026-08-12",
    "status": "Waiting Payment",
    "totalPrice": 1500000,
    "createdAt": "2026-04-21T10:00:00.000Z",
    "updatedAt": "2026-04-21T12:00:00.000Z"
  }
}
```

---

### Cancel My Booking

Endpoint: PATCH `/bookings/:id/cancel`
Akses: Authenticated (Vendor)
Tujuan: Membatalkan pesanan sendiri (hanya bisa jika status masih `Pending` atau `Waiting Payment`).

Request Headers:
```
Authorization: Bearer <accessToken>
```

Response Body (Success): 
```json
{
  "data": {
    "id": 1,
    "status": "Cancelled",
    "updatedAt": "2026-04-21T13:00:00.000Z"
  }
}
```

---

## 2. Booking Module (User POV - Organizer)

### Get Managed Bookings

Endpoint: GET `/organizer/bookings`
Akses: Authenticated (Organizer)
Tujuan: Melihat semua daftar pesanan yang masuk khusus untuk event-event yang dikelola organizer.

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
      "userId": 3,
      "boothId": 1,
      "rentalStartDate": "2026-08-10",
      "rentalEndDate": "2026-08-12",
      "status": "Waiting Payment",
      "totalPrice": 1500000,
      "createdAt": "2026-04-21T10:00:00.000Z",
      "updatedAt": "2026-04-21T10:00:00.000Z"
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

### Get Managed Booking Detail

Endpoint: GET `/organizer/bookings/:id`
Akses: Authenticated (Organizer)

Request Headers:
```
Authorization: Bearer <accessToken>
```

Response Body (Success): 
```json
{
  "data": {
    "id": 1,
    "userId": 3,
    "boothId": 1,
    "rentalStartDate": "2026-08-10",
    "rentalEndDate": "2026-08-12",
    "status": "Waiting Payment",
    "totalPrice": 1500000,
    "createdAt": "2026-04-21T10:00:00.000Z",
    "updatedAt": "2026-04-21T10:00:00.000Z"
  }
}
```

---

### Update Booking Status

Endpoint: PATCH `/organizer/bookings/:id/status`
Akses: Authenticated (Organizer)
Tujuan: Mengubah status booking.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Request Body: 
```json
{
  "status": "Approved"
}
```

Response Body (Success): 
```json
{
  "data": {
    "id": 1,
    "status": "Approved",
    "updatedAt": "2026-04-21T12:00:00.000Z"
  }
}
```

---

### Get Event Attendees (Approved Vendors)

Endpoint: GET `/organizer/events/:eventId/attendees`
Akses: Authenticated (Organizer)
Tujuan: Mengambil daftar `vendor_id` (`user_id` dengan role vendor) yang booking-nya berstatus `Approved`.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Response Body (Success): 
```json
{
  "data": [
    {
      "bookingId": 1,
      "userId": 3,
      "boothId": 1
    }
  ]
}
```

---

## 3. Booking Module (Admin POV)

### Get All Bookings Globally

Endpoint: GET `/admin/bookings`
Akses: Authenticated (Admin)

Request Headers:
```
Authorization: Bearer <accessToken>
```

Query Parameters:
- `page` (optional)
- `limit` (optional)
- `eventId` (optional)
- `userId` (optional)
- `status` (optional)

Response Body (Success): 
```json
{
  "data": [
    {
      "id": 1,
      "userId": 3,
      "boothId": 1,
      "rentalStartDate": "2026-08-10",
      "rentalEndDate": "2026-08-12",
      "status": "Approved",
      "totalPrice": 1500000,
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

### Get Booking Detail (Audit Trail)

Endpoint: GET `/admin/bookings/:id`
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
    "userId": 3,
    "boothId": 1,
    "rentalStartDate": "2026-08-10",
    "rentalEndDate": "2026-08-12",
    "status": "Cancelled",
    "totalPrice": 1500000,
    "createdAt": "2026-04-21T10:00:00.000Z",
    "updatedAt": "2026-04-21T13:00:00.000Z"
  }
}
```

---

### Force Cancel Booking (Admin Intervention)

Endpoint: PATCH `/admin/bookings/:id/force-cancel`
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
    "status": "Cancelled",
    "updatedAt": "2026-04-21T14:00:00.000Z"
  }
}
```
