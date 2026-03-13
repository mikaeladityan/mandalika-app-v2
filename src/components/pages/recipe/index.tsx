"use client";

import { Search, Plus, Loader2, FilterX, Import } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { useRecipeQuery, useRecipeTableState } from "@/app/(application)/recipes/server/use.recipe";
import Link from "next/link";
import { DataTable } from "@/components/ui/table/data";
import { RecipeColumns } from "./table/column";
import { useMemo } from "react";
import { LogData } from "@/components/log";

export function Recipe() {
    const table = useRecipeTableState();
    const { data, meta, isLoading, isFetching, isRefetching } = useRecipeQuery(table.queryParams);
    const groupedData = useMemo(() => {
        if (!data || data.length === 0) return [];
        const groups: Record<string, any> = {};

        data.forEach((item) => {
            if (!item.product) return;
            const key = `${item.product.id}_${item.version}`;
            if (!groups[key]) {
                groups[key] = {
                    ...item.product,
                    id: item.id, // Recipe ID
                    product_id: item.product.id, // Original Product ID
                    version: item.version,
                    is_active: item.is_active,
                    description: item.description,
                    total_material: item.total_material,
                    materials: [],
                };
            }
            groups[key].materials.push({
                id: item.id,
                name: item.raw_material?.name,
                barcode: item.raw_material?.barcode,
                quantity: item.quantity,
                unit: item.raw_material?.unit_raw_material?.name,
                stock: item.raw_material?.current_stock,
                price: item.raw_material?.price,
            });
        });
        return Object.values(groups);
    }, [data]);

    const columns = useMemo(
        () =>
            RecipeColumns({
                sortBy: table.sortBy,
                sortOrder: table.sortOrder,
                onSort: table.onSort,
            }),
        [table.sortBy, table.sortOrder, table.onSort],
    );
    const isDataLoading = isLoading || isFetching || isRefetching;

    return (
        <section className="space-y-6 max-w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Resep Produk
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola formulasi produk dan pantau kebutuhan bahan baku.
                    </p>
                </div>
                <div className="flex items-center justify-end gap-2">
                    <Link href="/recipes/import">
                        <Button className="shadow-sm" variant={"outline"}>
                            <Import className="h-4 w-4 mr-2" /> Import
                        </Button>
                    </Link>
                    <Link href="/recipes/form">
                        <Button className="shadow-sm">
                            <Plus className="h-4 w-4 mr-2" /> Tambah Resep Baru
                        </Button>
                    </Link>
                </div>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                        <InputGroup className="md:max-w-md rounded-lg shadow-sm border-slate-200">
                            <InputGroupInput
                                placeholder="Cari nama produk atau kode..."
                                value={table.search}
                                onChange={(e) => table.setSearch(e.target.value)}
                            />
                            <InputGroupAddon>
                                {isFetching ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                ) : (
                                    <Search className="h-4 w-4 text-slate-400" />
                                )}
                            </InputGroupAddon>
                        </InputGroup>

                        <div className="flex items-center gap-2">
                            {table.search && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => table.setSearch("")}
                                    className="text-slate-500"
                                >
                                    <FilterX className="h-4 w-4 mr-2" /> Reset
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {isDataLoading ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-16 w-full bg-white border rounded-lg animate-pulse"
                                />
                            ))}
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={groupedData || []}
                            page={table.queryParams.page ?? 1}
                            pageSize={table.queryParams.take ?? 10}
                            total={meta?.len ?? 0}
                            onPageChange={table.setPage}
                            onPageSizeChange={table.setPageSize}
                        />
                    )}
                </CardContent>
            </Card>

            <LogData data={data} />
        </section>
    );
}
