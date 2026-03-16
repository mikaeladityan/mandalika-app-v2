"use client";

import { useState, useMemo } from "react";
import {
    usePurchase,
    usePurchaseTableState,
} from "@/app/(application)/purchase/server/use.purchase";
import { PurchaseService } from "@/app/(application)/purchase/server/purchase.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import { PurchaseColumns } from "./table/column";
import { Button } from "@/components/ui/button";
import { SupplierSummaryGrid } from "./table/supplier-summary-grid";
import { formatNumber } from "@/lib/utils";
import {
    ShoppingCart,
    Search,
    Download,
    Calculator,
    Loader2,
    LayoutGrid,
    List,
} from "lucide-react";
import dayjs from "dayjs";
import { setupCSRFToken } from "@/lib/api";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PurchaseProps {
    title: string;
    description: string;
}

export function Purchase({ title, description }: PurchaseProps) {
    const table = usePurchaseTableState();
    const { list } = usePurchase(table.queryParams);
    const [view, setView] = useState<"table" | "supplier">("table");

    const columns = useMemo(() => PurchaseColumns(), []);

    const grandTotal = useMemo(() => {
        if (!list.data?.data) return 0;
        return list.data.data.reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
            0,
        );
    }, [list.data?.data]);

    const exportToExcel = async () => {
        try {
            await setupCSRFToken();
            const blob = await PurchaseService.export(table.queryParams);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `Data_Pengajuan_Purchase_${dayjs().format("YYYY-MM-DD")}.xlsx`,
            );
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Gagal melakukan export excel.");
        }
    };

    return (
        <div className="flex flex-col gap-6 p-2 md:p-4">
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="space-y-6 p-6 lg:p-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit">
                            <ShoppingCart className="h-6 w-6" />
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
                        {/* Grup Kiri: Filter Bulan & Tahun */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative w-full sm:w-64 lg:w-72 group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                                <Input
                                    placeholder="Cari by material..."
                                    value={table.search}
                                    onChange={(e) => table.setSearch(e.target.value)}
                                    className="pl-11 h-11 w-full bg-slate-50/50 border-slate-200 rounded-xl focus-visible:ring-amber-500/20 transition-all font-medium"
                                />
                            </div>
                            <Select
                                value={
                                    table.month
                                        ? String(table.month)
                                        : String(new Date().getMonth() + 1)
                                }
                                onValueChange={(val) => table.setMonth(Number(val))}
                            >
                                <SelectTrigger className="flex-1 md:w-[130px] h-11 bg-slate-50/50 border-slate-200 rounded-xl">
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
                                value={
                                    table.year
                                        ? String(table.year)
                                        : String(new Date().getFullYear())
                                }
                                onValueChange={(val) => table.setYear(Number(val))}
                            >
                                <SelectTrigger className="flex-1 md:w-[100px] h-11 bg-slate-50/50 border-slate-200 rounded-xl">
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

                        {/* Grup Kanan: Export & View Toggle */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                            <Button
                                onClick={exportToExcel}
                                disabled={list.isLoading || !list.data?.data?.length}
                                className="w-full sm:w-auto h-11 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md shadow-amber-500/20 font-semibold gap-2 transition-all"
                            >
                                <Download className="w-4 h-4" />
                                Export Excel
                            </Button>

                            {/* Two persistent view toggle buttons */}
                            <div className="flex items-center rounded-xl border border-amber-200 overflow-hidden shadow-sm">
                                <Button
                                    onClick={() => setView("table")}
                                    variant="ghost"
                                    className={`h-11 px-4 rounded-none font-bold gap-2 transition-all border-r border-amber-200 ${
                                        view === "table"
                                            ? "bg-amber-600 text-white hover:bg-amber-700"
                                            : "text-amber-600 hover:bg-amber-50"
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                    List Purchase
                                </Button>
                                <Button
                                    onClick={() => setView("supplier")}
                                    variant="ghost"
                                    className={`h-11 px-4 rounded-none font-bold gap-2 transition-all ${
                                        view === "supplier"
                                            ? "bg-amber-600 text-white hover:bg-amber-700"
                                            : "text-amber-600 hover:bg-amber-50"
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
                                        tableId="purchase-main-table"
                                        columns={columns}
                                        data={list.data?.data ?? []}
                                        page={table.page}
                                        pageSize={table.take}
                                        total={list.data?.meta?.total ?? 0}
                                        onPageChange={table.setPage}
                                        onPageSizeChange={table.setTake}
                                    />
                                    {list.data?.data && list.data.data.length > 0 && (
                                        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                                            <div className="flex items-center gap-3 text-amber-700">
                                                <div className="p-2 bg-amber-100 rounded-xl">
                                                    <Calculator className="w-5 h-5" />
                                                </div>
                                                <span className="font-semibold text-sm">
                                                    Estimasi Pembayaran (Semua halaman)
                                                </span>
                                            </div>
                                            <div className="text-xl md:text-2xl font-black text-amber-600 tracking-tight mt-2 sm:mt-0">
                                                Rp {formatNumber(grandTotal)}
                                            </div>
                                        </div>
                                    )}
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
