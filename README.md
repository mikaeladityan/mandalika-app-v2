# Mandalika ERP - APP (Frontend)

Antarmuka pengguna (Frontend) modern untuk ekosistem Mandalika ERP. Dirancang dengan estetika premium (Glassmorphism), responsif, dan performa tinggi menggunakan ekosistem Next.js terbaru.

## ✨ Visual & Estetika (Rich Aesthetics)

Aplikasi ini menggunakan standar desain modern:

- **Glassmorphism Design**: Efek transparansi dan blur yang memanjakan mata.
- **Modern Typography**: Menggunakan font Geist untuk keterbacaan optimal.
- **Premium UI Components**: Dibangun di atas Radix UI dan Shadcn UI.
- **Interactive Analytics**: Visualisasi data interaktif menggunakan [Recharts](https://recharts.org/).

## 🚀 Teknologi Utama

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) dengan Turbopack.
- **State Management**: [Jotai](https://jotai.org/) (Atomic state) & [React Query v5](https://tanstack.com/query) untuk sinkronisasi server.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan filter animasi kustom.
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) & Zod validation.
- **Icons**: [Lucide React](https://lucide.dev/).

## 📋 Fitur Unggulan

- **Sales Analytics Dashboard**: Pantau tren penjualan secara visual dengan deteksi tren otomatis.
- **Inventory Management**: Kelola stok Raw Material dan Finish Goods dengan filter yang powerful.
- **Global Search**: Pencarian cepat di seluruh entitas data aplikasi.
- **Responsive Navigation**: Sidebar dinamis untuk desktop dan akses intuitif untuk mobile.
- **Static Integrity**: Seluruh rute dibungkus dengan `<Suspense>` untuk stabilitas hidrasi yang maksimal.

## ⚙️ Memulai Pengembangan

1. Instal dependensi:
    ```bash
    npm install
    ```
2. Jalankan server development:
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:3001`.

## 📦 Build Produksi

Untuk melakukan build optimasi produksi:

```bash
npm run build
```

---

© 2026 Mandalika ERP.
