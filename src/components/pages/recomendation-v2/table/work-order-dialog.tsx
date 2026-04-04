"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    RecomendationV2Response,
    WORK_ORDER_STATUS,
} from "@/app/(application)/recomendation-v2/server/recomendation-v2.schema";
import {
    useRecomendationV2Mutations,
    calculateTotalNeeded,
} from "@/app/(application)/recomendation-v2/server/use.recomendation-v2";
import {
    Loader2,
    ShoppingCart,
    CheckCircle2,
    Trash2,
    CalendarRange,
    TrendingUp,
    Info,
    AlertTriangle,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface WorkOrderDialogProps {
    data: RecomendationV2Response;
    month: number;
    year: number;
}

export function WorkOrderDialog({ data, month: _month, year: _year }: WorkOrderDialogProps) {
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState<string>("0");

    const { saveOrder, approveOrder, deleteOrder } = useRecomendationV2Mutations();

    // Horizon comes from data only — set via the Total Need dialog
    const currentHorizon = data.work_order_horizon || 0;
    const hasHorizon = currentHorizon > 0;

    const totalNeeded = useMemo(
        () => calculateTotalNeeded(data.needs, currentHorizon),
        [data.needs, currentHorizon],
    );

    const calculatedRecommendation = useMemo(() => {
        if (!hasHorizon) return 0;
        const usableStock = data.current_stock - data.safety_stock_x_resep;
        const readyStock = usableStock + data.open_po;
        const deficit = (totalNeeded || 0) - readyStock;
        return deficit > 0 ? deficit : 0;
    }, [data, totalNeeded, hasHorizon]);

    useEffect(() => {
        if (open) {
            const defaultQty =
                data.work_order_quantity || (hasHorizon ? Math.round(calculatedRecommendation) : 0);
            setQuantity(String(defaultQty));
        }
    }, [open, data, calculatedRecommendation, hasHorizon]);

    const handleSave = () => {
        if (!hasHorizon) return;
        const qty = parseFloat(quantity);
        if (isNaN(qty)) return;

        saveOrder.mutate({
            raw_mat_id: data.material_id,
            month: _month,
            year: _year,
            quantity: qty,
            horizon: currentHorizon,
            total_needed: totalNeeded || 0,
            current_stock: data.current_stock,
            stock_fg_x_resep: data.stock_fg_x_resep,
            safety_stock_x_resep: data.safety_stock_x_resep,
        });
    };

    const handleApprove = () => {
        if (!data.work_order_id) return;
        approveOrder.mutate({ id: data.work_order_id }, { onSuccess: () => setOpen(false) });
    };

    const handleDelete = () => {
        if (!data.work_order_id) return;
        deleteOrder.mutate(data.work_order_id, { onSuccess: () => setOpen(false) });
    };

    const isDraft = data.work_order_status === WORK_ORDER_STATUS.DRAFT;
    const isApproved = data.work_order_status === WORK_ORDER_STATUS.ACC;
    const hasWorkOrder = !!data.work_order_id;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="cursor-pointer">
                    {isApproved ? (
                        <Badge
                            variant="outline"
                            className="bg-emerald-50 text-emerald-700 border-emerald-200 font-black px-3 py-1 text-[10px] rounded-full shadow-sm"
                        >
                            <CheckCircle2 className="size-3 mr-1" />
                            ORDERED: {formatNumber(data.work_order_quantity || 0)}
                        </Badge>
                    ) : hasWorkOrder ? (
                        <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-200 font-black px-3 py-1 text-[10px] rounded-full shadow-sm animate-pulse"
                        >
                            DRAFT: {formatNumber(data.work_order_quantity || 0)}
                        </Badge>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-full border-indigo-200 text-indigo-600 font-black text-[10px] hover:bg-indigo-50 hover:border-indigo-300 transition-all px-4"
                        >
                            <ShoppingCart className="size-3 mr-1.5" />
                            ORDER
                        </Button>
                    )}
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[550px] z-102 rounded-[2.5rem] p-0 overflow-hidden border-none shadow-[0_32px_64px_-15px_rgba(79,70,229,0.2)] bg-white">
                <DialogHeader className="p-10 pb-6 relative overflow-hidden bg-linear-to-br from-white to-indigo-50/30">
                    <div className="absolute -top-10 -right-10 opacity-5 text-indigo-600">
                        <ShoppingCart className="size-64" />
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                            <ShoppingCart className="size-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                                Work <span className="text-indigo-600">Order</span>
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium">
                                Purchase request untuk{" "}
                                <span className="text-indigo-600 font-bold">
                                    {data.material_name}
                                </span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="px-10 pb-6 space-y-8 bg-white">
                    {/* Stock summary */}
                    <div className="grid grid-cols-2 gap-5">
                        <div className="p-5 rounded-[1.5rem] bg-linear-to-br from-slate-50 to-white border border-slate-100 shadow-xs flex flex-col gap-2 transition-all hover:shadow-md hover:border-indigo-100 group">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
                                Ready Stock (S+P)
                            </span>
                            <span className="text-xl font-black text-slate-900">
                                {formatNumber(data.current_stock - data.safety_stock_x_resep + data.open_po)}
                                <span className="ml-1 text-[10px] text-slate-400 font-medium italic lowercase">
                                    {data.uom}
                                </span>
                            </span>
                        </div>
                        <div className="p-5 rounded-[1.5rem] bg-linear-to-br from-slate-50 to-white border border-slate-100 shadow-xs flex flex-col gap-2 transition-all hover:shadow-md hover:border-violet-100 group">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-violet-400 transition-colors">
                                FG Equivalent
                            </span>
                            <span className="text-xl font-black text-slate-900">
                                {formatNumber(data.stock_fg_x_resep)}
                                <span className="ml-1 text-[10px] text-slate-400 font-medium italic lowercase">
                                    {data.uom}
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Horizon — read-only, set via Total Need dialog */}
                    <div className="flex flex-col gap-3">
                        <Label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                            <CalendarRange className="size-3.5 text-indigo-500" />
                            Horizon Configuration
                        </Label>
                        {hasHorizon ? (
                            <div className="h-16 w-full rounded-2xl border border-indigo-100 bg-indigo-50/20 flex items-center justify-between px-6 font-black text-indigo-700 shadow-xs">
                                <span className="text-sm">Interval Analisis:</span>
                                <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-xs shadow-lg shadow-indigo-100">
                                    {currentHorizon} Bulan (M
                                    {currentHorizon > 1 ? ` - M${currentHorizon}` : ""})
                                </span>
                            </div>
                        ) : (
                            <div className="h-16 w-full rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50 flex items-center px-6 gap-3">
                                <AlertTriangle className="size-5 text-amber-500 shrink-0 animate-bounce-slow" />
                                <span className="font-bold text-amber-700 text-xs leading-tight">
                                    Horizon belum ditentukan! Selesaikan dahulu di kolom Total Need.
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Calculation preview — only visible when horizon is set */}
                    {hasHorizon && (
                        <div className="p-6 rounded-[1.75rem] bg-linear-to-br from-indigo-50/50 to-white border border-indigo-100/50 space-y-4 shadow-xs">
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wide">
                                <span className="text-slate-400">
                                    Total Need ({currentHorizon} bln):
                                </span>
                                <span className="text-slate-900 font-black">
                                    {formatNumber(totalNeeded)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wide">
                                <span className="text-slate-400">Safety Stock Buffer:</span>
                                <span className="text-indigo-600 font-black">
                                    +{formatNumber(data.safety_stock_x_resep)}
                                </span>
                            </div>

                            <div className="h-px bg-indigo-100/50 w-full" />
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wide">
                                <span className="text-slate-400">MOQ:</span>
                                <span className="text-rose-600 font-black">
                                    {formatNumber(data.moq)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
                                    Recommendation:
                                </span>

                                <div className="flex flex-col items-end">
                                    <span className="text-2xl font-black text-indigo-600 leading-none">
                                        {formatNumber(calculatedRecommendation)}
                                    </span>
                                    <span className="text-[9px] font-black text-indigo-300 uppercase mt-1 tracking-[0.2em]">
                                        Estimated Pure Need
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quantity input */}
                    <div className="flex flex-col gap-3">
                        <Label
                            htmlFor="order-qty"
                            className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1"
                        >
                            <TrendingUp className="size-3.5 text-indigo-500" />
                            Input Order Quantity
                        </Label>
                        <div className="relative group">
                            <Input
                                id="order-qty"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                disabled={isApproved || !hasHorizon}
                                className="h-16 rounded-2xl border-slate-200 bg-white text-2xl font-black text-slate-900 focus-visible:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm group-hover:shadow-md px-6 pr-20"
                                placeholder="0"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 border-l border-slate-100 pl-4 uppercase tracking-widest">
                                {data.uom}
                            </div>
                        </div>
                        {parseFloat(quantity) > 0 && parseFloat(quantity) < data.moq && (
                            <div className="mx-1 p-3 py-2 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-2">
                                <Info className="size-3 text-amber-500" />
                                <span className="text-[10px] font-bold text-amber-700">
                                    Alert: Pesanan di bawah MOQ ({formatNumber(data.moq)})
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="p-10 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
                    {hasWorkOrder && isDraft && (
                        <Button
                            variant="outline"
                            className="h-14 w-14 rounded-2xl border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold border-dashed shadow-xs shrink-0"
                            onClick={handleDelete}
                            disabled={deleteOrder.isPending}
                        >
                            {deleteOrder.isPending ? (
                                <Loader2 className="animate-spin size-5" />
                            ) : (
                                <Trash2 className="size-5" />
                            )}
                        </Button>
                    )}

                    {!isApproved ? (
                        <div className="flex flex-1 gap-3 flex-col sm:flex-row">
                            <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="h-14 flex-1 rounded-2xl font-bold text-slate-500 border-slate-200 hover:bg-white hover:text-slate-700 transition-all shadow-xs"
                            >
                                Kembali
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={saveOrder.isPending || !hasHorizon}
                                className="h-14 flex-1 rounded-2xl bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-black shadow-sm transition-all"
                            >
                                {saveOrder.isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    "Simpan Draft"
                                )}
                            </Button>
                            {hasWorkOrder && (
                                <Button
                                    onClick={handleApprove}
                                    disabled={approveOrder.isPending}
                                    className="h-14 flex-[1.5] rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-100 transition-all border-none"
                                >
                                    {approveOrder.isPending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        "Approve Order"
                                    )}
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 text-emerald-600 font-black text-base w-full justify-center py-4 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-xs animate-in fade-in zoom-in duration-300">
                            <CheckCircle2 className="size-6" />
                            PESANAN SUDAH DI-APPROVE & SEDANG DIPROSES
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
