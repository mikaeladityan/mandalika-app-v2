"use client";

import { useMemo } from "react";
import {
    useRecomendationV2,
    useRecomendationV2TableState,
} from "@/app/(application)/recomendation-v2/server/use.recomendation-v2";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import { Search, TrendingUp, CalendarDays, Download, Printer } from "lucide-react";
import { RecomendationV2Columns } from "./table/column";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Loader2, X } from "lucide-react";
import { OnChangeFn, VisibilityState, ColumnOrderState } from "@tanstack/react-table";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { PrintReport } from "./print-report";

interface RecomendationV2Props {
    title: string;
    description: string;
    type: "ffo" | "lokal" | "impor";
}

export function RecomendationV2({ title, description, type }: RecomendationV2Props) {
    const tableState = useRecomendationV2TableState({ defaultType: type });
    const { list, exportData } = useRecomendationV2(tableState.queryParams);

    // Persistence keys for column state based on type
    const tableId = `rec-v2-main-table-${type}`;
    const visibilityKey = `${tableId}-visibility`;
    const orderKey = `${tableId}-order`;

    const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(
        visibilityKey,
        {
            supplier: false,
            moq: false,
            total_open_po: true,
        },
    );

    const [columnOrder, setColumnOrder] = useLocalStorage<ColumnOrderState>(orderKey, []);

    const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = (updater: any) => {
        const next = typeof updater === "function" ? updater(columnVisibility) : updater;
        setColumnVisibility(next);
    };

    const handleColumnOrderChange: OnChangeFn<ColumnOrderState> = (updater: any) => {
        const next = typeof updater === "function" ? updater(columnOrder) : updater;
        setColumnOrder(next);
    };

    const periods = useMemo(() => {
        if (!list.data?.periods) {
            return {
                sales_periods: [],
                forecast_periods: [],
                po_periods: [],
                month: tableState.month,
                year: tableState.year,
                forecastMonths: tableState.forecastMonths,
            };
        }
        return {
            sales_periods: list.data.periods.sales_periods ?? [],
            forecast_periods: list.data.periods.forecast_periods ?? [],
            po_periods: list.data.periods.po_periods ?? [],
            month: tableState.month,
            year: tableState.year,
            forecastMonths: tableState.forecastMonths,
        };
    }, [list.data?.periods, tableState.month, tableState.year, tableState.forecastMonths]);

    const columns = useMemo(
        () => RecomendationV2Columns(periods),
        [periods],
    );

    const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    return (
        <div className="flex flex-col gap-4">
            <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white">
                <CardHeader className="space-y-4 border-b border-border/50 bg-white p-6">
                    {/* ROW 1: TITLE & ACTIONS */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                <TrendingUp className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground tracking-tight">
                                    {title}
                                </h1>
                                <p className="text-xs text-muted-foreground font-medium">
                                    {description}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1 self-end md:self-auto">
                            <Button
                                onClick={() => {
                                    // Get visible column IDs from state
                                    // Identify all columns from definition first
                                    const allColIds = columns.map((c: any) => c.id || c.accessorKey);

                                    // Filter based on visibility state
                                    const visibleKeys = allColIds.filter(
                                        (id) => columnVisibility[id] !== false,
                                    );

                                    exportData.mutate({
                                        ...tableState.queryParams,
                                        visibleColumns: visibleKeys.join(","),
                                        columnOrder: columnOrder.join(","),
                                    });
                                }}
                                disabled={exportData.isPending || list.isLoading}
                                variant="outline"
                                className="h-8 bg-emerald-50 text-emerald-700 border-emerald-100 rounded-xl font-bold shadow-sm hover:bg-emerald-100 transition-all px-3 text-[11px] flex items-center gap-1.5 group"
                            >
                                <Download
                                    className={`size-3.5 ${exportData.isPending ? "animate-bounce" : "group-hover:translate-y-0.5 transition-transform"}`}
                                />
                                {exportData.isPending ? "..." : "Excel"}
                            </Button>

                            <Button
                                onClick={() => window.print()}
                                disabled={list.isLoading || !list.data?.data?.length}
                                variant="outline"
                                className="h-8 bg-blue-50 text-blue-700 border-blue-100 rounded-xl font-bold shadow-sm hover:bg-blue-100 transition-all px-3 text-[11px] flex items-center gap-1.5 group"
                            >
                                <Printer className="size-3.5 group-hover:scale-110 transition-transform" />
                                Print PDF
                            </Button>
                        </div>
                    </div>

                    {/* ROW 2: SEARCH & FILTERS */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        {/* Search and Results Count */}
                        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full lg:max-w-2xl">
                            <InputGroup className="w-full md:max-w-sm rounded-xl">
                                <InputGroupInput
                                    placeholder="Cari material, barcode, atau supplier..."
                                    value={tableState.search}
                                    onChange={(e) => tableState.setSearch(e.target.value)}
                                    className="pl-3 h-10 border-none bg-transparent"
                                />
                                <InputGroupAddon align="inline-end">
                                    {list.isFetching ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    ) : (
                                        <Search className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </InputGroupAddon>
                                <InputGroupAddon align="inline-end" className="pr-3">
                                    <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap bg-muted/50 px-1.5 py-0.5 rounded">
                                        {list.data?.len ?? 0} Item
                                    </span>
                                </InputGroupAddon>
                            </InputGroup>

                            {/* Reset Button */}
                            {(tableState.search || tableState.queryParams.page !== 1) && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={tableState.reset}
                                    className="h-10 px-3 text-muted-foreground hover:text-foreground font-bold text-xs"
                                >
                                    Reset Filter <X className="ml-1.5 h-3.5 w-3.5" />
                                </Button>
                            )}
                        </div>

                        {/* Date & Horizon Selectors */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-lg border border-transparent focus-within:border-primary/10 transition-all text-muted-foreground mr-1">
                                <TrendingUp className="size-4 text-primary/60 ml-1" />
                                <Label className="text-[10px] font-bold text-nowrap uppercase tracking-tight">
                                    Horizon
                                </Label>
                                <Select
                                    value={String(tableState.forecastMonths)}
                                    onValueChange={(val) => tableState.setForecastMonths(Number(val))}
                                >
                                    <SelectTrigger className="w-20 border-none bg-transparent h-6 focus:ring-0 font-bold text-foreground p-0 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-border/50 shadow-xl">
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
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

                            <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-lg border border-transparent focus-within:border-primary/10 transition-all">
                                <CalendarDays className="size-4 text-primary/60 ml-1" />
                                <Select
                                    value={String(tableState.month)}
                                    onValueChange={(val) => tableState.setMonth(Number(val))}
                                >
                                    <SelectTrigger className="w-[110px] h-8 border-none bg-transparent focus:ring-0 font-semibold text-foreground text-xs px-1">
                                        <SelectValue placeholder="Bulan" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-indigo-50 shadow-xl">
                                        {months.map((m, i) => (
                                            <SelectItem
                                                key={m}
                                                value={String(i + 1)}
                                                className="text-[11px] font-bold"
                                            >
                                                {m}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <div className="w-px h-5 bg-border/50" />

                                <Select
                                    value={String(tableState.year)}
                                    onValueChange={(val) => tableState.setYear(Number(val))}
                                >
                                    <SelectTrigger className="w-[80px] h-8 border-none bg-transparent focus:ring-0 font-semibold text-foreground text-xs px-1">
                                        <SelectValue placeholder="Tahun" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-indigo-50 shadow-xl">
                                        {Array.from(
                                            { length: 5 },
                                            (_, i) => new Date().getFullYear() - 2 + i,
                                        ).map((y) => (
                                            <SelectItem
                                                key={y}
                                                value={String(y)}
                                                className="text-[11px] font-bold"
                                            >
                                                {y}
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
                                tableId={`rec-v2-main-table-${type}`}
                                columns={columns}
                                data={list.data?.data ?? []}
                                page={tableState.page}
                                pageSize={tableState.take}
                                total={list.data?.len ?? 0}
                                onPageChange={tableState.setPage}
                                onPageSizeChange={tableState.setTake}
                                state={{ columnVisibility }}
                                onColumnVisibilityChange={handleColumnVisibilityChange}
                                columnOrder={columnOrder}
                                onColumnOrderChange={handleColumnOrderChange}
                                sorting={
                                    tableState.sortBy
                                        ? { id: tableState.sortBy, desc: tableState.order === "desc" }
                                        : null
                                }
                                onSortingChange={(id, desc) =>
                                    tableState.setSorting(id, desc ? "desc" : "asc")
                                }
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Hidden Printable Version */}
            {list.data?.data && (
                <PrintReport
                    data={list.data.data}
                    visibleColumns={columns
                        .map((c: any) => c.id || c.accessorKey)
                        .filter((id) => columnVisibility[id] !== false)}
                    title={title}
                    periods={periods}
                />
            )}
        </div>
    );
}
