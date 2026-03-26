# 🔐 Auth Module (Frontend) — Business Logic & Flow

---

## 1. Arsitektur

```
proxy.ts (Route Guard)
    │
    ▼
useAuth() / useRole()        ← Hook-level guard di komponen
    │
    ▼
AuthService                  ← API calls ke backend
    │
    ▼
Axios + CSRF Interceptor      ← Auto-inject X-CSRF-Token header
    │
    ▼
Backend /api/auth             ← Session disimpan di Redis via httpOnly cookie
```

---

## 2. Route Protection — `proxy.ts`

**Lokasi:** `src/app/proxy.ts`

Next.js v16 mengganti `middleware.ts` dengan `proxy.ts`. File ini dijalankan di **Edge Runtime** sebelum setiap request sampai ke halaman.

### Logika

```
Request masuk
    │
    ├─ Path ada di PUBLIC_PATHS? (/auth, /auth/register)
    │       └─→ Ya: lewati proteksi, lanjut
    │
    ├─ Ada cookie SESSION-ID?
    │       ├─ Tidak + halaman protected → redirect /auth
    │       └─ Ya + halaman auth (/auth) → redirect /
    │
    └─→ NextResponse.next()
```

### Public Paths
```ts
const PUBLIC_PATHS = ["/auth", "/auth/register"];
```

### Matcher
```ts
matcher: ["/((?!_next|favicon.ico|api).*)"]
```
Semua path kecuali asset Next.js, favicon, dan `/api/*`.

### Penting
- Proxy hanya mengecek **keberadaan** cookie `SESSION-ID`, bukan validitasnya.
- Validasi session yang sebenarnya dilakukan oleh backend (`authMiddleware` di Hono).
- Jika session sudah expired di Redis tapi cookie masih ada → proxy lolos, tapi `useAuth()` akan dapat 401 dari backend → `authErrorAtom` di-set → user di-redirect ke `/auth`.

---

## 3. Auth Hooks

**Lokasi:** `src/app/auth/server/use.auth.ts`

### `useAuthAccount()`
Query hook sederhana. Memanggil `GET /api/auth` untuk mendapat data session.

```ts
{
    queryKey: ["account"],
    staleTime: 5 * 60 * 1000,  // Cache 5 menit
    retry: false,               // Tidak retry jika 401
}
```

### `useAuth()`
Wrapper di atas `useAuthAccount()`. Memberikan interface sederhana:

```ts
const { account, isLoading, isAuthenticated } = useAuth();
```

| Field | Tipe | Deskripsi |
|---|---|---|
| `account` | `AuthAccountResponseDTO \| undefined` | Data user jika sudah login |
| `isLoading` | `boolean` | Sedang fetch session |
| `isAuthenticated` | `boolean` | `true` jika `account` ada |

### `useRole(allowedRoles)`
Hook untuk cek apakah user punya role tertentu.

```ts
const { isAuthorized, isForbidden, hasRole, role } = useRole(["OWNER", "DEVELOPER"]);
```

| Field | Deskripsi |
|---|---|
| `role` | Role aktif user (dari session) |
| `hasRole` | `true` jika role user ada di `allowedRoles` |
| `isAuthorized` | Sudah login + punya role |
| `isForbidden` | Sudah login + tidak punya role |

**Contoh penggunaan di page:**
```tsx
// Lindungi halaman hanya untuk OWNER / DEVELOPER
const { isAuthorized, isForbidden, isLoading } = useRole(["OWNER", "DEVELOPER"]);
if (isLoading) return <Loading />;
if (isForbidden) throw new Error("FORBIDDEN");  // Caught by error boundary
return <AdminPage />;
```

**Contoh di UI:**
```tsx
// Sembunyikan tombol untuk STAFF
const { hasRole } = useRole(["OWNER", "DEVELOPER", "SUPER_ADMIN"]);
<Button disabled={!hasRole}>Hapus Permanen</Button>
```

### `useFormAuth()`
Mutation hooks untuk operasi auth: register, login, logout.

| Method | Action | On Success |
|---|---|---|
| `register(body)` | POST `/api/auth/register` | Redirect ke `/auth`, tampil notifikasi |
| `login(body)` | POST `/api/auth` | Redirect ke `/`, invalidate query `account` |
| `logout()` | DELETE `/api/auth` | Redirect ke `/auth`, invalidate query `account` |

---

## 4. CSRF Flow

Setiap mutasi (register, login, logout) memerlukan CSRF token:

```
1. `setupCSRFToken()` dipanggil sebelum POST/DELETE
2. GET /csrf → backend set cookie XSRF-TOKEN
3. Axios interceptor baca cookie XSRF-TOKEN
4. Inject ke header: X-XSRF-HEADER (atau sesuai NEXT_PUBLIC_XSRF_HEADER_NAME)
5. Backend csrfMiddleware validasi header vs Redis
```

---

## 5. Role Enum (Sinkron dengan Backend)

```ts
// shared/types.ts
export const ROLE = ["STAFF", "SUPER_ADMIN", "OWNER", "DEVELOPER"] as const;
```

| Role | Deskripsi |
|---|---|
| `STAFF` | Default untuk akun baru. Akses terbatas |
| `SUPER_ADMIN` | Admin penuh |
| `OWNER` | Pemilik sistem |
| `DEVELOPER` | Akses developer/debug |

---

## 6. Auth DTO

```ts
// AuthAccountResponseDTO — data session dari GET /api/auth
{
    email: string;
    role: "STAFF" | "SUPER_ADMIN" | "OWNER" | "DEVELOPER";
    status: "PENDING" | "ACTIVE" | "FAVOURITE" | "BLOCK" | "DELETE";
    user?: {
        first_name: string;
        last_name?: string;
        photo?: string;
        phone?: string;
        whatsapp?: string;
    };
}
```

---

## 7. Error Handling Auth

Axios interceptor di `lib/api/index.ts` menangkap error dari backend:

```
401 Unauthorized → authErrorAtom = "UNAUTHORIZED" → redirect login
403 Forbidden    → authErrorAtom = "FORBIDDEN"    → tampil halaman forbidden
404 Not Found    → authErrorAtom = "NOT_FOUND"    → tampil halaman 404
```

---

## 8. TODO / Known Issues

| # | Issue | Status |
|---|---|---|
| 1 | `authErrorAtom` diset tapi belum ada UI handler global untuk redirect otomatis saat 401 | ⚠️ Pending |
| 2 | Endpoint verify-email belum ada (backend juga pending) | ⚠️ Pending |
| 3 | `/auth/forgot-password` dan `/auth/reset-password` dikomentari di proxy.ts | ⚠️ Pending |
