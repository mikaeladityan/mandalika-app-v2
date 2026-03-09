"use client";

import { useMemo } from "react";
import { Search, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import {
    useWarehouseQuery,
    useWarehouseStatic,
    useWarehouseTableState,
} from "@/app/(application)/warehouses/server/use.warehouse";
import { useRawMatStockTableState } from "@/app/(application)/rawmat/stocks/server/use.rawmat.stock";
import { WarehouseInventoryColumns } from "../../warehouse/table/column";
import { DataTable } from "@/components/ui/table/data";
import { transformToStockTable } from "@/lib/utils/inventory";
import { ColumnDef } from "@tanstack/react-table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function RawMatStock() {
    // Gunakan state stok rawmat yang baru mendukung month/year
    const table = useRawMatStockTableState();
    const type = "RAW_MATERIAL";

    const { data: warehouses = [] } = useWarehouseStatic({
        page: 1,
        take: 100,
        type,
        sortBy: "updated_at",
        sortOrder: "asc",
    });
    const {
        list: inventoryRaw = [],
        isFetching,
        isLoading,
        month: effectiveMonth,
        year: effectiveYear,
        total: totalCount,
    } = useWarehouseQuery({
        page: table.queryParams.page,
        take: table.queryParams.take,
        search: table.queryParams.search,
        sortBy: "updated_at",
        sortOrder: table.queryParams.sortOrder as any,
        month: table.queryParams.month as number | undefined,
        year: table.queryParams.year as number | undefined,
        type,
    });

    // Transformasi data ke bentuk baris per material dan kolom per gudang
    const stockData = useMemo(
        () => transformToStockTable(inventoryRaw, type),
        [inventoryRaw, type],
    );

    const warehouseNames = useMemo(() => warehouses.map((w: any) => w.name), [warehouses]);

    const columns = useMemo(
        () => WarehouseInventoryColumns(warehouseNames, type),
        [warehouseNames, type],
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
                <h2 className="text-xl font-semibold tracking-tight">Stock Raw Material</h2>
                <p className="text-sm text-muted-foreground">
                    Lihat sebaran stok bahan baku di seluruh gudang perusahaan
                </p>
            </header>

            <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="bg-white border-b space-y-4">
                    <div className="flex flex-col justify-start items-start gap-4">
                        <span className="font-bold text-sm uppercase block">Rekap Stok Global</span>
                        <InputGroup className="max-w-xs">
                            <InputGroupInput
                                placeholder="Cari nama atau kode produk..."
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

                        <div className="flex items-center gap-2">
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
                </CardHeader>
                <CardContent className="pt-6">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <Loader2
                                className="animate-spin size-12 text-primary"
                                strokeWidth={1.5}
                            />
                            <p className="text-sm text-muted-foreground">
                                Memuat data inventory...
                            </p>
                        </div>
                    ) : (
                        <DataTable
                            columns={columns as ColumnDef<unknown, unknown>[]}
                            data={stockData}
                            total={totalCount}
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
