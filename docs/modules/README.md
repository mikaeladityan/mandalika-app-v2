# Frontend Modules — Documentation Index

Dokumentasi per modul disimpan di `app/docs/modules/[feature]/`.

---

## Struktur Dokumen Per Modul

| File | Isi |
|---|---|
| `ROADMAP.md` | Business logic, flow, hooks API, state management |

---

## Status Modul

| Modul | ROADMAP | Catatan |
|---|---|---|
| `auth` | ✅ Selesai | Login, Register, CSRF, role guard |
| `product` | ✅ Selesai | CRUD produk + sub-modul size/unit/type, table state, import |

---

## Tambah Modul Baru

Saat fitur frontend baru selesai, buat folder dan file:

```
app/docs/modules/[feature]/
└── ROADMAP.md    ← Business logic, hooks, state, flow
```

Lalu tambahkan entri ke tabel di atas.
