"use client";

import { useParams } from "next/navigation";
import { useDetailBOM } from "@/app/(application)/bom/server/use.bom";
import {
    ChevronLeft,
    Box,
    Database,
    Info,
    CheckCircle2,
    AlertCircle,
    Calendar,
    ArrowRightLeft,
    Tag,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LogData } from "@/components/log";

export default function DetailBOMRequirement() {
    const { material_code } = useParams();
    // Mengasumsikan params kedua adalah objek query untuk month/year jika diperlukan
    const { data, isLoading } = useDetailBOM(String(material_code), undefined);

    if (isLoading) return <DetailSkeleton />;
    if (!data) return <div className="p-10 text-center">Data tidak ditemukan.</div>;

    const res = data;
    const stockPercentage = Math.min(
        (res.inventory.current_stock / res.summary.total_requirement) * 100,
        100,
    );

    return (
        <div className="space-y-6 p-2 md:p-6 w-full">
            {/* Header & Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/bom">
                        <Button variant="outline" size="icon" className="rounded-full">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                {res.material.name}
                            </h1>
                            <Badge variant="secondary" className="font-mono">
                                {res.material.barcode}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                            <Tag className="h-3.5 w-3.5" />
                            {res.material.category} • {res.material.supplier}{" "}
                            {res.material.supplier_country?.toUpperCase() === "LOCAL" ? (
                                <Badge
                                    variant="outline"
                                    className="ml-2 text-[10px] text-teal-600 border-teal-200 bg-teal-50 shadow-none"
                                >
                                    Lokal
                                </Badge>
                            ) : res.material.supplier_country?.toUpperCase() === "IMPORT" ? (
                                <Badge
                                    variant="outline"
                                    className="ml-2 text-[10px] text-indigo-600 border-indigo-200 bg-indigo-50 shadow-none"
                                >
                                    Impor
                                </Badge>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg border">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium">
                        Periode: {res.periods?.[0]?.month}/{res.periods?.[0]?.year} -{" "}
                        {res.periods?.[res.periods.length - 1]?.month}/
                        {res.periods?.[res.periods.length - 1]?.year}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Kolom Kiri: Inventory Status */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-none shadow-md bg-linear-to-br from-white to-slate-50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Database className="h-4 w-4 text-teal-600" /> Inventory Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">
                                        Stok Tersedia
                                    </span>
                                    <span
                                        className={cn(
                                            "text-sm font-bold",
                                            res.inventory.current_stock < 0
                                                ? "text-rose-600"
                                                : "text-teal-700",
                                        )}
                                    >
                                        {Math.round(res.inventory.current_stock).toLocaleString()}{" "}
                                        {res.material.unit === "null" && "PCS"}
                                    </span>
                                </div>
                                <Progress value={stockPercentage} className="h-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-white rounded-md border border-slate-100">
                                    <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                                        Total Kebutuhan
                                    </p>
                                    <p className="text-lg font-bold text-slate-700">
                                        {Math.round(res.summary.total_requirement).toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-3 bg-white rounded-md border border-slate-100">
                                    <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                                        Stock Gap
                                    </p>
                                    <p
                                        className={`text-lg font-bold ${res.inventory.stock_gap >= 0 ? "text-teal-600" : "text-destructive"}`}
                                    >
                                        {Math.round(res.inventory.stock_gap).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div
                                className={`flex items-center gap-3 p-4 rounded-xl border ${res.summary.is_stock_sufficient ? "bg-teal-50 border-teal-100" : "bg-red-50 border-red-100"}`}
                            >
                                {res.summary.is_stock_sufficient ? (
                                    <CheckCircle2 className="h-8 w-8 text-teal-600" />
                                ) : (
                                    <AlertCircle className="h-8 w-8 text-red-600" />
                                )}
                                <div>
                                    <p
                                        className={`font-bold text-sm ${res.summary.is_stock_sufficient ? "text-teal-900" : "text-red-900"}`}
                                    >
                                        {res.summary.is_stock_sufficient
                                            ? "Stok Mencukupi"
                                            : "Stok Tidak Cukup"}
                                    </p>
                                    <p className="text-xs text-slate-500 leading-tight">
                                        {res.summary.is_stock_sufficient
                                            ? "Persediaan cukup untuk mendukung seluruh rencana produksi bulan ini."
                                            : "Segera lakukan pengadaan untuk menghindari hambatan produksi."}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Info className="h-4 w-4 text-blue-600" /> Informasi Material
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Harga Beli</span>
                                <span className="font-medium">Rp {res.material.price}</span>
                            </div>
                            {/* <Separator /> */}
                            {/* <div className="flex justify-between">
                                <span className="text-muted-foreground">Minimum Stock</span>
                                <span className="font-medium">
                                    {res.inventory.min_stock.toLocaleString()} {res.material.unit}
                                </span>
                            </div> */}
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Total Produk Terdampak
                                </span>
                                <span className="font-medium">
                                    {res.summary.affected_products_count} Produk
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Kolom Kanan: Rincian Produk (Allocation Table) */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-md overflow-hidden border-none">
                        <CardHeader className=" border-b">
                            <div className="flex items-center gap-2 text-slate-700">
                                <ArrowRightLeft className="h-5 w-5" />
                                <div>
                                    <CardTitle className="text-base">
                                        Alokasi Material ke Produk
                                    </CardTitle>
                                    <CardDescription>
                                        Rincian jumlah penggunaan {res.material.barcode} per produk.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow>
                                        <TableHead className="w-25 pl-6">Kode</TableHead>
                                        <TableHead>Nama Produk</TableHead>
                                        {res.periods?.map((p: any) => (
                                            <TableHead
                                                key={p.key}
                                                className="text-right text-slate-600"
                                            >
                                                {p.month}/{p.year}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {res.details.map((item: any) => (
                                        <TableRow
                                            key={item.product_id}
                                            className="hover:bg-slate-50/50 transition-colors uppercase"
                                        >
                                            <TableCell className="font-mono text-xs text-slate-500 pl-6 tracking-tighter">
                                                {item.product_code}
                                            </TableCell>
                                            <TableCell className="font-medium text-slate-800">
                                                {item.product_name} {item.product_type}
                                            </TableCell>
                                            {res.periods?.map((p: any) => {
                                                const req = item.monthly_data?.[p.key] || 0;
                                                return (
                                                    <TableCell key={p.key} className="text-right">
                                                        {req === 0 ? (
                                                            <span className="text-slate-300">
                                                                -
                                                            </span>
                                                        ) : (
                                                            <span className="font-medium text-slate-700">
                                                                {Math.round(req).toLocaleString()}
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>

                                {res.details.length > 0 && (
                                    <TableFooter className="bg-slate-100/50 text-slate-900 font-bold uppercase">
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-right pr-6">
                                                Total Kebutuhan
                                            </TableCell>
                                            {res.periods?.map((p: any) => {
                                                // Kalkulasi total per bulan dari seluruh baris produk
                                                const totalPerMonth = res.details.reduce(
                                                    (sum: number, item: any) =>
                                                        sum + (item.monthly_data?.[p.key] || 0),
                                                    0,
                                                );

                                                return (
                                                    <TableCell
                                                        key={`total-${p.key}`}
                                                        className="text-right"
                                                    >
                                                        {totalPerMonth === 0 ? (
                                                            <span className="text-slate-300">
                                                                -
                                                            </span>
                                                        ) : (
                                                            Math.round(
                                                                totalPerMonth,
                                                            ).toLocaleString()
                                                        )}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    </TableFooter>
                                )}
                            </Table>
                            {res.details.length === 0 && (
                                <div className="p-10 text-center text-muted-foreground italic">
                                    Tidak ada alokasi produk untuk periode ini.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end italic text-[10px] text-slate-400 gap-2">
                        Data ini dihasilkan melalui kalkulasi BOM Explode pada:{" "}
                        {new Date(res.details[0]?.exploded_at).toLocaleString()}
                    </div>
                </div>
            </div>
            <LogData data={res.details} />
        </div>
    );
}

function DetailSkeleton() {
    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="h-100 w-full" />
                <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-75 w-full" />
                </div>
            </div>
        </div>
    );
}
