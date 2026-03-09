"use client";

import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";

import { useFormForecast } from "@/app/(application)/forecasts/server/use.forecast";

type AddRatioForecastDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productId: number;
    productName: string;
    month: number;
    year: number;
};

type FormValues = {
    ratio: number;
};

export function AddRatioForecastDialog({
    open,
    onOpenChange,
    productId,
    productName,
    month,
    year,
}: AddRatioForecastDialogProps) {
    const { addRatio, isPending } = useFormForecast();
    const getMonthName = (month: number, locale = "id-ID") => {
        const date = new Date(2000, month - 1, 1);
        return date.toLocaleString(locale, { month: "long" });
    };
    const form = useForm<FormValues>({
        defaultValues: {
            ratio: 0,
        },
    });

    const onSubmit = async (values: FormValues) => {
        await addRatio({
            product_id: productId,
            month,
            year,
            additionalRatio: Number(values.ratio),
        });

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Additional Ratio</DialogTitle>
                    <p className="text-xs text-muted-foreground">
                        {productName} — {getMonthName(month)}/{year}
                    </p>
                </DialogHeader>

                <Form methods={form} onSubmit={form.handleSubmit(onSubmit)}>
                    <InputForm
                        name="ratio"
                        label="Tambahan Ratio (%)"
                        type="number"
                        control={form.control}
                    />

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>

                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Processing..." : "Apply Ratio"}
                        </Button>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
