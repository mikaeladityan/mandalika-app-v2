"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ResponseForecastDTO } from "@/app/(application)/forecasts/server/forecast.schema";
import { ArrowDown, ArrowUp, Flag, GitBranchPlus, Minus, Play, TrendingUpDown } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SyncProductionDialog } from "./production.dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ForecastRunDialog } from "./forecasting.dialog";

const formatMonthYear = (year: number, month: number) =>
    new Date(year, month - 1).toLocaleString("id-ID", {
        month: "short",
        year: "2-digit",
    });

export const ForecastColumns = ({
    periods,
}: {
    periods: any[];
}): ColumnDef<ResponseForecastDTO>[] => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const forecastColumns: ColumnDef<ResponseForecastDTO>[] = periods.map((p) => ({
        id: `forecast-${p.year}-${p.month}`,
        header: () => {
            const isCurrent = p.year === currentYear && p.month === currentMonth;
            return (
                <div className="flex flex-col items-start justify-center gap-0.5 px-2 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-bold text-[11px] 2xl:text-xs uppercase tracking-tighter w-full whitespace-nowrap">
                        {formatMonthYear(p.year, p.month)}
                        {isCurrent && (
                            <Flag className="size-3 text-blue-600 fill-blue-600 shrink-0" />
                        )}
                    </div>
                    {p.percentage_value != null && (
                        <div className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1 rounded border border-emerald-100">
                            {Number(p.percentage_value) > 0 ? "+" : ""}{p.percentage_value}%
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

            const hasAdjustment =
                found.final_forecast &&
                Number(found.final_forecast) !== Number(found.base_forecast);

            const isAdjusted = found.status === "ADJUSTED";

            const TrendIcon =
                found.trend === "UP" ? ArrowUp : found.trend === "DOWN" ? ArrowDown : Minus;
            const trendColor =
                found.trend === "UP"
                    ? "text-green-600"
                    : found.trend === "DOWN"
                      ? "text-rose-600"
                      : "text-muted-foreground";

            return (
                <TooltipProvider>
                    <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                            <div
                                className={`
                                    group w-full rounded-md px-2 py-1.5
                                    flex flex-col items-start gap-0.5
                                    transition-all border border-transparent
                                    ${isAdjusted ? "bg-emerald-50/80 hover:bg-emerald-100/80" : "hover:bg-muted/60"}
                                `}
                            >
                                <div className="flex items-center gap-1.5">
                                    <span
                                        className={`text-sm font-bold leading-none ${isAdjusted ? "text-emerald-700" : "text-foreground"}`}
                                    >
                                        {Math.round(Number(found.final_forecast ?? found.base_forecast))}
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
                                        <span>{Number(found.percentage_value) > 0 ? "+" : ""}{found.percentage_value}%</span>
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
                    <div className="flex flex-row space-x-3 items-center py-1 group/row">
                        <div className="flex flex-col gap-1">
                            <Button
                                size="icon"
                                className="h-8 w-8 cursor-pointer hover:scale-110 transition-transform bg-teal-50 hover:bg-teal-100 border-teal-200"
                                variant="outline"
                                title="Run Forecast"
                                onClick={() => setOpen(true)}
                            >
                                <TrendingUpDown className="size-4 text-teal-600" />
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
                                {row.original.product_name}
                            </p>
                            <div className="flex gap-1 mt-1">
                                <span className="text-[10px] border border-slate-200 px-1.5 rounded text-slate-500 uppercase bg-slate-50 font-bold">
                                    {row.original.product_type}
                                </span>
                                <span className="text-[10px] border border-slate-200 px-1.5 rounded text-slate-500 uppercase bg-slate-50 font-bold">
                                    {row.original.product_size}
                                </span>
                            </div>
                        </Link>
                    </div>
                );
            },
        },
        {
            id: "edar",
            header: () => (
                <div className="font-bold text-xs uppercase text-slate-500 whitespace-nowrap">
                    % EDAR
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block border border-blue-100 min-w-12 text-center shadow-sm">
                    {row.original.distribution_percentage}%
                </div>
            ),
            size: 80,
        },
        {
            id: "safety_p",
            header: () => (
                <div className="font-bold text-xs uppercase text-slate-500 whitespace-nowrap">
                    % SAFETY
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded inline-block border border-amber-100 min-w-12 text-center shadow-sm">
                    {row.original.safety_percentage}%
                </div>
            ),
            size: 80,
        },
        ...forecastColumns,
        {
            id: "safety-stock",
            header: () => (
                <div className="font-bold text-xs uppercase whitespace-nowrap">
                    Safety Stock
                </div>
            ),
            cell: ({ row }) => {
                const s = row.original;
                if (!s.safety_stock_summary) return <div className="text-xs text-muted-foreground px-4">–</div>;

                return (
                    <div className="flex flex-col border-l pl-4 py-1">
                        <span className="font-bold text-emerald-600 text-sm">
                            {Math.round(Number(s.safety_stock_summary.safety_stock_quantity || 0))} Unit
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                            Ratio: {Math.round(Number(s.safety_stock_summary.safety_stock_ratio || 0))}%
                        </span>
                    </div>
                );
            },
        },
    ];
};
