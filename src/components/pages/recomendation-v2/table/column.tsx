"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn, formatNumber } from "@/lib/utils";
import { RecomendationV2Response } from "@/app/(application)/recomendation-v2/server/recomendation-v2.schema";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { LeadTimeEditDialog } from "./lead-time-dialog";
import { WorkOrderDialog } from "./work-order-dialog";
import { HorizonDialog } from "./horizon-dialog";
import { calculateTotalNeeded } from "@/app/(application)/recomendation-v2/server/use.recomendation-v2";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PeriodProps {
    sales_periods: { month: number; year: number; key: string }[];
    forecast_periods: { month: number; year: number; key: string }[];
    po_periods: { month: number; year: number; key: string }[];
    month: number;
    year: number;
    forecastMonths: number;
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
const FormulaHint = ({
    title,
    formula,
    description,
}: {
    title: string;
    formula: string;
    description?: string;
}) => (
    <TooltipProvider>
        <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
                <div className="cursor-help inline-flex items-center ml-1">
                    <Info className="size-3 text-slate-300 hover:text-indigo-500 transition-colors" />
                </div>
            </TooltipTrigger>
            <TooltipContent
                side="top"
                className="w-80 p-3 bg-white text-slate-900 border-slate-200 shadow-xl z-100"
            >
                <div className="space-y-2 text-left">
                    <p className="font-bold text-[10px] uppercase tracking-wider text-indigo-600 border-b border-indigo-50 pb-1">
                        {title}
                    </p>
                    <div className="bg-slate-50 p-2 rounded border border-slate-100 font-mono text-[10px] leading-relaxed wrap-break-word text-slate-700">
                        {formula}
                    </div>
                    {description && (
                        <p className="text-[10px] text-slate-500 leading-normal italic">
                            {description}
                        </p>
                    )}
                </div>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

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
        enableHiding: false,
        enableSorting: true,
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
                <span className="text-[11px] font-bold text-slate-700">
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
        header: () => (
            <div className="flex items-center font-bold text-xs uppercase text-slate-500 whitespace-nowrap">
                Safety Stock
                <FormulaHint
                    title="Safety Stock Material"
                    formula="SS Mat = SS Produk x Resep"
                    description="Kebutuhan stok aman material yang telah dikonversi berdasarkan komposisi resep dari safety stock produk jadi."
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-[11px] font-bold text-indigo-700">
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
        header: () => (
            <div className="flex items-center font-bold text-xs uppercase text-slate-500 whitespace-nowrap">
                Current Stock
                <FormulaHint
                    title="Net Current Stock"
                    formula="Net Stock = Stock Saat Ini - Safety Stock"
                    description="Stok operasional yang benar-benar tersedia setelah dikurangi cadangan stok aman (Safety Stock)."
                />
            </div>
        ),
        cell: ({ row }) => {
            const physicalStock = row.original.current_stock;
            const netStock = physicalStock - row.original.safety_stock_x_resep;
            return (
                <div className="flex flex-col min-w-[90px]">
                    <div className="flex items-center gap-1">
                        <span
                            className={cn(
                                "text-[11px] font-bold",
                                netStock < 0 ? "text-red-600" : "text-slate-900",
                            )}
                        >
                            {formatNumber(netStock)}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">
                            {row.original.uom}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 border-t border-slate-100 pt-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                            Phys:
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 tabular-nums">
                            {formatNumber(physicalStock)}
                        </span>
                    </div>
                </div>
            );
        },
        size: 100,
        enableSorting: true,
    },
    {
        id: "available_stock",
        header: () => (
            <div className="flex items-center font-bold text-xs uppercase text-indigo-600 whitespace-nowrap">
                Ready Stock
                <FormulaHint
                    title="Ready Stock (S+P)"
                    formula="Ready Stock = Net Current Stock + Total Open PO"
                    description="Total ketersediaan material yang siap digunakan (stok gudang + yang sedang dalam pengiriman)."
                />
            </div>
        ),
        cell: ({ row }) => {
            const stock = row.original.current_stock - row.original.safety_stock_x_resep;
            const openPo = row.original.open_po;
            const available = stock + openPo;
            const needed = row.original.forecast_needed;
            // const isSufficient = available >= needed;
            const needs = row.original.needs || [];

            // const coverage = (() => {
            //     if (available <= 0) return 0;
            //     if (needs.length === 0) return 0;

            //     let cov = 0;
            //     let rem = available;
            //     for (const n of needs) {
            //         if (n.quantity <= 0) {
            //             cov += 1;
            //             continue;
            //         }
            //         if (rem >= n.quantity) {
            //             cov += 1;
            //             rem -= n.quantity;
            //         } else {
            //             cov += rem / n.quantity;
            //             rem = 0;
            //             break;
            //         }
            //     }
            //     return cov;
            // })();

            return (
                <div className="flex flex-col min-w-[120px] py-2">
                    <span
                        className={cn(
                            available > 0
                                ? "text-indigo-600 bg-indigo-50"
                                : "text-red-600 bg-red-50",
                            "text-[10px] font-bold  px-2 py-0.5 rounded border w-fit",
                        )}
                    >
                        {formatNumber(available)}{" "}
                        <span
                            className={cn(
                                available > 0 ? "text-indigo-400" : "text-red-400",
                                "text-[10px]",
                            )}
                        >
                            {row.original.uom}
                        </span>
                    </span>
                </div>
            );
        },
        size: 140,
    },

    // ─── Kolom Sales Historis (Consolidated) ───────────────────────────────────
    {
        id: "sales_history",
        header: () => (
            <div className="flex flex-col items-start gap-0.5 min-w-[200px]">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Sales History
                </span>
                <span className="text-[9px] text-slate-400 font-medium italic">
                    3 Bulan Terakhir
                </span>
            </div>
        ),
        cell: ({ row }) => {
            const history = row.original.sales || [];
            return (
                <div className="flex items-center gap-2">
                    {periods.sales_periods.map((p) => {
                        const q = history.find((s: any) => s.key === p.key)?.quantity ?? 0;
                        return (
                            <div
                                key={p.key}
                                className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-slate-100 bg-slate-50/50 min-w-[60px]"
                            >
                                <span className="text-[8px] font-black text-slate-400 uppercase">
                                    {MONTHS_SHORT[p.month - 1]}
                                </span>
                                <span className="text-[11px] font-bold text-slate-600 tabular-nums">
                                    {formatNumber(q)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            );
        },
        size: Math.max(200, periods.sales_periods.length * 65),
    },

    {
        accessorKey: "lead_time",
        header: "LT",
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
        size: 70,
    },

    // ─── Kolom Needs Buy (Consolidated) ─────────────────────────────────────────
    {
        id: "needs_buy",
        header: () => (
            <div className="flex flex-col items-start gap-0.5 min-w-[200px]">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">
                    Needs Buy
                </span>
                <span className="text-[9px] text-orange-400 font-medium italic">
                    Forecast {periods.forecast_periods.length} Bulan
                </span>
            </div>
        ),
        cell: ({ row }) => {
            const data = row.original;
            const needs = data.needs || [];
            const horizon = data.work_order_horizon || 0;
            const readyStock = data.current_stock - data.safety_stock_x_resep + data.open_po;

            let cumulativeNeed = 0;

            return (
                <div className="flex items-center gap-2">
                    {periods.forecast_periods.map((p, index) => {
                        const q = needs.find((s: any) => s.key === p.key)?.quantity ?? 0;
                        cumulativeNeed += q;

                        const isInHorizon = horizon > 0 && index < horizon;
                        const isInsufficient = cumulativeNeed > readyStock;

                        return (
                            <div
                                key={p.key}
                                className={cn(
                                    "flex flex-col items-center justify-center p-1.5 rounded-lg border transition-colors min-w-[65px]",
                                    isInHorizon
                                        ? "bg-amber-50 border-amber-200"
                                        : "bg-white border-slate-100",
                                )}
                            >
                                <span
                                    className={cn(
                                        "text-[8px] font-black uppercase",
                                        isInHorizon ? "text-amber-600" : "text-slate-400",
                                    )}
                                >
                                    {MONTHS_SHORT[p.month - 1]}
                                </span>
                                <span
                                    className={cn(
                                        "text-[10px] font-bold tabular-nums",
                                        isInsufficient
                                            ? "text-red-600"
                                            : isInHorizon
                                              ? "text-amber-700"
                                              : "text-slate-600",
                                    )}
                                >
                                    {formatNumber(q)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            );
        },
        size: Math.max(200, periods.forecast_periods.length * 70),
    },

    {
        id: "total_needs",
        header: () => (
            <div className="flex flex-col items-center gap-0.5 py-1 min-w-[100px]">
                <div className="flex items-center font-black uppercase text-slate-500 tracking-widest leading-none text-center">
                    Total Need
                </div>
                <span className="text-[8px] text-slate-400 font-mono italic">(Horizon)</span>
            </div>
        ),
        cell: ({ row }) => {
            const data = row.original;
            const hasHorizon = !!data.work_order_horizon;

            if (!hasHorizon) {
                return (
                    <div className="flex flex-col items-center justify-center min-w-[80px]">
                        <HorizonDialog
                            data={data}
                            month={periods.month}
                            year={periods.year}
                            defaultHorizon={periods.forecastMonths}
                        />
                    </div>
                );
            }

            const total = calculateTotalNeeded(data.needs, data.work_order_horizon || 0);

            return (
                <div className="flex flex-col items-center justify-center min-w-[80px]">
                    {/* <span className="text-[11px] font-bold text-slate-700 mb-1">
                        {total !== null ? formatNumber(total) : "–"}
                    </span> */}
                    <HorizonDialog
                        data={data}
                        month={periods.month}
                        year={periods.year}
                        defaultHorizon={periods.forecastMonths}
                    />
                </div>
            );
        },
        size: 110,
        enableHiding: false,
    },
    {
        id: "recommendation_quantity",
        header: () => (
            <div className="flex flex-col items-center gap-0.5 py-1 min-w-[140px]">
                <div className="flex items-center font-black uppercase text-indigo-600 tracking-widest leading-none">
                    Rekomendasi
                </div>
                <span className="text-[8px] text-indigo-400 font-mono italic">
                    (Ready Stock) - Total Need
                </span>
            </div>
        ),
        cell: ({ row }) => {
            const data = row.original;
            const h = data.work_order_horizon || 0;

            if (!h) {
                return <span className="text-[10px] font-bold text-slate-300">–</span>;
            }

            const deficit = calculateDeficit(
                data.current_stock - data.safety_stock_x_resep,
                data.open_po,
                data.needs,
                h,
            );

            if (deficit === null || (deficit && deficit >= 0)) {
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
                    className="bg-red-50 text-red-700 shadow-none border-red-200 font-bold px-2 py-0.5 whitespace-nowrap text-[10px]"
                >
                    Beli {formatNumber(Math.abs(deficit))}
                </Badge>
            );
        },
        size: 150,
        enableSorting: true,
    },

    // ─── Kolom Open PO (Consolidated) ──────────────────────────────────────────
    {
        id: "open_po_consolidated",
        header: () => (
            <div className="flex flex-col items-start gap-0.5 min-w-[200px]">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                    Open PO
                </span>
                <span className="text-[9px] text-emerald-400 font-medium italic">
                    Pending Arrival
                </span>
            </div>
        ),
        cell: ({ row }) => {
            const pos = row.original.open_pos || [];
            return (
                <div className="flex items-center gap-2">
                    {periods.po_periods.map((p) => {
                        const q = pos.find((s: any) => s.key === p.key)?.quantity ?? 0;
                        return (
                            <div
                                key={p.key}
                                className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-emerald-100 bg-emerald-50/30 min-w-[65px]"
                            >
                                <span className="text-[8px] font-black text-emerald-600 uppercase">
                                    {MONTHS_SHORT[p.month - 1]}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-700 tabular-nums">
                                    {formatNumber(q)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            );
        },
        size: Math.max(200, periods.po_periods.length * 70),
    },

    {
        id: "total_open_po",
        header: () => {
            const startStr =
                periods.po_periods.length > 0 ? MONTHS_SHORT[periods.po_periods[0].month - 1] : "";
            const endStr =
                periods.po_periods.length > 1
                    ? MONTHS_SHORT[periods.po_periods[periods.po_periods.length - 1].month - 1]
                    : "";
            const rangeText =
                startStr && endStr
                    ? ` (${startStr} - ${endStr})`
                    : startStr
                      ? ` (${startStr})`
                      : "";

            return (
                <div className="flex flex-col items-center gap-0.5 py-1 min-w-[100px]">
                    <span className="text-[10px] font-black uppercase text-emerald-700 tracking-widest leading-none text-center">
                        Total Open PO
                        <br />
                        <span className="text-[8px] font-mono italic opacity-70">{rangeText}</span>
                    </span>
                </div>
            );
        },
        cell: ({ row }) => {
            const total =
                row.original.open_pos?.reduce((sum, po) => sum + (po.quantity || 0), 0) ?? 0;
            return (
                <span className="font-bold text-[11px] text-emerald-700">
                    {formatNumber(total)}
                </span>
            );
        },
        size: 110,
    },
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
        enableHiding: false,
    },
];

// ─── Export helper untuk digunakan di tempat lain ──────────────────────────────
export { calculateDeficit };
