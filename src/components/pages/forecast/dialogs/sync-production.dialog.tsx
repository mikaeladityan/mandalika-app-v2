"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Info, Factory } from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useBulkProduction } from "@/app/(application)/production/server/use.production";

type SyncProductionDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function SyncProductionDialog({ open, onOpenChange }: SyncProductionDialogProps) {
    const queryClient = useQueryClient();
    const now = new Date();
    
    const bulkProduction = useBulkProduction({
        month: Number(now.getMonth() + 1),
        year: now.getFullYear(),
    });

    const onSyncProduction = async () => {
        try {
            await bulkProduction.mutateAsync();
            queryClient.invalidateQueries({ queryKey: ["forecast"] });
            toast.success("Sync produksi berhasil");
            onOpenChange(false);
        } catch (error) {
            toast.error("Gagal sinkronisasi");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-106.25 rounded-[2rem] border-none shadow-2xl p-8 text-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Factory className="h-8 w-8 text-indigo-600" />
                </div>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-center text-slate-900">
                        Sinkronisasi Data?
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 text-center font-medium pt-2 px-4">
                        Data akan dikirim ke modul produksi untuk perencanaan manufaktur bulan ini.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-6 p-4 bg-indigo-50/50 rounded-2xl flex items-start gap-3 text-left ring-1 ring-indigo-100">
                    <Info className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-indigo-700 leading-relaxed font-semibold uppercase tracking-tight">
                        Pastikan anda sudah menjalankan "Run Analytics" agar data yang disinkronkan adalah data terbaru.
                    </p>
                </div>
                <DialogFooter className="sm:flex-col gap-3 pt-8">
                    <Button
                        disabled={bulkProduction.isPending}
                        onClick={onSyncProduction}
                        className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 h-12 font-bold text-white shadow-lg shadow-indigo-100"
                    >
                        {bulkProduction.isPending ? "Syncing..." : "Sync ke Produksi"}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="w-full rounded-xl font-bold text-slate-400"
                    >
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
