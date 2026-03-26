"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown, PlusCircle, Import, Loader2, X, Download, TrendingUp } from "lucide-react";
import { useSaleQuery, useSaleTableState } from "@/app/(application)/sales/server/use.sales";
import { useType } from "@/app/(application)/products/(component)/type/server/use.type";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
                type: table.type,
            }),
        [periods, table.sortBy, table.sortOrder, table.onSort, table.type],
    );

    const isTableLoading = isLoading || isFetching || isRefetching;

    const typeLabel = useMemo(() => {
        if (!table.type || table.type === "ALL") return "Semua Channel";
        return table.type.replace("_", " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
    }, [table.type]);

    return (
        <section className="flex flex-col gap-4">
            <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white">
                <CardHeader className="space-y-4 p-6 border-b border-border/50 bg-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                <TrendingUp className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground tracking-tight">
                                    Manajemen Penjualan {typeLabel !== "Semua Channel" ? `— ${typeLabel}` : ""}
                                </h1>
                                <p className="text-xs text-muted-foreground font-medium">
                                    Monitoring tren penjualan {typeLabel.toLowerCase()} produk secara aktual.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Link href={`/sales/create${table.type ? `?type=${table.type}` : ""}`}>
                                <Button
                                    variant="default"
                                    className="h-9 px-4 font-semibold"
                                >
                                    <PlusCircle className="mr-1.5 size-4" />
                                    Input
                                </Button>
                            </Link>
                            <Link href={`/sales/import${table.type ? `?type=${table.type}` : ""}`}>
                                <Button
                                    variant="outline"
                                    className="h-9 px-4 font-semibold"
                                >
                                    <Import className="mr-1.5 size-4" />
                                    Import
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="h-9 px-4 font-semibold border-emerald-600/20 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                            >
                                <Download className="mr-1.5 size-4" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {/* ROW 2: SEARCH & FILTERS */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3 pt-1">
                        <div className="relative group w-full lg:max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <InputGroup className="w-full">
                                <InputGroupInput
                                    placeholder="Cari transaksi..."
                                    value={table.search}
                                    onChange={(e) => table.setSearch(e.target.value)}
                                    className="h-10 pl-10 bg-muted/30 border-transparent focus-visible:bg-white focus-visible:border-primary/20 transition-all"
                                />
                                <InputGroupAddon align="inline-end">
                                    {isFetching ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <Badge variant="secondary" className="text-[10px] font-bold h-5 px-1.5">
                                            {total}
                                        </Badge>
                                    )}
                                </InputGroupAddon>
                            </InputGroup>
                        </div>

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
                                table.search ||
                                table.type) && (
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
