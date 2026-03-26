"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Plus, Search, Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import {
    useSizesQuery,
    useSizeTableState,
} from "@/app/(application)/products/(component)/size/server/use.size";
import { SizeColumns } from "./table/column";

export function ProductsSize() {
    const table = useSizeTableState();

    const defaultColumnVisibility = useMemo(
        () => ({
            size: true,
        }),
        [],
    );

    const { data, meta } = useSizesQuery(table.queryParams);

    const columns = useMemo(
        () =>
            SizeColumns({
                sortBy: table.sortBy,
                sortOrder: table.sortOrder,
                onSort: table.onSort,
            }),
        [table.sortBy, table.sortOrder, table.onSort],
    );

    const isTableLoading = meta.isLoading || meta.isFetching || meta.isRefetching;

    return (
        <Card className="w-full">
            <CardHeader className="space-y-4">
                <Button
                    size="sm"
                    className="w-fit"
                    onClick={() => window.history.back()}
                    variant={"outline"}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">Ukuran Produk</h2>
                    <p className="text-sm text-muted-foreground">
                        Kelola daftar ukuran produk (Satuannya dalam ML)
                    </p>
                </div>

                <div className="flex justify-between gap-2">
                    <InputGroup className="md:max-w-sm">
                        <InputGroupInput
                            placeholder="Cari ukuran (angka)..."
                            value={table.search}
                            onChange={(e) => table.setSearch(e.target.value)}
                            type="number"
                        />
                        <InputGroupAddon>
                            <Search className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                            {meta.isFetching ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    {data?.length ?? 0} result
                                </span>
                            )}
                        </InputGroupAddon>
                    </InputGroup>
                    <Link href="/products/size/create">
                        <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" /> Ukuran Baru
                        </Button>
                    </Link>
                </div>
            </CardHeader>

            {isTableLoading ? (
                <CardContent>
                    <TableSkeleton />
                </CardContent>
            ) : (
                <CardContent>
                    <DataTable
                        tableId="products-size-table"
                        columns={columns}
                        data={data}
                        page={table.queryParams.page ?? 1}
                        pageSize={table.queryParams.take ?? 10}
                        total={data?.length ?? 0}
                        onPageChange={table.setPage}
                        onPageSizeChange={table.setPageSize}
                        state={{ columnVisibility: defaultColumnVisibility }}
                    />
                </CardContent>
            )}
        </Card>
    );
}
