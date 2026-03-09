"use client";

import { useMemo, useState, useEffect } from "react";
import {
    Loader2,
    Search,
    Zap,
    Info,
    X,
    CheckCircle2,
    AlertCircle,
    Bug,
    Factory,
    CalendarRange,
    ArrowRight,
    LayoutDashboard,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
    useForecast,
    useForecastTableState,
} from "@/app/(application)/forecasts/server/use.forecast";

import { ForecastColumns } from "./table/column";
import { forecastService } from "@/app/(application)/forecasts/server/forecast.service";
import { useBulkProduction } from "@/app/(application)/production/server/use.production";
import { BatchForecastDialog } from "./dialogs/batch-forecast.dialog";
import { SyncProductionDialog } from "./dialogs/sync-production.dialog";
import { toast } from "sonner";

export function Forecast() {
    const queryClient = useQueryClient();

    // UI States
    const [openForecastDialog, setOpenForecastDialog] = useState(false);
    const [openProductionDialog, setOpenProductionDialog] = useState(false);
    const [activeJobId, setActiveJobId] = useState<string | null>(null);
    // const [showErrorDetail, setShowErrorDetail] = useState(false);

    // Business Logic Hooks
    const table = useForecastTableState();
    const { list } = useForecast(table.queryParams);

    const now = new Date();
    const bulkProduction = useBulkProduction({
        month: Number(now.getMonth() + 1),
        year: now.getFullYear(),
    });

    // --- JOB MONITORING LOGIC ---
    useEffect(() => {
        const savedJobId = sessionStorage.getItem("active_forecast_job");
        if (savedJobId) setActiveJobId(savedJobId);
    }, []);

    const job = useQuery({
        queryKey: ["forecast-job-status", activeJobId],
        queryFn: () => forecastService.getStatusJob(activeJobId!),
        enabled: !!activeJobId,
        refetchInterval: (query) => (query.state.data?.status === "PROCESSING" ? 2000 : false),
    });

    useEffect(() => {
        if (job.data?.status === "SUCCESS") {
            queryClient.invalidateQueries({ queryKey: ["forecast"] });
            sessionStorage.removeItem("active_forecast_job");
            if (!job.data?.error) {
                const timer = setTimeout(() => setActiveJobId(null), 8000);
                return () => clearTimeout(timer);
            }
        }
        if (job.data?.status === "ERROR") {
            sessionStorage.removeItem("active_forecast_job");
        }
    }, [job.data?.status, queryClient]);

    const onHitRunForecast = (jobId: string) => {
        setOpenForecastDialog(false);
        setActiveJobId(jobId);
        sessionStorage.setItem("active_forecast_job", jobId);
        toast.success("Kalkulasi engine dimulai");
    };

    const isProcessingForecast = job.data?.status === "PROCESSING";
    const isSyncingProduction = bulkProduction.isPending;
    const progressValue = job.data ? (job.data.current / job.data.total) * 100 : 0;

    const periods = useMemo(() => {
        if (!list.data?.data?.length) return [];
        return list.data.data[0].monthly_data.map((m: any) => ({
            year: m.year,
            month: m.month,
            period: m.period,
        }));
    }, [list.data]);

    const columns = useMemo(() => ForecastColumns({ periods }), [periods]);

    return (
        <div className="flex flex-col gap-6 p-2 md:p-4">
            {/* ALERT SECTION: Job Progress */}
            {activeJobId && job.data && (
                <Card className="overflow-hidden border-none shadow-lg bg-white/50 backdrop-blur-sm ring-1 ring-slate-200">
                    <CardContent className="p-0">
                        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`p-2.5 rounded-xl ${
                                        job.data.status === "SUCCESS"
                                            ? "bg-emerald-100 text-emerald-600"
                                            : job.data.status === "ERROR"
                                              ? "bg-red-100 text-red-600"
                                              : "bg-amber-100 text-amber-600"
                                    }`}
                                >
                                    {isProcessingForecast ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : job.data.status === "SUCCESS" ? (
                                        <CheckCircle2 className="h-5 w-5" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                        Engine Forecasting
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0"
                                        >
                                            {job.data.status}
                                        </Badge>
                                    </h4>
                                    <p className="text-xs text-slate-500 font-medium">
                                        Progress: {job.data.current} dari {job.data.total} item
                                        diproses
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden md:block">
                                    <span className="text-xl font-black text-slate-900">
                                        {Math.round(progressValue)}%
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setActiveJobId(null)}
                                    className="rounded-full hover:bg-slate-100"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <Progress value={progressValue} className="h-1 rounded-none bg-slate-100" />
                    </CardContent>
                </Card>
            )}

            {/* MAIN CONTENT CARD */}
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="space-y-6 p-6 lg:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-600 rounded-lg">
                                    <LayoutDashboard className="h-5 w-5 text-white" />
                                </div>
                                <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                                    Forecast Engine
                                </CardTitle>
                            </div>
                            <CardDescription className="text-slate-500 font-medium ml-11">
                                Kelola proyeksi kebutuhan stok dan sinkronisasi jalur produksi.
                            </CardDescription>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-auto">
                            <Button
                                onClick={() => setOpenProductionDialog(true)}
                                disabled={isSyncingProduction || isProcessingForecast}
                                variant="outline"
                                className="rounded-xl font-bold border-slate-200 hover:bg-slate-50 text-slate-700 h-11"
                            >
                                {isSyncingProduction ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Factory className="mr-2 h-4 w-4 text-indigo-500" />
                                )}
                                Sync Production
                            </Button>
                            <Button
                                onClick={() => setOpenForecastDialog(true)}
                                disabled={isProcessingForecast}
                                className="rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white h-11 shadow-md px-6 transition-all active:scale-95"
                            >
                                <Zap className="mr-2 h-4 w-4 fill-amber-400 text-amber-400" />
                                Run Analytics
                            </Button>
                        </div>
                    </div>

                    <Separator className="bg-slate-100" />

                    {/* TOOLBAR */}
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full lg:max-w-md group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <Input
                                placeholder="Cari nama produk, SKU, atau kategori..."
                                value={table.search}
                                onChange={(e) => table.setSearch(e.target.value)}
                                className="pl-11 h-12 bg-slate-50/50 border-slate-200 rounded-2xl focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all font-medium"
                            />
                        </div>

                        <div className="flex items-center gap-4 w-full lg:w-auto">
                            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 flex-1 lg:flex-none">
                                <CalendarRange className="h-4 w-4 text-slate-400 shrink-0" />
                                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-tighter hidden sm:block">
                                    Horizon
                                </Label>
                                <Select
                                    value={String(table.horizon)}
                                    onValueChange={(val) => table.setHorizon(Number(val))}
                                >
                                    <SelectTrigger className="w-full sm:w-32.5 border-none bg-transparent h-8 focus:ring-0 font-bold text-slate-700 p-0">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                        <SelectItem value="12" className="font-bold">
                                            12 Bulan
                                        </SelectItem>
                                        <SelectItem value="24" className="font-bold">
                                            24 Bulan
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {list.isLoading ? (
                        <div className="p-8">
                            <TableSkeleton />
                        </div>
                    ) : (
                        <div className="border-t border-slate-50">
                            <DataTable
                                columns={columns}
                                data={list.data?.data ?? []}
                                page={table.page}
                                pageSize={table.take}
                                total={list.data?.len ?? 0}
                                onPageChange={table.setPage}
                                onPageSizeChange={table.setPageSize}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* DIALOGS */}
            <BatchForecastDialog
                open={openForecastDialog}
                onOpenChange={setOpenForecastDialog}
                onSuccess={onHitRunForecast}
            />

            <SyncProductionDialog
                open={openProductionDialog}
                onOpenChange={setOpenProductionDialog}
            />
        </div>
    );
}
