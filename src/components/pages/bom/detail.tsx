"use client";

import { useParams, useRouter } from "next/navigation";
import { useDetailBOM } from "@/app/(application)/bom/server/use.bom";
import {
    ChevronLeft,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FORECAST_HORIZON_KEY } from "@/app/(application)/forecasts/server/use.forecast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const FormulaHint = ({
    title,
    formula,
    description,
}: {
    title: string;
    formula: string;
    description?: string;
}) => (
    <TooltipProvider>
        <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
                <div className="cursor-help inline-flex items-center ml-1">
                    <Info className="size-3 text-slate-300 hover:text-indigo-500 transition-colors" />
                </div>
            </TooltipTrigger>
            <TooltipContent
                side="top"
                className="w-80 p-3 bg-white text-slate-900 border-slate-200 shadow-xl z-50"
            >
                <div className="space-y-2 text-left">
                    <p className="font-bold text-[10px] uppercase tracking-wider text-indigo-600 border-b border-indigo-50 pb-1">
                        {title}
                    </p>
                    <div className="bg-slate-50 p-2 rounded border border-slate-100 font-mono text-[10px] leading-relaxed wrap-break-word text-slate-700">
                        {formula}
                    </div>
                    {description && (
                        <p className="text-[10px] text-slate-500 leading-normal italic">
                            {description}
                        </p>
                    )}
                </div>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

export default function DetailBOMRequirement() {
    const router = useRouter();
    const { material_code } = useParams();
    const [forecastMonths] = useLocalStorage<number>(FORECAST_HORIZON_KEY, 3);

    const { data, isLoading } = useDetailBOM(String(material_code), {
        forecast_months: forecastMonths,
    });

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
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        size="icon"
                        className="rounded-full"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

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
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="h-9 px-3 rounded-lg border-slate-200 bg-white text-slate-500 font-bold text-[10px] uppercase shadow-none whitespace-nowrap">
                        Horizon: {forecastMonths} Bulan
                    </Badge>
                    <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg border h-9">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="text-xs font-semibold text-slate-700">
                            {res.periods?.[0]?.month}/{res.periods?.[0]?.year}
                            {res.periods && res.periods.length > 1 && (
                                <>
                                    {" "}
                                    - {res.periods?.[res.periods.length - 1]?.month}/
                                    {res.periods?.[res.periods.length - 1]?.year}
                                </>
                            )}
                        </span>
                    </div>
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
                                        {Number(res.inventory.current_stock).toLocaleString("id-ID", { maximumFractionDigits: 10 })}{" "}
                                        {res.material.unit === "null" && "PCS"}
                                    </span>
                                </div>
                                <Progress value={stockPercentage} className="h-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-white rounded-md border border-slate-100">
                                    <span className="text-sm text-muted-foreground">
                                        Total Kebutuhan
                                        <FormulaHint
                                            title="Total Kebutuhan"
                                            formula="Σ (Forecast Produk x Kuantitas Resep)"
                                            description="Akumulasi seluruh kebutuhan material ini untuk mendukung rencana produksi semua produk terkait."
                                        />
                                    </span>
                                    <p className="text-lg font-bold text-slate-700">
                                        {Number(res.summary.total_requirement).toLocaleString("id-ID", { maximumFractionDigits: 10 })}
                                    </p>
                                </div>
                                <div className="p-3 bg-white rounded-md border border-slate-100">
                                    <span className="text-sm text-muted-foreground">
                                        Stock Gap
                                        <FormulaHint
                                            title="Stock Gap"
                                            formula="Stok Tersedia - Total Kebutuhan"
                                            description="Selisih antara stok saat ini dengan total kebutuhan produksi. Jika minus, maka stok tidak mencukupi."
                                        />
                                    </span>
                                    <p
                                        className={`text-lg font-bold ${res.inventory.stock_gap >= 0 ? "text-teal-600" : "text-destructive"}`}
                                    >
                                        {Number(res.inventory.stock_gap).toLocaleString("id-ID", { maximumFractionDigits: 10 })}
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
                                                <div className="flex items-center justify-end">
                                                    {p.month}/{p.year}
                                                    <FormulaHint
                                                        title="Kebutuhan Bulanan"
                                                        formula="Forecast (M) x Qty per Unit"
                                                        description="Jumlah material yang dibutuhkan untuk memproduksi produk ini pada bulan spesifik."
                                                    />
                                                </div>
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
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    {item.product_name}
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px] bg-purple-50 text-purple-600 border-purple-100 h-4 px-1 py-0 normal-case"
                                                    >
                                                        v.{item.recipe_version || 1}
                                                    </Badge>
                                                </div>
                                                <span className="text-[10px] text-slate-400 block italic leading-none">
                                                    {item.product_type}
                                                </span>
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
                                                                {Number(req).toLocaleString("id-ID", { maximumFractionDigits: 10 })}
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
                                                            Number(totalPerMonth).toLocaleString("id-ID", { maximumFractionDigits: 10 })
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
