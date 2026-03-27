"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Search, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import {
    useSuppliersQuery,
    useSupplierTableState,
} from "@/app/(application)/rawmat/(component)/suppliers/server/use.supplier";
import { SupplierColumns } from "./table/column";
import { CreateSupplierDialog, EditSupplierDialog } from "./supplier-form-dialog";

export function Suppliers() {
    const table = useSupplierTableState();

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | undefined>();

    const defaultColumnVisibility = useMemo(
        () => ({
            name: true,
            country: true,
            created_at: false,
            updated_at: true,
        }),
        [],
    );
    const { data, meta } = useSuppliersQuery(table.queryParams);
    const columns = useMemo(
        () =>
            SupplierColumns({
                sortBy: table.sortBy,
                sortOrder: table.sortOrder,
                onSort: table.onSort,
                onEdit: (id) => {
                    setSelectedId(id);
                    setEditOpen(true);
                },
            }),
        [table.sortBy, table.sortOrder, table.onSort],
    );

    const isTableLoading = meta.isLoading || meta.isFetching || meta.isRefetching;

    return (
        <Card className="w-full">
            <CardHeader className="space-y-4">
                <Button size="sm" className="w-fit" onClick={() => window.history.back()} variant={"outline"}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>

                <div className="flex justify-between gap-2">
                    <InputGroup className="md:max-w-sm">
                        <InputGroupInput
                            placeholder="Cari supplier..."
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

                    <Button size={"sm"} onClick={() => setCreateOpen(true)}>
                        <Plus size={16} /> Supplier
                    </Button>
                </div>
            </CardHeader>

            {isTableLoading ? (
                <CardContent>
                    <TableSkeleton />
                </CardContent>
            ) : (
                <CardContent>
                    <DataTable
                        tableId="rawmat-supplier-table"
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

            <CreateSupplierDialog open={createOpen} setOpen={setCreateOpen} />
            <EditSupplierDialog open={editOpen} setOpen={setEditOpen} id={selectedId} />
        </Card>
    );
}
