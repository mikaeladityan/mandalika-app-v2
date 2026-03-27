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
import { CreateSupplierBody } from "./form/create";
import { EditSupplierBody } from "./form/edit";

interface CreateSupplierDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function CreateSupplierDialog({ open, setOpen }: CreateSupplierDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (isMobile && open) {
            router.push("/rawmat/suppliers/create");
            setOpen(false);
        }
    }, [isMobile, open, router, setOpen]);

    if (isMobile) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl p-0 border-none bg-transparent shadow-none">
                <div className="bg-background rounded-xl shadow-2xl border overflow-hidden relative">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-bold">Tambah Supplier</DialogTitle>
                        <DialogDescription>
                            Daftarkan supplier baru untuk pengadaan raw material Anda.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 pt-4">
                        <CreateSupplierBody
                            onSuccess={() => setOpen(false)}
                            onCancel={() => setOpen(false)}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface EditSupplierDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    id?: number;
}

export function EditSupplierDialog({ open, setOpen, id }: EditSupplierDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (isMobile && open && id) {
            router.push(`/rawmat/suppliers/edit/${id}`);
            setOpen(false);
        }
    }, [isMobile, open, id, router, setOpen]);

    if (isMobile) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl p-0 border-none bg-transparent shadow-none">
                <div className="bg-background rounded-xl shadow-2xl border overflow-hidden relative">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-bold">Edit Supplier</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi kontak atau alamat supplier.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 pt-4">
                        {id && (
                            <EditSupplierBody
                                id={id}
                                onSuccess={() => setOpen(false)}
                                onCancel={() => setOpen(false)}
                            />
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
