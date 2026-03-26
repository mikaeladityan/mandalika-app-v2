# 🏗️ Frontend Architecture — Mandalika ERP

## Stack

| Layer | Tech | Versi |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.6 |
| Runtime | React | 19.2.3 |
| Bundler | Turbopack | default di Next.js 16 |
| State Server | TanStack React Query | 5.x |
| State Client | Jotai (atoms) | 2.x |
| HTTP | Axios | 1.x |
| Form | React Hook Form + Zod | 7.x / 4.x |
| Styling | Tailwind CSS v4 | 4.x |
| UI Primitives | Radix UI | — |
| Animasi | Framer Motion | 12.x |
| Chart | Recharts | 3.x |

---

## Struktur Direktori

```
app/src/
├── app/                              # Next.js App Router
│   ├── proxy.ts                      # Route protection (Next.js v16 = proxy.ts, bukan middleware.ts)
│   ├── layout.tsx                    # Root layout + providers
│   ├── (application)/                # Route group — halaman terproteksi
│   │   ├── page.tsx                  # Dashboard
│   │   ├── products/                 # Manajemen produk
│   │   ├── rawmat/                   # Bahan baku
│   │   ├── warehouses/               # Gudang
│   │   ├── outlets/                  # Outlet / toko
│   │   ├── sales/                    # Penjualan
│   │   ├── purchase/                 # Pembelian
│   │   ├── po/                       # Open PO
│   │   ├── bom/                      # Bill of Materials
│   │   ├── forecasts/                # Forecast produksi
│   │   ├── recipes/                  # Resep / Formula
│   │   ├── recomendation/            # Rekomendasi (v1)
│   │   ├── recomendation-v2/         # Rekomendasi FFO (v2)
│   │   ├── stock-movements/          # Pergerakan stok
│   │   ├── stock-transfers/          # Transfer stok
│   │   ├── production/               # Produksi
│   │   └── settings/                 # Pengaturan sistem
│   └── auth/                         # Halaman autentikasi (publik)
│       ├── page.tsx                  # Login
│       ├── register/page.tsx         # Register
│       └── server/                   # Auth logic
│           ├── schema.ts             # Zod schemas + DTOs
│           ├── services.ts           # API calls
│           └── use.auth.ts           # React Query hooks
│
├── components/
│   ├── providers/                    # Context providers (RootProvider, toasts)
│   ├── layouts/                      # Sidebar, Navbar
│   ├── pages/                        # Komponen per fitur
│   │   ├── auth/                     # Login, Register UI
│   │   ├── products/                 # Product UI
│   │   └── ...
│   └── ui/                           # Reusable primitives (button, input, table, dll)
│
├── lib/
│   ├── api/index.ts                  # Axios instance + CSRF interceptor
│   ├── query.ts                      # React Query client config
│   └── utils/                        # Error helpers, cn(), dsb
│
└── shared/
    ├── types.ts                      # Enum global + interface ApiSuccessResponse
    ├── store.ts                      # Jotai atoms (errorAtom, notificationAtom, authErrorAtom)
    └── hooks.ts                      # Shared utility hooks
```

---

## Konvensi Per Modul

Setiap fitur mengikuti struktur server + UI:

```
[feature]/
├── server/
│   ├── [feature].schema.ts      ← Zod schemas (Request, Response, Query DTOs)
│   ├── [feature].service.ts     ← API calls menggunakan `api` (Axios)
│   └── use.[feature].ts         ← React Query hooks (useQuery + useMutation)
└── page.tsx / [id]/page.tsx     ← UI pages
```

---

## Route Protection

Next.js v16 menggunakan `proxy.ts` (bukan `middleware.ts`):
- [ARCHITECTURE.md](file:///Users/mandalika/Documents/erp-v0.0.1/app/docs/ARCHITECTURE.md) — Filosofi & Struktur Folder
- [UI_DESIGN_GUIDE.md](file:///Users/mandalika/Documents/erp-v0.0.1/app/docs/UI_DESIGN_GUIDE.md) — Panduan Visual (Gold/Zinc Edition) 💎
- [ROADMAP.md](file:///Users/mandalika/Documents/erp-v0.0.1/app/docs/ROADMAP.md) — Rencana Pengembangan
```
src/app/proxy.ts   ← dikenali otomatis oleh Next.js v16 sebagai route guard
```

**Flow:**
1. Setiap request masuk diperiksa oleh `proxy.ts`
2. Cek `SESSION-ID` cookie (`NEXT_PUBLIC_SESSION_NAME`)
3. Tidak ada session + halaman protected → redirect `/auth`
4. Ada session + halaman auth → redirect `/`

---

## Data Flow

```
UI Component
  └─→ React Query Hook (use.[feature].ts)
        └─→ Service ([feature].service.ts)
              └─→ Axios (lib/api/index.ts)
                    └─→ CSRF interceptor (auto-inject X-CSRF-Token)
                          └─→ Backend API
```

---

## Error Handling Global

```
Backend 401 → authErrorAtom = "UNAUTHORIZED"
Backend 403 → authErrorAtom = "FORBIDDEN"
Backend 404 → authErrorAtom = "NOT_FOUND"
ApiError    → errorAtom = { message, details }
             → ErrorToastProvider menampilkan toast otomatis
```

---

## Environment Variables

| Variable | Dev | Prod |
|---|---|---|
| `NEXT_PUBLIC_API` | `http://localhost:3000` | `https://api-erp.mandalikaperfume.my.id` |
| `NEXT_PUBLIC_SESSION_NAME` | `SESSION-ID` | `SESSION-ID` |
| `NEXT_PUBLIC_XSRF_NAME` | `XSRF-TOKEN` | `XSRF-TOKEN` |
| `NEXT_PUBLIC_XSRF_HEADER_NAME` | `x-xsrf-header` | `x-xsrf-header` |
| `NEXT_PUBLIC_CAN_REGISTER` | `true` | `true` |
| `NEXT_PUBLIC_NODE_ENV` | `development` | `production` |
