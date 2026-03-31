"use client";

import { useState } from "react";

import {
    useExportGRDetail,
    useFormGoodsReceipt,
    useGoodsReceipt,
} from "@/app/(application)/inventory-v2/gr/server/use.gr";
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
    Package,
    Calendar,
    User,
    FileText,
    Loader2,
    Warehouse,
    XCircle,
    FileDown,
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

interface DetailsDialogProps {
    id: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function GoodsReceiptDetailsDialog({ id, open, onOpenChange }: DetailsDialogProps) {
    const { detail, isLoading } = useGoodsReceipt(undefined, id ?? undefined);
    const { post, cancel } = useFormGoodsReceipt();
    const { exportDetailData, isExportingDetail } = useExportGRDetail();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

    if (!id) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl p-6">
                <DialogHeader className="mb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                {detail?.gr_number || "Memuat..."}
                            </DialogTitle>
                            <p className="text-muted-foreground text-sm mt-1 font-mono tracking-tight">
                                Informasi Dokumen GR
                            </p>
                        </div>
                        <div className="pr-8">
                            <Badge
                                variant={detail?.status === "COMPLETED" ? "default" : "secondary"}
                                className="px-3 py-1 uppercase text-[10px] font-bold"
                            >
                                {detail?.status}
                            </Badge>
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
                                        <Warehouse className="h-3 w-3" /> Gudang
                                    </p>
                                    <p className="text-sm font-semibold">{detail.warehouse.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> Tanggal
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {(() => {
                                            const d = detail.date || detail.created_at;
                                            try {
                                                return d ? format(new Date(d), "dd MMM yyyy") : "-";
                                            } catch (e) {
                                                return format(
                                                    new Date(detail.created_at),
                                                    "dd MMM yyyy",
                                                );
                                            }
                                        })()}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                        <FileText className="h-3 w-3" /> Tipe
                                    </p>
                                    <p className="text-sm font-semibold capitalize text-slate-700">
                                        {detail.type.toLowerCase().replace("_", " ")}
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
                                    Rincian Item
                                </h4>
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead className="w-16">No</TableHead>
                                                <TableHead>SKU / Produk</TableHead>
                                                <TableHead className="text-right">
                                                    Kuantitas
                                                </TableHead>
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
                                                                {item.product.code}
                                                            </span>
                                                            <span className="text-slate-800 font-medium">
                                                                {item.product.name}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-slate-700">
                                                        {item.quantity_actual}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground text-xs italic">
                                                        {item.notes || "-"}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    exportDetailData({
                                        id: detail.id,
                                        grNumber: detail.gr_number,
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

                            {detail.status === "PENDING" && (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => setConfirmCancelOpen(true)}
                                        className="uppercase text-[11px] font-bold tracking-wider text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                        Batalkan
                                    </Button>
                                    <Button
                                        onClick={() => setConfirmOpen(true)}
                                        disabled={post.isPending}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase text-[11px] tracking-wider"
                                    >
                                        {post.isPending && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Posting Sekarang
                                    </Button>
                                </>
                            )}
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="uppercase text-[11px] font-bold tracking-wider"
                            >
                                Tutup
                            </Button>
                        </div>

                        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                            <DialogContent className="max-w-md p-6">
                                <DialogHeader className="gap-2">
                                    <DialogTitle className="text-xl font-bold flex items-center gap-2 text-amber-600">
                                        <Package className="h-5 w-5" />
                                        Konfirmasi Posting
                                    </DialogTitle>
                                    <DialogDescription className="text-sm font-medium leading-relaxed mt-2 text-zinc-600">
                                        Posting Goods Receipt ini akan langsung <b>menambah stok</b>{" "}
                                        di gudang terpilih. Tindakan ini bersifat final dan tidak
                                        dapat dibatalkan.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-8 flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 uppercase text-[11px] font-bold tracking-wider"
                                        onClick={() => setConfirmOpen(false)}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase text-[11px] tracking-wider"
                                        onClick={() => {
                                            post.mutate(detail.id, {
                                                onSuccess: () => {
                                                    setConfirmOpen(false);
                                                    onOpenChange(false);
                                                },
                                            });
                                        }}
                                        disabled={post.isPending}
                                    >
                                        {post.isPending && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Konfirmasi & Post
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={confirmCancelOpen} onOpenChange={setConfirmCancelOpen}>
                            <DialogContent className="max-w-md p-6 border-red-100">
                                <DialogHeader className="gap-2">
                                    <DialogTitle className="text-xl font-bold flex items-center gap-2 text-red-600">
                                        <XCircle className="h-5 w-5" />
                                        Batalkan Goods Receipt
                                    </DialogTitle>
                                    <DialogDescription className="text-sm font-medium leading-relaxed mt-2 text-zinc-600">
                                        Apakah Anda yakin ingin membatalkan Goods Receipt ini?
                                        Tindakan ini akan membatalkannya <b>tanpa menambah stok</b>{" "}
                                        dan bersifat final.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-8 flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 uppercase text-[11px] font-bold tracking-wider bg-zinc-50 border-zinc-200 hover:bg-zinc-100"
                                        onClick={() => setConfirmCancelOpen(false)}
                                    >
                                        Tutup
                                    </Button>
                                    <Button
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-[11px] tracking-wider"
                                        onClick={() => {
                                            cancel.mutate(detail.id, {
                                                onSuccess: () => {
                                                    setConfirmCancelOpen(false);
                                                    onOpenChange(false);
                                                },
                                            });
                                        }}
                                        disabled={cancel.isPending}
                                    >
                                        {cancel.isPending && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Ya, Batalkan Sekarang
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
