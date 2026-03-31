import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateDOBody } from "./create-do-body";

interface CreateDODialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isMobile: boolean;
}

export function CreateDODialog({ open, onOpenChange, isMobile }: CreateDODialogProps) {
    if (isMobile) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-screen h-dvh max-w-none m-0 p-4 pt-10 rounded-none overflow-y-auto bg-slate-50 border-none flex flex-col items-center">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Buat Delivery Order</DialogTitle>
                    </DialogHeader>
                    <div className="w-full max-w-md bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <CreateDOBody
                            onSuccess={() => onOpenChange(false)}
                            onCancel={() => onOpenChange(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-slate-50 border-slate-200 shadow-xl rounded-xl">
                <DialogHeader className="sr-only">
                    <DialogTitle>Buat Delivery Order</DialogTitle>
                </DialogHeader>
                <div className="max-h-[85vh] overflow-y-auto w-full p-8">
                    <CreateDOBody
                        onSuccess={() => onOpenChange(false)}
                        onCancel={() => onOpenChange(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
