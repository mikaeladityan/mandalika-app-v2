"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Search, Loader2, Warehouse, Calendar, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWarehouse } from "@/app/(application)/warehouses/server/use.warehouse";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/table/data";
import { Badge } from "@/components/ui/badge";
import { LogData } from "@/components/log";

export function DetailWarehouse() {
    const { id } = useParams();
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const {
        detail_w_stock,
        isLoading,
        month: effectiveMonth,
        year: effectiveYear,
    } = useWarehouse(
        {
            month,
            year,
            type: "FINISH_GOODS",
            page,
            take: pageSize,
            sortBy: "updated_at",
            sortOrder: "desc",
        },
        Number(id),
        true,
    );

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
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

    const productColumns = [
        { header: "Kode Produk", accessorKey: "code" },
        { header: "Nama Produk", accessorKey: "name" },
        {
            header: "Jumlah Stok",
            accessorKey: "quantity",
            cell: ({ row }: any) => {
                const qty = row.original.quantity;
                const isLow = qty <= (row.original.min_stock || 0);
                return <Badge variant={isLow ? "destructive" : "outline"}>{qty}</Badge>;
            },
        },
        {
            header: "Update Terakhir",
            accessorKey: "updated_at",
            cell: ({ row }: any) => new Date(row.original.updated_at).toLocaleDateString("id-ID"),
        },
    ];

    const rawMatColumns = [
        { header: "Barcode/Kode", accessorKey: "code" },
        { header: "Nama Material", accessorKey: "name" },
        {
            header: "Jumlah Stok",
            accessorKey: "quantity",
            cell: ({ row }: any) => {
                const qty = row.original.quantity;
                const isLow = qty <= (row.original.min_stock || 0);
                return <Badge variant={isLow ? "destructive" : "outline"}>{qty}</Badge>;
            },
        },
        {
            header: "Update Terakhir",
            accessorKey: "updated_at",
            cell: ({ row }: any) => new Date(row.original.updated_at).toLocaleDateString("id-ID"),
        },
    ];

    const warehouseName = (detail_w_stock as any)?.warehouse?.name || "Gudang";

    return (
        <section className="space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.history.back()}
                            className="rounded-full h-8 w-8"
                        >
                            <ArrowLeft size={18} />
                        </Button>
                        <h2 className="text-xl font-semibold tracking-tight">
                            Stok Gudang: {warehouseName}
                        </h2>
                    </div>
                    <p className="text-sm text-muted-foreground ml-10">
                        Manajemen dan penelusuran stok inventory secara historis
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 px-2 border-r mr-2">
                        <Calendar size={14} className="text-muted-foreground" />
                        <span className="text-xs font-medium uppercase text-muted-foreground">
                            Periode
                        </span>
                    </div>
                    <Select
                        value={String(month || effectiveMonth)}
                        onValueChange={(val) => setMonth(Number(val))}
                    >
                        <SelectTrigger className="w-[130px] border-none shadow-none focus:ring-0 h-8 text-sm">
                            <SelectValue placeholder="Bulan" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((m, i) => (
                                <SelectItem key={m} value={String(i + 1)}>
                                    {m}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={String(year || effectiveYear)}
                        onValueChange={(val) => setYear(Number(val))}
                    >
                        <SelectTrigger className="w-[100px] border-none shadow-none focus:ring-0 h-8 text-sm">
                            <SelectValue placeholder="Tahun" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((y) => (
                                <SelectItem key={y} value={String(y)}>
                                    {y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </header>

            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="animate-spin size-12 text-primary" strokeWidth={1.5} />
                    <p className="text-sm text-muted-foreground">Memuat data inventory...</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="bg-white border-b flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold uppercase flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-teal-500" />
                                Stok Produk (Finish Goods)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <DataTable
                                columns={productColumns as any}
                                data={detail_w_stock?.product_inventories || []}
                                total={detail_w_stock?.product_inventories?.length || 0}
                                page={page}
                                pageSize={pageSize}
                                onPageChange={setPage}
                                onPageSizeChange={setPageSize}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="bg-white border-b flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold uppercase flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-orange-500" />
                                Stok Bahan Baku (Raw Materials)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <DataTable
                                columns={rawMatColumns as any}
                                data={detail_w_stock?.raw_material_inventories || []}
                                total={detail_w_stock?.raw_material_inventories?.length || 0}
                                page={page}
                                pageSize={pageSize}
                                onPageChange={setPage}
                                onPageSizeChange={setPageSize}
                            />
                        </CardContent>
                    </Card>
                </div>
            )}
        </section>
    );
}
