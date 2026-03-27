"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/app/(application)/products/server/use.products";
import { useIssuance } from "@/app/(application)/product-issuance/server/use.issuance";
import { useForecast } from "@/app/(application)/forecasts/server/use.forecast";
import { useWarehouses } from "@/app/(application)/shared/use.shared";
import { useAuth } from "@/app/auth/server/use.auth";
import { useOutlets } from "@/app/(application)/outlets/server/use.outlet";
import { useRawMaterial } from "@/app/(application)/rawmat/server/use.rawmat";

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    href,
    isLoading,
    color = "blue",
}: {
    title: string;
    value?: string | number;
    description?: string;
    icon: any;
    href: string;
    isLoading?: boolean;
    color?: "blue" | "green" | "purple" | "orange";
}) {
    const colorMap = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
    };

    return (
        <Link href={href}>
            <Card className="hover:shadow-md transition-all duration-300 cursor-pointer h-full rounded-2xl border-none shadow-xs group">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">
                                {title}
                            </p>
                            {isLoading ? (
                                <Skeleton className="h-8 w-20 mt-2" />
                            ) : (
                                <p className="text-3xl font-black mt-1 tracking-tight">
                                    {value ?? "-"}
                                </p>
                            )}
                            {description && (
                                <p className="text-[10px] font-medium text-muted-foreground mt-2 bg-muted/50 w-fit px-2 py-0.5 rounded-full">
                                    {description}
                                </p>
                            )}
                        </div>
                        <div
                            className={`p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300 ${colorMap[color]}`}
                        >
                            <Icon className="size-6" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

function QuickAction({
    title,
    description,
    href,
    icon: Icon,
}: {
    title: string;
    description: string;
    href: string;
    icon: any;
}) {
    return (
        <Link href={href}>
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all duration-200 cursor-pointer group border border-transparent hover:border-primary/10">
                <div className="p-3 rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-all duration-200">
                    <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">
                        {title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{description}</p>
                </div>
                <ArrowRight className="size-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
            </div>
        </Link>
    );
}

export function Main() {
    const { account } = useAuth();
    const { products, isLoading: loadingProducts } = useProduct({
        page: 1,
        take: 1,
        sortBy: "updated_at",
        sortOrder: "desc",
    });
    const { data: warehouses, isLoading: loadingWarehouses } = useWarehouses();
    const { list: forecastList } = useForecast({ page: 1, take: 1, horizon: 4 });
    const { outlets, isLoading: loadingOutlets } = useOutlets({
        page: 1,
        take: 1,
    });
    const { rawMaterials, isLoading: loadingRawMat } = useRawMaterial({
        page: 1,
        take: 1,
        status: "actived",
        sortBy: "updated_at",
        sortOrder: "desc",
    });

    const now = new Date();
    const { issuances: salesData, isLoading: loadingSales } = useIssuance({
        page: 1,
        take: 5,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        sortBy: "quantity",
        sortOrder: "desc",
    });

    const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    return (
        <div className="flex flex-col gap-[22px] animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-5">
                {/* Pusat Kendali Card */}
                <Card className="p-[22px] flex flex-col justify-between h-full bg-white border-[#E2E8F0] shadow-[0_10px_20px_rgba(15,23,42,0.06)] rounded-[18px]">
                    <div className="flex flex-col gap-2">
                        <small className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B49020]">
                            Pusat Kendali Inventaris
                        </small>
                        <h1 className="text-[26px] font-black text-[#0F172A] leading-tight">
                            Mandalika Parfumery — Manajemen Distribusi
                        </h1>
                        <p className="text-[13px] text-[#64748B] leading-relaxed max-w-[580px]">
                            Satu ekosistem terpadu untuk mengelola seluruh rantai pasokan parfum —
                            mulai dari pengadaan bahan baku, formulasi resep beraliansi, produksi,
                            hingga distribusi stok real-time ke seluruh outlet.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-[14px] mt-8">
                        <div className="p-[18px] border border-[#E2E8F0] rounded-[16px] bg-linear-to-b from-white to-[#FAFAFA]">
                            <div className="text-[10px] font-black uppercase tracking-widest text-[#64748B]">
                                Produk SKU
                            </div>
                            <div className="text-[24px] font-black text-[#0F172A] mt-2 leading-none">
                                {loadingProducts ? "..." : (products?.len ?? 0)}
                            </div>
                        </div>
                        <div className="p-[18px] border border-[#E2E8F0] rounded-[16px] bg-linear-to-b from-white to-[#FAFAFA]">
                            <div className="text-[10px] font-black uppercase tracking-widest text-[#64748B]">
                                Bahan Baku
                            </div>
                            <div className="text-[24px] font-black text-[#0F172A] mt-2 leading-none">
                                {loadingRawMat ? "..." : (rawMaterials?.len ?? 0)}
                            </div>
                        </div>
                        <div className="p-[18px] border border-[#E2E8F0] rounded-[16px] bg-linear-to-b from-white to-[#FAFAFA]">
                            <div className="text-[10px] font-black uppercase tracking-widest text-[#64748B]">
                                Total Outlet
                            </div>
                            <div className="text-[24px] font-black text-[#0F172A] mt-2 leading-none">
                                {loadingOutlets ? "..." : (outlets?.len ?? 0)}
                            </div>
                        </div>
                        <div className="p-[18px] border border-[#E2E8F0] rounded-[16px] bg-linear-to-b from-white to-[#FAFAFA]">
                            <div className="text-[10px] font-black uppercase tracking-widest text-[#64748B]">
                                Tahap Proyek
                            </div>
                            <div className="text-[14px] font-black text-[#10B981] mt-3 uppercase tracking-wider leading-none text-center">
                                Fase 2
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Right Stack */}
                <div className="flex flex-col gap-5">
                    <Card className="p-[22px] bg-white border-[#E2E8F0] shadow-[0_10px_20px_rgba(15,23,42,0.06)] rounded-[18px]">
                        <small className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B49020]">
                            Fokus Pengembangan
                        </small>
                        <h2 className="text-[20px] font-black text-[#0F172A] mt-2 mb-3 leading-tight">
                            Target Operasional
                        </h2>
                        <div className="space-y-1.5">
                            <p className="text-[12px] text-[#64748B] flex items-start gap-2">
                                <span className="font-bold text-[#0F172A]">1.</span> Stabilisasi Log
                                Mutasi Stok
                            </p>
                            <p className="text-[12px] text-[#64748B] flex items-start gap-2">
                                <span className="font-bold text-[#0F172A]">2.</span> Implementasi PO
                                & Receiving
                            </p>
                            <p className="text-[12px] text-[#64748B] flex items-start gap-2">
                                <span className="font-bold text-[#0F172A]">3.</span> Optimasi
                                Resupply ke Outlet
                            </p>
                            <p className="text-[12px] text-[#64748B] flex items-start gap-2">
                                <span className="font-bold text-[#0F172A]">4.</span> Integrasi
                                Real-time POS
                            </p>
                        </div>
                    </Card>

                    <Card className="p-[22px] bg-white border-[#E2E8F0] shadow-[0_10px_20px_rgba(15,23,42,0.06)] rounded-[18px]">
                        <small className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B49020]">
                            Ringkasan Aset
                        </small>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <Link href="/warehouses" className="group">
                                <div className="p-3 border border-[#E2E8F0] rounded-[14px] hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all">
                                    <div className="text-[10px] font-black text-[#64748B] uppercase tracking-wider group-hover:text-[#D4AF37]">
                                        Gudang
                                    </div>
                                    <div className="text-[16px] font-black text-[#0F172A] mt-1">
                                        {loadingWarehouses ? "..." : (warehouses?.length ?? 0)}
                                    </div>
                                </div>
                            </Link>
                            <Link href="/outlets" className="group">
                                <div className="p-3 border border-[#E2E8F0] rounded-[14px] hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all">
                                    <div className="text-[10px] font-black text-[#64748B] uppercase tracking-wider group-hover:text-[#D4AF37]">
                                        Outlet Toko
                                    </div>
                                    <div className="text-[16px] font-black text-[#0F172A] mt-1">
                                        {loadingOutlets ? "..." : (outlets?.len ?? 0)}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Middle Section: Recent Sales & Quick Access */}
            <section className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5">
                {/* Recent Sales */}
                <Card className="p-[22px] bg-white border-[#E2E8F0] shadow-[0_10px_20px_rgba(15,23,42,0.06)] rounded-[18px]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <small className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B49020]">
                                Monitoring Sales
                            </small>
                            <h2 className="text-[20px] font-black text-[#0F172A] mt-1">
                                Pengeluaran Terlaris — {months[now.getMonth()]}
                            </h2>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="rounded-xl border-[#E2E8F0] hover:bg-[#F8FAFC]"
                        >
                            <Link
                                href="/sales"
                                className="text-xs font-bold text-[#64748B] flex items-center gap-1"
                            >
                                Lihat Semua <ArrowRight className="size-3" />
                            </Link>
                        </Button>
                    </div>

                    {loadingSales ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-14 w-full rounded-2xl" />
                            ))}
                        </div>
                    ) : !salesData?.issuances?.length ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-2xl border border-dashed border-[#E2E8F0]">
                            <ShoppingBag className="size-8 text-[#CBD5E1] mb-2" />
                            <p className="text-[13px] font-medium text-[#94A3B8]">
                                Belum ada data penjualan tercatat bulan ini
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {salesData.issuances.map((sale: any, i: number) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-[16px] bg-white group hover:border-[#D4AF37]/40 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-[#F8FAFC] group-hover:bg-[#D4AF37]/10 flex items-center justify-center transition-colors">
                                            <Package className="size-5 text-[#64748B] group-hover:text-[#D4AF37]" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-black text-[#0F172A] leading-none">
                                                {sale.product?.name ?? "Produk Anonim"}
                                            </p>
                                            <p className="text-[11px] text-[#64748B] mt-1.5 font-medium">
                                                {" "}
                                                SKU: {sale.product?.code ?? "-"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[14px] font-black text-[#0F172A]">
                                            {sale.totalQuantity ?? 0}
                                        </p>
                                        <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                                            Unit
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Status Ringkas or Quick Links */}
                <div className="flex flex-col gap-5 min-w-[300px]">
                    <Card className="p-[22px] bg-[#0F172A] text-white border-none shadow-[0_20px_40px_rgba(15,23,42,0.2)] rounded-[18px] relative overflow-hidden h-full">
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                                <small className="text-[10px] font-black uppercase tracking-[0.14em] text-[#D4AF37]">
                                    System Health
                                </small>
                                <h3 className="text-[18px] font-black mt-2">Sinkronisasi POS</h3>
                                <p className="text-[12px] text-gray-400 mt-2 leading-relaxed">
                                    Status koneksi ke outlet saat ini stabil. Menunggu deployment
                                    modul Sync di Fase 3.
                                </p>
                            </div>
                            <Badge className="bg-[#10B981] text-white border-none rounded-full px-3 py-1 text-[10px] font-black mt-6 w-fit">
                                RUNNING (MOCK)
                            </Badge>
                        </div>
                        {/* Subtle background decoration */}
                        <div className="absolute -right-4 -bottom-4 size-32 bg-white/5 rounded-full blur-3xl"></div>
                    </Card>
                </div>
            </section>

            {/* Roadmap Section */}
            <section className="p-[22px] bg-white border-[#E2E8F0] shadow-[0_10px_20px_rgba(15,23,42,0.06)] rounded-[18px]">
                <div className="mb-6">
                    <small className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B49020]">
                        Master Project Roadmap
                    </small>
                    <h2 className="text-[20px] font-black text-[#0F172A] mt-1">
                        Tahapan Pengembangan Sistem
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px]">
                    {[
                        {
                            f: "Fase 1: Core Foundation",
                            d: "Produk SKU, Bahan Baku, Resep BOM, Forecasting Engine, dan Manajemen Outlet Dasar.",
                        },
                        {
                            f: "Fase 2: Inventory Ops",
                            d: "Log Mutasi Stok, Purchase Order (PO), Stock Transfer (Resupply), dan Stock Adjustment.",
                        },
                        {
                            f: "Fase 3: POS Integration",
                            d: "Registrasi POS Device, Sync Transaksi Penjualan, Idempotency, dan Auto-deduct Stok Toko.",
                        },
                        {
                            f: "Fase 4: Alerts & Safety",
                            d: "Low Stock Alert Otomatis (Gudang & Outlet), Safety Stock Calculation, dan Procurement Advice.",
                        },
                        {
                            f: "Fase 5: Analytics",
                            d: "Laporan Pergerakan Stok Universal, Analisis Slow Moving, dan Sinkronisasi Sales Actual.",
                        },
                        {
                            f: "Fase 6: Finance",
                            d: "Posting Akuntansi, AP/AR Tracking, Penjurnalan Otomatis, dan Laporan Laba Rugi.",
                        },
                    ].map((phase, i) => (
                        <div
                            key={i}
                            className="p-4 border border-[#E2E8F0] rounded-[16px] bg-white hover:shadow-md transition-all"
                        >
                            <h3 className="text-[14px] font-black text-[#0F172A] mb-2">
                                {phase.f}
                            </h3>
                            <p className="text-[12px] text-[#64748B] leading-relaxed">{phase.d}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Module Grid Section */}
            <section className="p-[22px] bg-white border-[#E2E8F0] shadow-[0_10px_20px_rgba(15,23,42,0.06)] rounded-[18px]">
                <div className="mb-6">
                    <small className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B49020]">
                        Peta Modul
                    </small>
                    <h2 className="text-[20px] font-black text-[#0F172A] mt-1">
                        Modul Operasional Aktif
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        {
                            n: "Katalog Produk",
                            s: "Manajemen produk jadi (Finish Goods) lengkap dengan ukuran dan tipe parfum.",
                            h: "/products",
                        },
                        {
                            n: "Bahan Baku (RM)",
                            s: "Kontrol stok Fragrance Oil (FO), packaging, dan aksesoris produksi.",
                            h: "/rawmat",
                        },
                        {
                            n: "Resep & Formula",
                            s: "Formulasi resep produk dari bahan baku dengan otomatisasi multiplier ukuran.",
                            h: "/recipes",
                        },
                        {
                            n: "Forecasting",
                            s: "Prediksi kebutuhan stok masa depan berdasarkan sales actual dan target pertumbuhan.",
                            h: "/forecasts",
                        },
                        {
                            n: "Manajemen Outlet",
                            s: "Kontrol distribusi stok dan inventaris real-time di setiap titik penjualan.",
                            h: "/outlets",
                        },
                        {
                            n: "Purchasing",
                            s: "Pengadaan bahan baku ke supplier dengan rekomendasi order otomatis.",
                            h: "/purchase",
                        },
                    ].map((mod, i) => (
                        <Link key={i} href={mod.h} className="group">
                            <div className="p-[14px_16px] border border-[#E2E8F0] rounded-[14px] bg-white group-hover:border-[#D4AF37]/40 group-hover:bg-[#D4AF37]/5 transition-all">
                                <div className="text-[13px] font-black text-[#0F172A] group-hover:text-[#D4AF37]">
                                    {mod.n}
                                </div>
                                <div className="text-[11px] text-[#64748B] mt-1 group-hover:text-[#64748B]/80">
                                    {mod.s}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
