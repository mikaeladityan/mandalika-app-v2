"use client";

import { useState } from "react";
import {
    useExportDODetail,
    useFormDeliveryOrder,
    useDeliveryOrder,
    useDOStock,
} from "@/app/(application)/inventory-v2/do/server/use.do";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
    Truck,
    Calendar,
    User,
    Store,
    Loader2,
    Warehouse,
    FileDown,
    CheckCircle2,
    Send,
    XCircle,
    AlertTriangle,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getDOStatusBadge } from "./table/columns";

interface DetailsDialogProps {
    id: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function RowStockDisplay({
    warehouseId,
    outletId,
    productId,
}: {
    warehouseId?: number;
    outletId?: number;
    productId?: number;
}) {
    const { data: stock, isLoading } = useDOStock(warehouseId, productId, outletId);
    if (isLoading) return <Loader2 className="h-3 w-3 animate-spin opacity-40" />;
    return <span className="font-mono font-bold">{stock || 0}</span>;
}

export function DeliveryOrderDetailsDialog({ id, open, onOpenChange }: DetailsDialogProps) {
    const { detail, isLoading } = useDeliveryOrder(undefined, id ?? undefined);
    const { updateStatus } = useFormDeliveryOrder();
    const { exportDetailData, isExportingDetail } = useExportDODetail();
    const [confirmApproveOpen, setConfirmApproveOpen] = useState(false);
    const [confirmShipOpen, setConfirmShipOpen] = useState(false);
    const [confirmReceiveOpen, setConfirmReceiveOpen] = useState(false);
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
    const [fulfillmentOpen, setFulfillmentOpen] = useState(false);
    const [fulfillmentData, setFulfillmentData] = useState<any[]>([]);

    if (!id) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-6 pb-0">
                    <div className="flex justify-between items-center pr-12">
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl font-bold flex items-center gap-2 tracking-tight">
                                <div className="bg-primary/10 p-2 rounded-lg">
                                    <Truck className="h-6 w-6 text-primary" />
                                </div>
                                {detail?.transfer_number || "Memuat..."}
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground text-sm font-medium pl-12">
                                Informasi lengkap rincian Delivery Order
                            </DialogDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            {detail?.status && (
                                <div className="scale-110">{getDOStatusBadge(detail.status)}</div>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center p-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                    </div>
                ) : detail ? (
                    <>
                        <div className="p-6 pt-2 space-y-6 overflow-y-auto max-h-[82vh] scrollbar-thin">
                            {/* Summary Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border border-muted/50 bg-muted/5">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                        <Warehouse className="h-3 w-3" /> Gudang Asal
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {detail.from_warehouse?.name || "-"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                        <Store className="h-3 w-3" /> Tujuan
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {detail.to_outlet?.name || "-"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> Tanggal DO
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {(() => {
                                            const d = detail.date || detail.created_at;
                                            return d ? format(new Date(d), "dd MMM yyyy") : "-";
                                        })()}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                        <User className="h-3 w-3" /> Notes
                                    </p>
                                    <p className="text-sm font-medium text-slate-600 italic">
                                        {detail.notes || "-"}
                                    </p>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold border-l-2 border-primary pl-2 uppercase tracking-wide">
                                    Rincian Barang Kirim
                                </h4>
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead className="w-16">No</TableHead>
                                                <TableHead>Produk</TableHead>
                                                <TableHead className="text-right">
                                                    Stok Asal
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Stok Tujuan
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Permintaan
                                                </TableHead>
                                                <TableHead className="text-right">Packed</TableHead>
                                                <TableHead className="text-right">
                                                    Fulfilled
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    Missing
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    Rejected
                                                </TableHead>
                                                <TableHead>Catatan</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="text-xs">
                                            {detail.items?.map((item, idx) => (
                                                <TableRow
                                                    key={item.id}
                                                    className="hover:bg-muted/30 transition-colors"
                                                >
                                                    <TableCell className="text-muted-foreground font-mono text-[10px]">
                                                        {idx + 1}
                                                    </TableCell>
                                                    <TableCell className="py-3">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="font-bold text-primary text-[10px] tracking-tight uppercase">
                                                                {item.product?.code || "SKU"}
                                                            </span>
                                                            <div className="flex flex-col">
                                                                <span className="text-slate-900 font-bold text-xs uppercase leading-tight">
                                                                    {item.product?.name || "-"}
                                                                </span>
                                                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                                                                    {item.product?.product_type?.name || "-"} •{" "}
                                                                    {item.product?.size?.size || "-"} •{" "}
                                                                    {item.product?.unit?.name || "-"} •{" "}
                                                                    {item.product?.gender || "-"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <RowStockDisplay
                                                            warehouseId={
                                                                detail.from_warehouse_id ??
                                                                undefined
                                                            }
                                                            productId={item.product_id}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <RowStockDisplay
                                                            outletId={
                                                                detail.to_outlet_id ?? undefined
                                                            }
                                                            productId={item.product_id}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-slate-700">
                                                        {item.quantity_requested}
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-emerald-600">
                                                        {item.quantity_packed ||
                                                            item.quantity_requested}
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-blue-600 bg-blue-50/30">
                                                        {item.quantity_fulfilled ?? "-"}
                                                    </TableCell>
                                                    <TableCell
                                                        className={`text-center font-bold ${Number(item.quantity_missing) > 0 ? "text-amber-600 bg-amber-100/50" : "text-slate-300"}`}
                                                    >
                                                        {item.quantity_missing ?? 0}
                                                    </TableCell>
                                                    <TableCell
                                                        className={`text-center font-bold ${Number(item.quantity_rejected) > 0 ? "text-red-600 bg-red-100/50" : "text-slate-300"}`}
                                                    >
                                                        {item.quantity_rejected ?? 0}
                                                    </TableCell>
                                                    <TableCell
                                                        className="text-muted-foreground text-[10px] italic leading-tight max-w-[120px] truncate"
                                                        title={item.notes || ""}
                                                    >
                                                        {item.notes || "-"}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {(!detail.items || detail.items.length === 0) && (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={5}
                                                        className="text-center italic text-muted-foreground py-4"
                                                    >
                                                        Item kosong
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t flex justify-between items-center">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    exportDetailData({
                                        id: detail.id,
                                        transferNumber: detail.transfer_number,
                                    })
                                }
                                disabled={isExportingDetail}
                                className="bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-bold uppercase text-[11px] tracking-wider"
                            >
                                {isExportingDetail ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
                                ) : (
                                    <FileDown className="mr-2 h-4 w-4 text-emerald-600" />
                                )}
                                Export XLSX
                            </Button>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    className="uppercase text-[11px] font-bold tracking-wider"
                                >
                                    Tutup
                                </Button>

                                {["PENDING", "APPROVED", "SHIPMENT", "RECEIVED"].includes(
                                    detail.status,
                                ) && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => setConfirmCancelOpen(true)}
                                        disabled={updateStatus.isPending}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold uppercase text-[11px] tracking-wider"
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Batalkan DO
                                    </Button>
                                )}

                                {detail.status === "PENDING" && (
                                    <Button
                                        onClick={() => setConfirmApproveOpen(true)}
                                        disabled={updateStatus.isPending}
                                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold uppercase text-[11px] tracking-wider"
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Setujui DO (Approve)
                                    </Button>
                                )}

                                {detail.status === "APPROVED" && (
                                    <Button
                                        onClick={() => setConfirmShipOpen(true)}
                                        disabled={updateStatus.isPending}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-[11px] tracking-wider"
                                    >
                                        <Send className="mr-2 h-4 w-4" />
                                        Kirim Sekarang (Shipment)
                                    </Button>
                                )}

                                {detail.status === "SHIPMENT" && (
                                    <Button
                                        onClick={() => setConfirmReceiveOpen(true)}
                                        disabled={updateStatus.isPending}
                                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase text-[11px] tracking-wider"
                                    >
                                        <Truck className="mr-2 h-4 w-4" />
                                        Tandai Diterima (Received)
                                    </Button>
                                )}

                                {detail.status === "RECEIVED" && (
                                    <Button
                                        onClick={() => {
                                            if (detail?.items) {
                                                setFulfillmentData(
                                                    detail.items.map((i: any) => ({
                                                        id: i.id,
                                                        product_id: i.product_id,
                                                        name: i.product?.name,
                                                        expected: Number(
                                                            i.quantity_packed ||
                                                                i.quantity_requested,
                                                        ),
                                                        fulfilled: 0,
                                                        missing: 0,
                                                        rejected: 0,
                                                    })),
                                                );
                                                setFulfillmentOpen(true);
                                            }
                                        }}
                                        disabled={updateStatus.isPending}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-[11px] tracking-wider"
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Verifikasi & Selesai (Fulfillment)
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Cancel Confirmation */}
                        <Dialog open={confirmCancelOpen} onOpenChange={setConfirmCancelOpen}>
                            <DialogContent className="max-w-md p-6">
                                <DialogHeader className="gap-2">
                                    <DialogTitle className="text-xl font-bold flex items-center gap-2 text-red-600">
                                        <AlertTriangle className="h-5 w-5" />
                                        Batalkan Delivery Order
                                    </DialogTitle>
                                    <DialogDescription className="text-sm font-medium leading-relaxed mt-2 text-zinc-600">
                                        Apakah Anda yakin ingin membatalkan DO ini?
                                        {detail.status === "SHIPMENT" && (
                                            <>
                                                <br />
                                                <span className="text-red-500 font-bold">
                                                    PENTING: Karena status sudah dikirim (SHIPMENT),
                                                    stok akan dikembalikan secara otomatis ke Gudang
                                                    Asal.
                                                </span>
                                            </>
                                        )}
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-8 flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 uppercase text-[11px] font-bold tracking-wider"
                                        onClick={() => setConfirmCancelOpen(false)}
                                    >
                                        Tidak, Kembali
                                    </Button>
                                    <Button
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-[11px] tracking-wider"
                                        onClick={() => {
                                            updateStatus.mutate(
                                                {
                                                    id: detail.id,
                                                    body: { status: "CANCELLED" },
                                                },
                                                {
                                                    onSuccess: () => {
                                                        setConfirmCancelOpen(false);
                                                        onOpenChange(false);
                                                    },
                                                },
                                            );
                                        }}
                                        disabled={updateStatus.isPending}
                                    >
                                        {updateStatus.isPending ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            "Ya, Batalkan DO"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Shipment Confirmation */}
                        <Dialog open={confirmShipOpen} onOpenChange={setConfirmShipOpen}>
                            <DialogContent className="max-w-md p-6">
                                <DialogHeader className="gap-2">
                                    <DialogTitle className="text-xl font-bold flex items-center gap-2 text-blue-600">
                                        <Send className="h-5 w-5" />
                                        Konfirmasi Pengiriman
                                    </DialogTitle>
                                    <DialogDescription className="text-sm font-medium leading-relaxed mt-2 text-zinc-600">
                                        Mengubah status ke SHIPMENT akan{" "}
                                        <b>mengurangi stok Gudang Asal</b> secara instan. Pastikan
                                        barang sudah dimasukkan ke kurir armada.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-8 flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 uppercase text-[11px] font-bold tracking-wider"
                                        onClick={() => setConfirmShipOpen(false)}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-[11px] tracking-wider"
                                        onClick={() => {
                                            updateStatus.mutate(
                                                {
                                                    id: detail.id,
                                                    body: { status: "SHIPMENT" },
                                                },
                                                {
                                                    onSuccess: () => {
                                                        setConfirmShipOpen(false);
                                                        onOpenChange(false);
                                                    },
                                                },
                                            );
                                        }}
                                        disabled={updateStatus.isPending}
                                    >
                                        {updateStatus.isPending ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            "Konfirmasi Kirim"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Receive Confirmation */}
                        <Dialog open={confirmReceiveOpen} onOpenChange={setConfirmReceiveOpen}>
                            <DialogContent className="max-w-md p-6">
                                <DialogHeader className="gap-2">
                                    <DialogTitle className="text-xl font-bold flex items-center gap-2 text-purple-600">
                                        <Truck className="h-5 w-5" />
                                        Konfirmasi Penerimaan
                                    </DialogTitle>
                                    <DialogDescription className="text-sm font-medium leading-relaxed mt-2 text-zinc-600">
                                        Tandai DO ini sebagai Diterima oleh Outlet. Tahap
                                        selanjutnya adalah Verifikasi Barang (Fulfillment) untuk
                                        menyesuaikan stok fisik.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-8 flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 uppercase text-[11px] font-bold tracking-wider"
                                        onClick={() => setConfirmReceiveOpen(false)}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase text-[11px] tracking-wider"
                                        onClick={() => {
                                            updateStatus.mutate(
                                                {
                                                    id: detail.id,
                                                    body: { status: "RECEIVED" },
                                                },
                                                {
                                                    onSuccess: () => {
                                                        setConfirmReceiveOpen(false);
                                                        onOpenChange(false);
                                                    },
                                                },
                                            );
                                        }}
                                        disabled={updateStatus.isPending}
                                    >
                                        {updateStatus.isPending ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            "Barang Sampai (RECEIVED)"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Approve Confirmation */}
                        <Dialog open={confirmApproveOpen} onOpenChange={setConfirmApproveOpen}>
                            <DialogContent className="max-w-md p-6">
                                <DialogHeader className="gap-2">
                                    <DialogTitle className="text-xl font-bold flex items-center gap-2 text-amber-600">
                                        <CheckCircle2 className="h-5 w-5" />
                                        Setujui Delivery Order
                                    </DialogTitle>
                                    <DialogDescription className="text-sm font-medium leading-relaxed mt-2 text-zinc-600">
                                        Apakah Anda yakin ingin menyetujui permintaan ini? Setelah
                                        disetujui, admin gudang dapat melanjutkan ke tahap
                                        pengiriman.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-8 flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 uppercase text-[11px] font-bold tracking-wider"
                                        onClick={() => setConfirmApproveOpen(false)}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold uppercase text-[11px] tracking-wider"
                                        onClick={() => {
                                            updateStatus.mutate(
                                                { id: detail.id, body: { status: "APPROVED" } },
                                                {
                                                    onSuccess: () => {
                                                        setConfirmApproveOpen(false);
                                                        onOpenChange(false);
                                                    },
                                                },
                                            );
                                        }}
                                        disabled={updateStatus.isPending}
                                    >
                                        {updateStatus.isPending ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            "Ya, Setujui DO"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Fulfillment Modal */}
                        <Dialog open={fulfillmentOpen} onOpenChange={setFulfillmentOpen}>
                            <DialogContent className="max-w-3xl p-6">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold flex items-center gap-2 text-emerald-600">
                                        <Store className="h-5 w-5" />
                                        Verifikasi Penerimaan (Fulfillment)
                                    </DialogTitle>
                                    <DialogDescription className="flex justify-between items-center">
                                        <span>
                                            Masukkan jumlah barang yang benar-benar masuk ke stok
                                            outlet. Laporkan jika ada selisih (Missing/Rejected).
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 text-[10px] font-bold border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                            onClick={() => {
                                                setFulfillmentData((prev) =>
                                                    prev.map((item) => ({
                                                        ...item,
                                                        fulfilled: item.expected,
                                                        missing: 0,
                                                        rejected: 0,
                                                    })),
                                                );
                                            }}
                                        >
                                            SETUJUI SEMUA (MATCH ALL)
                                        </Button>
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="max-h-[50vh] overflow-auto py-4 border-y my-4">
                                    <Table>
                                        <TableHeader className="bg-muted/50 sticky top-0">
                                            <TableRow>
                                                <TableHead className="text-[10px] uppercase font-bold">
                                                    Produk
                                                </TableHead>
                                                <TableHead className="text-center text-[10px] uppercase font-bold w-16">
                                                    Pack
                                                </TableHead>
                                                <TableHead className="text-center text-[10px] uppercase font-bold w-24">
                                                    Fulfilled
                                                </TableHead>
                                                <TableHead className="text-center text-[10px] uppercase font-bold w-24">
                                                    Missing
                                                </TableHead>
                                                <TableHead className="text-center text-[10px] uppercase font-bold w-24">
                                                    Rejected
                                                </TableHead>
                                                <TableHead className="text-center text-[10px] uppercase font-bold w-16">
                                                    Status
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="text-xs">
                                            {fulfillmentData.map((item, idx) => (
                                                <TableRow key={item.id}>
                                                    <TableCell
                                                        className="font-medium text-xs truncate max-w-[150px]"
                                                        title={item.name}
                                                    >
                                                        {item.name}
                                                    </TableCell>
                                                    <TableCell className="text-center font-bold text-zinc-500">
                                                        {item.expected}
                                                    </TableCell>
                                                    <TableCell>
                                                        <input
                                                            type="number"
                                                            className="w-full h-8 px-2 border rounded-md text-center focus:ring-1 focus:ring-emerald-500 outline-none"
                                                            value={item.fulfilled}
                                                            onChange={(e) => {
                                                                const val = Math.max(
                                                                    0,
                                                                    Number(e.target.value),
                                                                );
                                                                const newData = [
                                                                    ...fulfillmentData,
                                                                ];
                                                                newData[idx].fulfilled = val;
                                                                setFulfillmentData(newData);
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <input
                                                            type="number"
                                                            className="w-full h-8 px-2 border rounded-md text-center focus:ring-1 focus:ring-amber-500 outline-none bg-amber-50/30"
                                                            value={item.missing}
                                                            onChange={(e) => {
                                                                const val = Math.max(
                                                                    0,
                                                                    Number(e.target.value),
                                                                );
                                                                const newData = [
                                                                    ...fulfillmentData,
                                                                ];
                                                                newData[idx].missing = val;
                                                                // Auto adjust fulfilled
                                                                newData[idx].fulfilled = Math.max(
                                                                    0,
                                                                    item.expected -
                                                                        val -
                                                                        item.rejected,
                                                                );
                                                                setFulfillmentData(newData);
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <input
                                                            type="number"
                                                            className="w-full h-8 px-2 border rounded-md text-center focus:ring-1 focus:ring-red-500 outline-none bg-red-50/30"
                                                            value={item.rejected}
                                                            onChange={(e) => {
                                                                const val = Math.max(
                                                                    0,
                                                                    Number(e.target.value),
                                                                );
                                                                const newData = [
                                                                    ...fulfillmentData,
                                                                ];
                                                                newData[idx].rejected = val;
                                                                // Auto adjust fulfilled
                                                                newData[idx].fulfilled = Math.max(
                                                                    0,
                                                                    item.expected -
                                                                        item.missing -
                                                                        val,
                                                                );
                                                                setFulfillmentData(newData);
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {item.fulfilled +
                                                            item.missing +
                                                            item.rejected ===
                                                        item.expected ? (
                                                            <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" />
                                                        ) : (
                                                            <XCircle className="h-4 w-4 text-red-400 mx-auto" />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                <DialogFooter className="gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 uppercase text-[11px] font-bold tracking-wider"
                                        onClick={() => setFulfillmentOpen(false)}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-[11px] tracking-wider"
                                        disabled={updateStatus.isPending}
                                        onClick={() => {
                                            // Validation: Total must match
                                            for (const i of fulfillmentData) {
                                                if (
                                                    i.fulfilled + i.missing + i.rejected !==
                                                    i.expected
                                                ) {
                                                    alert(
                                                        `Total untuk ${i.name} (${i.fulfilled + i.missing + i.rejected}) harus sama dengan Pack (${i.expected})`,
                                                    );
                                                    return;
                                                }
                                            }

                                            updateStatus.mutate(
                                                {
                                                    id: detail.id,
                                                    body: {
                                                        status: "FULFILLMENT",
                                                        items: fulfillmentData.map((i) => ({
                                                            id: i.id,
                                                            quantity_fulfilled: i.fulfilled,
                                                            quantity_missing: i.missing,
                                                            quantity_rejected: i.rejected,
                                                        })),
                                                    },
                                                },
                                                {
                                                    onSuccess: () => {
                                                        setFulfillmentOpen(false);
                                                        onOpenChange(false);
                                                    },
                                                },
                                            );
                                        }}
                                    >
                                        {updateStatus.isPending ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            "Selesaikan & Update Stok"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                ) : (
                    <p className="text-center py-8 text-muted-foreground italic">
                        Data tidak ditemukan.
                    </p>
                )}
            </DialogContent>
        </Dialog>
    );
}
