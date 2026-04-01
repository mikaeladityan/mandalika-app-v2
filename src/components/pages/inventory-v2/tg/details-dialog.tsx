"use client";

import { useState } from "react";
import {
    useExportTransferGudang,
    useFormTransferGudang,
    useTransferGudang,
    useTGStock,
} from "@/app/(application)/inventory-v2/tg/server/use.tg";
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
    Loader2,
    Warehouse,
    FileDown,
    CheckCircle2,
    Send,
    XCircle,
    AlertTriangle,
    ArrowRightLeft,
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
import { getTGStatusBadge } from "./table/columns";

interface DetailsDialogProps {
    id: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function RowStockDisplay({
    warehouseId,
    productId,
}: {
    warehouseId?: number;
    productId?: number;
}) {
    const { data: stock, isLoading } = useTGStock(warehouseId, productId);
    if (isLoading) return <Loader2 className="h-3 w-3 animate-spin opacity-40" />;
    return <span className="font-mono font-bold">{stock || 0}</span>;
}

export function TransferGudangDetailsDialog({ id, open, onOpenChange }: DetailsDialogProps) {
    const { detail, isLoading } = useTransferGudang(undefined, id ?? undefined);
    const { updateStatus } = useFormTransferGudang();
    const { exportData, isExporting } = useExportTransferGudang();
    
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
                                <div className="bg-amber-100 p-2 rounded-lg">
                                    <ArrowRightLeft className="h-6 w-6 text-amber-600" />
                                </div>
                                {detail?.transfer_number || "Memuat..."}
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground text-sm font-medium pl-12">
                                Detail mutasi stok antar gudang (Transfer Gudang)
                            </DialogDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            {detail?.status && (
                                <div className="scale-110">{getTGStatusBadge(detail.status)}</div>
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
                                    <p className="text-sm font-semibold text-rose-700">
                                        {detail.from_warehouse?.name || "-"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                        <ArrowRightLeft className="h-3 w-3" /> Gudang Tujuan
                                    </p>
                                    <p className="text-sm font-semibold text-emerald-700">
                                        {detail.to_warehouse?.name || "-"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> Tanggal TG
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
                                <h4 className="text-sm font-bold border-l-2 border-amber-500 pl-2 uppercase tracking-wide">
                                    Daftar Barang Transfer
                                </h4>
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead className="w-16">No</TableHead>
                                                <TableHead>Produk</TableHead>
                                                <TableHead className="text-right">Stok Asal</TableHead>
                                                <TableHead className="text-right">Stok Tujuan</TableHead>
                                                <TableHead className="text-right">Request</TableHead>
                                                <TableHead className="text-right">Packed</TableHead>
                                                <TableHead className="text-right">Fulfilled</TableHead>
                                                <TableHead className="text-center">Missing</TableHead>
                                                <TableHead className="text-center">Rejected</TableHead>
                                                <TableHead>Catatan</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="text-xs">
                                            {detail.items?.map((item: any, idx: number) => (
                                                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                                    <TableCell className="text-muted-foreground font-mono text-[10px]">
                                                        {idx + 1}
                                                    </TableCell>
                                                    <TableCell className="py-3">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="font-bold text-amber-600 text-[10px] tracking-tight uppercase">
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
                                                            warehouseId={detail.from_warehouse_id ?? undefined}
                                                            productId={item.product_id}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <RowStockDisplay
                                                            warehouseId={detail.to_warehouse_id ?? undefined}
                                                            productId={item.product_id}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-slate-700">
                                                        {item.quantity_requested}
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-blue-600">
                                                        {item.quantity_packed || item.quantity_requested}
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-emerald-600 bg-emerald-50/30">
                                                        {item.quantity_fulfilled ?? "-"}
                                                    </TableCell>
                                                    <TableCell className={`text-center font-bold ${Number(item.quantity_missing) > 0 ? "text-orange-600 bg-orange-100/50" : "text-slate-300"}`}>
                                                        {item.quantity_missing ?? 0}
                                                    </TableCell>
                                                    <TableCell className={`text-center font-bold ${Number(item.quantity_rejected) > 0 ? "text-red-600 bg-red-100/50" : "text-slate-300"}`}>
                                                        {item.quantity_rejected ?? 0}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground text-[10px] italic leading-tight max-w-[120px] truncate">
                                                        {item.notes || "-"}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 p-6 pt-4 border-t flex justify-between items-center bg-zinc-50/50">
                            <Button
                                variant="outline"
                                onClick={() => exportData({ 
                                    from_warehouse_id: detail.from_warehouse_id!, 
                                    to_warehouse_id: detail.to_warehouse_id!,
                                    search: detail.transfer_number 
                                })}
                                disabled={isExporting}
                                className="bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-bold uppercase text-[11px] tracking-wider"
                            >
                                {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4 text-emerald-600" />}
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

                                {["PENDING", "APPROVED", "SHIPMENT", "RECEIVED"].includes(detail?.status || "") && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => setConfirmCancelOpen(true)}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold uppercase text-[11px] tracking-wider"
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Batalkan TG
                                    </Button>
                                )}


                                {detail.status === "PENDING" && (
                                    <Button
                                        onClick={() => setConfirmApproveOpen(true)}
                                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold uppercase text-[11px] tracking-wider"
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Setujui TG (Approve)
                                    </Button>
                                )}

                                {detail.status === "APPROVED" && (
                                    <Button
                                        onClick={() => setConfirmShipOpen(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-[11px] tracking-wider"
                                    >
                                        <Send className="mr-2 h-4 w-4" />
                                        Kirim Sekarang (Shipment)
                                    </Button>
                                )}

                                {detail.status === "SHIPMENT" && (
                                    <Button
                                        onClick={() => setConfirmReceiveOpen(true)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase text-[11px] tracking-wider"
                                    >
                                        <Truck className="mr-2 h-4 w-4" />
                                        Tandai Diterima (Received)
                                    </Button>
                                )}

                                {detail?.status === "RECEIVED" && (
                                    <Button
                                        onClick={() => {
                                            if (detail?.items) {
                                                setFulfillmentData(detail.items.map((i: any) => ({
                                                    id: i.id,
                                                    product_id: i.product_id,
                                                    name: i.product?.name,
                                                    expected: Number(i.quantity_packed || i.quantity_requested),
                                                    fulfilled: 0,
                                                    missing: 0,
                                                    rejected: 0,
                                                })));
                                                setFulfillmentOpen(true);
                                            }
                                        }}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-[11px] tracking-wider"
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Verifikasi & Selesai
                                    </Button>
                                )}

                            </div>
                        </div>

                        {/* Confirmation Dialogs (Shortened for brevity but logically complete) */}
                        <Dialog open={confirmApproveOpen} onOpenChange={setConfirmApproveOpen}>
                            <DialogContent className="max-w-md">
                                <DialogHeader><DialogTitle>Setujui Transfer Gudang</DialogTitle><DialogDescription>Admin gudang asal akan diberitahu untuk mulai memproses packing barang.</DialogDescription></DialogHeader>
                                <DialogFooter><Button variant="outline" onClick={() => setConfirmApproveOpen(false)}>Batal</Button><Button onClick={() => updateStatus.mutate({ id: detail.id, body: { status: "APPROVED" } }, { onSuccess: () => { setConfirmApproveOpen(false); onOpenChange(false); } })}>Ya, Setujui</Button></DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={confirmShipOpen} onOpenChange={setConfirmShipOpen}>
                            <DialogContent className="max-w-md">
                                <DialogHeader><DialogTitle>Konfirmasi Pengiriman</DialogTitle><DialogDescription>Stok akan dikurangi dari gudang asal setelah status berubah menjadi Shipment.</DialogDescription></DialogHeader>
                                <DialogFooter><Button variant="outline" onClick={() => setConfirmShipOpen(false)}>Batal</Button><Button onClick={() => updateStatus.mutate({ id: detail.id, body: { status: "SHIPMENT" } }, { onSuccess: () => { setConfirmShipOpen(false); onOpenChange(false); } })}>Konfirmasi Kirim</Button></DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={confirmReceiveOpen} onOpenChange={setConfirmReceiveOpen}>
                            <DialogContent className="max-w-md">
                                <DialogHeader><DialogTitle>Konfirmasi Diterima</DialogTitle><DialogDescription>Tandai barang telah sampai di gudang tujuan.</DialogDescription></DialogHeader>
                                <DialogFooter><Button variant="outline" onClick={() => setConfirmReceiveOpen(false)}>Batal</Button><Button onClick={() => updateStatus.mutate({ id: detail.id, body: { status: "RECEIVED" } }, { onSuccess: () => { setConfirmReceiveOpen(false); onOpenChange(false); } })}>Barang Sampai</Button></DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={confirmCancelOpen} onOpenChange={setConfirmCancelOpen}>
                            <DialogContent className="max-w-md">
                                <DialogHeader><DialogTitle className="text-red-500">Batalkan Transfer</DialogTitle><DialogDescription>Apakah Anda yakin? Stok akan dikembalikan jika transfer sudah pada tahap pengiriman.</DialogDescription></DialogHeader>
                                <DialogFooter><Button variant="outline" onClick={() => setConfirmCancelOpen(false)}>Kembali</Button><Button variant="destructive" onClick={() => updateStatus.mutate({ id: detail.id, body: { status: "CANCELLED" } }, { onSuccess: () => { setConfirmCancelOpen(false); onOpenChange(false); } })}>Ya, Batalkan</Button></DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Fulfillment Dialog */}
                        <Dialog open={fulfillmentOpen} onOpenChange={setFulfillmentOpen}>
                            <DialogContent className="max-w-3xl overflow-hidden">
                                <DialogHeader>
                                    <DialogTitle className="text-emerald-600 flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5" /> Verifikasi Penerimaan Barang
                                    </DialogTitle>
                                    <DialogDescription className="flex justify-between">
                                        <span>Sesuaikan jumlah barang fisik yang diterima di gudang tujuan.</span>
                                        <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setFulfillmentData(fulfillmentData.map(i => ({ ...i, fulfilled: i.expected, missing: 0, rejected: 0 })))}>MATCH ALL</Button>
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="max-h-[50vh] overflow-y-auto mb-4 border-y py-2">
                                    <Table>
                                        <TableHeader><TableRow><TableHead>Produk</TableHead><TableHead className="text-center w-16">Pack</TableHead><TableHead className="text-center w-24">Fulfilled</TableHead><TableHead className="text-center w-24">Missing</TableHead><TableHead className="text-center w-24">Rejected</TableHead></TableRow></TableHeader>
                                        <TableBody className="text-xs">
                                            {fulfillmentData.map((item, idx) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-bold">{item.name}</TableCell>
                                                    <TableCell className="text-center">{item.expected}</TableCell>
                                                    <TableCell><input type="number" className="w-full h-8 border rounded text-center" value={item.fulfilled} onChange={(e) => {
                                                        const newVal = [...fulfillmentData];
                                                        newVal[idx].fulfilled = Number(e.target.value);
                                                        setFulfillmentData(newVal);
                                                    }}/></TableCell>
                                                    <TableCell><input type="number" className="w-full h-8 border rounded text-center bg-orange-50" value={item.missing} onChange={(e) => {
                                                        const newVal = [...fulfillmentData];
                                                        const v = Number(e.target.value);
                                                        newVal[idx].missing = v;
                                                        newVal[idx].fulfilled = Math.max(0, item.expected - v - item.rejected);
                                                        setFulfillmentData(newVal);
                                                    }}/></TableCell>
                                                    <TableCell><input type="number" className="w-full h-8 border rounded text-center bg-red-50" value={item.rejected} onChange={(e) => {
                                                        const newVal = [...fulfillmentData];
                                                        const v = Number(e.target.value);
                                                        newVal[idx].rejected = v;
                                                        newVal[idx].fulfilled = Math.max(0, item.expected - item.missing - v);
                                                        setFulfillmentData(newVal);
                                                    }}/></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setFulfillmentOpen(false)}>Batal</Button>
                                    <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => {
                                        for(const i of fulfillmentData) if(i.fulfilled + i.missing + i.rejected !== i.expected) return alert(`Total ${i.name} tidak match!`);
                                        updateStatus.mutate({ id: detail.id, body: { status: "FULFILLMENT", items: fulfillmentData.map(i => ({ id: i.id, quantity_fulfilled: i.fulfilled, quantity_missing: i.missing, quantity_rejected: i.rejected })) } }, { onSuccess: () => { setFulfillmentOpen(false); onOpenChange(false); } });
                                    }}>Selesaikan & Update Stok</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                ) : (
                    <p className="text-center py-20 text-muted-foreground italic">Data tidak ditemukan.</p>
                )}
            </DialogContent>
        </Dialog>
    );
}
