"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, Plus, Search, Loader2, RefreshCcw, FileSpreadsheet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { SelectFilter } from "@/components/ui/form/select";
import { DataTable } from "@/components/ui/table/data";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { useWarehouses } from "@/app/(application)/shared/use.shared";
import {
    useTransferGudang,
    useFormTransferGudang,
    useTGTableState,
    useExportTransferGudang,
} from "@/app/(application)/inventory-v2/tg/server/use.tg";
import { TGColumns } from "./table/columns";
import { CreateTGDialog } from "./form/create-tg-dialog";
import { TransferGudangDetailsDialog } from "./details-dialog";

export function TransferGudang() {
    const table = useTGTableState();
    const [createOpen, setCreateOpen] = useState(false);
    const [detailId, setDetailId] = useState<number | null>(null);

    const { data, meta, isLoading, isFetching, refetch } = useTransferGudang(table.queryParams);
    const { data: warehouses, isLoading: whLoading } = useWarehouses();
    const { updateStatus } = useFormTransferGudang();
    const { exportData, isExporting } = useExportTransferGudang();

    const columns = useMemo(
        () =>
            TGColumns({
                onDetail: (id) => setDetailId(id),
            }),
        [updateStatus],
    );

    const isTableLoading = isLoading || isFetching || updateStatus.isPending;

    const warehouseOptions =
        warehouses
            ?.filter((w: any) => w.type === "FINISH_GOODS")
            .map((w: any) => ({
                value: w.id,
                label: w.name,
            })) ?? [];

    return (
        <div className="flex flex-col gap-5">
            <Card className="border-none shadow-sm bg-linear-to-b from-white to-zinc-50/30">
                <CardHeader className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-2.5 rounded-xl">
                                <ArrowRightLeft className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-zinc-900 uppercase">
                                    Transfer Gudang (TG)
                                </h2>
                                <p className="text-sm text-muted-foreground font-medium">
                                    Mutasi stok barang antar gudang Finish Goods.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetch()}
                                disabled={isFetching}
                                className="h-9 px-4 font-bold border-zinc-200"
                            >
                                <RefreshCcw
                                    className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
                                />
                                REFRESH
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => exportData(table.queryParams)}
                                disabled={isExporting}
                                className="h-9 px-4 bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-bold uppercase text-[11px] tracking-wider"
                            >
                                {isExporting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
                                ) : (
                                    <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
                                )}
                                EXPORT EXCEL
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => setCreateOpen(true)}
                                className="h-9 px-4 bg-amber-600 hover:bg-amber-700 font-bold shadow-md shadow-amber-200"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                BUAT PACKING TG
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 pt-2">
                        <InputGroup className="w-full md:max-w-md border-zinc-300">
                            <InputGroupInput
                                placeholder="Cari nomor TG atau Barcode..."
                                value={table.search}
                                onChange={(e) => table.setSearch(e.target.value)}
                            />
                            <InputGroupAddon align="inline-end">
                                {isFetching ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Search className="h-4 w-4 text-zinc-400" />
                                )}
                            </InputGroupAddon>
                        </InputGroup>

                        <div className="flex gap-2 items-center flex-wrap">
                            <SelectFilter
                                size="default"
                                placeholder="Gudang Asal"
                                value={table.queryParams.from_warehouse_id ?? null}
                                options={warehouseOptions}
                                onChange={(val) => table.setSourceWarehouse(Number(val))}
                                onReset={() => table.setSourceWarehouse(undefined)}
                                isLoading={whLoading}
                                canSearching={true}
                                className="w-48 bg-white border-zinc-300 pointer-events-auto"
                            />

                            <ArrowRightLeft className="h-4 w-4 text-zinc-300 hidden md:block" />

                            <SelectFilter
                                size="default"
                                placeholder="Gudang Tujuan"
                                value={table.queryParams.to_warehouse_id ?? null}
                                options={warehouseOptions}
                                onChange={(val) => table.setTargetWarehouse(Number(val))}
                                onReset={() => table.setTargetWarehouse(undefined)}
                                isLoading={whLoading}
                                canSearching={true}
                                className="w-48 bg-white border-zinc-300 pointer-events-auto"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 items-center w-fit bg-zinc-100/50 p-1.5 rounded-xl border border-zinc-200">
                        {[
                            { id: undefined, label: "SEMUA" },
                            { id: "PENDING", label: "DRAFT/PACKING" },
                            { id: "SHIPMENT", label: "SHIPPING" },
                            { id: "RECEIVED", label: "RECEIVED" },
                            { id: "COMPLETED", label: "DONE / COMPLETED" },
                            { id: "CANCELLED", label: "CANCELLED" },
                        ].map((s) => (
                            <Button
                                key={s.label}
                                variant={table.queryParams.status === s.id ? "default" : "ghost"}
                                size="sm"
                                className={`h-8 rounded-lg px-4 text-[10px] font-black transition-all tracking-wider ${
                                    table.queryParams.status === s.id
                                        ? "bg-white text-primary shadow-sm hover:bg-white border-none"
                                        : "text-zinc-500 hover:bg-zinc-200/50"
                                }`}
                                onClick={() => table.setStatus(s.id as any)}
                            >
                                {s.label}
                            </Button>
                        ))}
                    </div>
                </CardHeader>

                {isTableLoading && !data.length ? (
                    <CardContent>
                        <TableSkeleton />
                    </CardContent>
                ) : (
                    <CardContent>
                        <DataTable
                            tableId="tg-master-table"
                            columns={columns}
                            data={data}
                            page={table.queryParams.page || 1}
                            pageSize={table.queryParams.take || 25}
                            total={meta?.total ?? 0}
                            onPageChange={(page) => table.setPage(page)}
                            onPageSizeChange={(size) => table.setPageSize(size)}
                            enableMultiSelect={false}
                        />
                    </CardContent>
                )}
            </Card>

            <CreateTGDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onSuccess={() => refetch()}
            />

            <TransferGudangDetailsDialog
                open={detailId !== null}
                onOpenChange={(o: boolean) => !o && setDetailId(null)}
                id={detailId}
            />
        </div>
    );
}
