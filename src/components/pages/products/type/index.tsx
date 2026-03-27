"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus, Search, Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    useTypesQuery,
    useTypeTableState,
} from "@/app/(application)/products/(component)/type/server/use.type";
import { TypeColumns } from "./table/column";
import { CreateTypeDialog, EditTypeDialog } from "./type-form-dialog";
import { ResponseTypeDTO } from "@/app/(application)/products/(component)/type/server/type.schema";

export function ProductsType() {
    const table = useTypeTableState();
    const isMobile = useIsMobile();
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<ResponseTypeDTO | null>(null);

    const handleCreateClick = () => {
        setCreateOpen(true);
    };

    const handleEditClick = (data: ResponseTypeDTO) => {
        setSelectedData(data);
        setEditOpen(true);
    };

    const defaultColumnVisibility = useMemo(
        () => ({
            name: true,
            slug: true,
        }),
        [],
    );

    const { data, meta } = useTypesQuery(table.queryParams);

    const columns = useMemo(
        () =>
            TypeColumns({
                sortBy: table.sortBy,
                sortOrder: table.sortOrder,
                onSort: table.onSort,
                onEdit: handleEditClick,
            }),
        [table.sortBy, table.sortOrder, table.onSort],
    );

    const isTableLoading = meta.isLoading || meta.isFetching || meta.isRefetching;

    return (
        <>
            <Card className="w-full">
                <CardHeader className="space-y-4">
                    <Button
                        size="sm"
                        className="w-fit"
                        onClick={() => window.history.back()}
                        variant="outline"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">Tipe Produk</h2>
                        <p className="text-sm text-muted-foreground">
                            Kelola kategori tipe produk (Contoh: EDP, Body Mist, dll)
                        </p>
                    </div>

                    <div className="flex justify-between gap-2">
                        <InputGroup className="md:max-w-sm">
                            <InputGroupInput
                                placeholder="Cari tipe..."
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
                                    <span className="text-xs text-muted-foreground">
                                        {data?.length ?? 0} result
                                    </span>
                                )}
                            </InputGroupAddon>
                        </InputGroup>
                        <Button size="sm" onClick={handleCreateClick}>
                            <Plus className="mr-2 h-4 w-4" /> Tipe Baru
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
                            tableId="products-type-table"
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

            <CreateTypeDialog open={createOpen} setOpen={setCreateOpen} />

            <EditTypeDialog open={editOpen} setOpen={setEditOpen} data={selectedData} />
        </>
    );
}
