import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../dialog";
import { Button } from "../button";

interface DialogAlertProps {
    label: React.ReactNode;
    title: string;
    children: React.ReactNode;
    onClick?: () => Promise<void>;
    asChild?: boolean;
}

export function DialogAlert({ children, label, title, onClick, asChild }: DialogAlertProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (onClick) {
            setLoading(true);
            try {
                await onClick();
                setOpen(false);
            } catch (error) {
                console.error("Gagal melakukan aksi:", error);
            } finally {
                setLoading(false);
            }
        } else {
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {asChild ? (
                    React.isValidElement(label) ? (
                        label
                    ) : (
                        <span>{label}</span>
                    )
                ) : (
                    <Button
                        size={"sm"}
                        className="flex items-center justify-center gap-2 p-3 py-2 rounded bg-amber-500 border border-amber-500 hover:bg-amber-600/80 transition-all ease-in-out duration-200 cursor-pointer text-white"
                    >
                        {label}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {children}
                </DialogHeader>
                <DialogFooter className="sm:justify-end">
                    <Button
                        disabled={loading}
                        className="cursor-pointer font-bold shadow-md shadow-primary/20"
                        onClick={handleConfirm}
                    >
                        {loading ? "Memproses..." : "Konfirmasi"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
