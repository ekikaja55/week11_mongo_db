# API Endpoint - Mahasiswa, Dosen, Matkul, Pengumuman

Semua URL endpoint menggunakan method **GET**.

Setiap resource (mhs, dosen, matkul, pengumuman) memiliki:
- 1 endpoint untuk insert seeder (40 data)
- 5 query MongoDB (3 via `req.query`, 1 default tanpa query, 1 via `req.params`)

---

## Mahasiswa

- **Seeder**  
  `GET /api/mhs/seeder`  
  → Nge-seed 40 data mahasiswa

- **Query Mahasiswa**  
  `GET /api/mhs`  
  - Tanpa query → `find()` + sort `sks` ascending  
  - `?nrp=` → `findOne()` by `nrp`  
  - `?sks=` → `find()` `sks <= value`, sort by `sks` asc  
  - `?nrp=&sks=` → `find()` + sort `sks` asc (default behavior)

- **By NoTelp**  
  `GET /api/mhs/notelp/:notelp`  
  → Cari mahasiswa by `req.params`

---

## Dosen

- **Seeder**  
  `GET /api/dosen/seeder`  
  → Nge-seed 40 data dosen

- **Query Dosen**  
  `GET /api/dosen`  
  - Tanpa query → `find()`  
  - `?nid=` → `findOne()` by `nid`  
  - `?gender=` → `find()` by `gender`

- **By NoTelp**  
  `GET /api/dosen/:notelp`  
  → Cari dosen by `req.params`

---

## Mata Kuliah

- **Seeder**  
  `GET /api/matkul/seeder`  
  → Nge-seed 40 data matkul

- **Query Matkul**  
  `GET /api/matkul`  
  - Tanpa query → `find()`  
  - `?kode=` → `findOne()` by `kode`  
  - `?sks=` → `find()` `sks <= value`, sort by `sks` asc

- **By Nama Pengajar**  
  `GET /api/matkul/:nama_pengajar`  
  → Cari matkul by `req.params`

---

## Pengumuman

- **Seeder**  
  `GET /api/pengumuman/seeder`  
  → Nge-seed 40 data pengumuman

- **Query Pengumuman**  
  `GET /api/pengumuman`  
  - Tanpa query → `find()`  
  - `?kode=` → `findOne()` by `kode`  
  - `?sumber=` → `find()` by `sumber`

- **By Kode**  
  `GET /api/pengumuman/:kode`  
  → Cari pengumuman by `req.params`

---
