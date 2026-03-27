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
import { OutletForm } from "./form/outlet-form";

interface CreateOutletDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function CreateOutletDialog({ open, setOpen }: CreateOutletDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (open && isMobile) {
            setOpen(false);
            router.push("/outlets/create");
        }
    }, [open, isMobile, setOpen, router]);

    if (isMobile) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-5xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                <DialogHeader className="p-6 pb-2 bg-slate-50/50 border-b">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <div className="h-5 w-1.5 bg-primary rounded-full" />
                        Daftarkan Outlet Baru
                    </DialogTitle>
                    <DialogDescription className="italic">
                        Lengkapi informasi outlet untuk integrasi sistem POS dan gudang.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    <OutletForm 
                        onSuccess={() => setOpen(false)} 
                        onCancel={() => setOpen(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface EditOutletDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    id: number | null;
    initialData?: any;
}

export function EditOutletDialog({
    open,
    setOpen,
    id,
    initialData,
}: EditOutletDialogProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    useEffect(() => {
        if (open && isMobile && id) {
            setOpen(false);
            router.push(`/outlets/${id}/edit`);
        }
    }, [open, isMobile, id, setOpen, router]);

    if (isMobile || !id) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-5xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                <DialogHeader className="p-6 pb-2 bg-slate-50/50 border-b">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <div className="h-5 w-1.5 bg-primary rounded-full" />
                        Edit Informasi Outlet
                    </DialogTitle>
                    <DialogDescription className="italic">
                        Pembaruan data outlet akan langsung sinkron dengan sistem POS terkait.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    <OutletForm
                        id={id}
                        initialData={initialData}
                        onSuccess={() => setOpen(false)}
                        onCancel={() => setOpen(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
