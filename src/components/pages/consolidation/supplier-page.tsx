"use client";

import { useState } from "react";
import {
    useConsolidationSummary,
    useConsolidationTableState,
} from "@/app/(application)/consolidation/server/use.consolidation";
import { ConsolidationSummaryResponse } from "@/app/(application)/consolidation/server/consolidation.schema";
import { ConsolidationService } from "@/app/(application)/consolidation/server/consolidation.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { formatNumber } from "@/lib/utils";
import { PrintSupplierReport } from "./print-supplier-report";
import {
    Search,
    Download,
    Store,
    Package,
    ChevronRight,
    Calculator,
    FileText,
    Printer,
    Layers,
    ArrowLeft,
} from "lucide-react";
import dayjs from "dayjs";
import Link from "next/link";

interface ConsolidationSupplierProps {
    title: string;
    description: string;
}

export function ConsolidationSupplier({ title, description }: ConsolidationSupplierProps) {
    const table = useConsolidationTableState();
    const { summary } = useConsolidationSummary(table.queryParams);
    const [printData, setPrintData] = useState<ConsolidationSummaryResponse | null>(null);

    const handlePrint = (supplier: ConsolidationSummaryResponse) => {
        setPrintData(supplier);
        setTimeout(() => {
            window.print();
        }, 100);
    };

    const exportSingleSupplier = async (supplier: ConsolidationSummaryResponse) => {
        try {
            const data = await ConsolidationService.export({
                ...table.queryParams,
                supplier_id: supplier.supplier_id,
            });
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `Order_${supplier.supplier_name}_${dayjs().format("YYYY-MM-DD")}.xlsx`,
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Export failed", error);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="space-y-3 p-4 border-b border-slate-50">
                    {/* ROW 1: TITLE & BACK */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Link href="/consolidation">
                                <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 rounded-xl text-slate-400 hover:text-primary"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div className="p-1.5 bg-amber-500/10 text-amber-600 rounded-lg shrink-0">
                                <Store className="h-4 w-4" />
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
                    </div>

                    {/* ROW 2: SEARCH & FILTERS */}
                    <div className="flex flex-col md:flex-row flex-wrap items-center gap-3 pt-1">
                        <div className="relative w-full sm:w-64 lg:w-72 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Cari material..."
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
                        {summary.isLoading ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-64 bg-slate-100 rounded-[2.5rem]" />
                                ))}
                            </div>
                        ) : !summary.data || summary.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100 gap-4">
                                <Package className="h-12 w-12 text-slate-200" />
                                <p className="text-sm font-bold text-slate-400 font-mono tracking-tight text-center">
                                    Belum ada data pesanan yang tersimpan untuk periode ini.{" "}
                                    <br />
                                    Pastikan sudah mengklik &quot;Save Draft&quot; di halaman
                                    Rekomendasi.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
                                {summary.data.map((supplier) => (
                                    <div
                                        key={supplier.supplier_id}
                                        className="group relative flex flex-col bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-amber-50 hover:border-amber-100 transition-all duration-500 overflow-hidden"
                                    >
                                        {/* Card Header */}
                                        <div className="p-8 pb-4 flex items-start justify-between">
                                            <div className="flex items-center gap-5">
                                                <div className="p-4 bg-amber-600 text-white rounded-[1.5rem] shadow-lg shadow-amber-100 group-hover:scale-110 transition-transform duration-500">
                                                    <Store className="size-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2 uppercase">
                                                        {supplier.supplier_name}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black tracking-widest uppercase">
                                                            {supplier.total_items} Materials
                                                        </span>
                                                        <ChevronRight className="size-3 text-slate-300" />
                                                        <span className="text-[10px] font-black text-amber-500 tracking-widest uppercase">
                                                            Consolidated Approved
                                                        </span>
                                                    </div>
                                                    {supplier.supplier_address && (
                                                        <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                                            {supplier.supplier_address}
                                                        </p>
                                                    )}
                                                    {supplier.supplier_phone && (
                                                        <p className="text-[10px] text-slate-400 font-medium">
                                                            Tel: {supplier.supplier_phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                                    Estimated Total
                                                </div>
                                                <div className="text-2xl font-black text-amber-600 tracking-tighter">
                                                    Rp {formatNumber(supplier.total_amount)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Info Bar */}
                                        <div className="mx-8 mb-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <FileText className="size-3 text-amber-400" />
                                                Status:{" "}
                                                <span className="text-amber-600">
                                                    Active Consolidation
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calculator className="size-3 text-slate-400" />
                                                Auto-Summing
                                            </div>
                                        </div>

                                        {/* Mini Table Content */}
                                        <div className="px-0 flex-1 min-h-[200px]">
                                            <Table>
                                                <TableHeader className="bg-slate-50/50">
                                                    <TableRow className="hover:bg-transparent border-none">
                                                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-wider h-10 px-8">
                                                            Description
                                                        </TableHead>
                                                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-wider h-10 text-center">
                                                            Batch Qty
                                                        </TableHead>
                                                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-wider h-10 text-right pr-8">
                                                            Subtotal
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {supplier.items.map((item, idx) => (
                                                        <TableRow
                                                            key={idx}
                                                            className="border-slate-50/50 hover:bg-slate-50/30 transition-colors group/row"
                                                        >
                                                            <TableCell className="py-4 px-8">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[13px] font-bold text-slate-700 group-hover/row:text-amber-600 transition-colors">
                                                                        {item.material_name}
                                                                    </span>
                                                                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">
                                                                        {item.barcode}
                                                                    </span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="py-4 text-center">
                                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-xl text-[10px] font-black text-slate-600">
                                                                    {formatNumber(item.quantity)}
                                                                    <span className="text-[9px] font-medium text-slate-400 italic lowercase">
                                                                        {item.uom}
                                                                    </span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="py-4 pr-8 text-right">
                                                                <span className="text-[13px] font-black text-slate-900 tracking-tight">
                                                                    Rp{" "}
                                                                    {formatNumber(item.subtotal)}
                                                                </span>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {/* Card Footer Actions */}
                                        <div className="p-8 pt-6 border-t border-slate-50 flex items-center justify-end bg-slate-50/20">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={() => handlePrint(supplier)}
                                                    variant="outline"
                                                    className="h-12 rounded-[1.25rem] border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 font-black text-xs px-6 shadow-sm flex items-center gap-2 group/print"
                                                >
                                                    <Printer className="size-4 group-hover/print:scale-110 transition-transform" />
                                                    Print FPB
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        exportSingleSupplier(supplier)
                                                    }
                                                    className="h-12 rounded-[1.25rem] bg-white border-amber-200 text-amber-600 hover:bg-amber-600 hover:text-white transition-all duration-300 font-black text-xs px-6 shadow-sm flex items-center gap-2 group/btn"
                                                >
                                                    <Download className="size-4 group-hover/btn:rotate-12 transition-transform" />
                                                    Export Excel
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Hidden Printable Version */}
            <PrintSupplierReport supplier={printData} />
        </div>
    );
}
