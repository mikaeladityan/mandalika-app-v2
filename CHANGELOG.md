# Changelog - APP (Frontend)

Semua perubahan utama pada sisi client/antarmuka dicatat di sini.

## [2026-03-04]

### Added

- **Sales Analytics Feature**:
    - Implementasi halaman baru `/sales/analytics`.
    - Integrasi `Recharts` (BarChart & AreaChart) dengan desain glassmorphism modern.
    - Fitur **Automatic Best Seller**: Menampilkan data produk terlaris secara otomatis jika produk belum dipilih.
    - **Dynamic Trends**: Warna chart berubah otomatis (Hijau/Merah) berdasarkan tren kenaikan atau penurunan volume.
    - **Information Labels**: Penempatan `LabelList` di atas bar untuk visibilitas volume instan.
- **Product Selector**: Integrasi pencarian produk berbasis Redis dengan informasi Type & Size yang mendetail.
- **State Management**: Update `useSaleTableState` untuk sinkronisasi `product_id` dan `horizon` ke URL.

### Fixed

- **Global Prerender Fix**:
    - Masalah `useSearchParams()` tanpa `Suspense` yang menyebabkan error build Next.js di puluhan halaman.
    - Otomasi pembungkusan `<Suspense>` pada seluruh file `page.tsx`.
- **UI Enhancements**: Penyesuaian nama bulan ke Bahasa Indonesia dan formatting periode chart yang lebih bersih.
