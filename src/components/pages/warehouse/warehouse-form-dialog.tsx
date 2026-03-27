"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CreateWarehouseBody } from "./create";
import { UpdateWarehouseBody } from "./edit";

interface CreateWarehouseDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function CreateWarehouseDialog({ open, setOpen }: CreateWarehouseDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (isMobile && open) {
            setOpen(false);
            router.push("/warehouses/create");
        }
    }, [isMobile, open, router, setOpen]);

    if (isMobile) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-5xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                <DialogHeader className="p-6 pb-2 bg-slate-50/50 border-b">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <div className="h-5 w-1.5 bg-primary rounded-full" />
                        Tambah Gudang Baru
                    </DialogTitle>
                    <DialogDescription className="italic">
                        Daftarkan gudang baru untuk manajemen inventaris dan alur distribusi.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 overflow-y-auto max-h-[85vh]">
                    <CreateWarehouseBody
                        onSuccess={() => setOpen(false)}
                        onCancel={() => setOpen(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ─── Edit Dialog ────────────────────────────────────────────────────────────

interface EditWarehouseDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    id: number | null;
}

export function EditWarehouseDialog({ open, setOpen, id }: EditWarehouseDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (isMobile && open && id) {
            setOpen(false);
            router.push(`/warehouses/${id}/edit`);
        }
    }, [isMobile, open, id, router, setOpen]);

    if (isMobile) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-5xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                <DialogHeader className="p-6 pb-2 bg-slate-50/50 border-b">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <div className="h-5 w-1.5 bg-primary rounded-full" />
                        Edit Informasi Gudang
                    </DialogTitle>
                    <DialogDescription className="italic">
                        Perbarui rincian alamat dan jenis gudang.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 overflow-y-auto max-h-[85vh]">
                    {id && (
                        <UpdateWarehouseBody
                            id={id}
                            onSuccess={() => setOpen(false)}
                            onCancel={() => setOpen(false)}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

