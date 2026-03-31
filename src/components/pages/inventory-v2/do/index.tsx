"use client";

import { useMemo, useState } from "react";
import { Truck, Plus, Search, Loader2, Filter, RefreshCcw, FileSpreadsheet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SelectFilter } from "@/components/ui/form/select";
import { DataTable } from "@/components/ui/table/data";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { useWarehouses } from "@/app/(application)/shared/use.shared";
import { useOutlets } from "@/app/(application)/outlets/server/use.outlet";
import {
    useDeliveryOrder,
    useFormDeliveryOrder,
    useDOTableState,
    useExportDeliveryOrder,
} from "@/app/(application)/inventory-v2/do/server/use.do";
import { DOColumns } from "./table/columns";
import { CreateDODialog } from "./form/create-do-dialog";
import { DeliveryOrderDetailsDialog } from "./details-dialog";
import { useIsMobile } from "@/hooks/use-mobile";

export function DeliveryOrder() {
    const isMobile = useIsMobile();
    const table = useDOTableState();
    const [createOpen, setCreateOpen] = useState(false);
    const [detailId, setDetailId] = useState<number | null>(null);

    const { data, meta, isLoading, isFetching, refetch } = useDeliveryOrder(table.queryParams);
    const { data: warehouses, isLoading: whLoading } = useWarehouses();
    const { outlets, isLoading: outLoading } = useOutlets({
        take: 50,
        status: "active",
        type: table.targetType as any,
    } as any);
    const { updateStatus } = useFormDeliveryOrder();
    const { exportData, isExporting } = useExportDeliveryOrder();

    const columns = useMemo(
        () =>
            DOColumns({
                onDetail: (id) => setDetailId(id),
            }),
        [updateStatus],
    );

    const isTableLoading = isLoading || isFetching || updateStatus.isPending;

    return (
        <div className="flex flex-col gap-5">
            <Card>
                <CardHeader className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight">
                                Delivery Order (DO)
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Distribusi stok dari Gudang ke Outlet (Delivery/Transfer).
                            </p>
                        </div>
                        <div className="flex gap-2">
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
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => exportData(table.queryParams)}
                                disabled={isExporting}
                                className="bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-bold uppercase text-[11px] tracking-wider"
                            >
                                {isExporting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
                                ) : (
                                    <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
                                )}
                                Export Excel
                            </Button>
                            <Button size="sm" onClick={() => setCreateOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Buat DO List
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                        <InputGroup className="w-full md:max-w-md">
                            <InputGroupInput
                                placeholder="Cari nomor DO..."
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

                        <div className="flex gap-2 items-center flex-wrap">
                            <SelectFilter
                                size="sm"
                                placeholder="Asal Gudang"
                                value={table.queryParams.from_warehouse_id ?? null}
                                options={
                                    warehouses
                                        ?.filter((w: any) => w.type === "FINISH_GOODS")
                                        .map((w: any) => ({
                                            value: w.id,
                                            label: w.name,
                                        })) ?? []
                                }
                                onChange={(val) => table.setSourceWarehouse(Number(val))}
                                onReset={() => table.setSourceWarehouse(undefined)}
                                isLoading={whLoading}
                                canSearching={true}
                                className="w-36"
                            />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Filter className="h-4 w-4" />
                                        {table.targetType === "RETAIL"
                                            ? "Toko (Retail)"
                                            : table.targetType === "MARKETPLACE"
                                              ? "Reseller / Marketplace"
                                              : "Semua Tipe Target"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => {
                                            table.setTargetType(null);
                                            table.setTargetOutlet(undefined);
                                        }}
                                    >
                                        Semua Tipe Target
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            table.setTargetType("RETAIL");
                                            table.setTargetOutlet(undefined);
                                        }}
                                    >
                                        Toko (Retail)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            table.setTargetType("MARKETPLACE");
                                            table.setTargetOutlet(undefined);
                                        }}
                                    >
                                        Reseller / Marketplace
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <SelectFilter
                                size="sm"
                                placeholder="Pilih Tujuan"
                                value={table.queryParams.to_outlet_id ?? null}
                                options={
                                    outlets?.data?.map((o: any) => ({
                                        value: o.id,
                                        label: o.name,
                                    })) ?? []
                                }
                                onChange={(val) => table.setTargetOutlet(Number(val))}
                                onReset={() => table.setTargetOutlet(undefined)}
                                isLoading={outLoading}
                                canSearching={true}
                                className="w-72"
                            />
                        </div>
                    </div>
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
                            variant={table.queryParams.status === "PENDING" ? "default" : "ghost"}
                            size="sm"
                            className={`h-8 rounded-md px-3 text-xs font-bold transition-all ${
                                table.queryParams.status === "PENDING"
                                    ? "bg-white text-primary shadow-sm hover:bg-white"
                                    : "text-zinc-600 hover:bg-zinc-200/50"
                            }`}
                            onClick={() => table.setStatus("PENDING")}
                        >
                            Draft/Packing
                        </Button>
                        <Button
                            variant={table.queryParams.status === "SHIPMENT" ? "default" : "ghost"}
                            size="sm"
                            className={`h-8 rounded-md px-3 text-xs font-bold transition-all ${
                                table.queryParams.status === "SHIPMENT"
                                    ? "bg-white text-primary shadow-sm hover:bg-white"
                                    : "text-zinc-600 hover:bg-zinc-200/50"
                            }`}
                            onClick={() => table.setStatus("SHIPMENT")}
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
                        <Button
                            variant={table.queryParams.status === "COMPLETED" ? "default" : "ghost"}
                            size="sm"
                            className={`h-8 rounded-md px-3 text-xs font-bold transition-all ${
                                table.queryParams.status === "COMPLETED"
                                    ? "bg-white text-primary shadow-sm hover:bg-white"
                                    : "text-zinc-600 hover:bg-zinc-200/50"
                            }`}
                            onClick={() => table.setStatus("COMPLETED")}
                        >
                            Completed
                        </Button>
                        <Button
                            variant={table.queryParams.status === "CANCELLED" ? "default" : "ghost"}
                            size="sm"
                            className={`h-8 rounded-md px-3 text-xs font-bold transition-all ${
                                table.queryParams.status === "CANCELLED"
                                    ? "bg-white text-primary shadow-sm hover:bg-white"
                                    : "text-zinc-600 hover:bg-zinc-200/50"
                            }`}
                            onClick={() => table.setStatus("CANCELLED")}
                        >
                            Cancelled
                        </Button>
                    </div>
                </CardHeader>

                {isTableLoading && !data.length ? (
                    <CardContent>
                        <TableSkeleton />
                    </CardContent>
                ) : (
                    <CardContent>
                        <DataTable
                            tableId="do-master-table"
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

            <CreateDODialog open={createOpen} onOpenChange={setCreateOpen} isMobile={isMobile} />

            <DeliveryOrderDetailsDialog
                open={detailId !== null}
                onOpenChange={(o: boolean) => !o && setDetailId(null)}
                id={detailId}
            />
        </div>
    );
}
