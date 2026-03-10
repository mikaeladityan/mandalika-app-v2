"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Trash, Search, ChevronDown, Loader2, Package, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import {
    useCategoriesQuery,
    useCategoryTableState,
} from "@/app/(application)/rawmat/(component)/categories/server/use.category";
import { CategoryColumns } from "./table/column";
import { cn } from "@/lib/utils";

export function Categories() {
    const table = useCategoryTableState();

    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        name: true,
        status: true,
        created_at: false,
        updated_at: false,
    });

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
    const isDateColumnVisible = columnVisibility.created_at || columnVisibility.updated_at;
    return (
        <Card
            className={cn(
                isDateColumnVisible
                    ? "w-full lg:w-11/12 xl:w-8/12 2xl:w-6/12 3xl:w-6/12"
                    : "w-full lg:w-11/12 xl:w-8/12 2xl:w-6/12 3xl:w-4/12",
            )}
        >
            <CardHeader className="space-y-4">
                <Button className="w-fit" onClick={() => window.history.back()} variant={"outline"}>
                    <ArrowLeft />
                    Kembali
                </Button>
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

                <div className="flex justify-between gap-2">
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
                            {table.isDeleted ? <Package size={16} /> : <Trash size={16} />}
                        </Button>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Kolom <ChevronDown size={16} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {Object.entries(columnVisibility).map(([k, v]) => (
                                <DropdownMenuCheckboxItem
                                    key={k}
                                    checked={v}
                                    onCheckedChange={(c) =>
                                        setColumnVisibility((p) => ({
                                            ...p,
                                            [k]: Boolean(c),
                                        }))
                                    }
                                >
                                    {k.replace("_", " ").toUpperCase()}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            {isTableLoading ? (
                <CardContent>
                    <TableSkeleton />
                </CardContent>
            ) : (
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={data}
                        page={table.queryParams.page ?? 1}
                        pageSize={table.queryParams.take ?? 10}
                        total={meta.data?.len ?? 0}
                        onPageChange={table.setPage}
                        onPageSizeChange={table.setPageSize}
                        state={{ columnVisibility }}
                        onColumnVisibilityChange={setColumnVisibility}
                    />
                </CardContent>
            )}
        </Card>
    );
}
