"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useFormRawMat } from "@/app/(application)/rawmat/server/use.rawmat";
import { Loader2, Timer } from "lucide-react";

interface LeadTimeEditDialogProps {
    id: number;
    materialName: string;
    currentLeadTime: number;
}

export function LeadTimeEditDialog({ id, materialName, currentLeadTime }: LeadTimeEditDialogProps) {
    const [open, setOpen] = useState(false);
    const [leadTime, setLeadTime] = useState<string>(String(currentLeadTime));
    const { patch } = useFormRawMat();

    useEffect(() => {
        if (open) {
            setLeadTime(String(currentLeadTime));
        }
    }, [open, currentLeadTime]);

    const handleSave = async () => {
        const val = parseInt(leadTime);
        if (isNaN(val)) return;

        patch.mutate(
            {
                id,
                body: { lead_time: val },
            },
            {
                onSuccess: () => {
                    setOpen(false);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="cursor-pointer group">
                    <Badge
                        variant="outline"
                        className="font-mono bg-slate-50 text-slate-500 text-[10px] border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all px-2 py-0.5"
                    >
                        <Timer className="size-2.5 mr-1 opacity-50 group-hover:opacity-100" />
                        {currentLeadTime || 0} Hari
                    </Badge>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Timer className="size-5 text-indigo-600" />
                        Edit Lead Time
                    </DialogTitle>
                    <DialogDescription>
                        Ubah durasi lead time untuk material{" "}
                        <span className="font-bold text-slate-900">{materialName}</span>.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="lead-time" className="text-xs font-bold text-slate-500 uppercase">
                            Durasi (Hari)
                        </Label>
                        <Input
                            id="lead-time"
                            type="number"
                            value={leadTime}
                            onChange={(e) => setLeadTime(e.target.value)}
                            className="font-mono text-lg py-6 border-slate-200 focus:ring-indigo-500"
                            placeholder="Contoh: 30"
                            autoFocus
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        disabled={patch.isPending}
                        className="rounded-xl font-bold"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={patch.isPending || isNaN(parseInt(leadTime))}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-8 shadow-indigo-200 shadow-lg transition-all"
                    >
                        {patch.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            "Simpan Perubahan"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
