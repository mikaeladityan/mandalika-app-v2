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

export function Sales() {
    const table = useSaleTableState();
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

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
        <section className="space-y-6">
            <header className="space-y-1 mb-5">
                <h2 className="text-xl font-semibold tracking-tight">Manajemen Penjualan</h2>
                <p className="text-sm text-muted-foreground">
                    Monitoring tren penjualan produk aktual
                </p>
            </header>

            <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="space-y-4">
                    {/* ===== Search ===== */}
                    <InputGroup className="w-full md:max-w-sm">
                        <InputGroupInput
                            placeholder="Cari kode atau nama produk..."
                            value={table.search}
                            onChange={(e) => table.setSearch(e.target.value)}
                        />
                        <InputGroupAddon>
                            <Search className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                            {isFetching ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    {total} result
                                </span>
                            )}
                        </InputGroupAddon>
                    </InputGroup>

                    {/* ===== Filters ===== */}
                    <div className="flex flex-wrap gap-2">
                        {/* Gender */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant={table.gender ? "default" : "outline"}
                                    className="w-full md:w-auto justify-between"
                                >
                                    {table.gender === "WOMEN"
                                        ? "Wanita"
                                        : table.gender === "MEN"
                                          ? "Pria"
                                          : table.gender === "UNISEX"
                                            ? "Unisex"
                                            : "Gender"}
                                    <ChevronDown className="ml-1 h-4 w-4" />
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
                            placeholder="Tipe Produk"
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
                            className="w-full md:w-auto min-w-50"
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
                            className="w-full md:w-auto min-w-28"
                        />

                        {/* Horizon */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant={table.horizon ? "default" : "outline"}
                                    className="w-full md:w-auto justify-between"
                                >
                                    <span className="truncate">
                                        {table.horizon ? `${table.horizon} Bulan` : "Horizon"}
                                    </span>
                                    <ChevronDown className="h-4 w-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="max-h-60 overflow-y-auto">
                                {[2, 4, 6, 8, 10, 12, 16, 20, 24].map((h) => (
                                    <DropdownMenuItem key={h} onClick={() => table.setHorizon(h)}>
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
                                className="h-9 px-2 text-muted-foreground hover:text-foreground"
                            >
                                Reset <X className="ml-1 h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>

                    {/* ===== Action Buttons ===== */}
                    <div className="flex flex-col md:flex-row justify-between gap-2">
                        <div className="flex gap-2">
                            <Link href={"/sales/create"}>
                                <Button
                                    variant="teal"
                                    className="w-full cursor-pointer font-bold shadow-sm shadow-teal-50"
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Input Penjualan
                                </Button>
                            </Link>
                        </div>

                        <div className="flex gap-2">
                            <Link href="/sales/import">
                                <Button variant="outline" className="w-full">
                                    <Import className="mr-2 h-4 w-4" />
                                    Import
                                </Button>
                            </Link>

                            <Button variant="success" className="cursor-pointer">
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-6 relative">
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
