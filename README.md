# Boothable Backend API 🎪

**Boothable** adalah platform _marketplace_ penyewaan _booth_ (stan/bazar) tingkat lanjutan (Advanced Level) yang menghubungkan penyelenggara acara (Organizer) dengan penyewa _booth_ (Vendor). Sistem aplikasi ini juga memiliki entitas Admin (*Super User*) yang berperan sebagai penengah dan moderator untuk seluruh jalannya transaksi.

---

## 🛠️ Stack Teknologi

Sistem backend ini dibangun menggunakan teknologi-teknologi modern dan kokoh untuk skalabilitas tingkat lanjut:

* **[NestJS](https://nestjs.com/)**: Framework Node.js yang sangat terstruktur, modul-sentris, dan efisien untuk menyokong Controller-Service pattern TypeScript.
* **[Prisma ORM](https://www.prisma.io/)**: Menangani skema relasional, migrasi database, serta kueri yang aman (`type-safe`).
* **[PostgreSQL](https://www.postgresql.org/)**: Basis data relasional (*Relational Database*) utama yang tangguh.
* **[Zod](https://zod.dev/)**: Memastikan validasi skema input (DTOs) dan payload JSON selalu konsisten sebelum masuk ke *Controller*.
* **[Winston](https://github.com/winstonjs/winston)**: Menggantikan *native logger* NestJS, berguna untuk menyimpan log terpusat dan *audit trail* operasional.
* **[JWT & Passport](http://www.passportjs.org/)**: Autentikasi lintas (*stateless*) menggunakan metode Bearer Access Token tingkat industri.
* **[Multer](https://github.com/expressjs/multer)**: Intersepti `multipart/form-data` untuk unggahan gambar / bukti pembayaran / peta *booth* acara.

---

## 📂 Struktur Repositori

Proyek ini telah dikostumisasi menggunakan arsitektur adaptif (sering disebut arsitektur berbasis fitur / _feature-based components_):

```
📦 boothable-backend
 ┣ 📂 doc
 ┃ ┗ 📜 boothable_postman_collection.json (Koleksi API terpusat untuk uji Postman)
 ┣ 📂 prisma
 ┃ ┗ 📜 schema.prisma (Skema entitas dan relasi)
 ┣ 📂 src
 ┃ ┣ 📂 common
 ┃ ┃ ┣ 📂 decorators (Misal: @Roles, @GetUser)
 ┃ ┃ ┣ 📂 guards (Misal: JwtAuthGuard, RolesGuard)
 ┃ ┃ ┗ 📂 pipes (Misal: ZodValidationPipe)
 ┃ ┣ 📂 infrastructure
 ┃ ┃ ┣ 📂 prisma (Prisma Module)
 ┃ ┃ ┗ 📂 storage/upload (Pusat penyimpan lokal bukti statis & foto)
 ┃ ┣ 📂 modules (Pusat Logika Bisnis)
 ┃ ┃ ┣ 📂 auth (Login, Register JWT Token)
 ┃ ┃ ┣ 📂 users (Profil, Update User)
 ┃ ┃ ┣ 📂 events (Public, Vendor, Admin controllers)
 ┃ ┃ ┣ 📂 booths (Manajemen Stan)
 ┃ ┃ ┣ 📂 bookings (Algoritma pencegahan jadwal tumpang tindih)
 ┃ ┃ ┗ 📂 payments (Pembayaran dan Statistik Pendapatan)
 ┃ ┣ 📜 app.module.ts (Root modul NestJS)
 ┃ ┗ 📜 main.ts (Bootstrapper NestJS)
 ┗ 📜 package.json
```

---

## ⚙️ Petunjuk Pemasangan Lokal

### 1. Prasyarat (*Prerequisites*)
Pastikan hal-hal berikut sudah ter-install di mesin Anda:
- **Node.js** (Versi 18 LTS ke atas direkomendasikan)
- **PostgreSQL Database** (Berjalan secara lokal atau Anda bisa memakai Cloud DB URI seperti Supabase)

### 2. Kloning Repositori
```bash
git clone https://github.com/username-anda/boothable-backend.git
cd boothable-backend
npm install
```

### 3. Konfigurasi Lingkungan (*Environment*)
Buat file baru di direktori _root_ proyek dan beri nama `.env`, lalu ikuti format *boilerplate* berikut ini.
*(Jangan bagikan kode `SECRET` asli ke ranah publik!)*

```env
# URL Koneksi PostgreSQL Anda
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="postgresql://postgres:password123@localhost:5432/boothable?schema=public"

# Port spesifik untuk Node.JS (Default: 3000)
PORT=3000

# Rahasia untuk hash JWT (Ubah dengan string random agar aman)
JWT_SECRET="rahasia_super_boothable_jwt_xxyz"

# Waktu kedaluwarsa Token
JWT_EXPIRES_IN="7d"

# Konfigurasi Saluran Penyimpanan Lokal
UPLOAD_DIR="./src/infrastructure/storage/upload"
```

### 4. Setup Database & Migrasi
Lakukan sinkronisasi schema Prisma ke PostgreSQL Anda, kemudian jalankan generate tipe data:
```bash
# Push schema dan buat tabel database perdana
npx prisma db push

# (Alternatif bila ada error migrations)
# npx prisma migrate dev --name init

# Generate Prisma Client Typings
npx prisma generate
```

### 5. Jalankan Aplikasi
Aplikasi sudah siap diluncurkan.

```bash
# Versi Pengembangan (Watch Mode Cepat / Hot Reload)
npm run start:dev

# Versi Production
npm run build
npm run start:prod
```

Server kini aktif merespon di `http://localhost:${PORT}/`. 🚀

---

## 🔐 Sistem Autorisasi / Roles Berjenjang (RBAC)

Kami merancang struktur rute Controller dalam 3 cabang eksklusif berbekal **`Role-Based Access Control`**:

1. **Vendor**: Target pengguna reguler. Bisa mengambil `Access Token` via login, mencari Event (`GET /events`), mereservasi (*Booking*) stand, lalu *Upload* lampiran Bank Transfer.
2. **Organizer**: Penanggung Jawab Penuh. Bisa membuat *Events*, merancang jumlah/peta *Booths*, mengatur/menyetujui *Bookings* di bawah manajemennya, dan mendapatkan pantauan Revenue Finansial global dari acaranya.
3. **Admin**: God-Mode 👑. Dapat menghapus interaksi apa pun (termasuk *Force-Cancel* pemesanan nakal) secara membumi lintas data global dari semua Vendor dan Organizer.

> **Uji coba API menggunakan Postman:**
> Seluruh rute lengkap dengan *mock data body JSON* beserta dokumentasi detail *Header Bearer* & Endpoint Pagination (`?limit=10&page=1`) sudah tergabung langsung di dalam *workspace Postman* di repositori!
> File lokasi: `doc/boothable_postman_collection.json`.

---
*Ditenagai dan dirancang oleh kolaborasi modern Stack NestJS-Prisma TS.*
