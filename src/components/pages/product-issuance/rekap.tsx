"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown, Loader2, X, Download, Filter, ShoppingBag } from "lucide-react";
import {
    useIssuanceRekapQuery,
    useIssuanceRekapTableState,
} from "@/app/(application)/product-issuance/server/use.issuance";
import { IssuanceRekapListItemDTO } from "@/app/(application)/product-issuance/server/issuance.schema";
import { useType } from "@/app/(application)/products/(component)/type/server/use.type";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SelectFilter } from "@/components/ui/form/select";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "../../ui/table/data";
import { RekapColumns } from "./table/rekap-column";
import { useSizes } from "@/app/(application)/products/(component)/size/server/use.size";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { VisibilityState } from "@tanstack/react-table";

const MONTH_OPTIONS = [
    { label: "Januari", value: 1 },
    { label: "Februari", value: 2 },
    { label: "Maret", value: 3 },
    { label: "April", value: 4 },
    { label: "Mei", value: 5 },
    { label: "Juni", value: 6 },
    { label: "Juli", value: 7 },
    { label: "Agustus", value: 8 },
    { label: "September", value: 9 },
    { label: "Oktober", value: 10 },
    { label: "November", value: 11 },
    { label: "Desember", value: 12 },
];

const YEAR_OPTIONS = (() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }).map((_, i) => ({
        label: String(currentYear - 2 + i),
        value: currentYear - 2 + i,
    }));
})();

export function RekapIssuance() {
    const table = useIssuanceRekapTableState();
    const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(
        "issuance-rekap-table-visibility",
        {},
    );

    const {
        data: rekapData,
        total,
        isLoading,
        isFetching,
        isRefetching,
    } = useIssuanceRekapQuery(table.queryParams);

    const { data: typeList, isLoading: typesLoading } = useType();
    const { data: sizeList, isLoading: sizesLoading } = useSizes();

    const columns = useMemo(
        () =>
            RekapColumns({
                sortBy: table.sortBy,
                sortOrder: table.sortOrder,
                onSort: (key) => table.onSort(key),
            }),
        [table.sortBy, table.sortOrder, table.onSort],
    );

    const isTableLoading = isLoading || isFetching || isRefetching;

    return (
        <section>
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
                <CardHeader className="space-y-4 p-4 lg:p-5 border-b border-slate-50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                <ShoppingBag className="size-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black tracking-tight text-slate-800">
                                    Rekap Pengeluaran
                                </h2>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                    Laporan akumulasi pengeluaran produk per kategori
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-3">
                        <div className="flex-1 flex flex-wrap items-center gap-2">
                            <InputGroup className="w-full md:w-[280px]">
                                <InputGroupAddon>
                                    <Search className="h-3.5 w-3.5 text-slate-400" />
                                </InputGroupAddon>
                                <InputGroupInput
                                    placeholder="Cari kode atau nama produk..."
                                    value={table.search}
                                    onChange={(e) => table.setSearch(e.target.value)}
                                    className="h-9 text-[11px] bg-slate-50/50 border-slate-100"
                                />
                                {table.search && (
                                    <button
                                        onClick={() => table.setSearch("")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
                                    >
                                        <X className="h-3 w-3 text-slate-400" />
                                    </button>
                                )}
                            </InputGroup>

                            <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" />

                            <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
                                <SelectFilter
                                    placeholder="Bulan"
                                    options={MONTH_OPTIONS}
                                    value={table.month}
                                    onChange={(v) => table.setMonth(Number(v))}
                                    className="w-full sm:w-[120px] h-9 text-[11px]"
                                />
                                <SelectFilter
                                    placeholder="Tahun"
                                    options={YEAR_OPTIONS}
                                    value={table.year}
                                    onChange={(v) => table.setYear(Number(v))}
                                    className="w-full sm:w-[100px] h-9 text-[11px]"
                                />
                            </div>

                            <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" />

                            <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
                                <SelectFilter
                                    placeholder="Gender"
                                    options={[
                                        { label: "Women", value: "WOMEN" },
                                        { label: "Men", value: "MEN" },
                                        { label: "Unisex", value: "UNISEX" },
                                    ]}
                                    value={table.gender}
                                    onChange={table.setGender}
                                    className="w-full h-9 text-[11px]"
                                />
                                <SelectFilter
                                    placeholder="Type"
                                    options={
                                        typeList?.map((t) => ({ label: t.name, value: t.slug })) ??
                                        []
                                    }
                                    value={table.variant}
                                    onChange={table.setVariant}
                                    isLoading={typesLoading}
                                    className="w-full h-9 text-[11px]"
                                />
                                <SelectFilter
                                    placeholder="Size"
                                    options={
                                        sizeList?.map((s) => ({
                                            label: String(s.size),
                                            value: s.size,
                                        })) ?? []
                                    }
                                    value={table.size}
                                    onChange={(v) => table.setSize(Number(v))}
                                    isLoading={sizesLoading}
                                    className="w-full h-9 text-[11px]"
                                />
                            </div>

                            {(table.gender || table.variant || table.size || table.search) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={table.resetFilters}
                                    className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 text-[10px] font-bold"
                                >
                                    Reset
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t xl:border-t-0 pt-3 xl:pt-0">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3 text-[11px] font-bold border-slate-200 text-slate-600"
                                    >
                                        Columns{" "}
                                        <ChevronDown className="ml-2 h-3.5 w-3.5 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[180px]">
                                    {columns
                                        .filter(
                                            (column) =>
                                                "accessorKey" in column &&
                                                typeof column.accessorKey === "string",
                                        )
                                        .map((column: any) => (
                                            <DropdownMenuCheckboxItem
                                                key={column.id || column.accessorKey}
                                                className="text-[11px] capitalize"
                                                checked={
                                                    columnVisibility[
                                                        column.id || column.accessorKey
                                                    ] !== false
                                                }
                                                onCheckedChange={(value) =>
                                                    setColumnVisibility((prev) => ({
                                                        ...prev,
                                                        [column.id || column.accessorKey]: !!value,
                                                    }))
                                                }
                                            >
                                                {(column.id || column.accessorKey)
                                                    .replace("product.", "")
                                                    .replace("_", " ")}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 text-[11px] font-bold border-slate-200 text-slate-600 bg-white"
                                onClick={() => {
                                    /* TODO: Export to Excel */
                                }}
                            >
                                <Download className="mr-1.5 h-3.5 w-3.5" /> Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {isTableLoading && (
                        <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-primary opacity-50" />
                        </div>
                    )}

                    <DataTable<IssuanceRekapListItemDTO, any>
                        tableId="issuance-rekap-table"
                        columns={columns}
                        data={rekapData || []}
                        page={table.queryParams.page ?? 1}
                        pageSize={table.queryParams.take ?? 50}
                        total={total}
                        onPageChange={table.setPage}
                        onPageSizeChange={table.setPageSize}
                        state={{ columnVisibility }}
                        onColumnVisibilityChange={setColumnVisibility}
                    />

                    {total === 0 && !isLoading && (
                        <div className="py-24 flex flex-col items-center justify-center text-center px-4">
                            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <Search className="h-8 w-8 text-slate-200" />
                            </div>
                            <h3 className="text-slate-800 font-bold mb-1">Data Tidak Ditemukan</h3>
                            <p className="text-slate-400 text-xs max-w-[280px]">
                                Tidak ada data pengeluaran untuk periode dan filter yang dipilih.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
