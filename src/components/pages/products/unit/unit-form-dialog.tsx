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
import { CreateUnitBody, UpdateUnitBody } from "./form/create";
import { ResponseUnitDTO } from "@/app/(application)/products/(component)/unit/server/unit.schema";

interface CreateUnitDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function CreateUnitDialog({ open, setOpen }: CreateUnitDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (isMobile && open) {
            router.push("/products/unit/create");
            setOpen(false);
        }
    }, [isMobile, open, router, setOpen]);

    if (isMobile) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
                <div className="bg-background rounded-xl shadow-2xl border overflow-hidden relative">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-bold">Tambah Satuan</DialogTitle>
                        <DialogDescription>
                            Daftarkan satuan produk baru (cth: PCS, Box, Bottleia).
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
    data: ResponseUnitDTO | null;
}

export function EditUnitDialog({ open, setOpen, data }: EditUnitDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (isMobile && open && data) {
            // router.push(`/products/unit/edit/${data.id}`);
            // setOpen(false);
        }
    }, [isMobile, open, data, router, setOpen]);

    if (isMobile) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
                <div className="bg-background rounded-xl shadow-2xl border overflow-hidden relative">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-bold">Update Satuan</DialogTitle>
                        <DialogDescription>
                            Perbarui nama satuan produk yang sudah ada.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 pt-4">
                        {data && (
                            <UpdateUnitBody
                                initialData={data}
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
