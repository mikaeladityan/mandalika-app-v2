"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import { RecomendationV2Response } from "@/app/(application)/recomendation-v2/server/recomendation-v2.schema";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { LeadTimeEditDialog } from "./lead-time-dialog";
import { WorkOrderDialog } from "./work-order-dialog";
import { HorizonDialog } from "./horizon-dialog";

interface PeriodProps {
    sales_periods: { month: number; year: number; period: Date | string; key: string }[];
    forecast_periods: { month: number; year: number; period: Date | string; key: string }[];
    po_periods: { month: number; year: number; period: Date | string; key: string }[];
    month: number;
    year: number;
}

const MONTHS_SHORT = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Ags",
    "Sep",
    "Okt",
    "Nov",
    "Des",
];

/**
 * Menghitung defisit stok menggunakan logika:
 * =IF(current_stock_po - SUM(need_mar + need_apr) >= 0, "", (current_stock_po - SUM(need_mar + need_apr)))
 *
 * - Jika (current_stock + open_po) - (need_mar + need_apr) >= 0 → stok cukup → return null
 * - Jika hasilnya < 0 → stok kurang → return nilai negatif (defisit)
 */
function calculateDeficit(
    currentStock: number,
    openPo: number,
    needs: { month: number; quantity: number }[],
    monthsToCheck?: number,
): number | null {
    const readyStock = currentStock + openPo;

    // Jika monthsToCheck tidak ada, gunakan semua data needs yang tersedia
    const relevantNeeds = monthsToCheck ? needs.slice(0, monthsToCheck) : needs;
    const totalNeeded = relevantNeeds.reduce((sum, n) => sum + (n.quantity || 0), 0);

    const result = readyStock - totalNeeded;

    // Jika >= 0 → cukup → tampilkan null (kosong seperti "" di Excel)
    if (result >= 0) return null;

    // Jika < 0 → defisit → return nilai negatif
    return result;
}

export const RecomendationV2Columns = (
    periods: PeriodProps,
): ColumnDef<RecomendationV2Response>[] => [
    {
        accessorKey: "ranking",
        header: "Rank",
        cell: ({ row }) => {
            const rank = row.original.ranking;
            return (
                <div className="flex items-center justify-center gap-x-1 font-black text-xs text-slate-600">
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
                    <Link href={`/bom/${mat.barcode}/`} className="flex flex-col group">
                        <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
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
        accessorKey: "supplier",
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
                <span className="text-[9px] text-slate-400 font-bold uppercase">
                    {row.original.uom}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "safety_stock_x_resep",
        header: "Safety Stock",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-xs font-black text-indigo-700">
                    {formatNumber(row.original.safety_stock_x_resep)}
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase">
                    {row.original.uom}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "current_stock",
        header: "Current Stock",
        cell: ({ row }) => {
            const stock = row.original.current_stock;
            return (
                <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-800">{formatNumber(stock)}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                        {row.original.uom}
                    </span>
                </div>
            );
        },
        size: 100,
    },
    {
        id: "available_stock",
        header: "Ready Stock (S+P)",
        cell: ({ row }) => {
            const stock = row.original.current_stock;
            const openPo = row.original.open_po;
            const available = stock + openPo;
            const needed = row.original.forecast_needed;
            const isSufficient = available >= needed;
            const needs = row.original.needs || [];

            const coverage = (() => {
                if (available <= 0) return 0;
                if (needs.length === 0) return 0;

                let cov = 0;
                let rem = available;
                for (const n of needs) {
                    if (n.quantity <= 0) {
                        cov += 1;
                        continue;
                    }
                    if (rem >= n.quantity) {
                        cov += 1;
                        rem -= n.quantity;
                    } else {
                        cov += rem / n.quantity;
                        rem = 0;
                        break;
                    }
                }
                return cov;
            })();

            return (
                <div className="flex flex-col min-w-[120px] py-2">
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 w-fit">
                        {formatNumber(available)}{" "}
                        <span className="text-[10px] text-indigo-400">{row.original.uom}</span>
                    </span>
                    {/* <span
                        className={`text-[9px] mt-1 font-semibold uppercase tracking-wider ${
                            isSufficient ? "text-emerald-600" : "text-red-500"
                        }`}
                    >
                        {needed > 0
                            ? `${isSufficient ? "✓ Cukup" : "⚠ Defisit"} • ${coverage.toFixed(1)}m`
                            : "–"}
                    </span> */}
                </div>
            );
        },
        size: 140,
    },

    // ─── Kolom Sales Historis ──────────────────────────────────────────────────
    ...periods.sales_periods.map((p) => ({
        id: `sales_${p.key}`,
        header: `SALES ${MONTHS_SHORT[p.month - 1]}`,
        cell: ({ row }: any) => {
            const q = row.original.sales?.find((s: any) => s.key === p.key)?.quantity ?? 0;
            return <span className="font-bold text-xs text-slate-500">{formatNumber(q)}</span>;
        },
        size: 100,
    })),

    {
        accessorKey: "lead_time",
        header: "Lead Time",
        cell: ({ row }) => {
            const mat = row.original;
            return (
                <LeadTimeEditDialog
                    id={mat.material_id}
                    materialName={mat.material_name}
                    currentLeadTime={mat.lead_time || 0}
                />
            );
        },
    },
    ...periods.forecast_periods.map((p) => ({
        id: `need_${p.key}`,
        header: `NEED ${MONTHS_SHORT[p.month - 1]}`,
        cell: ({ row }: any) => {
            const q = row.original.needs?.find((s: any) => s.key === p.key)?.quantity ?? 0;
            return <span className="font-bold text-xs text-gray-600">{formatNumber(q)}</span>;
        },
        size: 100,
    })),
    {
        id: "total_needs",
        header: () => (
            <div className="flex flex-col items-center gap-0.5 py-1 min-w-[100px]">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none text-center">
                    Total Need<br/>(Horizon)
                </span>
            </div>
        ),
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="flex flex-col items-center justify-center min-w-[80px]">
                    <HorizonDialog 
                        data={data} 
                        month={periods.month} 
                        year={periods.year} 
                    />
                </div>
            );
        },
        size: 110,
    },
    {
        id: "recommendation",
        header: () => (
            <div className="flex flex-col items-center gap-0.5 py-1 min-w-[140px]">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest leading-none">
                    Rekomendasi
                </span>
                <span className="text-[8px] text-indigo-400 font-mono italic">(S+P) - Needs</span>
            </div>
        ),
        cell: ({ row }) => {
            const data = row.original;

            if (!data.work_order_horizon) {
                return <span className="text-[10px] font-bold text-slate-300">–</span>;
            }

            const deficit = calculateDeficit(
                data.current_stock,
                data.open_po,
                data.needs,
                data.work_order_horizon,
            );

            if (deficit === null) {
                return (
                    <Badge
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-600 font-bold border-emerald-100 shadow-none text-[10px] py-0.5 px-2"
                    >
                        ✓ Cukup
                    </Badge>
                );
            }

            return (
                <Badge
                    variant="destructive"
                    className="bg-red-50 text-red-700 shadow-none border-red-200 font-black px-2 py-0.5 whitespace-nowrap text-[10px]"
                >
                    Beli {formatNumber(Math.abs(deficit))}
                </Badge>
            );
        },
        size: 150,
    },
    ...periods.po_periods.map((p) => ({
        id: `po_${p.key}`,
        header: () => (
            <div className="flex flex-col items-center gap-0.5 py-1 min-w-[100px]">
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest leading-none">
                    PO {MONTHS_SHORT[p.month - 1]}
                </span>
                <span className="text-[8px] text-emerald-400 font-mono italic">{p.year}</span>
            </div>
        ),
        cell: ({ row }: any) => {
            const q = row.original.open_pos?.find((s: any) => s.key === p.key)?.quantity ?? 0;
            return <span className="font-bold text-xs text-emerald-600">{formatNumber(q)}</span>;
        },
        size: 100,
    })),
    {
        id: "action",
        header: () => (
            <div className="flex flex-col items-center gap-0.5 py-1 min-w-[120px]">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">
                    Action
                </span>
                <span className="text-[8px] text-slate-400 font-mono italic">Work Order</span>
            </div>
        ),
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="flex items-center justify-center">
                    <WorkOrderDialog data={data} month={periods.month} year={periods.year} />
                </div>
            );
        },
        size: 140,
    },
];

// ─── Export helper untuk digunakan di tempat lain ──────────────────────────────
export { calculateDeficit };
