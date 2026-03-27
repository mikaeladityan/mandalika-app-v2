"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IssuanceRekapListItemDTO } from "@/app/(application)/product-issuance/server/issuance.schema";
import { formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    sortBy: string;
    sortOrder: "asc" | "desc";
    onSort: (key: string) => void;
};

export function RekapColumns({
    sortBy,
    sortOrder,
    onSort,
}: Props): ColumnDef<IssuanceRekapListItemDTO>[] {
    const renderSortHeader = (label: string, key: string) => (
        <div
            className="flex items-center gap-1 cursor-pointer hover:text-slate-900 group transition-colors"
            onClick={() => onSort(key)}
        >
            {label}
            <ArrowUpDown
                className={cn(
                    "h-3 w-3 transition-opacity",
                    sortBy === key
                        ? "opacity-100 text-primary"
                        : "opacity-0 group-hover:opacity-100",
                )}
            />
        </div>
    );

    return [
        {
            accessorKey: "product.code",
            header: () => renderSortHeader("Kode", "code"),
            cell: ({ row }) => (
                <div className="font-mono text-[10px] font-bold text-slate-500">
                    {row.original.product.code}
                </div>
            ),
        },
        {
            accessorKey: "product.name",
            header: () => renderSortHeader("Produk", "name"),
            cell: ({ row }) => (
                <div className="max-w-[200px]">
                    <div className="text-[11px] font-bold text-slate-800 leading-tight truncate">
                        {row.original.product.name}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                        <Badge
                            variant="outline"
                            className="text-[9px] px-1 h-3.5 bg-slate-50 border-slate-200 text-slate-500 font-medium"
                        >
                            {row.original.product.product_type}
                        </Badge>
                        <span className="text-[9px] text-slate-400 font-medium">
                            • {row.original.product.size}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "offline",
            header: () => (
                <div className="text-start">{renderSortHeader("Offline", "offline")}</div>
            ),
            cell: ({ row }) => (
                <div className="text-start font-semibold text-slate-700">
                    {formatNumber(row.original.offline)}
                </div>
            ),
        },
        {
            accessorKey: "online",
            header: () => <div className="text-start">{renderSortHeader("Online", "online")}</div>,
            cell: ({ row }) => (
                <div className="text-start font-semibold text-slate-700">
                    {formatNumber(row.original.online)}
                </div>
            ),
        },
        {
            accessorKey: "spin_wheel",
            header: () => (
                <div className="text-start">{renderSortHeader("Spin Wheel", "spin_wheel")}</div>
            ),
            cell: ({ row }) => (
                <div className="text-start font-semibold text-slate-700">
                    {formatNumber(row.original.spin_wheel)}
                </div>
            ),
        },
        {
            accessorKey: "garansi_out",
            header: () => (
                <div className="text-start">{renderSortHeader("Garansi Out", "garansi_out")}</div>
            ),
            cell: ({ row }) => (
                <div className="text-start font-semibold text-slate-700">
                    {formatNumber(row.original.garansi_out)}
                </div>
            ),
        },
        {
            accessorKey: "all_qty",
            header: () => <div className="text-start">{renderSortHeader("ALL", "all_qty")}</div>,
            cell: ({ row }) => (
                <div className="text-start">
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-slate-50 text-slate-700 font-black text-xs border border-slate-100 min-w-[50px]">
                        {formatNumber(row.original.all_qty)}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "total_qty",
            header: () => (
                <div className="text-start">{renderSortHeader("TOTAL", "total_qty")}</div>
            ),
            cell: ({ row }) => (
                <div className="text-start">
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 font-black text-xs border border-indigo-100 min-w-[50px]">
                        {formatNumber(row.original.total_qty)}
                    </span>
                </div>
            ),
        },
    ];
}
