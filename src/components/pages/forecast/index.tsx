"use client";

import { useMemo, useState } from "react";
import { useMutationState } from "@tanstack/react-query";
import { Loader2, Search, Zap, Factory, CalendarRange, LayoutDashboard, Percent } from "lucide-react";
import Link from "next/link";

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";

import {
    useForecast,
    useForecastTableState,
    useFormForecast,
} from "@/app/(application)/forecasts/server/use.forecast";

import { ForecastColumns } from "./table/column";
import { useBulkProduction } from "@/app/(application)/production/server/use.production";
import { BatchForecastDialog } from "./dialogs/batch-forecast.dialog";
import { SyncProductionDialog } from "./dialogs/sync-production.dialog";

export function Forecast() {
    // UI States
    const [openForecastDialog, setOpenForecastDialog] = useState(false);
    const [openProductionDialog, setOpenProductionDialog] = useState(false);

    // Business Logic Hooks
    const table = useForecastTableState();
    const { list } = useForecast(table.queryParams);
    const mutationStates = useMutationState({
        filters: { mutationKey: ["forecasting", "run"], status: "pending" },
    });
    const isProcessingForecast = mutationStates.length > 0;

    const now = new Date();
    const bulkProduction = useBulkProduction({
        month: Number(now.getMonth() + 1),
        year: now.getFullYear(),
    });

    const isSyncingProduction = bulkProduction.isPending;

    const groupedData = useMemo(() => {
        return (list.data?.data as any) || [];
    }, [list.data]);

    const periods = useMemo(() => {
        if (!groupedData.length) return [];
        return groupedData[0].monthly_data.map((m: any) => ({
            year: m.year,
            month: m.month,
            period: m.period,
            percentage_value: m.percentage_value,
        }));
    }, [groupedData]);

    const columns = useMemo(() => ForecastColumns({ periods }), [periods]);

    return (
        <div className="flex flex-col gap-6 p-2 md:p-4">
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
                            <Link href="/forecasts/percentages">
                                <Button
                                    variant="outline"
                                    className="rounded-xl font-bold border-slate-200 hover:bg-slate-50 text-slate-700 h-11"
                                >
                                    <Percent className="mr-2 h-4 w-4 text-emerald-500" />
                                    Forecast Percentages
                                </Button>
                            </Link>

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
                                {isProcessingForecast ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-amber-400" />
                                ) : (
                                    <Zap className="mr-2 h-4 w-4 fill-amber-400 text-amber-400" />
                                     )}
                                {isProcessingForecast ? "Inisialisasi..." : "Run Analytics"}
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
                                data={groupedData}
                                page={table.page}
                                pageSize={table.take}
                                total={list.data?.len || 0}
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
                onSuccess={() => setOpenForecastDialog(false)}
            />

            <SyncProductionDialog
                open={openProductionDialog}
                onOpenChange={setOpenProductionDialog}
            />
        </div>
    );
}
