"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    RunForecastSchema,
    RunForecastDTO,
} from "@/app/(application)/forecasts/server/forecast.schema";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SelectForm } from "@/components/ui/form/select";
import { useFormForecast } from "@/app/(application)/forecasts/server/use.forecast";

type ForecastRunDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productId: number;
    productName: string;
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
export function ForecastRunDialog({
    open,
    onOpenChange,
    productId,
    productName,
}: ForecastRunDialogProps) {
    const { run, isPending } = useFormForecast();

    const form = useForm<RunForecastDTO>({
        resolver: zodResolver(RunForecastSchema) as any,
        mode: "onSubmit",
        defaultValues: {
            horizon: 12,
            start_month: DEFAULT_MONTH,
            start_year: DEFAULT_YEAR,
            product_id: productId,
        },
    });

    const onSubmit = async (values: RunForecastDTO) => {
        await run({
            ...values,
            product_id: productId,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Run Forecast</DialogTitle>
                    <p className="text-xs text-muted-foreground">
                        Produk: <b>{productName}</b>
                    </p>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Forecast Horizon */}
                    <SelectForm
                        name="horizon"
                        label="Forecast Horizon"
                        required
                        control={form.control}
                        options={HORIZON_OPTIONS}
                        placeholder="Pilih horizon"
                        error={form.formState.errors.horizon as any}
                        onValueChange={(val) => {
                            form.setValue("horizon", Number(val));
                        }}
                    />

                    {/* Month & Years */}
                    <div className="flex items-center justify-center gap-5">
                        <SelectForm
                            name="start_month"
                            label="Bulan Mulai Forecast"
                            required
                            control={form.control}
                            options={MONTH_OPTIONS}
                            placeholder="Pilih bulan"
                            error={form.formState.errors.start_month as any}
                            onValueChange={(val) => {
                                form.setValue("start_month", Number(val));
                            }}
                        />

                        <SelectForm
                            name="start_year"
                            label="Tahun Mulai Forecast"
                            required
                            control={form.control}
                            options={YEAR_OPTIONS}
                            placeholder="Pilih tahun"
                            error={form.formState.errors.start_year as any}
                            onValueChange={(val) => {
                                form.setValue("start_year", Number(val));
                            }}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>

                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Running..." : "Run Forecast"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
