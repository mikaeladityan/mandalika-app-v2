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
import { CreateUnitBody } from "./form/create";
import { EditUnitBody } from "./form/edit";

interface CreateUnitDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function CreateUnitDialog({ open, setOpen }: CreateUnitDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (isMobile && open) {
            router.push("/rawmat/units/create");
            setOpen(false);
        }
    }, [isMobile, open, router, setOpen]);

    if (isMobile) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
                <div className="bg-background rounded-xl shadow-2xl border overflow-hidden relative">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-bold">Tambah Unit</DialogTitle>
                        <DialogDescription>
                            Buat satuan baru untuk pengukuran inventory raw material.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 pt-4">
                        <CreateUnitBody
                            onSuccess={() => setOpen(false)}
                            onCancel={() => setOpen(false)}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface EditUnitDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    id?: number;
}

export function EditUnitDialog({ open, setOpen, id }: EditUnitDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (isMobile && open && id) {
            router.push(`/rawmat/units/edit/${id}`);
            setOpen(false);
        }
    }, [isMobile, open, id, router, setOpen]);

    if (isMobile) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
                <div className="bg-background rounded-xl shadow-2xl border overflow-hidden relative">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-bold">Edit Unit</DialogTitle>
                        <DialogDescription>
                            Perbarui nama satuan raw material.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 pt-4">
                        {id && (
                            <EditUnitBody
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
