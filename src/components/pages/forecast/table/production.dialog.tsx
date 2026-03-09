"use client";

import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form/main";
import { useSyncProduction } from "@/app/(application)/production/server/use.production";
import { RequestSyncProductionDTO } from "@/app/(application)/production/server/production.schema";

type SyncProductionDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product_id: number;
    productName: string;
    month: number;
    year: number;
};

export function SyncProductionDialog({
    open,
    onOpenChange,
    product_id,
    productName,
    month,
    year,
}: SyncProductionDialogProps) {
    const sync = useSyncProduction();
    const getMonthName = (month: number, locale = "id-ID") => {
        const date = new Date(2000, month - 1, 1);
        return date.toLocaleString(locale, { month: "long" });
    };
    const form = useForm<RequestSyncProductionDTO>({
        defaultValues: {
            month,
            year,
            product_id,
        },
    });

    const onSubmit = async (values: RequestSyncProductionDTO) => {
        await sync.mutateAsync(values);

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Sync Need Produce</DialogTitle>
                    <p className="text-xs text-muted-foreground">
                        {productName} — {getMonthName(month)}/{year}
                    </p>
                </DialogHeader>

                <Form methods={form} onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>

                        <Button type="submit" disabled={sync.isPending}>
                            {sync.isPending ? "Processing..." : "Jalankan"}
                        </Button>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
