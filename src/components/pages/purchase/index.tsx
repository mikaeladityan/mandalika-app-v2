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
        <div className="flex flex-col gap-4">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="space-y-3 p-4 border-b border-slate-50">
                    {/* ROW 1: TITLE & PRIMARY ACTIONS */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-primary/10 text-primary rounded-lg shrink-0">
                                <ShoppingCart className="h-4 w-4" />
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
                                        total={list.data?.len ?? 0}
                                        onPageChange={table.setPage}
                                        onPageSizeChange={table.setTake}
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
