"use client";

import { useMemo, useState } from "react";
import {
    useRecomendationV2,
    useRecomendationV2TableState,
} from "@/app/(application)/recomendation-v2/server/use.recomendation-v2";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import { Search, TrendingUp, CalendarDays, Zap, Download, CalendarRange } from "lucide-react";
import { RecomendationV2Columns } from "./table/column";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { OnChangeFn, VisibilityState } from "@tanstack/react-table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useLocalStorage } from "@/hooks/use-local-storage";

interface RecomendationV2Props {
    title: string;
    description: string;
    type: "ffo" | "lokal" | "impor";
}

export function RecomendationV2({ title, description, type }: RecomendationV2Props) {
    const tableState = useRecomendationV2TableState({ defaultType: type });
    const { list, bulkSaveHorizon, exportData } = useRecomendationV2(tableState.queryParams);
    const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);

    // Persistence key for column visibility based on type
    const tableId = `rec-v2-main-table-${type}`;
    const visibilityKey = `${tableId}-visibility`;

    const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(
        visibilityKey,
        {
            supplier: false,
            moq: false,
            total_open_po: true,
        },
    );

    const periods = useMemo(() => {
        if (!list.data?.periods) {
            return {
                sales_periods: [],
                forecast_periods: [],
                po_periods: [],
            };
        }
        return {
            sales_periods: list.data.periods.sales_periods ?? [],
            forecast_periods: list.data.periods.forecast_periods ?? [],
            po_periods: list.data.periods.po_periods ?? [],
        };
    }, [list.data?.periods]);

    const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = (updater: any) => {
        const next = typeof updater === "function" ? updater(columnVisibility) : updater;
        setColumnVisibility(next);
    };

    const columns = useMemo(
        () =>
            RecomendationV2Columns({
                ...periods,
                month: tableState.month,
                year: tableState.year,
                forecastMonths: tableState.forecastMonths,
            }),
        [periods, tableState.month, tableState.year, tableState.forecastMonths],
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
                                    {title} <span className="text-primary">V2</span>
                                </h1>
                                <p className="text-xs text-muted-foreground font-medium">
                                    {description}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1 self-end md:self-auto">
                            <Button
                                onClick={() => exportData.mutate(tableState.queryParams)}
                                disabled={exportData.isPending || list.isLoading}
                                variant="outline"
                                className="h-8 bg-emerald-50 text-emerald-700 border-emerald-100 rounded-xl font-bold shadow-sm hover:bg-emerald-100 transition-all px-3 text-[11px] flex items-center gap-1.5 group"
                            >
                                <Download
                                    className={`size-3.5 ${exportData.isPending ? "animate-bounce" : "group-hover:translate-y-0.5 transition-transform"}`}
                                />
                                {exportData.isPending ? "..." : "Excel"}
                            </Button>
                        </div>
                    </div>

                    {/* ROW 2: SEARCH & FILTERS */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        {/* Search */}
                        <div className="relative group w-full lg:max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Cari material..."
                                value={tableState.search}
                                onChange={(e) => tableState.setSearch(e.target.value)}
                                className="pl-10 h-10 bg-muted/30 border-transparent focus-visible:bg-white focus-visible:border-primary/20 transition-all"
                            />
                        </div>

                        {/* Date & Horizon Selectors */}
                        <div className="flex flex-wrap items-center gap-3">
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
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
//  <DropdownMenu>
//      <DropdownMenuTrigger asChild>
//          <Button
//              variant="outline"
//              className="h-14 bg-white border-indigo-100 rounded-3xl font-black text-slate-600 hover:bg-slate-50 transition-all border-dashed shadow-sm px-6"
//          >
//              <Settings2 className="mr-2 h-5 w-5 text-indigo-500" />
//              Kolom <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
//          </Button>
//      </DropdownMenuTrigger>
//      <DropdownMenuContent
//          align="end"
//          className="w-64 rounded-[1.5rem] p-3 shadow-2xl border-indigo-50"
//      >
//          <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//              Konfigurasi Kolom
//          </div>
//          <div className="space-y-1 mt-2">
//              {/* Sales Group Toggle */}
//              {periods.sales_periods.length > 0 && (
//                  <DropdownMenuCheckboxItem
//                      className="rounded-xl capitalize font-bold text-indigo-600 py-3 bg-indigo-50/50 cursor-pointer"
//                      checked={periods.sales_periods.every(
//                          (p: any) => columnVisibility[`sales_${p.key}`] !== false,
//                      )}
//                      onCheckedChange={(value) => {
//                          handleColumnVisibilityChange((prev: any) => {
//                              const updates: VisibilityState = {};
//                              periods.sales_periods.forEach((p: any) => {
//                                  updates[`sales_${p.key}`] = !!value;
//                              });
//                              return { ...prev, ...updates };
//                          });
//                      }}
//                  >
//                      Sales History ({periods.sales_periods.length})
//                  </DropdownMenuCheckboxItem>
//              )}

//              {/* Needs Group Toggle */}
//              {periods.forecast_periods.length > 0 && (
//                  <DropdownMenuCheckboxItem
//                      className="rounded-xl capitalize font-bold text-orange-600 py-3 bg-orange-50/50 cursor-pointer"
//                      checked={periods.forecast_periods.every(
//                          (p: any) => columnVisibility[`need_${p.key}`] !== false,
//                      )}
//                      onCheckedChange={(value) => {
//                          handleColumnVisibilityChange((prev: any) => {
//                              const updates: VisibilityState = {};
//                              periods.forecast_periods.forEach((p: any) => {
//                                  updates[`need_${p.key}`] = !!value;
//                              });
//                              return { ...prev, ...updates };
//                          });
//                      }}
//                  >
//                      Needs Buy ({periods.forecast_periods.length})
//                  </DropdownMenuCheckboxItem>
//              )}

//              {/* PO Group Toggle */}
//              {periods.po_periods?.length > 0 && (
//                  <DropdownMenuCheckboxItem
//                      className="rounded-xl capitalize font-bold text-emerald-600 py-3 bg-emerald-50/50 cursor-pointer"
//                      checked={periods.po_periods.every(
//                          (p: any) => columnVisibility[`po_${p.key}`] !== false,
//                      )}
//                      onCheckedChange={(value) => {
//                          handleColumnVisibilityChange((prev: any) => {
//                              const updates: VisibilityState = {};
//                              periods.po_periods.forEach((p: any) => {
//                                  updates[`po_${p.key}`] = !!value;
//                              });
//                              return { ...prev, ...updates };
//                          });
//                      }}
//                  >
//                      Open PO Partial ({periods.po_periods.length})
//                  </DropdownMenuCheckboxItem>
//              )}

//              {/* Total Open PO XOR Toggle */}
//              <DropdownMenuCheckboxItem
//                  className="rounded-xl capitalize font-bold text-emerald-700 py-3 border border-emerald-100 bg-emerald-50/30 cursor-pointer"
//                  checked={columnVisibility["total_open_po"] !== false}
//                  onCheckedChange={(value) => {
//                      handleColumnVisibilityChange((prev: any) => ({
//                          ...prev,
//                          total_open_po: !!value,
//                      }));
//                  }}
//              >
//                  Ringkasan Total PO
//              </DropdownMenuCheckboxItem>

//              {columns.map((column: any) => {
//                  const columnId = column.accessorKey || column.id;
//                  const header = column.header;

//                  if (!columnId || typeof header !== "string") return null;

//                  // Skip individual dynamic columns to keep selector clean
//                  if (
//                      columnId.startsWith("sales_") ||
//                      columnId.startsWith("need_") ||
//                      columnId.startsWith("po_") ||
//                      columnId === "total_open_po"
//                  )
//                      return null;

//                  return (
//                      <DropdownMenuCheckboxItem
//                          key={columnId}
//                          className="rounded-xl capitalize font-bold text-slate-600 py-3 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-600 cursor-pointer"
//                          checked={columnVisibility[columnId] !== false}
//                          onCheckedChange={(value) => {
//                              setColumnVisibility((prev) => ({
//                                  ...prev,
//                                  [columnId]: !!value,
//                              }));
//                          }}
//                      >
//                          {header.toLowerCase()}
//                      </DropdownMenuCheckboxItem>
//                  );
//              })}
//          </div>
//      </DropdownMenuContent>
//  </DropdownMenu>;
