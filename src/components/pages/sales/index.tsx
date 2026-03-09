"use client";

import { useMemo, useState } from "react";

import { Search, ChevronDown, PlusCircle, Import } from "lucide-react";

import { useSaleQuery, useSaleTableState } from "@/app/(application)/sales/server/use.sales";
import { useType } from "@/app/(application)/products/(component)/type/server/use.type";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "../../ui/table/data";
import { SalesColumns } from "./table/column";
import Link from "next/link";

export function Sales() {
    const table = useSaleTableState();

    const { sales, isLoading, isFetching } = useSaleQuery(table.queryParams);
    const { data: typeList, isLoading: typesLoading, isRefetching: typesRefetching } = useType();

    /**
     * Ambil period dari response (single source of truth)
     */
    const periods = useMemo(() => {
        if (!sales?.sales?.length) return [];
        return sales.sales[0].quantity.map((q) => ({
            year: q.year,
            month: q.month,
        }));
    }, [sales]);

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

    const isTableLoading = isLoading || isFetching;

    return (
        <>
            <header className="space-y-1 mb-6">
                <h2 className="text-2xl font-bold">Manajemen Penjualan</h2>
                <p className="text-muted-foreground">Monitoring tren penjualan produk</p>
            </header>

            <Card>
                <CardHeader className="space-y-4">
                    <div className="flex flex-col gap-4 justify-start items-start md:items-start">
                        <InputGroup className="w-full md:max-w-sm">
                            <InputGroupInput
                                placeholder="Cari produk..."
                                value={table.search}
                                onChange={(e) => table.setSearch(e.target.value)}
                            />
                            <InputGroupAddon>
                                <Search className="h-4 w-4" />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                    <CardDescription className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full">
                        {/* ===== Filters ===== */}
                        {/* Menggunakan grid-cols-2 di mobile, dan flex-row di layar md/lg */}
                        <div className="grid grid-cols-2 md:flex md:flex-row gap-2 w-full lg:w-auto">
                            {/* Gender */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full md:w-32 justify-between"
                                    >
                                        <span className="truncate">
                                            {table.gender === "WOMEN"
                                                ? "Wanita"
                                                : table.gender === "MEN"
                                                  ? "Pria"
                                                  : "Gender"}
                                        </span>
                                        <ChevronDown className="h-4 w-4 shrink-0" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => table.setGender("WOMEN")}>
                                        Wanita
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => table.setGender("MEN")}>
                                        Pria
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => table.setGender(undefined)}
                                        className="text-muted-foreground"
                                    >
                                        Reset
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Size */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full md:w-32 justify-between"
                                    >
                                        <span className="truncate">
                                            {table.size ? `${table.size}` : "Ukuran"}
                                        </span>
                                        <ChevronDown className="h-4 w-4 shrink-0" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    {[2, 10, 15, 110, 100].map((s) => (
                                        <DropdownMenuItem key={s} onClick={() => table.setSize(s)}>
                                            {s}
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuItem
                                        onClick={() => table.setSize(undefined)}
                                        className="text-muted-foreground"
                                    >
                                        Reset
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Type/Variant */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full md:w-48 justify-between"
                                        disabled={typesLoading || typesRefetching}
                                    >
                                        <span className="truncate">
                                            {table.variant
                                                ? (typeList
                                                      ?.find((t) => t.slug === table.variant)
                                                      ?.name.toUpperCase() ?? "Tipe Produk")
                                                : "Tipe Produk"}
                                        </span>
                                        <ChevronDown className="h-4 w-4 shrink-0" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    {typeList?.map((type) => (
                                        <DropdownMenuItem
                                            key={type.id}
                                            onClick={() => table.setVariant(type.slug)}
                                        >
                                            {type.name.toUpperCase()}
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuItem
                                        onClick={() => table.setVariant(undefined)}
                                        className="text-muted-foreground"
                                    >
                                        Reset
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Horizon */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full md:w-40 justify-between"
                                    >
                                        <span className="truncate">
                                            {table.horizon ? `${table.horizon} Bulan` : "Horizon"}
                                        </span>
                                        <ChevronDown className="h-4 w-4 shrink-0" />
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
                        </div>

                        {/* ===== Action Buttons ===== */}
                        {/* Menggunakan flex w-full di mobile agar tombol terbagi 2 rata dan tidak overflow */}
                        <div className="flex w-full lg:w-auto gap-3">
                            <Link href={"/sales/create"} className="flex-1 lg:flex-none">
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="w-full cursor-pointer"
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />{" "}
                                    {/* Opsional: margin kanan untuk icon */}
                                    Penjualan
                                </Button>
                            </Link>
                            <Link href="/sales/import" className="flex-1 lg:flex-none">
                                <Button variant="outline" size="sm" className="w-full">
                                    <Import className="mr-2 h-4 w-4" />{" "}
                                    {/* Opsional: margin kanan untuk icon */}
                                    Import
                                </Button>
                            </Link>
                        </div>
                    </CardDescription>
                </CardHeader>

                {isTableLoading ? (
                    <CardContent>
                        <TableSkeleton />
                    </CardContent>
                ) : (
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={sales?.sales ?? []}
                            page={table.queryParams.page ?? 1}
                            pageSize={table.queryParams.take ?? 10}
                            total={sales?.len ?? 0}
                            onPageChange={table.setPage}
                            onPageSizeChange={table.setPageSize}
                        />
                    </CardContent>
                )}
            </Card>
        </>
    );
}
