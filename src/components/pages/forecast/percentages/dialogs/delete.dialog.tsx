"use client";

import { AlertCircle, Loader2, Trash2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForecastPercentageMutations } from "@/app/(application)/forecasts/percentages/server/use.percentages";

interface DeletePercentagesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ids: number[];
    onSuccess?: () => void;
}

export function DeletePercentagesDialog({
    open,
    onOpenChange,
    ids,
    onSuccess,
}: DeletePercentagesDialogProps) {
    const { destroyBulk } = useForecastPercentageMutations();

    const handleConfirm = async () => {
        try {
            await destroyBulk.mutateAsync(ids);
            onSuccess?.();
            onOpenChange(false);
        } catch (error) {
            // error is handled in mutation
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <DialogTitle className="text-center text-xl font-bold text-slate-900">
                        Hapus {ids.length} Item?
                    </DialogTitle>
                    <DialogDescription className="text-center text-slate-500 font-medium pt-2">
                        Tindakan ini tidak dapat dibatalkan. Data persentase yang dipilih akan
                        dihapus secara permanen dari sistem.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="sm:justify-center gap-2 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={destroyBulk.isPending}
                        className="font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={destroyBulk.isPending}
                        className="font-bold gap-2"
                    >
                        {destroyBulk.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                        Ya, Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
