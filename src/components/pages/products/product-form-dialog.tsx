"use client";

import { useRouter } from "next/navigation";
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

export function CreateProductDialog({
    open,
    onOpenChange,
    children,
}: CreateProductDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    if (isMobile) {
        // Navigasi ke page biasa di mobile
        if (open) router.push("/products/create");
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-black">
                        <Box className="h-5 w-5 text-muted-foreground" />
                        Tambah Produk Baru
                    </DialogTitle>
                    <DialogDescription>
                        Lengkapi informasi dasar, atribut, dan parameter stok produk.
                    </DialogDescription>
                </DialogHeader>
                {children}
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

    if (isMobile) {
        if (open && productId) router.push(`/products/${productId}/edit`);
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-black">
                        <Box className="h-5 w-5 text-muted-foreground" />
                        Edit Produk
                    </DialogTitle>
                    <DialogDescription>
                        Perbarui rincian produk dan parameter forecasting.
                    </DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}
