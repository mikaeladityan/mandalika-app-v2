"use client";

import { useMemo } from "react";
import {
    useConsolidation,
    useConsolidationTableState,
} from "@/app/(application)/consolidation/server/use.consolidation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import { ConsolidationColumns } from "./table/column";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import { PrintReport } from "./print-report";
import { Search, Download, Calculator, Layers, Printer, Store } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { OnChangeFn, VisibilityState, ColumnOrderState } from "@tanstack/react-table";
import Link from "next/link";

interface ConsolidationProps {
    title: string;
    description: string;
}

export function Consolidation({ title, description }: ConsolidationProps) {
    const table = useConsolidationTableState();
    const { list, exportData } = useConsolidation(table.queryParams);

    const tableId = "consolidation-main-table";
    const visibilityKey = `${tableId}-visibility`;
    const orderKey = `${tableId}-order`;

    const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(
        visibilityKey,
        {},
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

    const columns = useMemo(() => ConsolidationColumns(), []);

    const grandTotal = useMemo(() => {
        if (!list.data?.data) return 0;
        return list.data.data.reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
            0,
        );
    }, [list.data?.data]);

    const exportToExcel = () => {
        const allColIds = columns.map((c: any) => c.id || c.accessorKey);
        const visibleKeys = allColIds.filter((id) => columnVisibility[id] !== false);

        exportData.mutate({
            ...table.queryParams,
            visibleColumns: visibleKeys.join(","),
            columnOrder: columnOrder.join(","),
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="space-y-3 p-4 border-b border-slate-50">
                    {/* ROW 1: TITLE & PRIMARY ACTIONS */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-primary/10 text-primary rounded-lg shrink-0">
                                <Layers className="h-4 w-4" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black tracking-tight text-slate-900 leading-none">
                                    {title}
                                </h2>
                                <p className="text-[10px] text-slate-400 font-medium mt-1">
                                    {description}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 self-end md:self-auto">
                            <Button
                                onClick={exportToExcel}
                                disabled={
                                    list.isLoading ||
                                    !list.data?.data?.length ||
                                    exportData.isPending
                                }
                                className="h-8 bg-primary hover:bg-primary/90 text-white rounded-full shadow-sm font-bold gap-1.5 transition-all text-[11px] px-3"
                            >
                                <Download
                                    className={`w-3 h-3 ${exportData.isPending ? "animate-bounce" : ""}`}
                                />
                                {exportData.isPending ? "Mengekspor..." : "Excel"}
                            </Button>

                            <Button
                                onClick={() => window.print()}
                                disabled={list.isLoading}
                                className="h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-sm font-bold gap-1.5 transition-all text-[11px] px-3"
                            >
                                <Printer className="w-3.5 h-3.5" />
                                Print PDF
                            </Button>

                            <Link href="/consolidation/supplier">
                                <Button
                                    variant="outline"
                                    className="h-8 rounded-full font-bold gap-1.5 transition-all text-[11px] px-3 border-amber-200 text-amber-600 hover:bg-amber-50"
                                >
                                    <Store className="w-3 h-3" />
                                    Per Supplier
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* ROW 2: SEARCH & FILTERS */}
                    <div className="flex flex-col md:flex-row flex-wrap items-center gap-3 pt-1">
                        <div className="relative w-full sm:w-64 lg:w-72 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Cari..."
                                value={table.search}
                                onChange={(e) => table.setSearch(e.target.value)}
                                className="pl-9 h-9 w-full bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-primary/20 text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Select
                                value={
                                    table.month
                                        ? String(table.month)
                                        : String(new Date().getMonth() + 1)
                                }
                                onValueChange={(val) => table.setMonth(Number(val))}
                            >
                                <SelectTrigger className="w-28 h-9 bg-slate-50 border-slate-200 rounded-xl text-xs font-bold">
                                    <SelectValue placeholder="Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        "Jan",
                                        "Feb",
                                        "Mar",
                                        "Apr",
                                        "Mei",
                                        "Jun",
                                        "Jul",
                                        "Agu",
                                        "Sep",
                                        "Okt",
                                        "Nov",
                                        "Des",
                                    ].map((m, i) => (
                                        <SelectItem key={m} value={String(i + 1)}>
                                            {m}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={
                                    table.year
                                        ? String(table.year)
                                        : String(new Date().getFullYear())
                                }
                                onValueChange={(val) => table.setYear(Number(val))}
                            >
                                <SelectTrigger className="w-24 h-9 bg-slate-50 border-slate-200 rounded-xl text-xs font-bold">
                                    <SelectValue placeholder="Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from(
                                        { length: 5 },
                                        (_, i) => new Date().getFullYear() - 2 + i,
                                    ).map((y) => (
                                        <SelectItem key={y} value={String(y)}>
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="px-6 lg:px-8 pb-8">
                        {list.isLoading ? (
                            <div className="p-8 border border-slate-100 rounded-2xl">
                                <TableSkeleton />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <DataTable
                                    tableId="consolidation-main-table"
                                    columns={columns}
                                    data={list.data?.data ?? []}
                                    page={table.page}
                                    pageSize={table.take}
                                    total={list.data?.len ?? 0}
                                    onPageChange={table.setPage}
                                    onPageSizeChange={table.setTake}
                                    state={{ columnVisibility }}
                                    onColumnVisibilityChange={handleColumnVisibilityChange}
                                    columnOrder={columnOrder}
                                    onColumnOrderChange={handleColumnOrderChange}
                                    sorting={
                                        table.sortBy
                                            ? { id: table.sortBy, desc: table.order === "desc" }
                                            : null
                                    }
                                    onSortingChange={(id, desc) =>
                                        table.setSorting(id, desc ? "desc" : "asc")
                                    }
                                />
                                {list.data?.data && list.data.data.length > 0 && (
                                    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                        <div className="flex items-center gap-3 text-primary">
                                            <div className="p-2 bg-primary/10 rounded-xl">
                                                <Calculator className="w-5 h-5" />
                                            </div>
                                            <span className="font-semibold text-sm">
                                                Estimasi Pembayaran (Semua halaman)
                                            </span>
                                        </div>
                                        <div className="text-xl md:text-2xl font-black text-primary tracking-tight mt-2 sm:mt-0">
                                            Rp {formatNumber(grandTotal)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
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
                />
            )}
        </div>
    );
}
