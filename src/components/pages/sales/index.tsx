"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown, PlusCircle, Import, Loader2, X, Download } from "lucide-react";
import { useSaleQuery, useSaleTableState } from "@/app/(application)/sales/server/use.sales";
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
import { SalesColumns } from "./table/column";
import Link from "next/link";
import { useSizes } from "@/app/(application)/products/(component)/size/server/use.size";
import { CheckedState } from "@radix-ui/react-checkbox";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { VisibilityState } from "@tanstack/react-table";

export function Sales() {
    const table = useSaleTableState();
    const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(
        "sales-main-table-visibility",
        {},
    );

    const {
        data: salesList,
        total,
        isLoading,
        isFetching,
        isRefetching,
    } = useSaleQuery(table.queryParams);
    const { data: typeList, isLoading: typesLoading, isRefetching: typesRefetching } = useType();
    const { data: sizeList, isLoading: sizesLoading, isRefetching: sizesRefetching } = useSizes();

    /**
     * Ambil period dari response (single source of truth)
     */
    const periods = useMemo(() => {
        if (!salesList || salesList.length === 0) return [];
        return salesList[0].quantity.map((q) => ({
            year: q.year,
            month: q.month,
        }));
    }, [salesList]);

    const columns = useMemo(
        () =>
            SalesColumns({
                periods,
                sortBy: table.sortBy,
                sortOrder: table.sortOrder,
                onSort: (key) => table.onSort(key),
            }),
        [periods, table.sortBy, table.sortOrder, table.onSort],
    );

    const isTableLoading = isLoading || isFetching || isRefetching;

    return (
        <section>
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
                <CardHeader className="space-y-4 p-4 lg:p-5 border-b border-slate-50">
                    {/* ROW 1: TITLE & ACTIONS */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-black tracking-tight text-slate-800">
                                Manajemen Penjualan
                            </h2>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                Monitoring tren penjualan produk aktual
                            </p>
                        </div>
                        <div className="flex gap-1.5">
                            <Link href={"/sales/create"}>
                                <Button
                                    variant="teal"
                                    className="h-8 px-3 cursor-pointer font-bold shadow-sm shadow-teal-50 text-[11px]"
                                >
                                    <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
                                    Input
                                </Button>
                            </Link>
                            <Link href="/sales/import">
                                <Button
                                    variant="outline"
                                    className="h-8 px-3 text-[11px] font-bold"
                                >
                                    <Import className="mr-1.5 h-3.5 w-3.5" />
                                    Import
                                </Button>
                            </Link>
                            <Button
                                variant="success"
                                className="h-8 px-3 cursor-pointer text-[11px] font-bold"
                            >
                                <Download className="mr-1.5 h-3.5 w-3.5" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {/* ROW 2: SEARCH & FILTERS */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3 pt-1">
                        {/* ===== Search ===== */}
                        <InputGroup className="w-full lg:max-w-sm">
                            <InputGroupInput
                                placeholder="Cari..."
                                value={table.search}
                                onChange={(e) => table.setSearch(e.target.value)}
                                className="h-9 text-sm"
                            />
                            <InputGroupAddon>
                                <Search className="h-3.5 w-3.5" />
                            </InputGroupAddon>
                            <InputGroupAddon align="inline-end">
                                {isFetching ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <span className="text-[10px] text-muted-foreground font-bold">
                                        {total}
                                    </span>
                                )}
                            </InputGroupAddon>
                        </InputGroup>

                        {/* ===== Filters ===== */}
                        <div className="flex flex-wrap gap-1.5 items-center">
                            {/* Gender */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant={table.gender ? "default" : "outline"}
                                        className="h-9 px-3 text-xs font-bold justify-between"
                                    >
                                        {table.gender === "WOMEN"
                                            ? "Wanita"
                                            : table.gender === "MEN"
                                              ? "Pria"
                                              : table.gender === "UNISEX"
                                                ? "Unisex"
                                                : "Gender"}
                                        <ChevronDown className="ml-1.5 h-3 w-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => table.setGender("WOMEN")}>
                                        Wanita
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => table.setGender("MEN")}>
                                        Pria
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => table.setGender("UNISEX")}>
                                        Unisex
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => table.setGender(undefined)}
                                        className="text-muted-foreground"
                                    >
                                        Reset
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Tipe Produk */}
                            <SelectFilter
                                placeholder="Tipe"
                                value={table.variant ?? null}
                                options={
                                    typeList?.map((t) => ({
                                        value: t.slug,
                                        label: t.name.toUpperCase(),
                                    })) ?? []
                                }
                                onChange={(val) => table.setVariant(String(val))}
                                onReset={() => table.setVariant(undefined)}
                                isLoading={typesLoading || typesRefetching}
                                canSearching={true}
                                className="w-full md:w-auto min-w-32 h-9"
                            />

                            {/* Ukuran */}
                            <SelectFilter
                                placeholder="Ukuran"
                                value={table.size ?? null}
                                options={
                                    sizeList?.map((s) => ({
                                        value: s.size,
                                        label: String(s.size) + "ML",
                                    })) ?? []
                                }
                                onChange={(val) => table.setSize(Number(val))}
                                onReset={() => table.setSize(undefined)}
                                isLoading={sizesLoading || sizesRefetching}
                                canSearching={true}
                                className="w-full md:w-auto min-w-24 h-9"
                            />

                            {/* Horizon */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant={table.horizon ? "default" : "outline"}
                                        className="h-9 px-3 text-xs font-bold justify-between"
                                    >
                                        <span className="truncate">
                                            {table.horizon ? `${table.horizon} Bulan` : "Horizon"}
                                        </span>
                                        <ChevronDown className="h-3 w-3 ml-1.5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="start"
                                    className="max-h-60 overflow-y-auto"
                                >
                                    {[2, 4, 6, 8, 10, 12, 16, 20, 24].map((h) => (
                                        <DropdownMenuItem
                                            key={h}
                                            onClick={() => table.setHorizon(h)}
                                        >
                                            {h} Bulan
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuItem
                                        onClick={() => table.setHorizon(undefined)}
                                        className="text-muted-foreground"
                                    >
                                        Reset
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Reset All Filters */}
                            {(table.gender ||
                                table.variant ||
                                table.size ||
                                table.horizon ||
                                table.search) && (
                                <Button
                                    variant="ghost"
                                    onClick={table.resetFilters}
                                    className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                                >
                                    Reset <X className="ml-1 h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="relative">
                    {/* Overlay fetching state for smoother UX during pagination/filter */}
                    {isFetching && !isLoading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    {isTableLoading && !salesList?.length ? (
                        <TableSkeleton />
                    ) : (
                        <DataTable
                            tableId="sales-main-table"
                            columns={columns}
                            data={salesList || []}
                            page={table.queryParams.page ?? 1}
                            pageSize={table.queryParams.take ?? 25}
                            total={total}
                            onPageChange={table.setPage}
                            onPageSizeChange={table.setPageSize}
                            state={{ columnVisibility }}
                            onColumnVisibilityChange={setColumnVisibility}
                        />
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
