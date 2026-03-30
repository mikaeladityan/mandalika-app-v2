"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ResponseForecastDTO } from "@/app/(application)/forecasts/server/forecast.schema";
import { ArrowDown, ArrowUp, Minus, TrendingUpDown } from "lucide-react";
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
                    <p className="font-bold text-[10px] uppercase tracking-wider text-primary border-b border-primary/10 pb-1">
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
    onEditManual,
    is_display,
}: {
    periods: any[];
    horizon?: number;
    is_display?: boolean;
    onEditManual?: (data: {
        product_id: number;
        product_name: string;
        month: number;
        year: number;
        period: string;
        current_value: number;
        current_ratio?: number;
        is_display?: boolean;
    }) => void;
}): ColumnDef<ResponseForecastDTO>[] => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const forecastColumn: ColumnDef<ResponseForecastDTO> = {
        id: "forecast-values",
        header: ({ table }) => {
            const first = periods[0];
            const last = periods[periods.length - 1];
            const rangeText =
                first && last
                    ? `${formatMonthYear(first.year, first.month)} — ${formatMonthYear(last.year, last.month)}`
                    : "";

            const firstRow = table.getFilteredRowModel().rows[0]?.original;

            return (
                <div className="flex flex-col items-start justify-center gap-1.5 py-1">
                    {/* <span className="font-black text-[9px] uppercase tracking-tighter text-slate-800 flex items-center gap-1.5 whitespace-nowrap">
                        <TrendingUpDown className="size-3 text-primary" />
                        Forecast Analytics
                        <span className="text-slate-400 font-bold ml-1">{rangeText}</span>
                    </span> */}

                    <div className="flex items-center gap-1">
                        {periods.map((p, idx) => {
                            const isCurrent = p.year === currentYear && p.month === currentMonth;
                            const monthData = firstRow?.monthly_data.find(
                                (m) => m.year === p.year && m.month === p.month,
                            );
                            const pct = monthData?.percentage_value;

                            return (
                                <div
                                    key={`head-${p.year}-${p.month}-${idx}`}
                                    className={cn(
                                        "min-w-[64px] flex flex-col items-center justify-center px-2 py-0.5 rounded border transition-all relative",
                                        isCurrent
                                            ? "bg-primary/5 border-primary/20"
                                            : "bg-slate-50 border-slate-100",
                                    )}
                                >
                                    <span className="text-[8px] font-black text-nowrap text-slate-500 uppercase tracking-tighter">
                                        {formatMonthYear(p.year, p.month)}
                                    </span>
                                    {pct != null && (
                                        <span
                                            className={cn(
                                                "text-[9px] font-black tracking-tighter",
                                                Number(pct) < 0
                                                    ? "text-rose-600"
                                                    : "text-emerald-600",
                                            )}
                                        >
                                            {Number(pct) > 0 ? "+" : ""}
                                            {pct}%
                                        </span>
                                    )}
                                    {isCurrent && (
                                        <div className="absolute -top-0.5 -right-0.5 size-1 rounded-full bg-primary" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        },
        size: Math.max(300, Number(horizon) * 90),
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    {periods.map((p, idx) => {
                        const found = row.original.monthly_data.find(
                            (m) => m.year === p.year && m.month === p.month,
                        );

                        const isCurrent =
                            found?.is_current_month ??
                            (p.year === currentYear && p.month === currentMonth);
                        const isAdjusted = found?.status === "ADJUSTED";

                        const TrendIcon =
                            found?.trend === "UP"
                                ? ArrowUp
                                : found?.trend === "DOWN"
                                  ? ArrowDown
                                  : Minus;
                        const trendColor =
                            found?.trend === "UP"
                                ? "text-green-600"
                                : found?.trend === "DOWN"
                                  ? "text-rose-600"
                                  : "text-muted-foreground";

                        return (
                            <TooltipProvider key={`${p.year}-${p.month}-${idx}`}>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <div
                                            onClick={(e) => {
                                                if (!is_display) return;
                                                e.stopPropagation();
                                                console.log("Manual edit triggered:", p);
                                                onEditManual?.({
                                                    product_id: row.original.product_id,
                                                    product_name: row.original.product_name,
                                                    month: p.month,
                                                    year: p.year,
                                                    period: formatMonthYear(p.year, p.month),
                                                    current_value: Number(
                                                        found?.base_forecast ?? 0,
                                                    ),
                                                    current_ratio: Number(found?.ratio ?? 0),
                                                    is_display: is_display,
                                                });
                                            }}
                                            className={cn(
                                                "group flex items-center justify-center gap-1.5 p-1 rounded-md border transition-all min-w-[64px] h-9",
                                                is_display
                                                    ? "cursor-pointer"
                                                    : "cursor-default select-none",
                                                isAdjusted
                                                    ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
                                                    : isCurrent
                                                      ? "bg-slate-50 border-primary/10"
                                                      : "bg-white border-transparent",
                                                is_display &&
                                                    !isAdjusted &&
                                                    !isCurrent &&
                                                    "hover:border-slate-200 hover:bg-slate-50",
                                                is_display && isCurrent && "hover:bg-white",
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "text-[10px] font-bold tabular-nums tracking-tight",
                                                    isAdjusted ? "text-primary" : "text-slate-900",
                                                    !found && "text-slate-300 italic",
                                                )}
                                            >
                                                {found
                                                    ? Math.round(
                                                          Number(
                                                              found.final_forecast ??
                                                                  found.base_forecast,
                                                          ),
                                                      ).toLocaleString("id-ID")
                                                    : "0"}
                                            </span>
                                            {found && (
                                                <TrendIcon className={cn("size-3", trendColor)} />
                                            )}
                                            {!found && (
                                                <div className="text-[14px] text-slate-300">
                                                    <Minus className="size-3" />
                                                </div>
                                            )}
                                        </div>
                                    </TooltipTrigger>

                                    <TooltipContent
                                        side="top"
                                        className="w-64 p-3 flex flex-col gap-2"
                                    >
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest border-b pb-1.5 mb-1">
                                            Analisis {formatMonthYear(p.year, p.month)}
                                        </p>

                                        {found ? (
                                            <>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-xs text-slate-500">
                                                        <span>Base Forecast:</span>
                                                        <span className="font-mono font-semibold">
                                                            {Number(
                                                                found.base_forecast,
                                                            ).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {found.percentage_value != null &&
                                                        row.original.product_type?.toLowerCase() !==
                                                            "atomizer" && (
                                                            <div className="flex justify-between text-[10px] text-emerald-600 font-bold bg-emerald-50/50 px-1 rounded">
                                                                <span>Persentase:</span>
                                                                <span>
                                                                    {Number(
                                                                        found.percentage_value,
                                                                    ) > 0
                                                                        ? "+"
                                                                        : ""}
                                                                    {found.percentage_value}%
                                                                </span>
                                                            </div>
                                                        )}
                                                </div>

                                                <div className="mt-1 space-y-1 bg-primary/5 p-1.5 rounded-md border border-primary/10">
                                                    <div className="flex justify-between text-xs text-primary border-t border-primary/10 mt-1 pt-1">
                                                        <span className="font-bold">
                                                            Final Forecast:
                                                        </span>
                                                        <span className="font-mono font-black text-sm">
                                                            {Number(
                                                                Math.round(
                                                                    found.final_forecast ||
                                                                        found.base_forecast,
                                                                ),
                                                            ).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-xs text-slate-500 italic">
                                                Belum ada data forecast. Klik untuk mengisi secara
                                                manual.
                                            </p>
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    })}
                </div>
            );
        },
    };

    return [
        {
            id: "code",
            header: "SKU",
            size: 300,

            cell: ({ row }) => {
                const [open, setOpen] = useState(false);
                return (
                    <div className="flex flex-row items-center py-1 group/row gap-2">
                        <Button
                            className="h-7 w-7 rounded-md cursor-pointer hover:scale-110 transition-transform bg-primary/5 hover:bg-primary/10 border-primary/20 p-0"
                            variant="outline"
                            title="Run Forecast"
                            onClick={() => setOpen(true)}
                        >
                            <TrendingUpDown className="text-primary size-3.5" />
                        </Button>
                        <ForecastRunDialog
                            open={open}
                            onOpenChange={setOpen}
                            productId={row.original.product_id}
                            productName={row.original.product_name}
                        />
                        <p className="text-[10px] text-muted-foreground font-bold truncate">
                            {row.original.product_code}
                        </p>
                    </div>
                );
            },
        },
        {
            id: "product",
            header: "product",
            size: 300,
            cell: ({ row }) => {
                return (
                    <div className="flex flex-row space-x-2 items-center py-1 group/row">
                        <Link
                            href={`/products/${row.original.product_id}`}
                            className="overflow-hidden"
                        >
                            <p className="font-bold text-[10px] truncate leading-tight text-primary">
                                {row.original.product_name}{" "}
                            </p>
                        </Link>
                    </div>
                );
            },
        },
        {
            id: "product_type",
            header: "type",
            size: 300,
            cell: ({ row }) => {
                return (
                    <div className="flex flex-row space-x-2 items-center py-1 group/row">
                        <Link
                            href={`/products/${row.original.product_id}`}
                            className="overflow-hidden"
                        >
                            <p className="font-bold text-[10px] truncate leading-tight text-primary">
                                {row.original.product_type.toLocaleUpperCase()}
                            </p>
                        </Link>
                    </div>
                );
            },
        },
        {
            id: "edar",
            header: () => (
                <div className="flex items-center font-black text-[10px] uppercase text-slate-500 whitespace-nowrap">
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
                return (
                    <div className="text-[10px] font-black text-primary bg-primary/5 px-1.5 py-0.5 rounded inline-block border border-primary/10 min-w-10 text-center shadow-xs">
                        {edar}%
                    </div>
                );
            },
            size: 80,
        },
        {
            id: "size",
            header: "size",
            cell: ({ row }) => {
                return (
                    <div className="text-[10px] font-black text-primary bg-primary/5 px-1.5 py-0.5 rounded inline-block border border-primary/10 min-w-10 text-center shadow-xs">
                        {row.original.product_size.toLocaleUpperCase()}
                    </div>
                );
            },
            size: 80,
        },

        ...[forecastColumn],

        {
            id: "total-forecast",
            header: () => (
                <div className="flex items-center font-black text-[10px] uppercase text-slate-500 whitespace-nowrap">
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
                if (!s.safety_stock_summary)
                    return <div className="text-xs text-muted-foreground px-4">–</div>;

                return (
                    <div className="flex flex-col py-1">
                        <span className="font-bold text-primary text-[10px] leading-tight">
                            {Math.round(
                                Number(s.safety_stock_summary.total_forecast || 0),
                            ).toLocaleString("id-ID")}{" "}
                            <span className="text-[8px] font-medium text-primary/60">ML</span>
                        </span>
                    </div>
                );
            },
            size: 130,
        },

        {
            id: "total-demand",
            header: () => (
                <div className="flex items-center font-black text-[10px] uppercase text-slate-500 whitespace-nowrap">
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
                if (!s.safety_stock_summary)
                    return <div className="text-xs text-muted-foreground px-4">–</div>;

                return (
                    <div className="flex flex-col py-1">
                        <span className="font-bold text-rose-700 text-[10px] leading-tight">
                            {Math.round(
                                Number(s.safety_stock_summary.total_demand || 0),
                            ).toLocaleString("id-ID")}{" "}
                            <span className="text-[8px] font-medium text-rose-500">ML</span>
                        </span>
                    </div>
                );
            },
            size: 140,
        },
        {
            id: "safety_percentage",
            header: () => (
                <div className="flex items-center font-black text-[10px] uppercase text-slate-500 whitespace-nowrap">
                    % SAFETY
                    <FormulaHint
                        title="Safety Stock Ratio"
                        formula="Target stok aman dalam persentase (%) terhadap rata-rata forecast bulanan."
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded inline-block border border-amber-100 min-w-10 text-center shadow-xs">
                    {row.original.safety_percentage}%
                </div>
            ),
            size: 80,
        },
        {
            id: "safety-stock",
            header: () => (
                <div className="flex items-center font-black text-[10px] uppercase text-slate-500 whitespace-nowrap">
                    Safety Stock
                    <FormulaHint
                        title="Safety Stock"
                        formula={`SS = (Total Forecast / ${horizon}) * % Safety`}
                        description={`Stok cadangan minimal yang dihitung berdasarkan rata-rata kebutuhan selama ${horizon} bulan (Horizon yang dipilih).`}
                    />
                </div>
            ),
            cell: ({ row }) => {
                const s = row.original;
                if (!s.safety_stock_summary)
                    return <div className="text-xs text-muted-foreground px-4">–</div>;

                return (
                    <div className="flex flex-col py-1">
                        <span className="font-bold text-emerald-700 text-[10px] leading-tight">
                            {Math.round(
                                Number(s.safety_stock_summary.safety_stock_quantity || 0),
                            ).toLocaleString("id-ID")}{" "}
                            <span className="text-[8px] font-medium text-emerald-500">ML</span>
                        </span>
                    </div>
                );
            },
            size: 130,
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
                <div className="text-[10px] font-bold text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded inline-block border border-slate-200 min-w-14 text-center shadow-xs tabular-nums">
                    {Math.round(row.original.current_stock).toLocaleString("id-ID")}
                </div>
            ),
            size: 100,
        },
        {
            id: "need_produce",
            header: () => {
                const first = periods[0];
                return (
                    <div className="flex items-center font-black text-[10px] uppercase text-slate-500 whitespace-nowrap gap-1">
                        <Factory size={14} className="text-slate-400" />
                        Produce {first ? formatMonthYear(first.year, first.month) : ""}
                        <FormulaHint
                            title="Need Produce"
                            formula="Produce = Forecast M1 - Current Stock"
                            description="Kebutuhan produksi bulan berjalan untuk memenuhi target forecast berdasarkan stok yang tersedia."
                        />
                    </div>
                );
            },
            cell: ({ row }) => {
                const value = row.original.need_produce;
                return (
                    <div
                        className={cn(
                            "text-[10px] font-black px-1.5 py-0.5 rounded inline-block border min-w-14 text-center shadow-xs tabular-nums transition-all",
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
