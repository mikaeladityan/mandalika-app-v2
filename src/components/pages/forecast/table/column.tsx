"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ResponseForecastDTO } from "@/app/(application)/forecasts/server/forecast.schema";
import { ArrowDown, ArrowUp, Flag, GitBranchPlus, Minus, Play, TrendingUpDown } from "lucide-react";
import { useState } from "react";
import { AddRatioForecastDialog } from "./add.ratio.dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SyncProductionDialog } from "./production.dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ForecastRunDialog } from "./forecasting.dialog";
import { ReconcileRunDialog } from "./reconciling.dialog";

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
                <div className="flex items-center justify-start gap-1 font-bold text-[11px] 2xl:text-xs uppercase tracking-tighter">
                    {formatMonthYear(p.year, p.month)}
                    {isCurrent && <Flag className="size-3 text-blue-600 fill-blue-600" />}
                </div>
            );
        },
        size: 100,
        cell: ({ row }) => {
            const found = row.original.monthly_data.find((m) => {
                if (p.period && m.period) {
                    return (
                        new Date(p.period).getTime() === new Date(m.period).getTime() ||
                        (m.year === p.year && m.month === p.month)
                    );
                }
                return m.year === p.year && m.month === p.month;
            });

            const [open, setOpen] = useState(false);

            if (!found?.base_forecast)
                return <div className="text-muted-foreground text-xs px-2">–</div>;

            const hasAdjustment =
                found.final_forecast &&
                Number(found.final_forecast) !== Number(found.base_forecast);

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
                            <button
                                onClick={() => setOpen(true)}
                                className={`
                                    group w-full rounded-md px-2 py-1.5
                                    flex flex-col items-start gap-0.5
                                    transition-all border border-transparent
                                    hover:border-primary/20 cursor-pointer
                                    ${hasAdjustment ? "bg-emerald-50/80 hover:bg-emerald-100/80" : "hover:bg-muted/60"}
                                `}
                            >
                                <div className="flex items-center gap-1.5">
                                    <span
                                        className={`text-sm font-bold leading-none ${hasAdjustment ? "text-emerald-700" : "text-foreground"}`}
                                    >
                                        {found.final_forecast || found.base_forecast}
                                    </span>
                                    <TrendIcon className={`size-3 ${trendColor}`} />
                                    {found.is_actionable && (
                                        <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    )}
                                </div>

                                <div className="flex items-center gap-1">
                                    {found.absolute_error !== null ? (
                                        <span className="text-[10px] font-mono text-rose-500 bg-rose-50 px-1 rounded">
                                            ae {found.absolute_error}
                                        </span>
                                    ) : (
                                        <span className="text-[9px] text-muted-foreground italic tracking-tighter">
                                            {hasAdjustment ? "Adjusted" : "Draft"}
                                        </span>
                                    )}
                                </div>
                            </button>
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
                                <div className="flex justify-between text-[11px] text-blue-600 bg-blue-50/50 px-1 py-0.5 rounded">
                                    <span>Safety Stock Error :</span>
                                    <span className="font-mono font-bold">
                                        +{Math.round(Number(found.system_ratio || 0))}%
                                    </span>
                                </div>
                            </div>

                            {/* SECTION 2: MANUAL ADJUSTMENT */}
                            <div className="space-y-1 border-t pt-1.5 border-dashed">
                                <div className="flex justify-between text-[11px] text-amber-600">
                                    <span>Additional Ratio:</span>
                                    <span className="font-mono font-bold">
                                        +{Math.round(Number(found.additional_ratio || 0))}%
                                    </span>
                                </div>

                                {/* HITUNG IMPACT UNIT: Selisih murni akibat Additional Ratio */}
                                {Number(found.additional_ratio) !== 0 && (
                                    <div className="flex justify-between text-[10px] bg-amber-50 text-amber-700 px-1 py-0.5 rounded italic">
                                        <span>Manual Impact:</span>
                                        <span className="font-bold">
                                            {/* Rumus: (AddRatio/100) * Base */}+
                                            {Math.round(
                                                (Number(found.additional_ratio) / 100) *
                                                    Number(found.base_forecast),
                                            )}{" "}
                                            Unit
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* SECTION 3: TOTAL & FINAL */}
                            <div className="mt-1 space-y-1 bg-emerald-50 p-1.5 rounded-md border border-emerald-100">
                                <div className="flex justify-between text-[11px] text-emerald-800">
                                    <span>Total Ratio:</span>
                                    <span className="font-mono font-bold italic">
                                        {Math.round(
                                            Number(found.system_ratio || 0) +
                                                Number(found.additional_ratio || 0),
                                        )}
                                        %
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-emerald-900 border-t border-emerald-200 mt-1 pt-1">
                                    <span className="font-bold">Final Forecast:</span>
                                    <span className="font-mono font-black text-sm">
                                        {Number(
                                            found.final_forecast || found.base_forecast,
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <p className="text-[9px] text-muted-foreground mt-1 text-center italic border-t pt-1">
                                Klik untuk atur ratio adjustment
                            </p>
                        </TooltipContent>
                    </Tooltip>

                    <AddRatioForecastDialog
                        open={open}
                        onOpenChange={setOpen}
                        productId={row.original.product_id}
                        productName={row.original.product_name}
                        month={p.month}
                        year={p.year}
                    />
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
                const [openReconcile, setOpenReconcile] = useState(false);

                return (
                    <div className="flex flex-row space-x-3 items-center py-1 group/row">
                        <div className="flex flex-col gap-1">
                            <Button
                                size="icon"
                                className="h-7 w-7 cursor-pointer hover:scale-110 transition-transform"
                                variant="outline"
                                title="Run Forecast"
                                onClick={() => setOpen(true)}
                            >
                                <TrendingUpDown className="size-3.5 text-teal-600" />
                            </Button>
                            <ForecastRunDialog
                                open={open}
                                onOpenChange={setOpen}
                                productId={row.original.product_id}
                                productName={row.original.product_name}
                            />

                            <Button
                                size="icon"
                                className="h-7 w-7 cursor-pointer hover:scale-110 transition-transform"
                                variant="warning"
                                title="Run Reconcile"
                                onClick={() => setOpenReconcile(true)}
                            >
                                <GitBranchPlus />
                            </Button>
                            <ReconcileRunDialog
                                open={openReconcile}
                                onOpenChange={setOpenReconcile}
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
                                <span className="text-xs border border-muted px-1 rounded text-muted-foreground uppercase bg-muted/20">
                                    {row.original.product_type}
                                </span>
                                <span className="text-xs border border-muted px-1 rounded text-muted-foreground uppercase bg-muted/20">
                                    {row.original.product_size}
                                </span>
                            </div>
                        </Link>
                    </div>
                );
            },
        },
        ...forecastColumns,
        {
            id: "action",
            header: () => (
                <div className="font-bold text-xs uppercase">
                    NEED PRODUCE {formatMonthYear(now.getFullYear(), now.getMonth() + 1)}
                </div>
            ),
            cell: ({ row }) => {
                const s = row.original;
                const [open, setOpen] = useState(false);

                const needProduce = s.need_produce;
                const isCalculated = needProduce !== null && needProduce !== undefined;

                return (
                    <div className="flex items-center gap-2 min-w-32 border-l pl-4 py-1">
                        {/* Safety Stock Ratio */}
                        <span className="text-sm text-emerald-600 font-medium whitespace-nowrap">
                            Sys: {Math.round(Number(s.safety_stock_summary.safety_stock_ratio))}%
                        </span>

                        <div className="w-px h-5 bg-gray-200" />

                        {/* Production State */}
                        {!isCalculated && (
                            <>
                                <Button
                                    variant="outline"
                                    size="xs"
                                    className="flex items-center gap-1"
                                    onClick={() => setOpen(true)}
                                >
                                    <Play className="w-3 h-3" />
                                    Sync
                                </Button>

                                <SyncProductionDialog
                                    open={open}
                                    onOpenChange={setOpen}
                                    product_id={s.product_id}
                                    productName={s.product_name}
                                    month={currentMonth}
                                    year={currentYear}
                                />
                            </>
                        )}

                        {isCalculated && needProduce === 0 && (
                            <span className="text-xs font-semibold text-gray-400">
                                No Production
                            </span>
                        )}

                        {isCalculated && needProduce > 0 && (
                            <span className="font-bold text-cyan-600">
                                {Math.round(needProduce)}
                            </span>
                        )}
                    </div>
                );
            },
        },
    ];
};
