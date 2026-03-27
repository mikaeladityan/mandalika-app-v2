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
import { CreateSizeBody, UpdateSizeBody } from "./form/create";
import { ResponseSizeDTO } from "@/app/(application)/products/(component)/size/server/size.schema";

interface CreateSizeDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function CreateSizeDialog({ open, setOpen }: CreateSizeDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (isMobile && open) {
            router.push("/products/size/create");
            setOpen(false);
        }
    }, [isMobile, open, router, setOpen]);

    if (isMobile) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
                <div className="bg-background rounded-xl shadow-2xl border overflow-hidden relative">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-bold">Tambah Ukuran</DialogTitle>
                        <DialogDescription>
                            Tambahkan ukuran produk baru dalam satuan ML.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 pt-4">
                        <CreateSizeBody
                            onSuccess={() => setOpen(false)}
                            onCancel={() => setOpen(false)}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface EditSizeDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    data: ResponseSizeDTO | null;
}

export function EditSizeDialog({ open, setOpen, data }: EditSizeDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (isMobile && open && data) {
            // For now mobile edit still goes here, but we can implement the page later if needed
            // router.push(`/products/size/edit/${data.id}`);
            // setOpen(false);
        }
    }, [isMobile, open, data, router, setOpen]);

    if (isMobile) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
                <div className="bg-background rounded-xl shadow-2xl border overflow-hidden relative">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-bold">Update Ukuran</DialogTitle>
                        <DialogDescription>
                            Perbarui ukuran produk yang sudah ada.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 pt-4">
                        {data && (
                            <UpdateSizeBody
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
