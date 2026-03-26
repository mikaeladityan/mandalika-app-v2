"use client";

import { usePurchaseSummary } from "@/app/(application)/purchase/server/use.purchase";
import { QueryPurchaseDTO, PurchaseSummaryResponse } from "@/app/(application)/purchase/server/purchase.schema";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import { Store, Download, Package, ChevronRight, Calculator, FileText } from "lucide-react";
import dayjs from "dayjs";
import { PurchaseService } from "@/app/(application)/purchase/server/purchase.service";

interface SupplierSummaryGridProps {
    queryParams: QueryPurchaseDTO;
}

export function SupplierSummaryGrid({ queryParams }: SupplierSummaryGridProps) {
    const { summary } = usePurchaseSummary(queryParams);

    const exportSingleSupplier = async (supplier: PurchaseSummaryResponse) => {
        try {
            const data = await PurchaseService.export({
                ...queryParams,
                supplier_id: supplier.supplier_id,
            });
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Order_${supplier.supplier_name}_${dayjs().format("YYYY-MM-DD")}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Export failed", error);
        }
    };

    if (summary.isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-64 bg-slate-100 rounded-[2.5rem]" />
                ))}
            </div>
        );
    }

    if (!summary.data || summary.data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100 gap-4">
                <Package className="h-12 w-12 text-slate-200" />
                <p className="text-sm font-bold text-slate-400 font-mono tracking-tight text-center">
                    Belum ada data pesanan yang tersimpan untuk periode ini. <br/>
                    Pastikan sudah mengklik "Save Draft" di halaman Rekomendasi.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
            {summary.data.map((supplier) => (
                <div key={supplier.supplier_id} className="group relative flex flex-col bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-amber-50 hover:border-amber-100 transition-all duration-500 overflow-hidden">
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
                                        Payable Approved
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Estimated Total</div>
                            <div className="text-2xl font-black text-amber-600 tracking-tighter">
                                Rp {formatNumber(supplier.total_amount)}
                            </div>
                        </div>
                    </div>

                    {/* Quick Info Bar */}
                    <div className="mx-8 mb-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <FileText className="size-3 text-amber-400" />
                            Status: <span className="text-amber-600">Active Procurement</span>
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
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-wider h-10 px-8">Description</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-wider h-10 text-center">Batch Qty</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-wider h-10 text-right pr-8">Subtotal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {supplier.items.map((item, idx) => (
                                    <TableRow key={idx} className="border-slate-50/50 hover:bg-slate-50/30 transition-colors group/row">
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
                                                <span className="text-[9px] font-medium text-slate-400 italic lowercase">{item.uom}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 pr-8 text-right">
                                            <span className="text-[13px] font-black text-slate-900 tracking-tight">
                                                Rp {formatNumber(item.subtotal)}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-8 pt-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/20">
                        <Button 
                            variant="ghost" 
                            className="rounded-xl font-bold text-slate-400 hover:text-amber-600 transition-colors text-xs"
                        >
                            View All Items
                        </Button>
                        <Button
                            onClick={() => exportSingleSupplier(supplier)}
                            className="h-12 rounded-[1.25rem] bg-white border border-amber-200 text-amber-600 hover:bg-amber-600 hover:text-white transition-all duration-300 font-black text-xs px-6 shadow-sm flex items-center gap-2 group/btn"
                        >
                            <Download className="size-4 group-hover/btn:rotate-12 transition-transform" />
                            Export {supplier.supplier_name}
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
