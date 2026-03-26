"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Trash, Search, Loader2, Package, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import {
    useCategoriesQuery,
    useCategoryTableState,
} from "@/app/(application)/rawmat/(component)/categories/server/use.category";
import { CategoryColumns } from "./table/column";

export function Categories() {
    const table = useCategoryTableState();

    const defaultColumnVisibility = useMemo(
        () => ({
            name: true,
            status: true,
            created_at: false,
            updated_at: false,
        }),
        [],
    );

    const { data, meta } = useCategoriesQuery(table.queryParams);

    const columns = useMemo(
        () =>
            CategoryColumns({
                sortBy: table.sortBy,
                sortOrder: table.sortOrder,
                onSort: table.onSort,
                status: table.status,
            }),
        [table.sortBy, table.sortOrder, table.onSort, table.status],
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

                <div className="flex justify-between gap-2">
                    <InputGroup className="md:max-w-sm">
                        <InputGroupInput
                            placeholder="Cari kategori..."
                            value={table.search}
                            onChange={(e) => table.setSearch(e.target.value)}
                        />
                        <InputGroupAddon>
                            <Search className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                            {meta.isFetching ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <span className="text-xs">{meta?.data?.len ?? 0} result</span>
                            )}
                        </InputGroupAddon>
                    </InputGroup>
                    <div className="flex gap-2">
                        <Link href="/rawmat/categories/create">
                            <Button size={"sm"}>
                                <Plus size={16} /> Category
                            </Button>
                        </Link>

                        <Button
                            size={"sm"}
                            variant={table.isDeleted ? "outline" : "rose"}
                            onClick={table.toggleTrashMode}
                        >
                            {table.isDeleted ? <Package /> : <Trash />}
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {isTableLoading ? (
                <CardContent>
                    <TableSkeleton />
                </CardContent>
            ) : (
                <CardContent>
                    <DataTable
                        tableId="rawmat-category-table"
                        columns={columns}
                        data={data}
                        page={table.queryParams.page ?? 1}
                        pageSize={table.queryParams.take ?? 10}
                        total={meta.data?.len ?? 0}
                        onPageChange={table.setPage}
                        onPageSizeChange={table.setPageSize}
                        state={{ columnVisibility: defaultColumnVisibility }}
                    />
                </CardContent>
            )}
        </Card>
    );
}
