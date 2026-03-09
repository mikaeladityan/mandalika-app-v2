"use client";

import { useForm } from "react-hook-form";
import { Zap } from "lucide-react";

import { RequestForecastDTO } from "@/app/(application)/forecasts/server/forecast.schema";

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
    onSuccess: (jobId: string) => void;
};

const HORIZON_OPTIONS = Array.from({ length: 12 }).map((_, i) => ({
    value: i + 1,
    label: `${i + 1} bulan`,
}));

const FORECAST_MODEL_OPTIONS = [
    { value: "AUTO", label: "Auto (Recommended)" },
    { value: "HOLT_WINTERS", label: "Holt Winters" },
    { value: "LINEAR_REGRESSION", label: "Linear Regression" },
    { value: "ENSEMBLE", label: "Ensemble" },
];

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

    let month = now.getMonth(); 
    let year = now.getFullYear();

    if (month === 0) {
        month = 12;
        year -= 1;
    }

    return { month, year };
};
const { month: DEFAULT_MONTH, year: DEFAULT_YEAR } = getDefaultForecastPeriod();

const YEAR_OPTIONS = Array.from({ length: 5 }).map((_, i) => {
    const year = DEFAULT_YEAR - 2 + i;
    return {
        value: year,
        label: year.toString(),
    };
});

export function BatchForecastDialog({ open, onOpenChange, onSuccess }: BatchForecastDialogProps) {
    const { generateForecast, isPending } = useFormForecast();

    const form = useForm<Omit<RequestForecastDTO, "product_id" | "preview">>({
        mode: "onSubmit",
        defaultValues: {
            horizon: 12,
            forecast_model: "HOLT_WINTERS",
            month: DEFAULT_MONTH,
            year: DEFAULT_YEAR,
        } as any, // bypassing zod since it requires product_id
    });

    const onSubmit = async (values: any) => {
        try {
            const payload = {
                ...values,
                horizon: Number(values.horizon),
                month: Number(values.month),
                year: Number(values.year),
            };
            const res: any = await generateForecast(payload);
            if (res?.job_id) {
                onSuccess(res.job_id);
            }
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
                            Engine akan menganalisis data historis untuk memprediksi kebutuhan stok seluruh produk aktif.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <div className="flex items-center justify-center gap-5">
                            <SelectForm
                                name="month"
                                label="Anchor Month"
                                required
                                control={form.control}
                                options={MONTH_OPTIONS}
                                placeholder="Pilih bulan"
                                onValueChange={(val) => form.setValue("month", Number(val))}
                            />

                            <SelectForm
                                name="year"
                                label="Anchor Year"
                                required
                                control={form.control}
                                options={YEAR_OPTIONS}
                                placeholder="Pilih tahun"
                                onValueChange={(val) => form.setValue("year", Number(val))}
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

                            <SelectForm
                                name="forecast_model"
                                label="Forecast Model"
                                required
                                control={form.control}
                                options={FORECAST_MODEL_OPTIONS}
                                placeholder="Pilih model"
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
