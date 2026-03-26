"use client";

import { useForm } from "react-hook-form";
import { Edit3 } from "lucide-react";

import { UpdateManualForecastDTO } from "@/app/(application)/forecasts/server/forecast.schema";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form";
import { useManualForecast } from "@/app/(application)/forecasts/server/use.forecast";

type ManualForecastDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    data: {
        product_id: number;
        product_name: string;
        month: number;
        year: number;
        period: string;
        current_value: number;
        current_ratio?: number;
        is_display?: boolean;
    } | null;
};

export function ManualForecastDialog({
    open,
    onOpenChange,
    onSuccess,
    data,
}: ManualForecastDialogProps) {
    const { update, isPending } = useManualForecast();

    const form = useForm<UpdateManualForecastDTO>({
        mode: "onSubmit",
        values: {
            product_id: data?.product_id ?? 0,
            month: data?.month ?? 0,
            year: data?.year ?? 0,
            final_forecast: data?.current_value,
            ratio: data?.current_ratio ?? 0,
        },
    });

    const onSubmit = async (values: UpdateManualForecastDTO) => {
        try {
            await update(values);
            onSuccess();
        } catch (error) {
            console.error("Gagal update manual forecast", error);
        }
    };

    if (!data) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-[2rem] border-none shadow-2xl p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <Edit3 className="h-8 w-8 text-indigo-500" />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-slate-900">
                            Update Forecast Manual
                        </DialogTitle>
                        <DialogDescription asChild className="text-slate-500 font-medium pt-2">
                            <div>
                                Menyesuaikan kebutuhan forecast untuk <span className="font-bold text-slate-900">{data.product_name}</span> pada periode <span className="font-bold text-indigo-600">{data.period}</span>.
                                {data.is_display && (
                                    <div className="mt-2 space-y-1.5">
                                        <div className="p-2.5 bg-indigo-50 text-indigo-700 text-[9px] rounded-lg border border-indigo-100 uppercase tracking-widest font-black flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                            Update Forecast (Base) = Merubah 12 Bulan
                                        </div>
                                        <div className="p-2.5 bg-amber-50 text-amber-700 text-[9px] rounded-lg border border-amber-100 uppercase tracking-widest font-black flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                            Update Growth (%) = Merubah Bulan Ini Saja
                                        </div>
                                    </div>
                                )}
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InputForm
                                name="final_forecast"
                                label="Forecast (Base)"
                                type="number"
                                control={form.control}
                                placeholder="Cth: 300"
                                autoFocus
                            />
                            <InputForm
                                name="ratio"
                                label="Growth (%)"
                                type="number"
                                control={form.control}
                                placeholder="Cth: 10"
                            />
                        </div>

                        <div className="text-[10px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200 leading-relaxed shadow-sm">
                            <span className="font-bold text-indigo-600">Rumus:</span> Final Forecast = Base + (Base × Growth %)
                            <br />
                            <span className="text-[9px] mt-1 block font-medium">
                                * Kosongkan salah satu jika tidak ingin merubah nilainya.
                            </span>
                        </div>

                        <DialogFooter className="sm:flex-col gap-3 pt-6">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full rounded-xl bg-slate-900 h-12 font-bold text-white shadow-lg shadow-slate-200"
                            >
                                {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="w-full rounded-xl font-bold text-slate-400"
                            >
                                Batal
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
