"use client";

import { useMemo, useState } from "react";
import {
    Package,
    Plus,
    Search,
    Loader2,
    Warehouse,
    Filter,
    RefreshCcw,
    XCircle,
    FileSpreadsheet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SelectFilter } from "@/components/ui/form/select";
import { DataTable } from "@/components/ui/table/data";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { useWarehouses } from "@/app/(application)/shared/use.shared";
import {
    useGoodsReceipt,
    useFormGoodsReceipt,
    useGRTableState,
    useExportGoodsReceipt,
} from "@/app/(application)/inventory-v2/gr/server/use.gr";
import { GRColumns } from "./table/columns";
import { CreateGRDialog } from "./form/create-gr-dialog";
import { GoodsReceiptDetailsDialog } from "./details-dialog";
import { useIsMobile } from "@/hooks/use-mobile";

export function GoodsReceipt() {
    const isMobile = useIsMobile();
    const table = useGRTableState();
    const [createOpen, setCreateOpen] = useState(false);
    const [detailId, setDetailId] = useState<number | null>(null);
    const [confirmPostId, setConfirmPostId] = useState<number | null>(null);
    const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);

    const { data, meta, isLoading, isFetching, refetch } = useGoodsReceipt(table.queryParams);
    const { data: warehouses, isLoading: whLoading } = useWarehouses();
    const { post, cancel } = useFormGoodsReceipt();
    const { exportData, isExporting } = useExportGoodsReceipt();

    const columns = useMemo(
        () =>
            GRColumns({
                onDetail: (id) => setDetailId(id),
                onPost: (id) => setConfirmPostId(id),
                onCancel: (id) => setConfirmCancelId(id),
            }),
        [post],
    );

    const isTableLoading = isLoading || isFetching || post.isPending;

    return (
        <div className="flex flex-col gap-5">
            <Card>
                <CardHeader className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight">
                                Goods Receipt (GR)
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Pencatatan barang masuk (FG) ke Warehouse dari Produksi/Supplier.
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
                                GR Baru
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                        <InputGroup className="w-full md:max-w-md">
                            <InputGroupInput
                                placeholder="Cari nomor GR..."
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

                        <div className="flex gap-2 items-center">
                            <SelectFilter
                                size="sm"
                                placeholder="Pilih Gudang"
                                value={table.queryParams.warehouse_id ?? null}
                                options={
                                    warehouses?.map((w: any) => ({
                                        value: w.id,
                                        label: w.name,
                                    })) ?? []
                                }
                                onChange={(val) => table.setWarehouse(Number(val))}
                                onReset={() => table.setWarehouse(undefined)}
                                isLoading={whLoading}
                                canSearching={true}
                                className="w-full md:w-56"
                            />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Filter className="h-4 w-4" />
                                        {table.queryParams.status || "Semua Status"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => table.setStatus(undefined)}>
                                        Semua Status
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => table.setStatus("PENDING")}>
                                        Pending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => table.setStatus("COMPLETED")}>
                                        Completed
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => table.setStatus("CANCELLED")}>
                                        Cancelled
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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
                            tableId="gr-master-table"
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

            {/* Dialogs */}
            <CreateGRDialog open={createOpen} onOpenChange={setCreateOpen} isMobile={isMobile} />

            <GoodsReceiptDetailsDialog
                open={detailId !== null}
                onOpenChange={(o: boolean) => !o && setDetailId(null)}
                id={detailId}
            />

            <Dialog
                open={confirmPostId !== null}
                onOpenChange={(o) => !o && setConfirmPostId(null)}
            >
                <DialogContent className="max-w-md p-6">
                    <DialogHeader className="gap-2">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                                <Package className="h-5 w-5" />
                            </span>
                            Konfirmasi Posting
                        </DialogTitle>
                        <DialogDescription className="text-sm font-medium leading-relaxed mt-2 text-zinc-600">
                            Posting Goods Receipt ini akan langsung <b>menambah stok</b> di gudang
                            terpilih. Tindakan ini bersifat final dan tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-8 flex flex-col-reverse sm:flex-row gap-3">
                        <Button
                            variant="outline"
                            className="bg-zinc-50 border-zinc-200 hover:bg-zinc-100 font-semibold flex-1"
                            onClick={() => setConfirmPostId(null)}
                        >
                            Batal
                        </Button>
                        <Button
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold flex-1"
                            onClick={() => {
                                if (confirmPostId) {
                                    post.mutate(confirmPostId);
                                }
                                setConfirmPostId(null);
                            }}
                            disabled={post.isPending}
                        >
                            {post.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Ya, Post Sekarang
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={confirmCancelId !== null}
                onOpenChange={(o) => !o && setConfirmCancelId(null)}
            >
                <DialogContent className="max-w-md p-6 border-red-100">
                    <DialogHeader className="gap-2">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-red-600">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                                <XCircle className="h-5 w-5" />
                            </span>
                            Batalkan Goods Receipt
                        </DialogTitle>
                        <DialogDescription className="text-sm font-medium leading-relaxed mt-2 text-zinc-600">
                            Apakah Anda yakin ingin membatalkan Goods Receipt ini? Tindakan ini akan
                            membatalkannya <b>tanpa menambah stok</b> dan bersifat final.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-8 flex flex-col-reverse sm:flex-row gap-3">
                        <Button
                            variant="outline"
                            className="bg-zinc-50 border-zinc-200 hover:bg-zinc-100 font-semibold flex-1"
                            onClick={() => setConfirmCancelId(null)}
                        >
                            Tutup
                        </Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white font-bold flex-1"
                            onClick={() => {
                                if (confirmCancelId) {
                                    cancel.mutate(confirmCancelId);
                                }
                                setConfirmCancelId(null);
                            }}
                            disabled={cancel.isPending}
                        >
                            {cancel.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Ya, Batalkan Sekarang
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
