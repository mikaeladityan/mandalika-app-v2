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
            <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white">
                <CardHeader className="space-y-4 border-b border-border/50 bg-white">
                    {/* ROW 1: TITLE & PRIMARY ACTIONS */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                <LayoutDashboard className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-foreground">
                                    Forecast Engine
                                </h1>
                                <p className="text-xs text-muted-foreground font-medium">
                                    Kelola proyeksi stok dan sinkronisasi produksi.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link href="/forecasts/percentages">
                                <Button
                                    variant="outline"
                                    className="rounded-lg font-semibold h-9 px-4"
                                >
                                    <Percent className="mr-1.5 size-4 text-primary" />
                                    Percentages
                                </Button>
                            </Link>

                            <Button
                                onClick={() => setOpenForecastDialog(true)}
                                disabled={isProcessingForecast}
                                className="rounded-lg font-semibold h-9 px-4"
                            >
                                {isProcessingForecast ? (
                                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                                ) : (
                                    <Zap className="mr-1.5 size-4 fill-amber-400 text-amber-400" />
                                )}
                                {isProcessingForecast ? "Proses..." : "Run Analytics"}
                            </Button>
                        </div>
                    </div>

                    {/* ROW 2: SEARCH & FILTERS */}
                    <div className="flex flex-col lg:flex-row gap-3 items-center justify-between pt-1">
                        <div className="relative w-full lg:max-w-sm group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Cari material..."
                                value={table.search}
                                onChange={(e) => table.setSearch(e.target.value)}
                                className="pl-10 h-10 bg-muted/30 border-transparent focus-visible:bg-white focus-visible:border-primary/20 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-lg border border-transparent focus-within:border-primary/10 transition-all">
                                <CalendarRange className="size-4 text-primary/60" />
                                <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">
                                    Horizon SS
                                </Label>
                                <Select
                                    value={String(table.horizon)}
                                    onValueChange={(val) => table.setHorizon(Number(val))}
                                >
                                    <SelectTrigger className="w-24 border-none bg-transparent h-6 focus:ring-0 font-bold text-foreground p-0 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-border/50">
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

                <CardContent className="p-0 px-6 pb-6">
                    {list.isLoading ? (
                        <div className="py-10">
                            <TableSkeleton />
                        </div>
                    ) : (
                        <div className="overflow-hidden">
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
