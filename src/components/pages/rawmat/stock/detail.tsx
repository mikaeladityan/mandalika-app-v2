"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, ChevronDown, Import, Loader2 } from "lucide-react";

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

import { RawMatColumns } from "./table/column";
import {
    useRawMatStocksQuery,
    useRawMatStockTableState,
} from "@/app/(application)/rawmat/stocks/server/use.rawmat.stock";
import { useCategory } from "@/app/(application)/rawmat/categories/server/use.category";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import { useParams } from "next/navigation";

export function RawMatWarehouseStockDetail() {
    const { id } = useParams<{ id: string }>();
    const table = useRawMatStockTableState();
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        category: true,
        amount: true,
        warehouse: true,
    });

    // Pass warehouse_id from params
    const { rawMats, meta, isLoading, isFetching, isRefetching } = useRawMatStocksQuery({
        ...table.queryParams,
        warehouse_id: Number(id),
    });

    const { categories } = useCategory({ take: 100 });

    const columns = useMemo(
        () =>
            RawMatColumns({
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
                    Stock Raw Material Gudang {rawMats[0]?.warehouse?.name ?? "..."}
                </h2>
                <p className="text-sm text-muted-foreground">
                    Kelola pergerakan dan informasi seluruh stock bahan baku pada gudang ini
                </p>
            </header>

            <Card>
                <CardHeader className="space-y-4">
                    {/* ===== Search ===== */}
                    <InputGroup className="w-full md:max-w-sm">
                        <InputGroupInput
                            placeholder="Search raw material..."
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
                        {/* Category */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full md:w-48 justify-between"
                                    disabled={categories.isLoading || categories.isRefetching}
                                >
                                    {table.category_id
                                        ? (categories.data?.data
                                              ?.find((t) => t.id === table.category_id)
                                              ?.name.toUpperCase() ?? "Kategori Material")
                                        : "Kategori Material"}
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {categories.data?.data?.map((cat) => (
                                    <DropdownMenuItem
                                        key={cat.id}
                                        onClick={() => table.setCategory(cat.id)}
                                    >
                                        {cat.name.toUpperCase()}
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem
                                    onClick={() => table.setCategory(undefined)}
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
                            <Link href={`/warehouses/${id}/rawmat-import`}>
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
                                data={rawMats}
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
