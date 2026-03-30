"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Box } from "lucide-react";

// ─── Create Dialog ─────────────────────────────────────────────────────────

interface CreateProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Rendered form body — pass <CreateProductBody /> */
    children: React.ReactNode;
}

export function CreateProductDialog({ open, onOpenChange, children }: CreateProductDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (isMobile && open) {
            onOpenChange(false);
            router.push("/products/create");
        }
    }, [isMobile, open, onOpenChange, router]);

    if (isMobile) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                <DialogHeader className="p-6 pb-2 bg-slate-50/50 border-b">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <div className="h-5 w-1.5 bg-primary rounded-full" />
                        Tambah Produk Baru
                    </DialogTitle>
                    <DialogDescription className="italic">
                        Lengkapi informasi dasar, atribut, dan parameter stok produk.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 overflow-y-auto max-h-[85vh]">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ─── Edit Dialog ────────────────────────────────────────────────────────────

interface EditProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productId: number | null;
    /** Rendered form body — pass <EditProductBody id={productId} /> */
    children: React.ReactNode;
}

export function EditProductDialog({
    open,
    onOpenChange,
    productId,
    children,
}: EditProductDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (isMobile && open && productId) {
            onOpenChange(false);
            router.push(`/products/${productId}/edit`);
        }
    }, [isMobile, open, productId, onOpenChange, router]);

    if (isMobile) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                <DialogHeader className="p-6 pb-2 bg-slate-50/50 border-b">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <div className="h-5 w-1.5 bg-primary rounded-full" />
                        Edit Informasi Produk
                    </DialogTitle>
                    <DialogDescription className="italic">
                        Perbarui rincian produk dan parameter forecasting.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 overflow-y-auto max-h-[85vh]">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}

