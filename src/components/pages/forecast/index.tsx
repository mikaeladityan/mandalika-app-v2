"use client";

import { useMemo, useState } from "react";
import { useMutationState } from "@tanstack/react-query";
import { Loader2, Search, Zap, CalendarRange, LayoutDashboard, Percent } from "lucide-react";
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
} from "@/app/(application)/forecasts/server/use.forecast";

import { ForecastColumns } from "./table/column";
import { useBulkProduction } from "@/app/(application)/production/server/use.production";
import { BatchForecastDialog } from "./dialogs/batch-forecast.dialog";
import { SyncProductionDialog } from "./dialogs/sync-production.dialog";
import { ManualForecastDialog } from "./dialogs/manual-forecast.dialog";

export function Forecast({ is_display }: { is_display?: boolean }) {
    // UI States
    const [openForecastDialog, setOpenForecastDialog] = useState(false);
    const [openProductionDialog, setOpenProductionDialog] = useState(false);
    const [manualEditData, setManualEditData] = useState<any>(null);
    const handleEditManual = useMemo(() => (data: any) => setManualEditData(data), []);

    // Business Logic Hooks
    const table = useForecastTableState(is_display);
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
        const now = new Date();
        const startMonth = now.getMonth() + 1;
        const startYear = now.getFullYear();
        return Array.from({ length: table.horizon }).map((_, i) => {
            const d = new Date(startYear, startMonth - 1 + i, 1);
            return {
                month: d.getMonth() + 1,
                year: d.getFullYear(),
            };
        });
    }, [table.horizon]);

    const columns = useMemo(
        () =>
            ForecastColumns({
                periods,
                horizon: table.horizon,
                onEditManual: handleEditManual,
            }),
        [periods, table.horizon, handleEditManual],
    );

    return (
        <div className="flex flex-col gap-4">
            {/* MAIN CONTENT CARD */}
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
                <CardHeader className="space-y-3 border-b border-slate-50">
                    {/* ROW 1: TITLE & PRIMARY ACTIONS */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-indigo-600 rounded-lg shrink-0">
                                <LayoutDashboard className="h-3.5 w-3.5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black tracking-tight text-slate-900 leading-none">
                                    Forecast Engine
                                </h2>
                                <p className="text-[10px] text-slate-400 font-medium mt-1">
                                    Kelola proyeksi stok dan sinkronisasi produksi.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <Link href="/forecasts/percentages">
                                <Button
                                    variant="outline"
                                    className="rounded-xl font-bold border-slate-200 hover:bg-slate-50 text-slate-700 h-8 px-3 text-[11px]"
                                >
                                    <Percent className="mr-1.5 h-3 w-3 text-emerald-500" />
                                    Percentages
                                </Button>
                            </Link>

                            <Button
                                onClick={() => setOpenForecastDialog(true)}
                                disabled={isProcessingForecast}
                                className="rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white h-8 shadow-sm px-4 text-[11px] transition-all"
                            >
                                {isProcessingForecast ? (
                                    <Loader2 className="mr-1.5 h-3 w-3 animate-spin text-amber-400" />
                                ) : (
                                    <Zap className="mr-1.5 h-3 w-3 fill-amber-400 text-amber-400" />
                                )}
                                {isProcessingForecast ? "Proses..." : "Run Analytics"}
                            </Button>
                        </div>
                    </div>

                    {/* ROW 2: SEARCH & FILTERS */}
                    <div className="flex flex-col lg:flex-row gap-3 items-center justify-between pt-1">
                        <div className="relative w-full lg:max-w-md group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <Input
                                placeholder="Cari..."
                                value={table.search}
                                onChange={(e) => table.setSearch(e.target.value)}
                                className="pl-9 h-9 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-indigo-500/20 text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 rounded-xl border border-slate-100 flex-1 lg:flex-none">
                                <CalendarRange className="h-3.5 w-3.5 text-slate-400" />
                                <Label className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
                                    Horizon SS (Avg)
                                </Label>
                                <Select
                                    value={String(table.horizon)}
                                    onValueChange={(val) => table.setHorizon(Number(val))}
                                >
                                    <SelectTrigger className="w-24 border-none bg-transparent h-6 focus:ring-0 font-bold text-slate-700 p-0 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-200">
                                        {[3, 4, 6, 12].map((h) => (
                                            <SelectItem
                                                key={h}
                                                value={String(h)}
                                                className="font-bold text-xs"
                                            >
                                                {h} Bulan
                                            </SelectItem>
                                        ))}
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
                        <div className="p-0">
                            <DataTable
                                tableId="forecast-main-table"
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
                is_display={is_display}
            />

            <SyncProductionDialog
                open={openProductionDialog}
                onOpenChange={setOpenProductionDialog}
            />

            <ManualForecastDialog
                open={!!manualEditData}
                onOpenChange={(open) => !open && setManualEditData(null)}
                data={manualEditData}
                onSuccess={() => setManualEditData(null)}
            />
        </div>
    );
}
