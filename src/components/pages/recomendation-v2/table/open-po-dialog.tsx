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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RecomendationV2Response } from "@/app/(application)/recomendation-v2/server/recomendation-v2.schema";
import { useRecomendationV2Mutations } from "@/app/(application)/recomendation-v2/server/use.recomendation-v2";
import { Loader2, PackageSearch, Save, Trash2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface OpenPoDialogProps {
    data: RecomendationV2Response;
    month: number;
    year: number;
    currentQuantity: number;
    children: React.ReactNode;
}

export function OpenPoDialog({
    data,
    month,
    year,
    currentQuantity,
    children,
}: OpenPoDialogProps) {
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState<string>(String(currentQuantity));
    const { saveOpenPo } = useRecomendationV2Mutations();

    useEffect(() => {
        if (open) {
            setQuantity(String(currentQuantity));
        }
    }, [open, currentQuantity]);

    const handleSave = () => {
        const qty = parseFloat(quantity);
        if (isNaN(qty)) return;

        saveOpenPo.mutate(
            {
                raw_mat_id: data.material_id,
                month,
                year,
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
                month,
                year,
                quantity: 0,
            },
            {
                onSuccess: () => setOpen(false),
            }
        );
    };

    const monthName = new Intl.DateTimeFormat("id-ID", { month: "long" }).format(
        new Date(year, month - 1)
    );

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
                                Input ketersediaan untuk {monthName} {year}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="px-8 pb-6 space-y-6 bg-white">
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
