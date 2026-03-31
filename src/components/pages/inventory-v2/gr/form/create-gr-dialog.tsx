"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PackageOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CreateGRBody } from "./create-gr-body";

interface CreateGRDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isMobile?: boolean;
}

export function CreateGRDialog({ open, onOpenChange, isMobile }: CreateGRDialogProps) {
    const router = useRouter();

    // Responsive behavior: If mobile, redirect to a separate create page if open
    // However, the user said "gapapa page saja", so I can also just render a full-screen layout here
    // or truly redirect. Since I want to follow established SOP, let's see if there's a mobile pattern.

    useEffect(() => {
        if (open && isMobile) {
            // Option 1: Redirect to mobile page
            // router.push("/inventory-v2/gr/create");
            // onOpenChange(false);
        }
    }, [open, isMobile]);

    if (isMobile && open) {
        // Basic full screen mock for mobile if not redirecting
        return (
            <div className="fixed inset-0 z-50 bg-white p-4 overflow-y-auto animate-in slide-in-from-bottom duration-300">
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                    <h2 className="text-xl font-semibold flex gap-2 items-center tracking-tight">
                        <PackageOpen className="h-5 w-5" />
                        GR Baru (Mobile)
                    </h2>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="text-muted-foreground font-semibold"
                    >
                        X
                    </button>
                </div>
                <CreateGRBody
                    onSuccess={() => onOpenChange(false)}
                    onCancel={() => onOpenChange(false)}
                />
            </div>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl p-0 overflow-hidden sm:rounded-2xl shadow-xl">
                <div className="p-6 border-b bg-muted/5">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                            <PackageOpen className="h-6 w-6" />
                            Buat Goods Receipt Baru
                        </DialogTitle>
                        <p className="text-muted-foreground text-sm font-normal mt-1">
                            Catat barang masuk hasil produksi (FG) ke lokasi gudang terpilih.
                        </p>
                    </DialogHeader>
                </div>
                <div className="p-6 max-h-[85vh] overflow-y-auto">
                    <CreateGRBody
                        onSuccess={() => onOpenChange(false)}
                        onCancel={() => onOpenChange(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

