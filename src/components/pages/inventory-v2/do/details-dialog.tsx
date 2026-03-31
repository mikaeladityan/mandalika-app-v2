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

function RowStockDisplay({ warehouseId, outletId, productId }: { warehouseId?: number; outletId?: number; productId?: number }) {
    const { data: stock, isLoading } = useDOStock(warehouseId, productId, outletId);
    if (isLoading) return <Loader2 className="h-3 w-3 animate-spin opacity-40" />;
    return <span className="font-mono font-bold">{stock || 0}</span>;
}

export function DeliveryOrderDetailsDialog({ id, open, onOpenChange }: DetailsDialogProps) {
    const { detail, isLoading } = useDeliveryOrder(undefined, id ?? undefined);
    const { updateStatus } = useFormDeliveryOrder();
    const { exportDetailData, isExportingDetail } = useExportDODetail();
    const [confirmShipOpen, setConfirmShipOpen] = useState(false);
    const [confirmReceiveOpen, setConfirmReceiveOpen] = useState(false);
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

    if (!id) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-6">
                <DialogHeader className="mb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                {detail?.transfer_number || "Memuat..."}
                            </DialogTitle>
                            <p className="text-muted-foreground text-sm mt-1 font-mono tracking-tight">
                                Informasi Delivery Order (DO)
                            </p>
                        </div>
                        <div className="pr-8">
                            {detail?.status && getDOStatusBadge(detail.status)}
                        </div>
                    </div>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted" />
                    </div>
                ) : detail ? (
                    <>
                        <div className="space-y-6">
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
                                                <TableHead>SKU / Produk</TableHead>
                                                <TableHead className="text-right">Stok Asal</TableHead>
                                                <TableHead className="text-right">Stok Tujuan</TableHead>
                                                <TableHead className="text-right">
                                                    Permintaan
                                                </TableHead>
                                                <TableHead className="text-right">Packed</TableHead>
                                                <TableHead>Catatan</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {detail.items?.map((item, idx) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="text-muted-foreground font-mono text-xs">
                                                        {idx + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-slate-600 text-xs">
                                                                {item.product?.code || "SKU"}
                                                            </span>
                                                            <span className="text-slate-800 font-medium">
                                                                {item.product?.name ||
                                                                    "Product Name"}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <RowStockDisplay 
                                                            warehouseId={detail.from_warehouse_id ?? undefined} 
                                                            productId={item.product_id} 
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <RowStockDisplay 
                                                            outletId={detail.to_outlet_id ?? undefined} 
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
                                                    <TableCell className="text-muted-foreground text-xs italic">
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

                                {(detail.status === "PENDING" || detail.status === "SHIPMENT") && (
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
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-[11px] tracking-wider"
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Tandai Diterima (Received)
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
                                                    PENTING: Karena status sudah dikirim (SHIPMENT), stok akan dikembalikan secara otomatis ke Gudang Asal.
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
                                    <DialogTitle className="text-xl font-bold flex items-center gap-2 text-emerald-600">
                                        <CheckCircle2 className="h-5 w-5" />
                                        Konfirmasi Penerimaan
                                    </DialogTitle>
                                    <DialogDescription className="text-sm font-medium leading-relaxed mt-2 text-zinc-600">
                                        Tandai DO ini sebagai Diterima. Stok tidak akan masuk ke
                                        inventori sebelum tahapan Fulfillment dilakukan secara
                                        berkala.
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
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-[11px] tracking-wider"
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
                                            "Barang Diterima"
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
