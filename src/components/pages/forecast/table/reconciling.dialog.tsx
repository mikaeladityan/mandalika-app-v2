"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    RequestReconcileDTO,
    RequestReconcileSchema,
} from "@/app/(application)/forecasts/server/forecast.schema";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFormForecast } from "@/app/(application)/forecasts/server/use.forecast";
import { SelectForm } from "@/components/ui/form/select";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";

type ReconcileRunDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productId: number;
    productName: string;
};

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

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }).map((_, i) => {
    const year = CURRENT_YEAR - 2 + i;
    return {
        value: year,
        label: year.toString(),
    };
});
export function ReconcileRunDialog({
    open,
    onOpenChange,
    productId,
    productName,
}: ReconcileRunDialogProps) {
    const { reconcile, isPending } = useFormForecast();

    // LOGIKA DEFAULT VALUE M-1
    const getInitialDate = () => {
        const date = new Date();
        // Mundur 1 bulan
        date.setMonth(date.getMonth() - 1);

        return {
            month: date.getMonth() + 1, // +1 karena getMonth itu 0-index
            year: date.getFullYear(),
        };
    };

    const initialDate = getInitialDate();

    const form = useForm<RequestReconcileDTO>({
        resolver: zodResolver(RequestReconcileSchema),
        defaultValues: {
            product_id: productId,
            additionalRatio: Number(0),
            month: initialDate.month,
            year: initialDate.year,
        },
        mode: "onSubmit",
    });

    const onSubmit = async (values: RequestReconcileDTO) => {
        const payload: RequestReconcileDTO = {
            product_id: values.product_id,
            additionalRatio: Number(values.additionalRatio ?? 0),
            month: values.month,
            year: values.year,
        };
        await reconcile(payload);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Run Reconcile</DialogTitle>
                    <p className="text-xs text-muted-foreground">
                        Produk: <b>{productName}</b>
                    </p>
                </DialogHeader>

                <Form methods={form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Forecast Model */}
                    <InputForm
                        name="additionalRatio"
                        label="Tambahan Ratio Safety Stock (%)"
                        type="number"
                        control={form.control}
                        error={form.formState.errors.additionalRatio}
                    />
                    {/* Year */}
                    {/* Month */}
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
                            {isPending ? "Running..." : "Run Reconciling"}
                        </Button>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
