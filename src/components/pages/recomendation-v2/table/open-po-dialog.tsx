"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RecomendationV2Response } from "@/app/(application)/recomendation-v2/server/recomendation-v2.schema";
import { useRecomendationV2Mutations } from "@/app/(application)/recomendation-v2/server/use.recomendation-v2";
import { CalendarDays, Loader2, PackageSearch, Save, Trash2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface OpenPoDialogProps {
    data: RecomendationV2Response;
    month: number;
    year: number;
    currentQuantity: number;
    children: React.ReactNode;
    isManualSelect?: boolean;
}

export function OpenPoDialog({
    data,
    month,
    year,
    currentQuantity,
    children,
    isManualSelect = false,
}: OpenPoDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<number>(month);
    const [selectedYear, setSelectedYear] = useState<number>(year);
    const [quantity, setQuantity] = useState<string>(String(currentQuantity));
    const { saveOpenPo } = useRecomendationV2Mutations();

    useEffect(() => {
        if (open) {
            setQuantity(String(currentQuantity));
            setSelectedMonth(month);
            setSelectedYear(year);
        }
    }, [open, currentQuantity, month, year]);

    const handleSave = () => {
        const qty = parseFloat(quantity);
        if (isNaN(qty)) return;

        saveOpenPo.mutate(
            {
                raw_mat_id: data.material_id,
                month: selectedMonth,
                year: selectedYear,
                quantity: qty,
            },
            {
                onSuccess: () => setOpen(false),
            }
        );
    };

    const handleDelete = () => {
        saveOpenPo.mutate(
            {
                raw_mat_id: data.material_id,
                month: selectedMonth,
                year: selectedYear,
                quantity: 0,
            },
            {
                onSuccess: () => setOpen(false),
            }
        );
    };

    const monthName = new Intl.DateTimeFormat("id-ID", { month: "long" }).format(
        new Date(selectedYear, selectedMonth - 1)
    );

    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[450px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl bg-white">
                <DialogHeader className="p-8 pb-4 bg-linear-to-br from-emerald-50 to-white">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-100">
                            <PackageSearch className="size-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">
                                Manual <span className="text-emerald-600">Open PO</span>
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium">
                                {isManualSelect 
                                    ? "Pilih periode dan input ketersediaan data" 
                                    : `Input ketersediaan untuk ${monthName} ${selectedYear}`}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="px-8 pb-6 space-y-6 bg-white">
                    {/* Period Matchers */}
                    {isManualSelect && (
                        <div className="flex flex-col gap-3">
                            <Label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                PERIODE KEDATANGAN
                            </Label>
                            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-sm">
                                <Select
                                    value={String(selectedMonth)}
                                    onValueChange={(val) => setSelectedMonth(Number(val))}
                                >
                                    <SelectTrigger className="flex-1 h-11 border-none bg-white rounded-xl shadow-xs font-bold text-slate-700 focus:ring-emerald-500/10">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="size-4 text-emerald-500/50" />
                                            <SelectValue placeholder="Bulan" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                        {months.map((m, i) => (
                                            <SelectItem key={m} value={String(i + 1)} className="font-bold text-xs">
                                                {m}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={String(selectedYear)}
                                    onValueChange={(val) => setSelectedYear(Number(val))}
                                >
                                    <SelectTrigger className="w-[100px] h-11 border-none bg-white rounded-xl shadow-xs font-bold text-slate-700 focus:ring-emerald-500/10">
                                        <SelectValue placeholder="Tahun" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                        {years.map((y) => (
                                            <SelectItem key={y} value={String(y)} className="font-bold text-xs">
                                                {y}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            MATERIAL
                        </span>
                        <p className="text-sm font-bold text-slate-800">{data.material_name}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label
                            htmlFor="po-qty"
                            className="text-xs font-black text-slate-400 uppercase tracking-widest px-1"
                        >
                            Quantity Open PO
                        </Label>
                        <div className="relative">
                            <Input
                                id="po-qty"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="h-14 rounded-2xl border-slate-200 bg-white text-xl font-black text-slate-900 focus-visible:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm px-5 pr-16"
                                placeholder="0"
                                autoFocus
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 border-l border-slate-100 pl-4 uppercase">
                                {data.uom}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-8 bg-slate-50/50 flex gap-3">
                    {currentQuantity > 0 && (
                        <Button
                            variant="outline"
                            className="h-12 w-12 rounded-xl border-rose-100 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all border-dashed shadow-xs shrink-0"
                            onClick={handleDelete}
                            disabled={saveOpenPo.isPending}
                        >
                            {saveOpenPo.isPending ? (
                                <Loader2 className="animate-spin size-4" />
                            ) : (
                                <Trash2 className="size-4" />
                            )}
                        </Button>
                    )}
                    <div className="flex flex-1 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="h-12 flex-1 rounded-xl font-bold text-slate-500 border-slate-200 hover:bg-white hover:text-slate-700 transition-all"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saveOpenPo.isPending}
                            className="h-12 flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-lg shadow-emerald-100 transition-all"
                        >
                            {saveOpenPo.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Save className="size-4 mr-2" />
                                    Simpan
                                </>
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
