# 📦 Product Module (Frontend) — Business Logic & Flow

---

## 1. Arsitektur

```
app/src/app/(application)/products/
    │
    ├── page.tsx                    ← List produk
    ├── create/page.tsx             ← Form tambah produk
    ├── [id]/page.tsx               ← Detail produk
    ├── [id]/edit/page.tsx          ← Form edit produk
    ├── import/page.tsx             ← Import bulk produk
    ├── stocks/page.tsx             ← Daftar stok produk
    ├── stocks/[id]/page.tsx        ← Detail stok
    ├── stocks/[id]/import/page.tsx ← Import stok
    └── (component)/
        ├── size/                   ← Sub-modul ukuran
        ├── unit/                   ← Sub-modul satuan
        └── type/                   ← Sub-modul tipe
```

**Data flow:**
```
UI Component
  └─→ Hook (use.products.ts)
        └─→ ProductService (products.service.ts)
              └─→ Axios (lib/api) + CSRF interceptor
                    └─→ Backend /api/app/products
```

---

## 2. Server Config & Hooks

**Lokasi:** `src/app/(application)/products/server/`

### `useProduct(params?, id?)`

Query hook untuk list dan detail dalam satu fungsi:

```ts
const { products, product, isLoading, isFetching } = useProduct(params);
// atau
const { product, isLoading } = useProduct(undefined, id);
```

| Return | Tipe | Keterangan |
|---|---|---|
| `products` | `{ data: ResponseProductDTO[], len: number }` | Hasil list + total count |
| `product` | `ResponseProductDTO & { recipes: [...] }` | Detail produk + resep bahan |
| `isLoading` | `boolean` | State loading detail |
| `isFetching` | `boolean` | Sedang fetch (list atau detail) |

**Query keys:**
- List: `["products", params]`
- Detail: `["products", id]`

**Catatan:** `enabled` di-set secara mutual exclusive — list aktif saat `params` ada dan `id` tidak, detail aktif saat `id` ada dan `params` tidak.

---

### `useFormProduct()`

Mutations untuk create dan update:

```ts
const { create, update } = useFormProduct();

// Create
await create.mutateAsync(body);

// Update
await update.mutateAsync({ body, id });
```

**On success:** Invalidate `["products"]`, `["types"]`, `["units"]` — karena create/update bisa auto-create tipe dan satuan baru.

---

### `useActionProduct()`

Mutations untuk aksi non-form (status dan clean):

```ts
const { changeStatus, clean } = useActionProduct();

await changeStatus.mutateAsync({ id, status: "ACTIVE" });
await clean.mutateAsync();
```

---

### `useProductTableState()`

Hook manajemen state tabel yang terintegrasi dengan URL query params (`useQueryParams`):

| State | Getter | Setter |
|---|---|---|
| Search | `search` | `setSearch(str)` |
| Sort | `sortBy`, `sortOrder` | `onSort(key)` |
| Filter gender | `gender` | `setGender(val?)` |
| Filter tipe | `type_id` | `setType(val?)` |
| Filter ukuran | `size_id` | `setSize(val?)` |
| Mode sampah | `isTrashMode` | `toggleTrashMode()` |
| Pagination | — | `setPage(n)`, `setPageSize(n)` |
| Reset semua | — | `resetFilters()` |
| Query DTO | `queryParams` | — (derived) |

**`queryParams`** adalah `useMemo` dari semua filter yang siap di-pass ke `useProduct(queryParams)`.

---

### `useProductsQuery(params)`

Wrapper tipis di atas `useProduct` — mengekstrak `data` dan `meta` untuk kemudahan tabel:

```ts
const { data, meta, isLoading } = useProductsQuery(queryParams);
// data = ResponseProductDTO[]
// meta = { data: [...], len: number }
```

---

## 3. Sub-Module Hooks

### Size (`(component)/size/server/use.size.ts`)

```ts
useSize(params?)          // list ukuran
useActionSize()           // create, update, delete
```

### Unit (`(component)/unit/server/use.unit.ts`)

```ts
useUnit(params?)          // list satuan
useActionUnit()           // create, update, delete
```

### Type (`(component)/type/server/use.type.ts`)

```ts
useType(params?)          // list tipe produk
useActionType()           // create, update, delete
```

Semua sub-modul punya Query Key sendiri (`["sizes"]`, `["units"]`, `["types"]`) dan di-invalidate dari `useFormProduct` saat produk dibuat/diupdate.

---

## 4. Schema Notes

**`RequestProductSchema`** (field penting):

| Field | Validasi | Keterangan |
|---|---|---|
| `code` | `regex(/^\S+$/)` | Tidak boleh ada spasi — gunakan `_` |
| `name` | `min(5)`, `max(100)` | |
| `size` | `coerce.number().min(2)` | Dikirim sebagai angka; backend auto find-or-create di `product_size` |
| `unit` | `string \| null` | Dikirim sebagai nama string; backend auto find-or-create |
| `product_type` | `string \| null` | Dikirim sebagai nama string; backend auto find-or-create |
| `z_value` | default `1.65` | Z-score untuk safety stock |
| `distribution_percentage` | default `0` | Persentase distribusi |
| `safety_percentage` | default `0` | Persentase safety stock |

**`QueryProductSchema`** — filter yang didukung:

| Parameter | Tipe | Default |
|---|---|---|
| `search` | string | — |
| `status` | STATUS enum | — (exclude DELETE) |
| `gender` | WOMEN \| MEN \| UNISEX | — |
| `type_id` | number | — |
| `size_id` | number | — |
| `page` | number | 1 |
| `take` | number | 25 |
| `sortBy` | enum 10 kolom | `name` |
| `sortOrder` | asc \| desc | `asc` |

---

## 5. Service Methods

**Lokasi:** `src/app/(application)/products/server/products.service.ts`

| Method | HTTP | Endpoint | CSRF |
|---|---|---|---|
| `list(params)` | GET | `/api/app/products` | — |
| `detail(id)` | GET | `/api/app/products/:id` | — |
| `create(body)` | POST | `/api/app/products` | ✅ |
| `update(body, id)` | PUT | `/api/app/products/:id` | ✅ |
| `changeStatus(id, status)` | PATCH | `/api/app/products/status/:id?status=` | ✅ |
| `clean()` | DELETE | `/api/app/products/clean` | ✅ |

**Catatan:** `detail()` mengembalikan `ResponseProductDTO & { recipes: [...] }` — backend menyertakan resep bahan baku di halaman detail produk.

---

## 6. State Management

**Atoms yang dipakai** (dari `@/shared/store`):

| Atom | Kapan di-set |
|---|---|
| `errorAtom` | `onError` di semua mutation — via `FetchError(err, setErr)` |
| `notificationAtom` | `onSuccess` di semua mutation — tampil toast sukses |

**Error handling:**
```ts
onError: (err) => FetchError(err, setErr)
// FetchError dari @/lib/utils/error — format error dari AxiosError ke errorAtom
```

---

## 7. URL State (`useQueryParams`)

Semua filter tabel disimpan di URL query params via `useQueryParams` dari `@/shared/hooks`. Ini memungkinkan:
- State tabel bertahan saat refresh halaman
- URL dapat di-share/bookmark dengan filter aktif
- Back button browser me-restore filter sebelumnya

---

## 8. TODO / Known Issues

| # | Issue | Status |
|---|---|---|
| 1 | `useProduct` menggabungkan list dan detail dalam satu hook — jika keduanya di-call bersamaan, `enabled` bisa confusing | ⚠️ Noted |
| 2 | `ResponseProductSchema` di frontend masih re-declare `code`, `name`, `status` (redundant dari base schema) | ⚠️ Minor |
| 3 | Sub-module size/unit/type tidak punya routes tersendiri — diakses via dialog/sheet di halaman utama produk | — |
