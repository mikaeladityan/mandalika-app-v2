"use client";

import Link from "next/link";
import {
    Boxes,
    ShoppingBag,
    BarChart2,
    Warehouse,
    TrendingUp,
    ArrowRight,
    FlaskConical,
    Package,
    BanknoteArrowUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/app/(application)/products/server/use.products";
import { useSales } from "@/app/(application)/sales/server/use.sales";
import { useForecast } from "@/app/(application)/forecasts/server/use.forecast";
import { useWarehouses } from "@/app/(application)/shared/use.shared";
import { useAuth } from "@/app/auth/server/use.auth";

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
                            <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">{title}</p>
                            {isLoading ? (
                                <Skeleton className="h-8 w-20 mt-2" />
                            ) : (
                                <p className="text-3xl font-black mt-1 tracking-tight">{value ?? "-"}</p>
                            )}
                            {description && (
                                <p className="text-[10px] font-medium text-muted-foreground mt-2 bg-muted/50 w-fit px-2 py-0.5 rounded-full">{description}</p>
                            )}
                        </div>
                        <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300 ${colorMap[color]}`}>
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
                    <p className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">{title}</p>
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
 
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
 
    const { sales: salesData, isLoading: loadingSales } = useSales({
        page: 1,
        take: 5,
        month: prevMonth,
        year: prevYear,
        sortBy: "quantity",
        sortOrder: "desc",
    });

    const months = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agt", "Sep", "Okt", "Nov", "Des",
    ];

    const greeting = () => {
        const h = now.getHours();
        if (h < 11) return "Selamat pagi";
        if (h < 15) return "Selamat siang";
        if (h < 18) return "Selamat sore";
        return "Selamat malam";
    };

    const displayName = account?.user
        ? account.user.first_name
        : account?.email?.split("@")[0] ?? "User";

    return (
        <section className="space-y-6 pb-8">
            {/* Greeting */}
            <div>
                <h1 className="text-xl font-semibold text-gray-900">
                    {greeting()}, {displayName} 👋
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    {now.toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Produk (FG)"
                    value={products?.len}
                    description="Produk aktif terdaftar"
                    icon={Boxes}
                    href="/products"
                    isLoading={loadingProducts}
                    color="blue"
                />
                <StatCard
                    title="Pengeluaran Bulan Ini"
                    value={salesData?.len ?? 0}
                    description={`${months[prevMonth - 1]} ${prevYear}`}
                    icon={ShoppingBag}
                    href={`/sales?month=${prevMonth}&year=${prevYear}`}
                    isLoading={loadingSales}
                    color="green"
                />
                <StatCard
                    title="Data Forecast"
                    value={forecastList.data?.len ?? 0}
                    description="Total record forecast"
                    icon={BarChart2}
                    href="/forecasts"
                    isLoading={forecastList.isLoading}
                    color="purple"
                />
                <StatCard
                    title="Total Gudang"
                    value={warehouses?.length ?? 0}
                    description="Gudang aktif"
                    icon={Warehouse}
                    href="/warehouses"
                    isLoading={loadingWarehouses}
                    color="orange"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Recent Sales */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Pengeluaran Terbaru</CardTitle>
                                <CardDescription>
                                    {months[prevMonth - 1]} {prevYear}
                                </CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/sales" className="text-xs">
                                    Lihat semua <ArrowRight className="ml-1 size-3" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loadingSales ? (
                            <div className="space-y-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-10 w-full" />
                                ))}
                            </div>
                        ) : !salesData?.sales?.length ? (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                Belum ada data pengeluaran bulan ini
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {salesData.sales.map((sale: any) => (
                                    <div
                                        key={sale.product_id}
                                        className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                <Package className="size-4 text-blue-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {sale.product?.name ?? `#${sale.product_id}`}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {sale.product?.code}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0 ml-2">
                                            <p className="text-sm font-semibold">{sale.totalQuantity ?? 0}</p>
                                            <p className="text-xs text-muted-foreground">pcs</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Akses Cepat</CardTitle>
                        <CardDescription>Navigasi ke fitur utama</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <QuickAction
                            title="Tambah Pengeluaran"
                            description="Catat pengeluaran produk baru"
                            href="/sales/create"
                            icon={ShoppingBag}
                        />
                        <QuickAction
                            title="Jalankan Forecast"
                            description="Generate prediksi penjualan"
                            href="/forecasts"
                            icon={BarChart2}
                        />
                        <QuickAction
                            title="Rekap Stock"
                            description="Lihat rekap stok produk"
                            href="/products/stocks"
                            icon={Boxes}
                        />
                        <QuickAction
                            title="Resep Produk"
                            description="Kelola resep dan BOM"
                            href="/recipes"
                            icon={FlaskConical}
                        />
                        <QuickAction
                            title="Rekomendasi PPIC"
                            description="Lihat rekomendasi pembelian"
                            href="/recomendation-v2/ffo"
                            icon={TrendingUp}
                        />
                        <QuickAction
                            title="Purchase Order"
                            description="Kelola pesanan pembelian"
                            href="/purchase"
                            icon={BanknoteArrowUp}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Warehouse Summary */}
            {!loadingWarehouses && warehouses && warehouses.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Daftar Gudang</CardTitle>
                                <CardDescription>Semua gudang aktif dalam sistem</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/warehouses" className="text-xs">
                                    Kelola <ArrowRight className="ml-1 size-3" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
                            {warehouses.map((wh) => (
                                <Link
                                    key={wh.id}
                                    href={
                                        wh.type === "FINISH_GOODS"
                                            ? `/products/stocks/${wh.id}`
                                            : `/rawmat/stocks/${wh.id}`
                                    }
                                >
                                    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
                                        <div className="p-2 rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                            <Warehouse className="size-5" />
                                        </div>
                                        <p className="text-xs font-bold text-center text-gray-700 leading-tight truncate w-full">
                                            {wh.name}
                                        </p>
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px] px-2 h-4 font-bold"
                                        >
                                            {wh.type === "FINISH_GOODS" ? "FG" : "RM"}
                                        </Badge>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </section>
    );
}
