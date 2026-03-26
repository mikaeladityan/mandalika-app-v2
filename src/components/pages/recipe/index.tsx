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
        <section className="space-y-6 max-w-full animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/60 pb-5">
                <div className="space-y-1.5">
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
                        Resep Produk
                    </h1>
                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                        Kelola formulasi produk dan pantau kebutuhan bahan baku untuk efisiensi
                        produksi.
                    </p>
                </div>
                <div className="flex items-center justify-end gap-2.5">
                    <Link href="/recipes/import">
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-9 font-bold bg-white shadow-sm hover:bg-slate-50 border-slate-200"
                        >
                            <Import className="h-4 w-4 mr-2" /> Import
                        </Button>
                    </Link>
                    <Link href="/recipes/form">
                        <Button
                            size="sm"
                            className="h-9 font-bold bg-primary hover:bg-primary-dark text-white shadow-md transition-all active:scale-[0.98]"
                        >
                            <Plus className="h-4 w-4 mr-2" /> Tambah Resep
                        </Button>
                    </Link>
                </div>
            </div>

            <Card className="border border-slate-200 rounded-[18px] shadow-[0_10px_20px_rgba(15,23,42,0.06)] overflow-hidden bg-white">
                <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/30">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                        <InputGroup className="md:max-w-md bg-white rounded-lg shadow-sm border-slate-200 transition-focus-within focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 overflow-hidden h-9">
                            <InputGroupInput
                                placeholder="Cari nama produk atau kode..."
                                value={table.search}
                                onChange={(e) => table.setSearch(e.target.value)}
                                className="h-full border-none focus-visible:ring-0 text-[13px]"
                            />
                            <InputGroupAddon className="bg-transparent border-none">
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
                                    className="h-9 text-slate-500 hover:text-primary hover:bg-primary/5 font-bold transition-colors"
                                >
                                    <FilterX className="h-4 w-4 mr-2" /> Reset Filter
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {isDataLoading ? (
                        <div className="p-5 space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-16 w-full bg-slate-50/50 border border-slate-100 rounded-xl animate-pulse"
                                />
                            ))}
                        </div>
                    ) : (
                        <DataTable
                            tableId="recipe-table"
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
        </section>
    );
}
