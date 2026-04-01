"use client";

import { useState } from "react";
import {
    useReturnDetail,
    useFormReturn,
} from "@/app/(application)/inventory-v2/return/server/use.return";
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
    Undo2,
    Calendar,
    User,
    Store,
    Loader2,
    Warehouse,
    CheckCircle2,
    Truck,
    XCircle,
    AlertTriangle,
    Package,
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
import { getReturnStatusBadge } from "../table/columns";

interface DetailsDialogProps {
    id: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DetailReturnDialog({ id, open, onOpenChange }: DetailsDialogProps) {
    const { data: detail, isLoading } = useReturnDetail(id ?? 0);
    const { updateStatus } = useFormReturn();
    const [confirmShipOpen, setConfirmShipOpen] = useState(false);
    const [confirmReceiveOpen, setConfirmReceiveOpen] = useState(false);
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

    if (!id) return null;

    const d = detail;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl overflow-hidden border-none shadow-2xl p-0">
                <DialogHeader className="p-6 pb-0 text-left">
                    <div className="flex justify-between items-center pr-8">
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl font-bold flex items-center gap-3 tracking-tight">
                                <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                                    <Undo2 className="h-6 w-6" />
                                </div>
                                {d?.return_number || "MEMUAT..."}
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500 text-sm font-medium">
                                Informasi lengkap rincian Pengembalian Barang (Retur)
                            </DialogDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            {d?.status && (
                                <div className="scale-110">{getReturnStatusBadge(d.status)}</div>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center p-20">
                        <Loader2 className="h-10 w-10 animate-spin text-amber-600/40" />
                    </div>
                ) : d ? (
                    <>
                        <div className="p-6 pt-4 space-y-6 overflow-y-auto max-h-[80vh] scrollbar-thin">
                            {/* Summary Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl border border-zinc-100 bg-zinc-50/50 text-left">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                                        <Store className="h-3 w-3" /> Asal Barang
                                    </p>
                                    <p className="text-sm font-bold text-zinc-800 uppercase line-clamp-1">
                                        {d.from_warehouse?.name || d.from_outlet?.name || "-"}
                                    </p>
                                    <Badge variant="outline" className="text-[9px] font-bold h-4 px-1 border-zinc-200 uppercase bg-white">
                                        {d.from_type}
                                    </Badge>
                                </div>
                                <div className="space-y-1 text-left">
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                                        <Warehouse className="h-3 w-3" /> Tujuan
                                    </p>
                                    <p className="text-sm font-bold text-zinc-800 uppercase line-clamp-1">
                                        {d.to_warehouse?.name || "-"}
                                    </p>
                                </div>
                                <div className="space-y-1 text-left">
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> Tanggal
                                    </p>
                                    <p className="text-sm font-bold text-zinc-800 uppercase">
                                        {format(new Date(d.created_at), "dd MMM yyyy")}
                                    </p>
                                </div>
                                <div className="space-y-1 text-left">
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                                        <User className="h-3 w-3" /> Catatan
                                    </p>
                                    <p className="text-sm font-medium text-zinc-500 italic line-clamp-2">
                                        {d.notes || "-"}
                                    </p>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-zinc-700 flex items-center gap-2 uppercase tracking-wide">
                                    <Package className="h-4 w-4 text-zinc-400" />
                                    Daftar Barang Retur
                                </h4>
                                <div className="border border-zinc-100 rounded-lg overflow-hidden shadow-sm bg-white">
                                    <Table>
                                        <TableHeader className="bg-zinc-50/80 border-b border-zinc-100">
                                            <TableRow>
                                                <TableHead className="w-12 text-center text-[10px] font-bold uppercase">No</TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase">Produk</TableHead>
                                                <TableHead className="text-center text-[10px] font-bold uppercase w-24">Kuantitas</TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase">Alasan Item</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="text-xs">
                                            {d.items?.map((item: any, idx: number) => (
                                                <TableRow key={item.id} className="hover:bg-zinc-50/50 transition-colors border-zinc-50">
                                                    <TableCell className="text-center font-mono text-[10px] text-zinc-400">
                                                        {idx + 1}
                                                    </TableCell>
                                                    <TableCell className="py-3 text-left">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="font-bold text-amber-700 text-[10px] tracking-tight uppercase">
                                                                {item.product?.code || "SKU"}
                                                            </span>
                                                            <span className="text-zinc-900 font-bold text-xs uppercase leading-tight">
                                                                {item.product?.name || "-"}
                                                            </span>
                                                            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter">
                                                                {item.product?.product_type?.name || "-"} • {item.product?.size?.size || "-"}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center font-bold text-zinc-800 bg-zinc-50/30">
                                                        {item.quantity}
                                                    </TableCell>
                                                    <TableCell className="text-zinc-500 text-[10px] italic leading-tight max-w-[200px] truncate text-left">
                                                        {item.notes || "-"}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-4 border-t border-zinc-100">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => onOpenChange(false)}
                                        className="uppercase text-[11px] font-bold tracking-wider border-zinc-200 h-9 px-4"
                                    >
                                        Tutup
                                    </Button>

                                    {(d.status === "DRAFT" || d.status === "SHIPPING") && (
                                        <Button
                                            variant="ghost"
                                            onClick={() => setConfirmCancelOpen(true)}
                                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold uppercase text-[11px] tracking-wider h-9"
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Batalkan Retur
                                        </Button>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {d.status === "DRAFT" && (
                                        <Button
                                            onClick={() => setConfirmShipOpen(true)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-[11px] tracking-wider shadow-lg shadow-blue-200 h-9 px-6 transition-all active:scale-95"
                                        >
                                            <Truck className="mr-2 h-4 w-4" />
                                            Kirim Barang (SHIPPING)
                                        </Button>
                                    )}

                                    {d.status === "SHIPPING" && (
                                        <Button
                                            onClick={() => setConfirmReceiveOpen(true)}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-[11px] tracking-wider shadow-lg shadow-emerald-200 h-9 px-6 transition-all active:scale-95"
                                        >
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Terima Barang (RECEIVED)
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Confirmation Dialogs */}
                        <Dialog open={confirmShipOpen} onOpenChange={setConfirmShipOpen}>
                            <DialogContent className="max-w-md p-6">
                                <DialogHeader className="gap-2">
                                    <DialogTitle className="text-xl font-bold flex items-center gap-2 text-blue-600 text-left">
                                        <Truck className="h-5 w-5" />
                                        Konfirmasi Pengiriman
                                    </DialogTitle>
                                    <DialogDescription className="text-sm font-medium leading-relaxed mt-2 text-zinc-600 text-left">
                                        Status akan diubah ke <b>SHIPPING</b>. Stok di <b>lokasi asal</b> akan dikurangi secara otomatis untuk dipindahkan ke status transit (Return).
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-8 flex gap-3">
                                    <Button variant="outline" className="flex-1 uppercase text-[11px] font-bold" onClick={() => setConfirmShipOpen(false)}>Batal</Button>
                                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-[11px]" 
                                        onClick={() => {
                                            updateStatus.mutate({ id: d.id, payload: { status: "SHIPPING" } }, {
                                                onSuccess: () => { setConfirmShipOpen(false); onOpenChange(false); }
                                            });
                                        }}
                                        disabled={updateStatus.isPending}
                                    >
                                        {updateStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "SIAP KIRIM"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={confirmReceiveOpen} onOpenChange={setConfirmReceiveOpen}>
                            <DialogContent className="max-w-md p-6">
                                <DialogHeader className="gap-2 text-left">
                                    <DialogTitle className="text-xl font-bold flex items-center gap-2 text-emerald-600">
                                        <CheckCircle2 className="h-5 w-5" />
                                        Konfirmasi Penerimaan
                                    </DialogTitle>
                                    <DialogDescription className="text-sm font-medium leading-relaxed mt-2 text-zinc-600">
                                        Barang telah sampai di <b>Gudang Pusat</b>. Stok akan bertambah secara otomatis dan status dokumen menjadi <b>COMPLETED</b>.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-8 flex gap-3">
                                    <Button variant="outline" className="flex-1 uppercase text-[11px] font-bold" onClick={() => setConfirmReceiveOpen(false)}>Batal</Button>
                                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-[11px]" 
                                        onClick={() => {
                                            updateStatus.mutate({ id: d.id, payload: { status: "RECEIVED" } }, {
                                                onSuccess: () => { setConfirmReceiveOpen(false); onOpenChange(false); }
                                            });
                                        }}
                                        disabled={updateStatus.isPending}
                                    >
                                        {updateStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "TERIMA BARANG"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={confirmCancelOpen} onOpenChange={setConfirmCancelOpen}>
                            <DialogContent className="max-w-md p-6 text-left">
                                <DialogHeader className="gap-2">
                                    <DialogTitle className="text-xl font-bold flex items-center gap-2 text-rose-600">
                                        <AlertTriangle className="h-5 w-5" />
                                        Batalkan Retur
                                    </DialogTitle>
                                    <DialogDescription className="text-sm font-medium leading-relaxed mt-2 text-zinc-600">
                                        Apakah Anda yakin ingin membatalkan pengembalian barang ini? Stok akan dikembalikan ke asal jika status sebelumnya sudah <b>SHIPPING</b>.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-8 flex gap-3">
                                    <Button variant="outline" className="flex-1 uppercase text-[11px] font-bold" onClick={() => setConfirmCancelOpen(false)}>Kembali</Button>
                                    <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase text-[11px]" 
                                        onClick={() => {
                                            updateStatus.mutate({ id: d.id, payload: { status: "CANCELLED" } }, {
                                                onSuccess: () => { setConfirmCancelOpen(false); onOpenChange(false); }
                                            });
                                        }}
                                        disabled={updateStatus.isPending}
                                    >
                                        {updateStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "BATALKAN SEKARANG"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                ) : (
                    <p className="text-center py-20 text-zinc-400 italic font-medium">Data tidak ditemukan.</p>
                )}
            </DialogContent>
        </Dialog>
    );
}
