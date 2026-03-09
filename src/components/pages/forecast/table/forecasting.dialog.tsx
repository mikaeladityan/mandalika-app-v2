"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    RequestForecastSchema,
    RequestForecastDTO,
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

const FORECAST_MODEL_OPTIONS = [
    { value: "AUTO", label: "Auto (Recommended)" },
    // { value: "ARIMA", label: "ARIMA" },
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

    let month = now.getMonth(); // 0–11 → previous month
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
export function ForecastRunDialog({
    open,
    onOpenChange,
    productId,
    productName,
}: ForecastRunDialogProps) {
    const { generateForecast, isPending } = useFormForecast();

    const form = useForm<RequestForecastDTO>({
        resolver: zodResolver(RequestForecastSchema),
        mode: "onSubmit",
        defaultValues: {
            product_id: productId,
            horizon: 12,
            forecast_model: "HOLT_WINTERS",
            month: DEFAULT_MONTH,
            year: DEFAULT_YEAR,
        },
    });

    const onSubmit = async (values: RequestForecastDTO) => {
        await generateForecast(values);
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
                        error={form.formState.errors.horizon}
                        onValueChange={(val) => {
                            form.setValue("horizon", Number(val));
                        }}
                    />

                    {/* Forecast Model */}
                    <SelectForm
                        name="forecast_model"
                        label="Forecast Model"
                        required
                        control={form.control}
                        options={FORECAST_MODEL_OPTIONS}
                        placeholder="Pilih model"
                        error={form.formState.errors.forecast_model}
                    />

                    {/* Month & Years */}
                    <div className="flex items-center justify-center gap-5">
                        <SelectForm
                            name="month"
                            label="Forecast Start Month"
                            required
                            control={form.control}
                            options={MONTH_OPTIONS}
                            placeholder="Pilih bulan"
                            error={form.formState.errors.month}
                            onValueChange={(val) => {
                                form.setValue("month", Number(val));
                            }}
                        />

                        <SelectForm
                            name="year"
                            label="Forecast Year"
                            required
                            control={form.control}
                            options={YEAR_OPTIONS}
                            placeholder="Pilih tahun"
                            error={form.formState.errors.year}
                            onValueChange={(val) => {
                                form.setValue("year", Number(val));
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
