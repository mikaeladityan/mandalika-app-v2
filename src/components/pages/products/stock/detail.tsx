"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, ChevronDown, Download, Import, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ProductColumns } from "./table.tsx/column";
import {
    useProductStocksQuery,
    useProductStockTableState,
} from "@/app/(application)/products/stocks/server/use.product.stock";
import { useType } from "@/app/(application)/products/(component)/type/server/use.type";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import { useParams } from "next/navigation";

export function ProductsWarehouseStockDetail() {
    const { id } = useParams<{ id: string }>();
    const table = useProductStockTableState();
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        gender: true,
        type: true,
        size: true,
        amount: true,
        warehouse: true,
    });
    const { products, meta, isLoading, isFetching, isRefetching } = useProductStocksQuery({
        ...table.queryParams,
        warehouse_id: Number(id),
    });

    const { data: typeList, isLoading: typesLoading, isRefetching: typesRefetching } = useType();

    const columns = useMemo(
        () =>
            ProductColumns({
                sortBy: table.sortBy,
                sortOrder: table.sortOrder,
                onSort: table.onSort,
            }),
        [table.sortBy, table.sortOrder, table.onSort],
    );

    const isTableLoading = isLoading || isFetching || isRefetching;

    return (
        <>
            <header className="space-y-1 mb-5">
                <h2 className="text-xl font-semibold tracking-tight">
                    Stock Produk Gudang {products[0]?.warehouse?.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                    Kelola pergerakan dan informasi seluruh stock produk
                </p>
            </header>

            <Card>
                <CardHeader className="space-y-4">
                    {/* ===== Search ===== */}
                    <InputGroup className="w-full md:max-w-sm">
                        <InputGroupInput
                            placeholder="Search product..."
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
                                    {meta?.len ?? 0} result
                                </span>
                            )}
                        </InputGroupAddon>
                    </InputGroup>

                    {/* ===== Filters ===== */}
                    <div className="flex flex-col md:flex-row gap-2">
                        {/* Gender */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full md:w-40 justify-between"
                                >
                                    {table.gender === "WOMEN"
                                        ? "Wanita"
                                        : table.gender === "MEN"
                                          ? "Pria"
                                          : table.gender === "UNISEX"
                                            ? "Unisex"
                                            : "Gender"}
                                    <ChevronDown className="h-4 w-4" />
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

                        {/* Type */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full md:w-48 justify-between"
                                    disabled={typesLoading || typesRefetching}
                                >
                                    {table.type_id
                                        ? (typeList
                                              ?.find((t) => t.id === table.type_id)
                                              ?.name.toUpperCase() ?? "Tipe Produk")
                                        : "Tipe Produk"}
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {typeList?.map((type) => (
                                    <DropdownMenuItem
                                        key={type.id}
                                        onClick={() => table.setType(type.id)}
                                    >
                                        {type.name.toUpperCase()}
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem
                                    onClick={() => table.setType(undefined)}
                                    className="text-muted-foreground"
                                >
                                    Reset
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* ===== Actions ===== */}
                    <div className="flex flex-col md:flex-row justify-end gap-2">
                        <Button variant="success" asChild>
                            <Link href={`/warehouses/${id}/import`}>
                                <Import className="h-4 w-4 mr-2" />
                                Import
                            </Link>
                        </Button>
                        <div className="flex gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        Kolom
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {Object.entries(columnVisibility).map(([key, value]) => (
                                        <DropdownMenuCheckboxItem
                                            key={key}
                                            checked={value}
                                            onCheckedChange={(checked) =>
                                                setColumnVisibility((prev) => ({
                                                    ...prev,
                                                    [key]: Boolean(checked),
                                                }))
                                            }
                                        >
                                            {key.replace("_", " ").toUpperCase()}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                {isTableLoading ? (
                    <CardContent>
                        <TableSkeleton />
                    </CardContent>
                ) : (
                    <>
                        <CardContent>
                            <DataTable
                                columns={columns}
                                data={products}
                                page={table.queryParams.page || 1}
                                pageSize={table.queryParams.take || 10}
                                total={meta?.len ?? 0}
                                onPageChange={(page) => table.setPage(page)}
                                onPageSizeChange={(size) => table.setPageSize(size)}
                                state={{ columnVisibility }}
                                onColumnVisibilityChange={setColumnVisibility}
                            />
                        </CardContent>
                    </>
                )}
            </Card>
        </>
    );
}
