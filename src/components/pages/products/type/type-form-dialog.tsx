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
import { CreateTypeBody, UpdateTypeBody } from "./form/create";
import { ResponseTypeDTO } from "@/app/(application)/products/(component)/type/server/type.schema";

interface CreateTypeDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function CreateTypeDialog({ open, setOpen }: CreateTypeDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (isMobile && open) {
            router.push("/products/type/create");
            setOpen(false);
        }
    }, [isMobile, open, router, setOpen]);

    if (isMobile) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
                <div className="bg-background rounded-xl shadow-2xl border overflow-hidden relative">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-bold">Tambah Tipe</DialogTitle>
                        <DialogDescription>
                            Daftarkan tipe produk baru (cth: EDP, Parfum, etc).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 pt-4">
                        <CreateTypeBody
                            onSuccess={() => setOpen(false)}
                            onCancel={() => setOpen(false)}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface EditTypeDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    data: ResponseTypeDTO | null;
}

export function EditTypeDialog({ open, setOpen, data }: EditTypeDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (isMobile && open && data) {
            // router.push(`/products/type/edit/${data.id}`);
            // setOpen(false);
        }
    }, [isMobile, open, data, router, setOpen]);

    if (isMobile) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
                <div className="bg-background rounded-xl shadow-2xl border overflow-hidden relative">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-bold">Update Tipe</DialogTitle>
                        <DialogDescription>
                            Perbarui nama tipe produk yang sudah ada.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 pt-4">
                        {data && (
                            <UpdateTypeBody
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
