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
import { UnitColumns } from "./table/column";
import {
    useUnitsQuery,
    useUnitTableState,
} from "@/app/(application)/rawmat/(component)/units/server/use.unit";

export function Units() {
    const table = useUnitTableState();

    const { data, meta } = useUnitsQuery(table.queryParams);

    const columns = useMemo(
        () =>
            UnitColumns({
                sortBy: table.sortBy,
                sortOrder: table.sortOrder,
                onSort: table.onSort,
            }),
        [table.sortBy, table.sortOrder, table.onSort],
    );

    const isTableLoading = meta.isLoading || meta.isFetching || meta.isRefetching;

    return (
        <Card className={"w-full lg:w-11/12 xl:w-8/12 2xl:w-6/12 3xl:w-4/12"}>
            <CardHeader className="space-y-4">
                <Button className="w-fit" onClick={() => window.history.back()} variant={"outline"}>
                    <ArrowLeft />
                    Kembali
                </Button>
                <InputGroup className="md:max-w-sm">
                    <InputGroupInput
                        placeholder="Cari satuan..."
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
                        <Link href="/rawmat/units/create">
                            <Button size={"sm"}>
                                <Plus size={16} /> Unit/Satuan
                            </Button>
                        </Link>
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
                        columns={columns}
                        data={data}
                        page={table.queryParams.page ?? 1}
                        pageSize={table.queryParams.take ?? 10}
                        total={meta.data?.len ?? 0}
                        onPageChange={table.setPage}
                        onPageSizeChange={table.setPageSize}
                    />
                </CardContent>
            )}
        </Card>
    );
}
