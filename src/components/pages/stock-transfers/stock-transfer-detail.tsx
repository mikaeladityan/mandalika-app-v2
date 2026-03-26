"use client";

import { useState, useMemo } from "react";
import { 
    Package, 
    ArrowRight, 
    Calendar, 
    Hash, 
    CheckCircle2, 
    Truck, 
    Inbox, 
    ClipboardCheck,
    AlertCircle,
    XCircle,
    Loader2,
    Store,
    Warehouse as WarehouseIcon,
    FileText,
    History
} from "lucide-react";
import { useStockTransfer, useActionStockTransfer } from "@/app/(application)/stock-transfers/server/use.stock-transfer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { formatNumber, cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { TRANSFER_STATUS } from "@/shared/types";

const statusConfig: Record<string, { label: string, color: string, icon: any }> = {
    PENDING: { label: "Pending Approval", color: "bg-amber-500", icon: Clock },
    APPROVED: { label: "Approved - Ready to Ship", color: "bg-blue-500", icon: CheckCircle2 },
    SHIPMENT: { label: "In Shipment", color: "bg-indigo-500", icon: Truck },
    RECEIVED: { label: "Received - Checking", color: "bg-emerald-500", icon: Inbox },
    FULFILLMENT: { label: "Fulfillment Process", color: "bg-purple-500", icon: ClipboardCheck },
    COMPLETED: { label: "Completed", color: "bg-green-600", icon: CheckCircle2 },
    PARTIAL: { label: "Partial Fulfillment", color: "bg-orange-500", icon: AlertCircle },
    MISSING: { label: "Missing Items", color: "bg-rose-500", icon: AlertCircle },
    REJECTED: { label: "Rejected Items", color: "bg-rose-600", icon: XCircle },
    CANCELLED: { label: "Cancelled", color: "bg-slate-500", icon: XCircle },
};

function Clock(props: any) {
    return <History {...props} />;
}

export function StockTransferDetail({ id }: { id: number }) {
    const { data: transfer, isLoading } = useStockTransfer(id);
    const { updateStatus } = useActionStockTransfer();
    
    // Local state for editing quantities during transitions
    const [editItems, setEditItems] = useState<any[]>([]);
    const [notes, setNotes] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    // Initialize edit items when transfer data is available
    useMemo(() => {
        if (transfer?.items) {
            setEditItems(transfer.items.map((item: any) => ({
                id: item.id,
                product_id: item.product_id,
                quantity_requested: item.quantity_requested,
                quantity_packed: item.quantity_packed ?? item.quantity_requested,
                quantity_received: item.quantity_received ?? item.quantity_packed ?? item.quantity_requested,
                quantity_fulfilled: item.quantity_fulfilled ?? item.quantity_received ?? item.quantity_packed ?? item.quantity_requested,
                quantity_missing: item.quantity_missing ?? 0,
                quantity_rejected: item.quantity_rejected ?? 0,
                product: item.product
            })));
        }
    }, [transfer]);

    const handleUpdateQty = (index: number, field: string, value: string) => {
        const newItems = [...editItems];
        newItems[index] = { ...newItems[index], [field]: Number(value) };
        
        // Auto-calculate missing/rejected in FULFILLMENT stage if needed
        if (transfer?.status === "RECEIVED" && field === "quantity_fulfilled") {
            const expected = newItems[index].quantity_received || newItems[index].quantity_packed || newItems[index].quantity_requested;
            newItems[index].quantity_missing = Math.max(0, expected - Number(value) - newItems[index].quantity_rejected);
        }
        
        setEditItems(newItems);
    };

    const handleStatusTransition = async (nextStatus: string) => {
        setIsUpdating(true);
        try {
            const payload: any = { status: nextStatus, notes };
            
            if (nextStatus === "SHIPMENT") {
                payload.items = editItems.map(i => ({ id: i.id, quantity_packed: i.quantity_packed }));
            } else if (nextStatus === "RECEIVED") {
                payload.items = editItems.map(i => ({ id: i.id, quantity_received: i.quantity_received }));
            } else if (nextStatus === "FULFILLMENT") {
                payload.items = editItems.map(i => ({ 
                    id: i.id, 
                    quantity_fulfilled: i.quantity_fulfilled,
                    quantity_missing: i.quantity_missing,
                    quantity_rejected: i.quantity_rejected
                }));
            }
            
            await updateStatus.mutateAsync({ id, body: payload });
            setNotes("");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) return <div className="space-y-6"><Skeleton className="h-40 w-full rounded-2xl" /><Skeleton className="h-80 w-full rounded-2xl" /></div>;
    if (!transfer) return <div>Data tidak ditemukan.</div>;

    const currentStatus = transfer.status;
    const StatusIcon = statusConfig[currentStatus]?.icon || AlertCircle;

    return (
        <div className="space-y-6 mx-auto">
            {/* Header / Info Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className={cn("text-white p-6", statusConfig[currentStatus].color)}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                    <StatusIcon size={24} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black tracking-tight uppercase">{statusConfig[currentStatus].label}</h2>
                                    <p className="text-xs font-medium text-white/80">{transfer.transfer_number}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-bold text-white/60 tracking-widest">Reference Barcode</p>
                                <p className="text-sm font-mono font-bold">{transfer.barcode}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b border-slate-100">
                            {/* Source */}
                            <div className="p-6 space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                                    <Package size={12} /> Dari Lokasi
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                        {transfer.from_type === "WAREHOUSE" ? <WarehouseIcon size={20} /> : <Store size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-700">{transfer.from_warehouse?.name || transfer.from_outlet?.name}</h3>
                                        <Badge variant="outline" className="text-[9px] uppercase font-bold text-slate-400 border-slate-100 bg-slate-50/50">
                                            {transfer.from_type}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            {/* Destination */}
                            <div className="p-6 space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                                    <Store size={12} /> Tujuan Ke
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                        {transfer.to_type === "WAREHOUSE" ? <WarehouseIcon size={20} /> : <Store size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-700">{transfer.to_warehouse?.name || transfer.to_outlet?.name}</h3>
                                        <Badge variant="outline" className="text-[9px] uppercase font-bold text-slate-400 border-slate-100 bg-slate-50/50">
                                            {transfer.to_type}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50/30">
                            <div className="flex flex-wrap gap-8">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase text-slate-400 block">Dibuat Pada</span>
                                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                                        <Calendar size={12} className="text-slate-400" />
                                        {new Date(transfer.created_at).toLocaleString("id-ID")}
                                    </span>
                                </div>
                                {transfer.shipped_at && (
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase text-slate-400 block">Dikirim</span>
                                        <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                                            <Truck size={12} className="text-slate-400" />
                                            {new Date(transfer.shipped_at).toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                )}
                                {transfer.received_at && (
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase text-slate-400 block">Diterima</span>
                                        <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                                            <Inbox size={12} className="text-slate-400" />
                                            {new Date(transfer.received_at).toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions Panel */}
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            Workflow Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {["COMPLETED", "CANCELLED", "REJECTED", "MISSING", "PARTIAL"].includes(currentStatus) ? (
                            <div className="text-center py-8 space-y-3">
                                <div className="size-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-300">
                                    <CheckCircle2 size={32} />
                                </div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Workflow Finished</p>
                                <p className="text-xs text-muted-foreground px-4">Transfer ini sudah mencapai tahap akhir dan tidak dapat diubah lagi.</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Catatan Progress</label>
                                    <textarea 
                                        className="w-full rounded-xl border-slate-200 text-sm p-3 min-h-[80px] focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Tambahkan catatan untuk tahap ini..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>
                                
                                <div className="space-y-3">
                                    {currentStatus === "PENDING" && (
                                        <>
                                            <Button 
                                                className="w-full rounded-xl h-11 bg-blue-600 hover:bg-blue-700 shadow-md"
                                                onClick={() => handleStatusTransition("APPROVED")}
                                                disabled={isUpdating}
                                            >
                                                {isUpdating ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                                Approve Transfer
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                className="w-full text-rose-500 hover:bg-rose-50 rounded-xl"
                                                onClick={() => handleStatusTransition("CANCELLED")}
                                                disabled={isUpdating}
                                            >
                                                Cancel Transfer
                                            </Button>
                                        </>
                                    )}
                                    {currentStatus === "APPROVED" && (
                                        <Button 
                                            className="w-full rounded-xl h-11 bg-indigo-600 hover:bg-indigo-700 shadow-md"
                                            onClick={() => handleStatusTransition("SHIPMENT")}
                                            disabled={isUpdating}
                                        >
                                            {isUpdating ? <Loader2 className="animate-spin mr-2" /> : <Truck className="mr-2 h-4 w-4" />}
                                            Mulai Pengiriman (Shipment)
                                        </Button>
                                    )}
                                    {currentStatus === "SHIPMENT" && (
                                        <Button 
                                            className="w-full rounded-xl h-11 bg-emerald-600 hover:bg-emerald-700 shadow-md"
                                            onClick={() => handleStatusTransition("RECEIVED")}
                                            disabled={isUpdating}
                                        >
                                            {isUpdating ? <Loader2 className="animate-spin mr-2" /> : <Inbox className="mr-2 h-4 w-4" />}
                                            Konfirmasi Barang Tiba
                                        </Button>
                                    )}
                                    {currentStatus === "RECEIVED" && (
                                        <Button 
                                            className="w-full rounded-xl h-11 bg-purple-600 hover:bg-purple-700 shadow-md"
                                            onClick={() => handleStatusTransition("FULFILLMENT")}
                                            disabled={isUpdating}
                                        >
                                            {isUpdating ? <Loader2 className="animate-spin mr-2" /> : <ClipboardCheck className="mr-2 h-4 w-4" />}
                                            Verifikasi & Selesaikan
                                        </Button>
                                    )}
                                </div>
                                <p className="text-[10px] text-muted-foreground text-center px-4 italic">
                                    Pastikan anda telah melakukan pengecekan fisik barang sebelum melakukan konfirmasi status.
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Items Table */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        Daftar Barang Transfer
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="border-slate-100 hover:bg-transparent">
                                <TableHead className="w-12 text-center">#</TableHead>
                                <TableHead className="font-bold">Barang</TableHead>
                                <TableHead className="font-bold text-center">Requested</TableHead>
                                {["APPROVED", "SHIPMENT"].includes(currentStatus) && (
                                    <TableHead className="font-bold text-center bg-indigo-50/50 text-indigo-700">Packed</TableHead>
                                )}
                                {["SHIPMENT", "RECEIVED"].includes(currentStatus) && (
                                    <TableHead className="font-bold text-center bg-emerald-50/50 text-emerald-700">Received</TableHead>
                                )}
                                {["RECEIVED", "FULFILLMENT", "COMPLETED", "PARTIAL", "MISSING", "REJECTED"].includes(currentStatus) && (
                                    <>
                                        <TableHead className="font-bold text-center bg-green-50/50 text-green-700">Fulfilled</TableHead>
                                        <TableHead className="font-bold text-center bg-rose-50 text-rose-700">Missing</TableHead>
                                        <TableHead className="font-bold text-center bg-rose-100 text-rose-800">Rejected</TableHead>
                                    </>
                                )}
                                <TableHead className="font-bold">Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {editItems.map((item, index) => (
                                <TableRow key={item.id} className="border-slate-50">
                                    <TableCell className="text-center text-xs text-muted-foreground">{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-slate-700">{item.product?.name}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-tight">{item.product?.code}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-slate-600 tabular-nums">
                                        {formatNumber(item.quantity_requested)}
                                    </TableCell>
                                    
                                    {/* Packed Column */}
                                    {["APPROVED", "SHIPMENT"].includes(currentStatus) && (
                                        <TableCell className="text-center bg-indigo-50/20">
                                            {currentStatus === "APPROVED" ? (
                                                <Input 
                                                    type="number" 
                                                    className="w-20 h-8 mx-auto text-center font-black" 
                                                    value={item.quantity_packed}
                                                    onChange={(e) => handleUpdateQty(index, "quantity_packed", e.target.value)}
                                                />
                                            ) : (
                                                <span className="font-bold text-indigo-600">{formatNumber(item.quantity_packed)}</span>
                                            )}
                                        </TableCell>
                                    )}

                                    {/* Received Column */}
                                    {["SHIPMENT", "RECEIVED"].includes(currentStatus) && (
                                        <TableCell className="text-center bg-emerald-50/20">
                                            {currentStatus === "SHIPMENT" ? (
                                                <Input 
                                                    type="number" 
                                                    className="w-20 h-8 mx-auto text-center font-black" 
                                                    value={item.quantity_received}
                                                    onChange={(e) => handleUpdateQty(index, "quantity_received", e.target.value)}
                                                />
                                            ) : (
                                                <span className="font-bold text-emerald-600">{formatNumber(item.quantity_received)}</span>
                                            )}
                                        </TableCell>
                                    )}

                                    {/* Fulfillment Columns */}
                                    {["RECEIVED", "FULFILLMENT", "COMPLETED", "PARTIAL", "MISSING", "REJECTED"].includes(currentStatus) && (
                                        <>
                                            <TableCell className="text-center bg-green-50/20">
                                                {currentStatus === "RECEIVED" ? (
                                                    <Input 
                                                        type="number" 
                                                        className="w-20 h-8 mx-auto text-center font-black text-green-600 border-green-200" 
                                                        value={item.quantity_fulfilled}
                                                        onChange={(e) => handleUpdateQty(index, "quantity_fulfilled", e.target.value)}
                                                    />
                                                ) : (
                                                    <span className="font-bold text-green-600">{formatNumber(item.quantity_fulfilled)}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center bg-rose-50/30">
                                                {currentStatus === "RECEIVED" ? (
                                                    <Input 
                                                        type="number" 
                                                        className="w-20 h-8 mx-auto text-center font-bold text-rose-500 border-rose-100" 
                                                        value={item.quantity_missing}
                                                        onChange={(e) => handleUpdateQty(index, "quantity_missing", e.target.value)}
                                                    />
                                                ) : (
                                                    <span className="font-bold text-rose-500">{formatNumber(item.quantity_missing)}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center bg-rose-100/20">
                                                {currentStatus === "RECEIVED" ? (
                                                    <Input 
                                                        type="number" 
                                                        className="w-20 h-8 mx-auto text-center font-bold text-rose-700 border-rose-200" 
                                                        value={item.quantity_rejected}
                                                        onChange={(e) => handleUpdateQty(index, "quantity_rejected", e.target.value)}
                                                    />
                                                ) : (
                                                    <span className="font-bold text-rose-700">{formatNumber(item.quantity_rejected)}</span>
                                                )}
                                            </TableCell>
                                        </>
                                    )}

                                    <TableCell className="text-xs text-muted-foreground italic">
                                        {item.notes || "-"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
