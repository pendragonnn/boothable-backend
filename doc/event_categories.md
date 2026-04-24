# Event Categories Module API Spec

Seluruh _endpoint_ pada modul ini bersifat **Restricted** (hanya dapat diakses oleh peran `admin`). Modul ini digunakan untuk mengelola data master kategori acara (seperti 'Tech', 'Music', 'Art') yang akan dipakai Organizer saat membuat acara.

---

## 1. Event Categories Module (Admin POV)

### Create Event Category

Endpoint: POST `/admin/event-categories`
Akses: Authenticated (Admin)
Tujuan: Membuat kategori acara baru.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Request Body:
```json
{
  "name": "E-Sports Tournament",
  "slug": "e-sports",
  "icon": "gamepad-2",
  "description": "Kategori turnamen olahraga elektronik."
}
```

Response Body (Success):
```json
{
  "data": {
    "id": "uuid-v4-generated-string",
    "name": "E-Sports Tournament",
    "slug": "e-sports",
    "icon": "gamepad-2",
    "description": "Kategori turnamen olahraga elektronik.",
    "createdAt": "2026-04-24T00:00:00.000Z",
    "updatedAt": "2026-04-24T00:00:00.000Z"
  }
}
```

---

### Get All Event Categories

Endpoint: GET `/admin/event-categories`
Akses: Authenticated (Admin)
Tujuan: Mengambil daftar seluruh kategori acara dengan fitur paginasi.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Query Parameters:
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

Response Body (Success):
```json
{
  "data": [
    {
      "id": "uuid-1",
      "name": "Technology & Gadgets",
      "slug": "tech",
      "icon": "monitor",
      "description": "Tech events",
      "createdAt": "2026-04-24T00:00:00.000Z",
      "updatedAt": "2026-04-24T00:00:00.000Z"
    },
    {
      "id": "uuid-2",
      "name": "Food & Beverages",
      "slug": "food",
      "icon": "utensils",
      "description": "Food events",
      "createdAt": "2026-04-24T00:00:00.000Z",
      "updatedAt": "2026-04-24T00:00:00.000Z"
    }
  ],
  "paging": {
    "page": 1,
    "totalPage": 1,
    "totalData": 2
  }
}
```

---

### Get Event Category Detail

Endpoint: GET `/admin/event-categories/:id`
Akses: Authenticated (Admin)
Tujuan: Melihat spesifikasi lengkap satu kategori acara.

Request Headers:
```
Authorization: Bearer <accessToken>
```

Response Body (Success):
```json
{
  "data": {
    "id": "uuid-1",
    "name": "Technology & Gadgets",
    "slug": "tech",
    "icon": "monitor",
    "description": "Tech events",
    "createdAt": "2026-04-24T00:00:00.000Z",
    "updatedAt": "2026-04-24T00:00:00.000Z"
  }
}
```

---

### Update Event Category

Endpoint: PATCH `/admin/event-categories/:id`
Akses: Authenticated (Admin)
Tujuan: Memperbarui data kategori acara. Backend akan mencegah pengubahan `name` atau `slug` jika sudah ada kategori lain yang menggunakannya (mencegah duplikasi).

Request Headers:
```
Authorization: Bearer <accessToken>
```

Request Body (Partial Update):
```json
{
  "icon": "laptop",
  "description": "Hardware and software tech events"
}
```

Response Body (Success):
```json
{
  "data": {
    "id": "uuid-1",
    "name": "Technology & Gadgets",
    "slug": "tech",
    "icon": "laptop",
    "description": "Hardware and software tech events",
    "createdAt": "2026-04-24T00:00:00.000Z",
    "updatedAt": "2026-04-24T00:10:00.000Z"
  }
}
```

---

### Delete Event Category

Endpoint: DELETE `/admin/event-categories/:id`
Akses: Authenticated (Admin)
Tujuan: Menghapus kategori acara dari sistem.

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

## 2. Event Categories Module (Public POV)

Endpoint ini bersifat publik dan diakses tanpa otentikasi. Biasanya dipanggil oleh *Frontend/Company Profile* untuk menampilkan daftar kategori yang ada.

### Get All Event Categories (Public)

Endpoint: GET `/event-categories`
Akses: Public
Tujuan: Mengambil daftar seluruh kategori acara untuk ditampilkan.

Query Parameters:
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

Response Body (Success):
```json
{
  "data": [
    {
      "id": "uuid-1",
      "name": "Technology & Gadgets",
      "slug": "tech",
      "icon": "monitor",
      "description": "Tech events",
      "createdAt": "2026-04-24T00:00:00.000Z",
      "updatedAt": "2026-04-24T00:00:00.000Z"
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

### Get Event Category Detail (Public)

Endpoint: GET `/event-categories/:id`
Akses: Public
Tujuan: Mengambil detail spesifik dari satu kategori.

Response Body (Success):
```json
{
  "data": {
    "id": "uuid-1",
    "name": "Technology & Gadgets",
    "slug": "tech",
    "icon": "monitor",
    "description": "Tech events",
    "createdAt": "2026-04-24T00:00:00.000Z",
    "updatedAt": "2026-04-24T00:00:00.000Z"
  }
}
```
