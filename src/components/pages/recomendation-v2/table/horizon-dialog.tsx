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
import { Label } from "@/components/ui/label";
import { RecomendationV2Response } from "@/app/(application)/recomendation-v2/server/recomendation-v2.schema";
import {
    useRecomendationV2Mutations,
    calculateTotalNeeded,
} from "@/app/(application)/recomendation-v2/server/use.recomendation-v2";
import { Loader2, CalendarRange, Info, CheckCircle2, Settings2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface HorizonDialogProps {
    data: RecomendationV2Response;
    month: number;
    year: number;
    defaultHorizon?: number;
}

export function HorizonDialog({ data, month, year, defaultHorizon }: HorizonDialogProps) {
    const [open, setOpen] = useState(false);
    const [horizon, setHorizon] = useState<string>(
        String(data.work_order_horizon || defaultHorizon || ""),
    );

    const { saveOrder } = useRecomendationV2Mutations();

    const currentHorizon = parseInt(horizon) || 0;

    const totalNeeded = useMemo(
        () => calculateTotalNeeded(data.needs, currentHorizon),
        [data.needs, currentHorizon],
    );

    useEffect(() => {
        if (open) {
            setHorizon(String(data.work_order_horizon || defaultHorizon || ""));
        }
    }, [open, data, defaultHorizon]);

    const handleSave = () => {
        const h = parseInt(horizon);
        if (isNaN(h)) return;

        saveOrder.mutate(
            {
                raw_mat_id: data.material_id,
                month,
                year,
                quantity: data.work_order_quantity || 0,
                horizon: h,
                total_needed: totalNeeded,
                current_stock: data.current_stock,
                stock_fg_x_resep: data.stock_fg_x_resep,
                safety_stock_x_resep: data.safety_stock_x_resep,
            },
            { onSuccess: () => setOpen(false) },
        );
    };

    const hForDisplay = data.work_order_horizon || defaultHorizon || 0;
    const hasHorizon = !!data.work_order_horizon;
    const triggerTotal = calculateTotalNeeded(data.needs, hForDisplay);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="group cursor-pointer flex flex-col items-center">
                    <span
                        className={`text-xs font-black tabular-nums transition-colors ${hasHorizon ? "text-slate-800" : "text-slate-400 italic"}`}
                    >
                        {formatNumber(triggerTotal)}
                    </span>
                    <Settings2 className="size-3 text-slate-400 group-hover:text-indigo-600 transition-colors mt-0.5" />
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[450px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-8 bg-linear-to-br from-slate-700 to-slate-900 text-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <CalendarRange className="size-24" />
                    </div>
                    <DialogTitle className="text-2xl font-black">Total Need Horizon</DialogTitle>
                    <DialogDescription className="text-slate-300 font-medium">
                        Tentukan rentang bulan untuk{" "}
                        <span className="text-white font-bold">{data.material_name}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="p-8 space-y-6 bg-white">
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                                <CalendarRange className="size-3.5" />
                                Pilih Rentang Waktu (Horizon)
                            </Label>
                            <Select value={horizon} onValueChange={setHorizon}>
                                <SelectTrigger className="w-full h-12 rounded-xl border-slate-200 font-bold text-slate-700 focus:ring-indigo-500">
                                    <SelectValue placeholder="Pilih Horizon Kebutuhan" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {Array.from(
                                        { length: defaultHorizon || 1 },
                                        (_, i) => i + 1,
                                    ).map((h) => (
                                        <SelectItem key={h} value={String(h)} className="font-bold">
                                            {h} Bulan {h === 1 ? "(M)" : `(M + ${h - 1}M)`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {currentHorizon > 0 ? (
                            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <span className="text-slate-500 uppercase tracking-tight">
                                        Perhitungan {horizon} Bulan:
                                    </span>
                                    <span className="text-slate-700 font-black">
                                        {formatNumber(totalNeeded)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <span className="text-slate-500 uppercase tracking-tight">
                                        UOM:
                                    </span>
                                    <span className="text-indigo-600 font-black">{data.uom}</span>
                                </div>
                                <Separator className="bg-indigo-100" />
                                <div className="p-3 bg-white rounded-xl border border-indigo-50 text-[11px] text-slate-500 leading-relaxed flex gap-2">
                                    <Info className="size-4 text-indigo-400 shrink-0" />
                                    Total Need ini menjadi acuan dasar sebelum membuat Work Order.
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                                <div className="p-3 bg-slate-50 rounded-full">
                                    <CalendarRange className="size-6 text-slate-300" />
                                </div>
                                <p className="text-xs font-bold text-slate-400">
                                    Silahkan pilih horizon untuk melihat hasil kalkulasi
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="p-8 bg-slate-50/50 gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="rounded-2xl font-bold text-slate-500"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saveOrder.isPending || !horizon}
                        className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 shadow-lg shadow-indigo-200 transition-all flex-1 sm:flex-none"
                    >
                        {saveOrder.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="size-4" />
                                Simpan Horizon
                            </div>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
