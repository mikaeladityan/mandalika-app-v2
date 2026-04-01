"use client";

import { useMemo, useState } from "react";
import { Undo2, Search, Loader2, RefreshCcw, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { DataTable } from "@/components/ui/table/data";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { useReturn, useReturnTableState, useFormReturn } from "@/app/(application)/inventory-v2/return/server/use.return";
import { ReturnColumns } from "./table/columns";
import { CreateReturnDialog } from "./form/create-return-dialog";
import { DetailReturnDialog } from "./dialog/detail-return-dialog";
import { useIsMobile } from "@/hooks/use-mobile";

export function ReturnReport() {
    const isMobile = useIsMobile();
    const table = useReturnTableState();
    const [createOpen, setCreateOpen] = useState(false);
    const [detailId, setDetailId] = useState<number | null>(null);

    const { data, meta, isLoading, isFetching, refetch } = useReturn(table.queryParams);
    const { updateStatus } = useFormReturn();

    const columns = useMemo(
        () =>
            ReturnColumns({
                onDetail: (id) => setDetailId(id),
                onUpdateStatus: (id, status) => {
                    const msg =
                        status === "CANCELLED"
                            ? "Apakah Anda yakin ingin membatalkan retur ini?"
                            : `Apakah Anda yakin ingin mengubah status retur ini menjadi ${status}?`;
                    if (window.confirm(msg)) {
                        updateStatus.mutate({ id, payload: { status } });
                    }
                },
            }),
        [updateStatus],
    );

    const isTableLoading = isLoading || isFetching;

    return (
        <div className="flex flex-col gap-5">
            <Card>
                <CardHeader className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Undo2 className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold tracking-tight">
                                        Pengembalian Barang (Retur)
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Daftar pengembalian stok (Rejected dari produk DO atau TG).
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                className="bg-amber-600 hover:bg-amber-700 text-white font-bold h-9 px-4 rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-2"
                                onClick={() => setCreateOpen(true)}
                            >
                                <PlusCircle className="h-4 w-4" />
                                <span className="hidden sm:inline">Buat Manual Retur</span>
                                <span className="sm:hidden text-[10px]">Buat Retur</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetch()}
                                disabled={isFetching}
                            >
                                <RefreshCcw
                                    className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
                                />
                                Refresh
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                        <InputGroup className="w-full md:max-w-md">
                            <InputGroupInput
                                placeholder="Cari nomor Retur atau DO/TG..."
                                value={table.search}
                                onChange={(e) => table.setSearch(e.target.value)}
                            />
                            <InputGroupAddon align="inline-end">
                                {isFetching ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Search className="h-4 w-4" />
                                )}
                            </InputGroupAddon>
                        </InputGroup>

                        <div className="flex gap-2 items-center w-fit bg-zinc-100/50 p-1 rounded-lg border border-zinc-200">
                            <Button
                                variant={table.queryParams.status === undefined ? "default" : "ghost"}
                                size="sm"
                                className={`h-8 rounded-md px-3 text-xs font-bold transition-all ${
                                    table.queryParams.status === undefined
                                        ? "bg-white text-primary shadow-sm hover:bg-white"
                                        : "text-zinc-600 hover:bg-zinc-200/50"
                                }`}
                                onClick={() => table.setStatus(undefined)}
                            >
                                Semua
                            </Button>
                            <Button
                                variant={table.queryParams.status === "DRAFT" ? "default" : "ghost"}
                                size="sm"
                                className={`h-8 rounded-md px-3 text-xs font-bold transition-all ${
                                    table.queryParams.status === "DRAFT"
                                        ? "bg-white text-primary shadow-sm hover:bg-white"
                                        : "text-zinc-600 hover:bg-zinc-200/50"
                                }`}
                                onClick={() => table.setStatus("DRAFT")}
                            >
                                Draft
                            </Button>
                            <Button
                                variant={table.queryParams.status === "SHIPPING" ? "default" : "ghost"}
                                size="sm"
                                className={`h-8 rounded-md px-3 text-xs font-bold transition-all ${
                                    table.queryParams.status === "SHIPPING"
                                        ? "bg-white text-primary shadow-sm hover:bg-white"
                                        : "text-zinc-600 hover:bg-zinc-200/50"
                                }`}
                                onClick={() => table.setStatus("SHIPPING")}
                            >
                                Shipping
                            </Button>
                            <Button
                                variant={table.queryParams.status === "RECEIVED" ? "default" : "ghost"}
                                size="sm"
                                className={`h-8 rounded-md px-3 text-xs font-bold transition-all ${
                                    table.queryParams.status === "RECEIVED"
                                        ? "bg-white text-primary shadow-sm hover:bg-white"
                                        : "text-zinc-600 hover:bg-zinc-200/50"
                                }`}
                                onClick={() => table.setStatus("RECEIVED")}
                            >
                                Received
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {isTableLoading && !data.length ? (
                    <CardContent>
                        <TableSkeleton />
                    </CardContent>
                ) : (
                    <CardContent>
                        <DataTable
                            tableId="return-master-table"
                            columns={columns}
                            data={data}
                            page={table.queryParams.page || 1}
                            pageSize={table.queryParams.take || 25}
                            total={meta?.len ?? 0}
                            onPageChange={(page) => table.setPage(page)}
                            onPageSizeChange={(size) => table.setPageSize(size)}
                            enableMultiSelect={false}
                        />
                    </CardContent>
                )}
            </Card>

            {detailId && (
                <DetailReturnDialog
                    id={detailId}
                    open={!!detailId}
                    onOpenChange={(open) => !open && setDetailId(null)}
                />
            )}

            <CreateReturnDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                isMobile={isMobile}
            />
        </div>
    );
}
