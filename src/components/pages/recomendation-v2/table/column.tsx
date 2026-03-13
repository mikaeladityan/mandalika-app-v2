"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import { RecomendationV2Response } from "@/app/(application)/recomendation-v2/server/recomendation-v2.schema";
import Link from "next/link";
import { Trophy } from "lucide-react";

export const RecomendationV2Columns = (): ColumnDef<RecomendationV2Response>[] => [
    {
        accessorKey: "ranking",
        header: "Rank",
        cell: ({ row }) => {
            const rank = row.original.ranking;
            return (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 border border-slate-100 font-black text-xs text-slate-600 shadow-sm">
                    {rank === 1 && <Trophy className="size-3 text-amber-500 mr-0.5" />}
                    {rank}
                </div>
            );
        },
        size: 60,
    },
    {
        accessorKey: "material_name",
        header: "Material / Barcode",
        cell: ({ row }) => {
            const mat = row.original;
            return (
                <div className="flex flex-col min-w-[200px]">
                    <Link
                        href={`/bom/${mat.barcode}/`}
                        className="flex flex-col group"
                    >
                        <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                            {mat.material_name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                            {mat.barcode || "NO-BARCODE"}
                        </span>
                    </Link>
                </div>
            );
        },
    },
    {
        accessorKey: "supplier_name",
        header: "Supplier",
        cell: ({ row }) => (
            <span className="text-xs font-semibold text-slate-600">
                {row.original.supplier_name || "–"}
            </span>
        ),
    },
    {
        accessorKey: "moq",
        header: "MOQ",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-xs font-black text-slate-700">
                    {formatNumber(row.original.moq)}
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase">{row.original.uom}</span>
            </div>
        ),
    },
    {
        accessorKey: "lead_time",
        header: "Lead Time",
        cell: ({ row }) => (
            <Badge variant="outline" className="font-mono bg-slate-50 text-slate-500 text-[10px] border-slate-200">
                {row.original.lead_time || 0} Hari
            </Badge>
        ),
    },
];
