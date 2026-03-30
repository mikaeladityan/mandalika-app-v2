import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Database, Timer, Store, Printer, X } from "lucide-react";

interface ResultDialogProps {
    result: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ResultDialog({ result, open, onOpenChange }: ResultDialogProps) {
    if (!result) return null;
    const { total, import_id } = result;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-[95vw] md:w-full max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl">
                <div className="relative">
                    <DialogHeader className="p-6 border-b bg-white sticky top-0 z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-green-100">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold text-slate-900">
                                        Hasil Import Outlet
                                    </DialogTitle>
                                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                                        ID: {import_id}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="default"
                                    className="bg-emerald-600 text-white px-3 py-1 uppercase tracking-wider text-[10px] font-bold"
                                >
                                    BERHASIL
                                </Badge>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-md"
                                    onClick={() => onOpenChange(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-6 space-y-8">
                        <div className="bg-emerald-50 border-emerald-100 text-emerald-800 p-4 rounded-xl border flex items-start gap-3">
                            <div className="mt-0.5">
                                <CheckCircle className="h-5 w-5 opacity-70" />
                            </div>
                            <p className="text-sm font-medium leading-relaxed">
                                Selamat! Data outlet telah berhasil diimport dan kini tersedia di
                                dalam sistem sebagai basis data Master Toko.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <StatCard
                                icon={<Database className="h-5 w-5" />}
                                label="Total Diproses"
                                value={total || 0}
                                color="blue"
                            />
                            <StatCard
                                icon={<Store className="h-5 w-5" />}
                                label="Status Import"
                                value="Success"
                                color="emerald"
                            />
                            <StatCard
                                icon={<Timer className="h-5 w-5" />}
                                label="Waktu Proses"
                                value="Selesai"
                                color="purple"
                            />
                        </div>
                    </div>

                    <DialogFooter className="p-6 border-t bg-slate-50/80 sticky bottom-0 z-10 flex-row justify-end gap-3">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="bg-white hover:bg-slate-50 border-slate-200"
                        >
                            Tutup
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => window.print()}
                            className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200 gap-2 px-6"
                        >
                            <Printer className="h-4 w-4" /> Cetak Laporan
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function StatCard({
    icon,
    label,
    value,
    color,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
}) {
    const colorClasses: Record<string, string> = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
    };

    return (
        <div
            className={`p-4 rounded-2xl border ${colorClasses[color]} bg-white shadow-sm flex items-center gap-4 group hover:shadow-md transition-all duration-300`}
        >
            <div
                className={`p-3 rounded-xl ${colorClasses[color]} transition-transform group-hover:scale-110`}
            >
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {label}
                </p>
                <p className="text-xl font-black text-slate-900 leading-none mt-1">{value}</p>
            </div>
        </div>
    );
}
