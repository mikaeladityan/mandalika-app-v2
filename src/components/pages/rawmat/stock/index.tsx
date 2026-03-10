"use client";

import { useMemo } from "react";
import { Search, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import {
    useRawMaterialStocksQuery,
    useRawMaterialStockTableState,
    useRawMaterialStockWarehouses,
} from "@/app/(application)/rawmat/stocks/server/use.rawmat.stock";
import { RawMaterialColumns } from "./table/column";
import { DataTable } from "@/components/ui/table/data";
import { ColumnDef } from "@tanstack/react-table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function RawMaterialsStock() {
    const table = useRawMaterialStockTableState();

    // Fetch Warehouses for filter
    const { warehouses = [] } = useRawMaterialStockWarehouses();

    // Fetch Raw Materials with Stock
    const {
        rawMaterials,
        isFetching,
        isLoading,
        month: effectiveMonth,
        year: effectiveYear,
        total,
    } = useRawMaterialStocksQuery(table.queryParams);

    const warehouseNames = useMemo(() => warehouses.map((w: any) => w.name), [warehouses]);

    const columns = useMemo(
        () =>
            RawMaterialColumns({
                sortBy: table.sortBy,
                sortOrder: table.sortOrder,
                onSort: table.onSort,
                warehouseNames,
            }),
        [table.sortBy, table.sortOrder, table.onSort, warehouseNames],
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

    return (
        <section className="space-y-6">
            <header className="space-y-1 mb-5">
                <h2 className="text-xl font-semibold tracking-tight">Rekap Stok Bahan Baku</h2>
                <p className="text-sm text-muted-foreground">
                    Lihat rekap sebaran stok bahan baku di seluruh gudang RM perusahaan
                </p>
            </header>

            <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="bg-white border-b space-y-4 pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-4 flex-1">
                            <span className="font-bold text-sm uppercase block text-muted-foreground tracking-wider">
                                Filter & Pencarian
                            </span>
                            <div className="flex flex-wrap items-center gap-3">
                                <InputGroup className="w-full md:max-w-xs">
                                    <InputGroupInput
                                        placeholder="Cari nama atau barcode..."
                                        value={table.search}
                                        onChange={(e) => table.setSearch(e.target.value)}
                                    />
                                    <InputGroupAddon>
                                        {isFetching ? (
                                            <Loader2 className="animate-spin" size={14} />
                                        ) : (
                                            <Search size={14} />
                                        )}
                                    </InputGroupAddon>
                                </InputGroup>

                                <Select
                                    value={
                                        table.month
                                            ? String(table.month)
                                            : effectiveMonth
                                              ? String(effectiveMonth)
                                              : String(new Date().getMonth() + 1)
                                    }
                                    onValueChange={(val) => table.setMonth(Number(val))}
                                >
                                    <SelectTrigger className="w-[130px]" size="sm">
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
                                    value={
                                        table.year
                                            ? String(table.year)
                                            : effectiveYear
                                              ? String(effectiveYear)
                                              : String(new Date().getFullYear())
                                    }
                                    onValueChange={(val) => table.setYear(Number(val))}
                                >
                                    <SelectTrigger className="w-[100px]" size="sm">
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
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <Loader2
                                className="animate-spin size-12 text-blue-600"
                                strokeWidth={1.5}
                            />
                            <p className="text-sm text-muted-foreground">
                                Memuat data stok bahan baku...
                            </p>
                        </div>
                    ) : (
                        <DataTable
                            columns={columns as ColumnDef<unknown, unknown>[]}
                            data={rawMaterials}
                            total={total}
                            page={Number(table.queryParams.page)}
                            pageSize={Number(table.queryParams.take)}
                            onPageChange={table.setPage}
                            onPageSizeChange={table.setPageSize}
                        />
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
