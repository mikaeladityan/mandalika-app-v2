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
import { CreateCategoryBody } from "./form/create";
import { EditCategoryBody } from "./form/edit";

interface CreateCategoryDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function CreateCategoryDialog({ open, setOpen }: CreateCategoryDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (isMobile && open) {
            router.push("/rawmat/categories/create");
            setOpen(false);
        }
    }, [isMobile, open, router, setOpen]);

    if (isMobile) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
                <div className="bg-background rounded-xl shadow-2xl border overflow-hidden relative">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-bold">Tambah Kategori</DialogTitle>
                        <DialogDescription>
                            Buat kategori baru untuk mengklasifikasikan raw material Anda.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 pt-4">
                        <CreateCategoryBody
                            onSuccess={() => setOpen(false)}
                            onCancel={() => setOpen(false)}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface EditCategoryDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    id?: number;
}

export function EditCategoryDialog({ open, setOpen, id }: EditCategoryDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (isMobile && open && id) {
            router.push(`/rawmat/categories/edit/${id}`);
            setOpen(false);
        }
    }, [isMobile, open, id, router, setOpen]);

    if (isMobile) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
                <div className="bg-background rounded-xl shadow-2xl border overflow-hidden relative">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-bold">Edit Kategori</DialogTitle>
                        <DialogDescription>
                            Ubah nama atau status kategori raw material.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 pt-4">
                        {id && (
                            <EditCategoryBody
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
