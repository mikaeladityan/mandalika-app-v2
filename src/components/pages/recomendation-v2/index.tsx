"use client";

import { useMemo, useState, useEffect } from "react";
import {
    useRecomendationV2,
    useRecomendationV2TableState,
} from "@/app/(application)/recomendation-v2/server/use.recomendation-v2";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import { Search, TrendingUp, CalendarDays, Zap, Download } from "lucide-react";
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

interface RecomendationV2Props {
    title: string;
    description: string;
    type?: "ffo" | "lokal" | "impor";
}

export function RecomendationV2({ title, description, type }: RecomendationV2Props) {
    const tableState = useRecomendationV2TableState({ defaultType: type });
    const { list, bulkSaveHorizon, exportData } = useRecomendationV2(tableState.queryParams);
    const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);

    const handleBulkHorizon = () => {
        setIsBulkDialogOpen(true);
    };

    const confirmBulkHorizon = () => {
        bulkSaveHorizon.mutate(
            {
                month: tableState.month,
                year: tableState.year,
                horizon: 3,
                type: type,
            },
            {
                onSuccess: () => {
                    setIsBulkDialogOpen(false);
                },
            },
        );
    };
    const periods = useMemo(() => {
        if (!(list.data as any)?.meta) {
            return {
                sales_periods: [],
                forecast_periods: [],
                po_periods: [],
            };
        }
        return {
            sales_periods: (list.data as any).meta.sales_periods || [],
            forecast_periods: (list.data as any).meta.forecast_periods || [],
            po_periods: (list.data as any).meta.po_periods || [],
        };
    }, [list.data]);

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        supplier: false,
        moq: false,
        total_open_po: true,
        // lead_time: false,
    });

    // Auto-hide monthly PO columns by default once data is loaded
    useEffect(() => {
        if (periods.po_periods.length > 0) {
            setColumnVisibility((prev) => {
                const updates: VisibilityState = {};
                let changed = false;

                // Ensure XOR logic on initial load
                // If total_open_po is true (default), hide all monthly columns
                const shouldHideMonthly = prev.total_open_po !== false;

                periods.po_periods.forEach((p: any) => {
                    const key = `po_${p.key}`;
                    const targetVisibility = !shouldHideMonthly;
                    if (prev[key] !== targetVisibility) {
                        updates[key] = targetVisibility;
                        changed = true;
                    }
                });

                return changed ? { ...prev, ...updates } : prev;
            });
        }
    }, [periods.po_periods]);

    const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = (updater: any) => {
        setColumnVisibility((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            const final = { ...next };

            // Find what changed
            const changedKeys = Object.keys(next).filter((k) => next[k] !== prev[k]);
            if (changedKeys.length === 0) return final;

            for (const key of changedKeys) {
                const isVisible = next[key];
                if (key === "total_open_po" && isVisible) {
                    // Disable all po_*
                    periods.po_periods.forEach((p: any) => {
                        final[`po_${p.key}`] = false;
                    });
                } else if (key.startsWith("po_") && isVisible) {
                    // Disable total_open_po
                    final["total_open_po"] = false;
                }
            }
            return final;
        });
    };

    const columns = useMemo(
        () =>
            RecomendationV2Columns({ ...periods, month: tableState.month, year: tableState.year }),
        [periods, tableState.month, tableState.year],
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
        <div className="flex flex-col gap-6 p-2 md:p-4">
            <Card className="border-none shadow-2xl shadow-indigo-100/50 rounded-[2.5rem] overflow-hidden bg-white">
                <CardHeader className="space-y-8 p-8 lg:p-10 border-b border-indigo-50/50 bg-linear-to-br from-white to-indigo-50/20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-indigo-600 text-white rounded-3xl shadow-lg shadow-indigo-200 animate-pulse-slow">
                                <TrendingUp className="h-7 w-7" />
                            </div>
                            <div>
                                <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">
                                    {title} <span className="text-indigo-600">v2</span>
                                </CardTitle>
                                <CardDescription className="text-slate-500 font-medium text-sm mt-1">
                                    {description}
                                </CardDescription>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <Button
                                onClick={handleBulkHorizon}
                                disabled={bulkSaveHorizon.isPending}
                                className="h-14 bg-indigo-600 text-white rounded-3xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all px-8 border-none group"
                            >
                                <Zap
                                    className={`mr-2 h-5 w-5 ${bulkSaveHorizon.isPending ? "animate-spin" : "group-hover:scale-110 transition-transform"}`}
                                />
                                {bulkSaveHorizon.isPending ? "Memproses..." : "Bulk Horizon (3m)"}
                            </Button>

                            <Button
                                onClick={() => exportData.mutate(tableState.queryParams)}
                                disabled={exportData.isPending || list.isLoading}
                                variant="outline"
                                className="h-14 bg-emerald-50 text-emerald-700 border-emerald-100 rounded-3xl font-black shadow-sm hover:bg-emerald-100 transition-all px-8 flex items-center gap-2 group"
                            >
                                <Download
                                    className={`size-5 ${exportData.isPending ? "animate-bounce" : "group-hover:translate-y-0.5 transition-transform"}`}
                                />
                                {exportData.isPending ? "Exporting..." : "Excel"}
                            </Button>

                            <div className="flex items-center gap-3 bg-white p-2 rounded-3xl border border-indigo-100 shadow-sm">
                                <CalendarDays className="size-4 text-indigo-400 ml-2" />
                                <Select
                                    value={String(tableState.month)}
                                    onValueChange={(val) => tableState.setMonth(Number(val))}
                                >
                                    <SelectTrigger className="w-[140px] h-10 border-none bg-transparent focus:ring-0 font-bold text-slate-700">
                                        <SelectValue placeholder="Bulan" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-indigo-50 shadow-xl">
                                        {months.map((m, i) => (
                                            <SelectItem
                                                key={m}
                                                value={String(i + 1)}
                                                className="rounded-xl"
                                            >
                                                {m}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <div className="w-px h-6 bg-indigo-100" />

                                <Select
                                    value={String(tableState.year)}
                                    onValueChange={(val) => tableState.setYear(Number(val))}
                                >
                                    <SelectTrigger className="w-[100px] h-10 border-none bg-transparent focus:ring-0 font-bold text-slate-700">
                                        <SelectValue placeholder="Tahun" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-indigo-50 shadow-xl">
                                        {Array.from(
                                            { length: 5 },
                                            (_, i) => new Date().getFullYear() - 2 + i,
                                        ).map((y) => (
                                            <SelectItem
                                                key={y}
                                                value={String(y)}
                                                className="rounded-xl"
                                            >
                                                {y}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="relative group max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-all duration-300" />
                        <Input
                            placeholder="Cari material berdasarkan nama atau barcode..."
                            value={tableState.search}
                            onChange={(e) => tableState.setSearch(e.target.value)}
                            className="pl-12 h-14 bg-white border-slate-200 rounded-[1.25rem] focus-visible:ring-indigo-500/10 focus:border-indigo-500/50 transition-all duration-300 font-medium shadow-sm group-hover:shadow-md"
                        />
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="px-8 lg:px-10 py-10">
                        {list.isLoading ? (
                            <div className="space-y-4">
                                <TableSkeleton />
                            </div>
                        ) : (
                            <div>
                                <DataTable
                                    tableId="recommendation-v2-main-table"
                                    columns={columns}
                                    data={list.data?.data ?? []}
                                    page={tableState.page}
                                    pageSize={tableState.take}
                                    total={list.data?.meta?.total ?? 0}
                                    onPageChange={tableState.setPage}
                                    onPageSizeChange={tableState.setTake}
                                    state={{ columnVisibility }}
                                    onColumnVisibilityChange={handleColumnVisibilityChange}
                                    // enableMultiSelect={false}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
                <DialogContent className="rounded-[2.5rem] p-8 lg:p-10 border-none shadow-2xl max-w-md bg-white overflow-hidden">
                    <DialogHeader className="space-y-4">
                        <div className="mx-auto w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mb-2">
                            <Zap className="h-10 w-10 text-indigo-600 animate-pulse" />
                        </div>
                        <DialogTitle className="text-2xl font-black text-slate-900 text-center tracking-tight">
                            Eksekusi Bulk <span className="text-indigo-600">Horizon</span>
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-center text-base leading-relaxed">
                            Apakah Anda yakin ingin memperbarui **seluruh** Horizon ke **3 bulan**
                            untuk kategori{" "}
                            <span className="text-indigo-600 font-bold">{title}</span>? Aksi ini
                            akan menimpa konfigurasi yang sudah ada.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-8 flex-col sm:flex-row gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsBulkDialogOpen(false)}
                            className="flex-1 h-14 rounded-2xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50 transition-all"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={confirmBulkHorizon}
                            disabled={bulkSaveHorizon.isPending}
                            className="flex-1 h-14 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all border-none"
                        >
                            {bulkSaveHorizon.isPending ? "Memproses..." : "Ya, Eksekusi"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
