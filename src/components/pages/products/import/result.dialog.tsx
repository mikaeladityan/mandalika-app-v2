import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Database, Timer, Package, Printer, X } from "lucide-react";

interface ResultDialogProps {
    result: any;
    dryRun: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ResultDialog({ result, dryRun, open, onOpenChange }: ResultDialogProps) {
    if (!result) return null;
    const { stats, duration, importId } = result;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-[95vw] md:w-full max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl">
                <div className="relative">
                    <DialogHeader className="p-6 border-b bg-white sticky top-0 z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-2 rounded-xl ${dryRun ? "bg-amber-100" : "bg-green-100"}`}
                                >
                                    {dryRun ? (
                                        <AlertCircle className="h-6 w-6 text-amber-600" />
                                    ) : (
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    )}
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold text-slate-900">
                                        Hasil Import Produk
                                    </DialogTitle>
                                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                                        ID: {importId}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={dryRun ? "outline" : "default"}
                                    className={`px-3 py-1 uppercase tracking-wider text-[10px] font-bold ${dryRun ? "border-amber-200 bg-amber-50 text-amber-700" : "bg-emerald-600 text-white"}`}
                                >
                                    {dryRun ? "SIMULASI" : "BERHASIL"}
                                </Badge>
                                <Button size="sm"  variant="ghost"
                                    
                                    className="h-8 w-8 rounded-md"
                                    onClick={() => onOpenChange(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-6 space-y-8">
                        {/* Summary Message */}
                        <div
                            className={`p-4 rounded-xl border flex items-start gap-3 ${dryRun ? "bg-amber-50 border-amber-100 text-amber-800" : "bg-emerald-50 border-emerald-100 text-emerald-800"}`}
                        >
                            <div className="mt-0.5">
                                {dryRun ? (
                                    <AlertCircle className="h-5 w-5 opacity-70" />
                                ) : (
                                    <CheckCircle className="h-5 w-5 opacity-70" />
                                )}
                            </div>
                            <p className="text-sm font-medium leading-relaxed">
                                {dryRun
                                    ? "Simulasi selesai dilakukan. Seluruh data telah diverifikasi namun tidak ada perubahan yang disimpan ke database."
                                    : "Selamat! Data produk telah berhasil diimport dan kini tersedia di dalam sistem."}
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                icon={<Database className="h-5 w-5" />}
                                label="Total Baris"
                                value={stats?.total || 0}
                                color="blue"
                            />
                            <StatCard
                                icon={<Package className="h-5 w-5" />}
                                label="Data Baru"
                                value={stats?.created || 0}
                                color="emerald"
                            />
                            <StatCard
                                icon={<RefreshCwIcon className="h-5 w-5" />}
                                label="Update Data"
                                value={stats?.updated || 0}
                                color="amber"
                            />
                            <StatCard
                                icon={<Timer className="h-5 w-5" />}
                                label="Waktu Proses"
                                value={duration || "0s"}
                                color="purple"
                            />
                        </div>

                        {/* Detailed Analysis Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="shadow-sm border-slate-200/60 overflow-hidden group">
                                <div className="h-1 bg-primary/20 w-full group-hover:bg-primary/40 transition-colors" />
                                <CardContent className="p-5">
                                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-xl bg-primary" />
                                        Metrik Efisiensi
                                    </h4>
                                    <div className="space-y-5">
                                        <div>
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-xs font-semibold text-slate-500">
                                                    Tingkat Kesuksesan
                                                </span>
                                                <span className="text-sm font-bold text-slate-900">
                                                    {stats?.total
                                                        ? `${(
                                                              ((stats.created + stats.updated) /
                                                                  stats.total) *
                                                              100
                                                          ).toFixed(1)}%`
                                                        : "0%"}
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-xl h-2.5 p-0.5 border shadow-inner">
                                                <div
                                                    className="bg-linear-to-r from-emerald-400 to-emerald-600 h-1.5 rounded-xl transition-all duration-1000 ease-out shadow-sm"
                                                    style={{
                                                        width: stats?.total
                                                            ? `${((stats.created + stats.updated) / stats.total) * 100}%`
                                                            : "0%",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] text-slate-400 italic">
                                            <span>*Berdasarkan validasi skema</span>
                                            <span>Total: {stats?.total || 0}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm border-slate-200/60 overflow-hidden group">
                                <div className="h-1 bg-blue-400/20 w-full group-hover:bg-blue-400/40 transition-colors" />
                                <CardContent className="p-5">
                                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-xl bg-blue-400" />
                                        Audit Log Import
                                    </h4>
                                    <div className="space-y-3">
                                        <InfoRows
                                            label="Mode"
                                            value={dryRun ? "Dry Run" : "Live Write"}
                                        />
                                        <InfoRows
                                            label="Waktu"
                                            value={new Date().toLocaleTimeString("id-ID")}
                                        />
                                        <InfoRows label="Status" value="Selesai" highlight />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <DialogFooter className="p-6 border-t bg-slate-50/80 sticky bottom-0 z-10 flex-row justify-end gap-3">
                        <Button size="sm"   variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="bg-white hover:bg-slate-50 border-slate-200"
                        >
                            Tutup
                        </Button>
                        <Button size="sm"   onClick={() => window.print()}
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
        amber: "bg-amber-50 text-amber-600 border-amber-100",
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

function InfoRows({
    label,
    value,
    highlight,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div className="flex justify-between items-center py-1">
            <span className="text-xs text-slate-500">{label}</span>
            <span
                className={`text-xs font-bold ${highlight ? "text-emerald-600" : "text-slate-700"}`}
            >
                {value}
            </span>
        </div>
    );
}

function RefreshCwIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
        </svg>
    );
}
