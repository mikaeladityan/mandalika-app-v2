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
import { ResponseWarehouseDTO } from "@/app/(application)/warehouses/server/warehouse.schema";
import { ResponseSalesDTO } from "@/app/(application)/sales/server/sales.schema";
import { useFormSales } from "@/app/(application)/sales/server/use.sales";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";

export function Sales() {
    const table = useSaleTableState();

    const { data: salesList, total, isLoading, isFetching } = useSaleQuery(table.queryParams);
    const { data: typeList, isLoading: typesLoading } = useType();

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

    const isDataLoading = isLoading;

    return (
        <section className="space-y-6">
            <header className="space-y-1 mb-6">
                <h2 className="text-2xl font-bold">Manajemen Penjualan</h2>
                <p className="text-muted-foreground">Monitoring tren penjualan produk aktual</p>
            </header>

            <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="space-y-4 bg-white/50 border-b">
                    <div className="flex flex-col gap-4 justify-start items-start md:items-start">
                        <InputGroup className="w-full md:max-w-sm">
                            <InputGroupInput
                                placeholder="Cari kode atau nama produk..."
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
                                        disabled={typesLoading}
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
                        <div className="flex w-full lg:w-auto gap-3">
                            <Link href={"/sales/create"} className="flex-1 lg:flex-none">
                                <Button
                                    variant="teal"
                                    size="sm"
                                    className="w-full cursor-pointer font-bold shadow-sm shadow-teal-50"
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Input Penjualan
                                </Button>
                            </Link>
                            <Link href="/sales/import" className="flex-1 lg:flex-none">
                                <Button variant="outline" size="sm" className="w-full">
                                    <Import className="mr-2 h-4 w-4" />
                                    Import CSV/Excel
                                </Button>
                            </Link>
                        </div>
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-6 relative">
                    {/* Overlay fetching state for smoother UX during pagination/filter */}
                    {isFetching && !isLoading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    {isDataLoading ? (
                        <TableSkeleton />
                    ) : (
                        <DataTable
                            columns={columns}
                            data={salesList}
                            page={table.queryParams.page ?? 1}
                            pageSize={table.queryParams.take ?? 25}
                            total={total}
                            onPageChange={table.setPage}
                            onPageSizeChange={table.setPageSize}
                        />
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
