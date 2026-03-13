"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ResponseForecastDTO } from "@/app/(application)/forecasts/server/forecast.schema";
import { ArrowDown, ArrowUp, Flag, GitBranchPlus, Minus, Play, TrendingUpDown } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ForecastRunDialog } from "./forecasting.dialog";
import { cn } from "@/lib/utils";
import { Box, Factory, Info } from "lucide-react";

const formatMonthYear = (year: number, month: number) =>
    new Date(year, month - 1).toLocaleString("id-ID", {
        month: "short",
        year: "2-digit",
    });

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
                <div className="space-y-2">
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

export const ForecastColumns = ({
    periods,
    horizon,
}: {
    periods: any[];
    horizon?: number;
}): ColumnDef<ResponseForecastDTO>[] => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const forecastColumns: ColumnDef<ResponseForecastDTO>[] = periods.map((p) => ({
        id: `forecast-${p.year}-${p.month}`,
        header: () => {
            const isCurrent = p.year === currentYear && p.month === currentMonth;
            return (
                <div className="flex flex-col items-start justify-center gap-0 px-2 whitespace-nowrap group">
                    <div className="flex items-center gap-1 font-bold text-[11px] 2xl:text-xs uppercase tracking-tighter w-full whitespace-nowrap">
                        {formatMonthYear(p.year, p.month)}
                        {isCurrent && (
                            <Flag className="size-3 text-blue-600 fill-blue-600 shrink-0" />
                        )}
                        <FormulaHint
                            title={`Forecast ${formatMonthYear(p.year, p.month)}`}
                            formula="Final = Input * (1 + % Growth)"
                            description="Input adalah penjualan bulan sebelumnya (M-1) atau forecast bulan sebelumnya. Ada aturan pembagian (Split) khusus untuk Aroma Utama, Atomizer, dan varian 2ml."
                        />
                    </div>
                    {p.percentage_value != null && (
                        <div className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1 rounded border border-emerald-100">
                            {Number(p.percentage_value) > 0 ? "+" : ""}
                            {Math.round(Number(p.percentage_value) * 100)}%
                        </div>
                    )}
                </div>
            );
        },
        size: 110,
        cell: ({ row }) => {
            const found = row.original.monthly_data.find((m) => {
                return m.year === p.year && m.month === p.month;
            });

            if (!found?.base_forecast)
                return <div className="text-muted-foreground text-xs px-2">–</div>;

            // const hasAdjustment =
            //     found.final_forecast &&
            //     Number(found.final_forecast) !== Number(found.base_forecast);

            const isAdjusted = found.status === "ADJUSTED";

            const TrendIcon =
                found.trend === "UP" ? ArrowUp : found.trend === "DOWN" ? ArrowDown : Minus;
            const trendColor =
                found.trend === "UP"
                    ? "text-green-600"
                    : found.trend === "DOWN"
                      ? "text-rose-600"
                      : "text-muted-foreground";

            const forecastValue = Math.round(Number(found.final_forecast ?? found.base_forecast));
            if (forecastValue <= 0) return null;

            return (
                <TooltipProvider>
                    <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                            <div
                                className={`
                                    group w-full rounded-md px-2 py-0.5
                                    flex flex-col items-start gap-0
                                    transition-all border border-transparent
                                    ${isAdjusted ? "bg-emerald-50/80 hover:bg-emerald-100/80" : "hover:bg-muted/60"}
                                `}
                            >
                                <div className="flex items-center gap-1.5">
                                    <span
                                        className={`text-sm font-bold leading-none ${isAdjusted ? "text-emerald-700" : "text-foreground"}`}
                                    >
                                        {forecastValue}
                                    </span>
                                    <TrendIcon className={`size-3 ${trendColor}`} />
                                    {found.is_actionable && (
                                        <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    )}
                                </div>
                            </div>
                        </TooltipTrigger>

                        <TooltipContent side="top" className="w-64 p-3 flex flex-col gap-2">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest border-b pb-1.5 mb-1">
                                Analisis Forecast
                            </p>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Base Forecast:</span>
                                    <span className="font-mono font-semibold">
                                        {Number(found.base_forecast).toLocaleString()}
                                    </span>
                                </div>
                                {found.percentage_value != null && (
                                    <div className="flex justify-between text-[10px] text-emerald-600 font-bold bg-emerald-50/50 px-1 rounded">
                                        <span>Growth Factor:</span>
                                        <span>
                                            {Number(found.percentage_value) > 0 ? "+" : ""}
                                            {Math.round(Number(found.percentage_value) * 100)}%
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-1 space-y-1 bg-emerald-50 p-1.5 rounded-md border border-emerald-100">
                                <div className="flex justify-between text-xs text-emerald-900 border-t border-emerald-200 mt-1 pt-1">
                                    <span className="font-bold">Final Forecast:</span>
                                    <span className="font-mono font-black text-sm">
                                        {Number(
                                            found.final_forecast || found.base_forecast,
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    }));

    return [
        {
            id: "product",
            header: "Produk",
            size: 300,
            cell: ({ row }) => {
                const [open, setOpen] = useState(false);

                return (
                    <div className="flex flex-row space-x-2 items-center py-1.5 group/row">
                        <div className="flex flex-col gap-1">
                            <Button
                                size="icon"
                                className="h-7 w-7 rounded-md cursor-pointer hover:scale-110 transition-transform bg-teal-50 hover:bg-teal-100 border-teal-200"
                                variant="outline"
                                title="Run Forecast"
                                onClick={() => setOpen(true)}
                            >
                                <TrendingUpDown className="size-3 text-teal-600" />
                            </Button>
                            <ForecastRunDialog
                                open={open}
                                onOpenChange={setOpen}
                                productId={row.original.product_id}
                                productName={row.original.product_name}
                            />
                        </div>

                        {/* Detail Produk */}
                        <Link
                            href={`/products/${row.original.product_id}`}
                            className="overflow-hidden"
                        >
                            <p className="text-[10px] text-muted-foreground font-mono truncate">
                                {row.original.product_code}
                            </p>

                            <p className="font-bold text-xs 2xl:text-sm truncate leading-tight text-primary">
                                {row.original.product_name}{" "}
                                {row.original.product_type.toLocaleUpperCase()}{" "}
                                {row.original.product_size.toLocaleUpperCase()}
                            </p>
                        </Link>
                    </div>
                );
            },
        },
        {
            id: "edar",
            header: () => (
                <div className="flex items-center font-bold text-xs uppercase text-slate-500 whitespace-nowrap">
                    EDAR
                    <FormulaHint
                        title="Persentase Edar (Distribution)"
                        formula="% EDAR = (Varian / Σ Penjualan Grup Aroma) %"
                        description="Varian utama botol 100/110ml akan berbagi 'EDAR' dari total pool aroma tersebut."
                    />
                </div>
            ),
            cell: ({ row }) => {
                const edar = row.original.distribution_percentage;
                if (!edar || edar <= 0) return null;
                const displayVal = Math.round(Number(edar));
                return (
                    <div className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block border border-blue-100 min-w-12 text-center shadow-sm">
                        {displayVal}%
                    </div>
                );
            },
            size: 80,
        },

        ...forecastColumns,
        {
            id: "safety_p",
            header: () => (
                <div className="flex items-center font-bold text-xs uppercase text-slate-500 whitespace-nowrap">
                    % SAFETY
                    <FormulaHint
                        title="Safety Stock Ratio"
                        formula="Target stok aman dalam persentase (%) terhadap rata-rata forecast bulanan."
                    />
                </div>
            ),
            cell: ({ row }) => {
                const val = row.original.safety_percentage;
                const displayVal = Math.round(Number(val || 0) * 100);
                return (
                    <div className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded inline-block border border-amber-100 min-w-12 text-center shadow-sm">
                        {displayVal}%
                    </div>
                );
            },
            size: 80,
        },
        {
            id: "total-forecast",
            header: () => (
                <div className="flex items-center font-bold text-xs uppercase whitespace-nowrap">
                    Total Forecast
                    <FormulaHint
                        title="Total Forecast"
                        formula={`Σ Forecast bulan m s/d m+${Number(horizon) - 1} (${horizon} bulan)`}
                        description="Akumulasi seluruh proyeksi penjualan selama periode horizon yang ditetapkan."
                    />
                </div>
            ),
            cell: ({ row }) => {
                const s = row.original;
                const total = Math.round(Number(s.safety_stock_summary?.total_forecast || 0));
                if (
                    !s.safety_stock_summary ||
                    total <= 0 ||
                    !s.distribution_percentage ||
                    s.distribution_percentage <= 0
                )
                    return null;

                return (
                    <div className="flex flex-col">
                        <span className="font-black text-indigo-700 text-sm leading-tight">
                            {total.toLocaleString("id-ID")}{" "}
                            <span className="text-[10px] font-medium text-indigo-500">ML</span>
                        </span>
                    </div>
                );
            },
            size: 130,
        },
        {
            id: "safety-stock",
            header: () => (
                <div className="flex items-center font-bold text-xs uppercase whitespace-nowrap">
                    Safety Stock
                    <FormulaHint
                        title="Safety Stock"
                        formula={`SS = (Total Forecast / ${horizon}) * % Safety`}
                        description="Stok cadangan minimal yang harus tersedia berdasarkan rata-rata kebutuhan horizon."
                    />
                </div>
            ),
            cell: ({ row }) => {
                const s = row.original;
                const val = Math.round(Number(s.safety_stock_summary?.safety_stock_quantity || 0));
                if (
                    !s.safety_stock_summary ||
                    val <= 0 ||
                    !s.distribution_percentage ||
                    s.distribution_percentage <= 0
                )
                    return null;

                return (
                    <div className="flex flex-col">
                        <div className="flex flex-col">
                            <span className="font-black text-emerald-700 text-sm leading-tight">
                                {val.toLocaleString("id-ID")}{" "}
                                <span className="text-[10px] font-medium text-emerald-500">ML</span>
                            </span>
                        </div>
                    </div>
                );
            },
            size: 130,
        },
        {
            id: "total-demand",
            header: () => (
                <div className="flex items-center font-bold text-xs uppercase whitespace-nowrap text-rose-600">
                    Jumlah Forecast
                    <FormulaHint
                        title="Total Demand"
                        formula="Total Demand = Total Forecast + Safety Stock"
                        description="Angka acuan final untuk kebutuhan pengadaan/produksi seluruh material resep."
                    />
                </div>
            ),
            cell: ({ row }) => {
                const s = row.original;
                const totalDemand = Math.round(Number(s.safety_stock_summary?.total_demand || 0));
                if (
                    !s.safety_stock_summary ||
                    totalDemand <= 0 ||
                    !s.distribution_percentage ||
                    s.distribution_percentage <= 0
                )
                    return null;

                return (
                    <div className="flex flex-co">
                        <span className="font-black text-rose-700 text-sm leading-tight">
                            {totalDemand.toLocaleString("id-ID")}{" "}
                            <span className="text-[10px] font-medium text-rose-500">ML</span>
                        </span>
                    </div>
                );
            },
            size: 140,
        },
        {
            id: "current_stock",
            header: () => (
                <div className="font-bold text-[10px] 2xl:text-xs uppercase text-slate-500 whitespace-nowrap flex items-center gap-1">
                    <Box size={14} className="text-slate-400" />
                    Stock
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-[11px] 2xl:text-xs font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded inline-block border border-slate-200 min-w-16 text-center shadow-sm tabular-nums">
                    {Math.round(row.original.current_stock).toLocaleString("id-ID")}
                </div>
            ),
            size: 100,
        },
        {
            id: "need_produce",
            header: () => (
                <div className="font-bold text-[10px] 2xl:text-xs uppercase text-orange-600 whitespace-nowrap flex items-center gap-1">
                    <Factory size={14} className="text-orange-400" />
                    Produce
                </div>
            ),
            cell: ({ row }) => {
                const value = row.original.need_produce;
                return (
                    <div
                        className={cn(
                            "text-[11px] 2xl:text-xs font-black px-2 py-0.5 rounded inline-block border min-w-16 text-center shadow-sm tabular-nums transition-all",
                            value > 0
                                ? "text-orange-700 bg-orange-50 border-orange-200 shadow-orange-100"
                                : "text-slate-400 bg-slate-50 border-slate-100 opacity-60",
                        )}
                    >
                        {value > 0 ? Math.round(value).toLocaleString("id-ID") : "–"}
                    </div>
                );
            },
            size: 110,
        },
    ];
};
