"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { SortableHeader } from "@/components/ui/table/sortable";
import { QueryBOMDTO, ResponseGroupedBOMDTO } from "@/app/(application)/bom/server/bom.schema";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Factory, TrendingUp, History, ShieldCheck } from "lucide-react";

type Props = {
    sortBy?: QueryBOMDTO["sortBy"];
    sortOrder?: QueryBOMDTO["sortOrder"];
    onSort: (key: string) => void;
};

export const BOMColumns = ({
    sortBy,
    sortOrder,
    onSort,
}: Props): ColumnDef<ResponseGroupedBOMDTO>[] => {
    return [
        {
            id: "product",
            header: () => (
                <SortableHeader
                    label="Produk"
                    sortKey="product_name"
                    activeSortBy={sortBy}
                    activeSortOrder={sortOrder}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => (
                <div className="flex flex-col gap-1 min-w-[200px] py-3 px-2">
                    <Link
                        href={`/products/${row.original.product.id}`}
                        className="hover:underline font-bold text-slate-900 text-sm leading-tight"
                    >
                        {row.original.product.name}
                    </Link>
                    <div className="flex flex-wrap gap-1">
                        <Badge
                            variant="outline"
                            className="text-[9px] font-mono px-1 py-0 uppercase"
                        >
                            {row.original.product.code}
                        </Badge>
                        <Badge
                            variant="outline"
                            className="text-[9px] px-1 py-0 bg-blue-50 border-blue-100 text-blue-600 uppercase"
                        >
                            {row.original.product.gender}
                        </Badge>
                        <Badge
                            variant="outline"
                            className="text-[9px] px-1 py-0 bg-amber-50 border-amber-100 text-amber-600 uppercase"
                        >
                            {row.original.product.size} {row.original.product.uom}
                        </Badge>
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase">
                        {row.original.product.type}
                    </div>
                </div>
            ),
            size: 220,
        },
        {
            id: "material",
            header: () => (
                <div className="text-left py-2 px-3 text-[10px] uppercase font-black text-slate-500">
                    Material
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex flex-col min-w-[180px]">
                    {row.original.items.map((item, idx) => (
                        <div
                            key={idx}
                            className={`flex flex-col py-3 px-3 h-[60px] justify-center ${idx !== row.original.items.length - 1 ? "border-b border-slate-100" : ""}`}
                        >
                            <span
                                className="text-[11px] font-bold text-slate-700 truncate"
                                title={item.material.name}
                            >
                                {item.material.name}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400">
                                {item.material.barcode || "-"}
                            </span>
                        </div>
                    ))}
                </div>
            ),
            size: 200,
        },
        {
            id: "bom_qty",
            header: () => (
                <div className="text-center py-2 text-[10px] uppercase font-black text-slate-500">
                    Qty
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex flex-col min-w-[60px]">
                    {row.original.items.map((item, idx) => (
                        <div
                            key={idx}
                            className={`flex items-center justify-center py-3 h-[60px] ${idx !== row.original.items.length - 1 ? "border-b border-slate-100" : ""}`}
                        >
                            <span className="text-xs font-black text-indigo-600 tabular-nums">
                                {Number(item.material.quantity).toLocaleString("id-ID")}
                            </span>
                        </div>
                    ))}
                </div>
            ),
            size: 70,
        },
        {
            id: "sales_history",
            header: () => (
                <div className="flex flex-col items-center gap-1 py-1 px-2 border-slate-100 min-w-[150px]">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        <History size={12} /> Sales
                    </div>
                    <span className="text-[8px] text-slate-400 font-mono">Past 4 Mo</span>
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex gap-1.5 px-3 h-full items-center justify-center min-w-[150px]">
                    {row.original.sales_history.map((s, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <span className="text-[8px] font-bold text-slate-400 uppercase leading-none mb-1">
                                {s.period.split("/")[0]}
                            </span>
                            <span className="text-[10px] font-bold text-slate-600 tabular-nums bg-white border border-slate-100 px-1 rounded shadow-sm">
                                {Math.round(s.value).toLocaleString("id-ID")}
                            </span>
                        </div>
                    ))}
                </div>
            ),
            size: 160,
        },
        {
            id: "forecast",
            header: () => (
                <div className="flex flex-col items-center gap-1 py-1 px-2 min-w-[220px]">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-600 tracking-widest">
                        <TrendingUp size={12} /> Forecast
                    </div>
                    <span className="text-[8px] text-emerald-500 font-mono">Next 6 Mo</span>
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex gap-1 px-3 h-full items-center justify-center min-w-[220px]">
                    {row.original.forecast.map((f, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <span className="text-[8px] font-bold text-emerald-400 uppercase leading-none mb-1">
                                {f.period.split("/")[0]}
                            </span>
                            <span className="text-[10px] font-black text-emerald-700 tabular-nums bg-white border border-emerald-100 px-1 rounded shadow-sm">
                                {Math.round(f.value).toLocaleString("id-ID")}
                            </span>
                        </div>
                    ))}
                </div>
            ),
            size: 240,
        },
        {
            id: "needs_to_buy",
            header: () => (
                <div className="flex flex-col items-center gap-1 py-1 px-2 min-w-[220px]">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-orange-600 tracking-widest leading-none">
                        <Factory size={12} /> Needs Buy
                    </div>
                    <span className="text-[8px] text-orange-500 font-mono">Mat Req</span>
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex flex-col min-w-[220px]">
                    {row.original.items.map((item, idx) => (
                        <div
                            key={idx}
                            className={`flex gap-1 justify-between px-3 py-3 h-[60px] items-center ${idx !== row.original.items.length - 1 ? "border-b border-slate-100" : ""}`}
                        >
                            {item.needs_to_buy.map((n, nIdx) => (
                                <div key={nIdx} className="flex flex-col items-center">
                                    <span className="text-[8px] font-bold text-orange-400 uppercase leading-none mb-1">
                                        {n.period.split("/")[0]}
                                    </span>
                                    <span className="text-[10px] font-black text-orange-700 tabular-nums bg-white border border-orange-100 px-1 rounded shadow-sm">
                                        {Math.round(n.value).toLocaleString("id-ID")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ),
            size: 240,
        },
        {
            id: "safety_stock",
            header: () => (
                <div className="flex flex-col items-center gap-1 py-1 px-2 min-w-[120px]">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-blue-600 tracking-widest leading-none">
                        <ShieldCheck size={12} /> Safety Target
                    </div>
                    <span className="text-[8px] text-blue-500 font-mono">Current Month</span>
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex flex-col min-w-[120px] divide-y divide-slate-100">
                    {row.original.items.map((item, idx) => (
                        <div
                            key={idx}
                            className={`flex flex-col justify-center gap-0.5 px-3 py-2 h-[60px] ${idx !== row.original.items.length - 1 ? "border-b border-slate-100" : ""}`}
                        >
                            {/* FG Target */}
                            <div className="flex justify-between items-center bg-blue-50/50 px-1.5 py-0.5 rounded border border-blue-100/50">
                                <span className="text-[8px] font-bold text-blue-400">SAFETY</span>
                                <span className="text-[10px] font-bold text-blue-700 tabular-nums">
                                    {Math.round(row.original.safety_stock).toLocaleString("id-ID")}
                                </span>
                            </div>
                            {/* Material Prop */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex justify-between items-center bg-indigo-50/50 px-1.5 py-0.5 rounded border border-indigo-100/50 cursor-help">
                                            <span className="text-[8px] font-bold text-indigo-400">
                                                =
                                            </span>
                                            <span className="text-[10px] font-black text-indigo-700 tabular-nums">
                                                {Math.round(item.safety_stock_x_bom).toLocaleString(
                                                    "id-ID",
                                                )}
                                            </span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                        <p className="text-[10px] font-bold text-emerald-800">
                                            {item.material.name}
                                        </p>
                                        <p className="text-[9px] text-emerald-500">
                                            Proporsional Safety Stock (Qty x BOM)
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    ))}
                </div>
            ),
            size: 150,
        },
    ];
};
