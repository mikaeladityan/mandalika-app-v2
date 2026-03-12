"use client";

import { useForm } from "react-hook-form";
import { Zap } from "lucide-react";

import { RunForecastDTO } from "@/app/(application)/forecasts/server/forecast.schema";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SelectForm } from "@/components/ui/form/select";
import { Form } from "@/components/ui/form";
import { useFormForecast } from "@/app/(application)/forecasts/server/use.forecast";

type BatchForecastDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
};

const HORIZON_OPTIONS = Array.from({ length: 12 }).map((_, i) => ({
    value: i + 1,
    label: `${i + 1} bulan`,
}));



const MONTH_OPTIONS = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
];

const getDefaultForecastPeriod = () => {
    const now = new Date();
    // Default start month: Bulan Sekarang
    const month = now.getMonth() + 1; // 1-indexed
    const year = now.getFullYear();
    return { month, year };
};
const { month: DEFAULT_MONTH, year: DEFAULT_YEAR } = getDefaultForecastPeriod();

const YEAR_OPTIONS = Array.from({ length: 5 }).map((_, i) => {
    const year = DEFAULT_YEAR - 1 + i;
    return {
        value: year,
        label: year.toString(),
    };
});

export function BatchForecastDialog({ open, onOpenChange, onSuccess }: BatchForecastDialogProps) {
    const { run, isPending } = useFormForecast();

    const form = useForm<RunForecastDTO>({
        mode: "onSubmit",
        defaultValues: {
            horizon: 12,
            start_month: DEFAULT_MONTH,
            start_year: DEFAULT_YEAR,
        },
    });

    const onSubmit = async (values: any) => {
        try {
            const payload = {
                horizon: Number(values.horizon),
                start_month: Number(values.start_month),
                start_year: Number(values.start_year),
            };
            await run(payload);
            onSuccess();
        } catch (error) {
            console.error("Gagal inisialisasi forecast", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-106.25 rounded-[2rem] border-none shadow-2xl p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center">
                        <Zap className="h-8 w-8 text-amber-500 fill-amber-500" />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-slate-900">
                            Batch Kalkulasi Forecast
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium pt-2">
                            Engine akan menganalisis data historis untuk memprediksi kebutuhan stok
                            seluruh produk aktif dimulai dari bulan yang dipilih.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <div className="flex items-center justify-center gap-5">
                            <SelectForm
                                name="start_month"
                                label="Bulan Mulai Forecast"
                                required
                                control={form.control}
                                options={MONTH_OPTIONS}
                                placeholder="Pilih bulan"
                                onValueChange={(val) => form.setValue("start_month", Number(val))}
                            />

                            <SelectForm
                                name="start_year"
                                label="Tahun Mulai Forecast"
                                required
                                control={form.control}
                                options={YEAR_OPTIONS}
                                placeholder="Pilih tahun"
                                onValueChange={(val) => form.setValue("start_year", Number(val))}
                            />
                        </div>


                        <div className="flex items-center justify-center gap-5">
                            <SelectForm
                                name="horizon"
                                label="Forecast Horizon"
                                required
                                control={form.control}
                                options={HORIZON_OPTIONS}
                                placeholder="Pilih horizon"
                                onValueChange={(val) => form.setValue("horizon", Number(val))}
                            />
                        </div>

                        <DialogFooter className="sm:flex-col gap-3 pt-6">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full rounded-xl bg-slate-900 h-12 font-bold text-white shadow-lg shadow-slate-200"
                            >
                                {isPending ? "Inisialisasi..." : "Konfirmasi & Jalankan Engine"}
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
