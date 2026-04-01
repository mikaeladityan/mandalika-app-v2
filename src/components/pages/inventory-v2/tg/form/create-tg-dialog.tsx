"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CreateTGBody } from "./create-tg-body";
import { ResponseTransferGudangDTO } from "@/app/(application)/inventory-v2/tg/server/tg.schema";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (data: ResponseTransferGudangDTO) => void;
}

export function CreateTGDialog({ open, onOpenChange, onSuccess }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Buat Packing List Transfer Gudang</DialogTitle>
                    <DialogDescription>
                        Langkah awal untuk melakukan mutasi stok antar gudang Finish Goods.
                    </DialogDescription>
                </DialogHeader>

                <CreateTGBody
                    onSuccess={(data) => {
                        onSuccess(data);
                        onOpenChange(false);
                    }}
                    onCancel={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
