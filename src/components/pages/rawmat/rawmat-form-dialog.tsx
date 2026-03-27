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
import { CreateRawMaterialBody } from "./create";
import { EditRawMaterialBody } from "./edit";

interface CreateRawMaterialDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function CreateRawMaterialDialog({ open, setOpen }: CreateRawMaterialDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (isMobile && open) {
            router.push("/rawmat/create");
            setOpen(false);
        }
    }, [isMobile, open, router, setOpen]);

    if (isMobile) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0 border-none bg-transparent shadow-none">
                <div className="bg-background rounded-xl shadow-2xl border overflow-hidden relative">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-bold">
                            Tambah Raw Material
                        </DialogTitle>
                        <DialogDescription>
                            Lengkapi informasi dasar, detail pembelian, stok, dan klasifikasi.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 pt-4">
                        <CreateRawMaterialBody
                            onSuccess={(item) => setOpen(false)}
                            onCancel={() => setOpen(false)}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface EditRawMaterialDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    id?: number;
}

export function EditRawMaterialDialog({ open, setOpen, id }: EditRawMaterialDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (isMobile && open && id) {
            router.push(`/rawmat/edit/${id}`);
            setOpen(false);
        }
    }, [isMobile, open, id, router, setOpen]);

    if (isMobile) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0 border-none bg-transparent shadow-none">
                <div className="bg-background rounded-xl shadow-2xl border overflow-hidden relative">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-bold">Edit Raw Material</DialogTitle>
                        <DialogDescription>
                            Ubah informasi dasar, detail pembelian, stok, atau klasifikasi.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 pt-4">
                        {id && (
                            <EditRawMaterialBody
                                id={id}
                                onSuccess={(item) => setOpen(false)}
                                onCancel={() => setOpen(false)}
                            />
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
