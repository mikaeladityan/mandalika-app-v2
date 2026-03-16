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
        <div className="flex flex-col gap-6 p-2 md:p-4">
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="space-y-6 p-6 lg:p-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit">
                            <Truck className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black text-slate-900">
                                {title}
                            </CardTitle>
                            <CardDescription className="text-slate-500 font-medium">
                                {description}
                            </CardDescription>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row flex-wrap md:justify-between items-center gap-3 w-full">
                        {/* Grup Kiri: Filter Bulan & Tahun & Export */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative w-full sm:w-64 lg:w-72 group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    placeholder="Cari by material/PO..."
                                    value={table.search}
                                    onChange={(e) => table.setSearch(e.target.value)}
                                    className="pl-11 h-11 w-full bg-slate-50/50 border-slate-200 rounded-xl focus-visible:ring-blue-500/20 transition-all font-medium"
                                />
                            </div>
                            <Select
                                value={String(table.month)}
                                onValueChange={(val) => table.setMonth(Number(val))}
                            >
                                <SelectTrigger className="flex-1 md:w-[130px] h-11 bg-slate-50/50 border-slate-200 rounded-xl font-medium">
                                    <SelectValue placeholder="Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
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
                                    ].map((m, i) => (
                                        <SelectItem key={m} value={String(i + 1)}>
                                            {m}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={String(table.year)}
                                onValueChange={(val) => table.setYear(Number(val))}
                            >
                                <SelectTrigger className="flex-1 md:w-[100px] h-11 bg-slate-50/50 border-slate-200 rounded-xl font-medium">
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
                            <Select value={table.status} onValueChange={table.setStatus}>
                                <SelectTrigger className="w-full sm:w-[140px] h-11 bg-slate-50/50 border-slate-200 rounded-xl font-medium">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="OPEN">OPEN</SelectItem>
                                    <SelectItem value="RECEIVED">RECEIVED</SelectItem>
                                    <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Grup Kanan: Status, Search & View Toggle */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                            <Button
                                onClick={exportToExcel}
                                disabled={list.isLoading || !list.data?.data?.length}
                                className="w-full sm:w-auto h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 font-semibold gap-2 transition-all"
                            >
                                <Download className="w-4 h-4" />
                                Export Excel
                            </Button>

                            {/* Two persistent view toggle buttons */}
                            <div className="flex items-center rounded-xl border border-blue-200 overflow-hidden shadow-sm">
                                <Button
                                    onClick={() => setView("table")}
                                    variant="ghost"
                                    className={`h-11 px-4 rounded-none font-bold gap-2 transition-all border-r border-blue-200 ${
                                        view === "table"
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "text-blue-600 hover:bg-blue-50"
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                    Table View
                                </Button>
                                <Button
                                    onClick={() => setView("supplier")}
                                    variant="ghost"
                                    className={`h-11 px-4 rounded-none font-bold gap-2 transition-all ${
                                        view === "supplier"
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "text-blue-600 hover:bg-blue-50"
                                    }`}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                    Supplier View
                                </Button>
                            </div>
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
                                        columns={columns}
                                        data={list.data?.data ?? []}
                                        page={table.page}
                                        pageSize={table.take}
                                        total={list.data?.meta?.total ?? 0}
                                        onPageChange={table.setPage}
                                        onPageSizeChange={table.setTake}
                                    />
                                    {/* Grand Total Summary Bar */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-blue-50/50 rounded-2xl border border-blue-100 gap-4 mt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-white text-blue-600 rounded-xl shadow-sm border border-blue-100">
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
                                        <div className="h-10 w-px bg-blue-100 hidden sm:block" />
                                        <div className="text-center sm:text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                                Grand Total Period
                                            </p>
                                            <p className="text-2xl font-black text-blue-600 tracking-tighter">
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
