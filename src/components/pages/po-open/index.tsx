"use client";

import { useMemo, useState } from "react";
import { useOpenPo, useOpenPoTableState } from "@/app/(application)/po/open/server/use.po-open";
import { OpenPoService } from "@/app/(application)/po/open/server/po-open.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import { Truck, Search, Download, Calculator, List, LayoutGrid } from "lucide-react";
import { OpenPoColumns } from "./table/column";
import { Button } from "@/components/ui/button";
import { SupplierSummaryGrid } from "./table/supplier-summary-grid";
import { formatNumber } from "@/lib/utils";
import { setupCSRFToken } from "@/lib/api";
import dayjs from "dayjs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface OpenPoProps {
    title: string;
    description: string;
}

export function OpenPo({ title, description }: OpenPoProps) {
    const table = useOpenPoTableState();
    const { list } = useOpenPo(table.queryParams);
    const [view, setView] = useState<"table" | "supplier">("table");

    const columns = useMemo(() => OpenPoColumns(), []);

    const grandTotal = useMemo(() => {
        if (!list.data?.data) return 0;
        return list.data.data.reduce((acc, item) => acc + (item.subtotal || 0), 0);
    }, [list.data?.data]);

    const totalItems = useMemo(() => {
        if (!list.data?.data) return 0;
        return list.data.data.length;
    }, [list.data?.data]);

    const exportToExcel = async () => {
        try {
            await setupCSRFToken();
            const blob = await OpenPoService.export(table.queryParams);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `Data_Tracking_PO_Open_${dayjs().format("YYYY-MM-DD")}.xlsx`,
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Gagal export excel:", error);
        }
    };

    return (
        <div className="flex flex-col gap-4 p-2 md:p-3">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="space-y-3 p-4 border-b border-slate-50">
                    {/* ROW 1: TITLE & PRIMARY ACTIONS */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-primary/10 text-primary rounded-lg shrink-0">
                                <Truck className="h-4 w-4" />
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
                                disabled={list.isLoading || !list.data?.data?.length}
                                className="h-8 bg-primary hover:bg-primary/90 text-white rounded-full shadow-sm font-bold gap-1.5 transition-all text-[11px] px-3"
                            >
                                <Download className="w-3 h-3" />
                                Excel
                            </Button>

                            <div className="flex items-center rounded-full border border-primary/20 overflow-hidden shrink-0">
                                <Button
                                    onClick={() => setView("table")}
                                    variant="ghost"
                                    className={`h-8 px-3 rounded-none font-bold gap-1.5 transition-all border-r border-primary/20 text-[11px] ${
                                        view === "table"
                                            ? "bg-primary text-white hover:bg-primary/90"
                                            : "text-primary hover:bg-primary/5"
                                    }`}
                                >
                                    <List className="w-3 h-3" />
                                    Tabel
                                </Button>
                                <Button
                                    onClick={() => setView("supplier")}
                                    variant="ghost"
                                    className={`h-8 px-3 rounded-none font-bold gap-1.5 transition-all text-[11px] ${
                                        view === "supplier"
                                            ? "bg-primary text-white hover:bg-primary/90"
                                            : "text-primary hover:bg-primary/5"
                                    }`}
                                >
                                    <LayoutGrid className="w-3 h-3" />
                                    Supplier
                                </Button>
                            </div>
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
                             <Select value={String(table.month)} onValueChange={(val) => table.setMonth(Number(val))}>
                                <SelectTrigger className="w-28 h-9 bg-slate-50 border-slate-200 rounded-xl text-xs font-bold">
                                    <SelectValue placeholder="Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"].map((m, i) => (
                                        <SelectItem key={m} value={String(i + 1)}>{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={String(table.year)} onValueChange={(val) => table.setYear(Number(val))}>
                                <SelectTrigger className="w-24 h-9 bg-slate-50 border-slate-200 rounded-xl text-xs font-bold">
                                    <SelectValue placeholder="Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
                                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={table.status} onValueChange={table.setStatus}>
                                <SelectTrigger className="w-28 h-9 bg-slate-50 border-slate-200 rounded-xl font-bold text-xs">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="OPEN">OPEN</SelectItem>
                                    <SelectItem value="RECEIVED">RECEIVED</SelectItem>
                                    <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="px-6 lg:px-8 pb-8">
                        {view === "table" ? (
                            list.isLoading ? (
                                <div className="p-8 border border-slate-100 rounded-2xl">
                                    <TableSkeleton />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <DataTable
                                        tableId="po-open-main-table"
                                        columns={columns}
                                        data={list.data?.data ?? []}
                                        page={table.page}
                                        pageSize={table.take}
                                        total={list.data?.meta?.total ?? 0}
                                        onPageChange={table.setPage}
                                        onPageSizeChange={table.setTake}
                                    />
                                    {/* Grand Total Summary Bar */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-primary/5 rounded-2xl border border-primary/10 gap-4 mt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-white text-primary rounded-xl shadow-xs border border-primary/10">
                                                <Calculator className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                                    Total Items tracked
                                                </p>
                                                <p className="text-lg font-black text-slate-800 leading-none">
                                                    {totalItems} Materials
                                                </p>
                                            </div>
                                        </div>
                                        <div className="h-10 w-px bg-primary/10 hidden sm:block" />
                                        <div className="text-center sm:text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                                Grand Total Period
                                            </p>
                                            <p className="text-2xl font-black text-primary tracking-tighter">
                                                Rp {formatNumber(grandTotal)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        ) : (
                            <SupplierSummaryGrid queryParams={table.queryParams} />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
