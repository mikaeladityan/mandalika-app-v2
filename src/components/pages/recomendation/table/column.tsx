"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/utils";
import { RecomendationResponse } from "@/app/(application)/recomendation/server/recomendation.schema";
import {
    useActionSaveOrder,
    useApproveRecomendation,
} from "@/app/(application)/recomendation/server/use.recomendation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Check, Clock, Save } from "lucide-react";
import dayjs from "dayjs";

interface PeriodProps {
    sales_periods: { month: number; year: number; period: Date | string; key: string }[];
    forecast_periods: { month: number; year: number; period: Date | string; key: string }[];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

export const RecomendationColumns = ({
    sales_periods,
    forecast_periods,
}: PeriodProps): ColumnDef<RecomendationResponse>[] => {
    const baseColumns: ColumnDef<RecomendationResponse>[] = [
        {
            accessorKey: "material_name",
            header: "MATERIAL / BARCODE",
            cell: ({ row }) => {
                const mat = row.original;
                return (
                    <div className="flex flex-col min-w-[200px]">
                        <Link
                            href={`/bom/${mat.barcode}/`}
                            className="col-span-6 flex flex-col pr-4 group"
                        >
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-600 truncate">
                                {mat.material_name}
                            </span>
                            <span className="text-xs font-mono text-slate-400 uppercase">
                                {mat.barcode}
                            </span>
                        </Link>
                    </div>
                );
            },
        },
        {
            accessorKey: "suppliers",
            header: "Supplier",
            cell: ({ row }) => (
                <span className="font-semibold text-slate-500">{row.original.supplier_name}</span>
            ),
        },
        {
            accessorKey: "moq",
            header: "MOQ",
            cell: ({ row }) => (
                <span className="font-semibold text-slate-500">
                    {formatNumber(row.original.moq)}
                </span>
            ),
        },
        // Dihidden sementara sesuai permintaan user
        // ...sales_periods.map((p) => ({
        //     id: `sales_${p.key}`,
        //     header: `SALES ${MONTHS[p.month - 1]}`,
        //     cell: ({ row }: any) => {
        //         const q = row.original.sales.find((s: any) => s.key === p.key)?.quantity ?? 0;
        //         return <span className="font-medium text-slate-600">{formatNumber(q)}</span>;
        //     },
        // })),
        {
            accessorKey: "lead_time",
            header: "LEAD TIME",
            cell: ({ row }) => (
                <Badge variant="outline" className="font-mono bg-slate-50 text-slate-500">
                    {row.original.lead_time || 0} Hari
                </Badge>
            ),
        },
    ];

    // --- PERUBAHAN DI SINI: Kalkulasi Running Sum Kebutuhan ---
    // Dihidden sementara sesuai permintaan user
    /*
    const needsColumns: ColumnDef<RecomendationResponse>[] = forecast_periods.map((p, index) => ({
        id: `needs_${p.key}`,
        header: `NEED ${MONTHS[p.month - 1]}`,
        cell: ({ row }: any) => {
            const q = row.original.needs.find((s: any) => s.key === p.key)?.quantity ?? 0;

            // Hitung akumulasi kebutuhan dari bulan pertama sampai bulan ini (kolom ini)
            const runningNeeds = forecast_periods.slice(0, index + 1).reduce((sum, currPeriod) => {
                const pastQ =
                    row.original.needs.find((s: any) => s.key === currPeriod.key)?.quantity ?? 0;
                return sum + pastQ;
            }, 0);

            // Total stok yang bisa dipakai (Stok Gudang + Open PO)
            // Catatan: Hapus "(row.original.open_po || 0)" jika Anda ingin mutlak hanya menghitung dari fisik Gudang
            const availableStock = row.original.current_stock + (row.original.open_po || 0);

            // Apakah stok masih cukup untuk menutupi akumulasi kebutuhan hingga bulan ini?
            const isSufficient = availableStock >= runningNeeds;

            if (isSufficient) {
                // Tampilan aman (hijau/slate)
                return <span className="font-semibold text-emerald-600">{formatNumber(q)}</span>;
            }

            // Tampilan defisit (background merah, text merah)
            return (
                <span className="font-bold bg-red-100 text-red-700 px-2 py-1.5 rounded-md whitespace-nowrap">
                    {formatNumber(q)}
                </span>
            );
        },
    }));
    */

    const actionColumns: ColumnDef<RecomendationResponse>[] = [
        {
            accessorKey: "stock_fg_x_resep",
            header: "TOTAL STOCK FG X RESEP",
            cell: ({ row }) => {
                const val = Math.round(Number(row.original.stock_fg_x_resep));
                const breakdown = row.original.fg_stock_breakdown || [];
                const invPeriod = row.original.inv_period;

                return (
                    <div className="flex flex-col gap-0.5 min-w-[160px]">
                        <span className="font-bold text-slate-800">
                            {formatNumber(val)} {row.original.uom.toUpperCase()}
                        </span>
                        {invPeriod && (
                            <span className="text-[9px] text-slate-400">
                                Stok per{" "}
                                {invPeriod.period
                                    ? dayjs(invPeriod.period).format("MM/YYYY")
                                    : `${invPeriod.month}/${invPeriod.year}`}
                            </span>
                        )}
                        {breakdown.length > 0 && (
                            <div className="flex flex-col gap-1 mt-1.5 border-t border-slate-100 pt-1.5">
                                {breakdown.slice(0, 3).map((b: any, i: number) => (
                                    <div
                                        key={i}
                                        className="text-[9px] font-medium text-slate-500 leading-tight"
                                    >
                                        <span className="text-slate-700 bg-slate-100 px-1 rounded mr-1">
                                            {b.product_code} [v.{b.recipe_version || 1}]
                                        </span>
                                        {formatNumber(Number(b.fg_stock))} × {Number(b.recipe_qty)}
                                        {" = "}
                                        <span className="text-indigo-600 font-bold">
                                            {formatNumber(Math.round(Number(b.contribution)))}
                                        </span>
                                    </div>
                                ))}
                                {breakdown.length > 3 && (
                                    <span className="text-[8px] text-slate-400 italic">
                                        + {breakdown.length - 3} produk lainnya
                                    </span>
                                )}
                            </div>
                        )}
                        {breakdown.length === 0 && (
                            <span className="text-[9px] text-slate-400 italic">
                                Tidak ada FG stok terkait
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "safety_stock_x_resep",
            header: "SAFETY STOCK x RESEP",
            cell: ({ row }) => {
                const val = row.original.safety_stock_x_resep || 0;
                return (
                    <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-indigo-700">
                            {formatNumber(val)} {row.original.uom.toUpperCase()}
                        </span>
                        <span className="text-[9px] text-slate-400 uppercase font-medium">
                            Buffer Stock
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "current_stock",
            header: "Pure Stock",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold text-xs text-slate-800">
                        {formatNumber(row.original.current_stock)}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{row.original.uom}</span>
                </div>
            ),
            size: 100,
        },
        {
            id: "available_stock",
            header: "Ready Stock (S+P)",
            cell: ({ row }) => {
                const stock = row.original.current_stock;
                const availableStock = stock + (row.original.open_po || 0);

                let monthsLasted = 0;
                let runningSum = 0;
                for (const p of forecast_periods) {
                    const q = row.original.needs.find((s: any) => s.key === p.key)?.quantity ?? 0;
                    runningSum += q;
                    if (availableStock >= runningSum) {
                        monthsLasted++;
                    } else {
                        break;
                    }
                }

                return (
                    <div className="flex flex-col min-w-[140px]">
                        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 w-fit">
                            {formatNumber(availableStock)} <span className="text-[10px] text-indigo-400">{row.original.uom}</span>
                        </span>
                        <span
                            className={`text-[9px] mt-1 font-black uppercase tracking-wider ${
                                monthsLasted > 0 ? "text-emerald-600" : "text-red-500"
                            }`}
                        >
                            {monthsLasted > 0 ? `Tahan ~${monthsLasted} Bln` : "Stok Defisit!"}
                        </span>
                        {row.original.status === "ACC" && row.original.open_po_expected_arrival && (
                            <Badge
                                variant="outline"
                                className="mt-1 w-fit border-blue-200 bg-blue-50 text-blue-700 text-[10px]"
                            >
                                <Clock className="w-3 h-3 mr-1" />
                                ETA:{" "}
                                {dayjs(row.original.open_po_expected_arrival).format("DD MMM YYYY")}
                            </Badge>
                        )}
                    </div>
                );
            },
            size: 150,
        },
        {
            accessorKey: "open_po",
            header: "OPEN PO",
            cell: ({ row }) => {
                if (row.original.open_po > 0)
                    return (
                        <Badge
                            variant="secondary"
                            className="bg-indigo-50 text-indigo-700 shadow-none font-bold"
                        >
                            +{formatNumber(row.original.open_po)} {row.original.uom.toUpperCase()}
                        </Badge>
                    );
                return (
                    <span className="font-semibold text-slate-400">
                        0 {row.original.uom.toUpperCase()}
                    </span>
                );
            },
        },

        {
            accessorKey: "forecast_target_month_needs",
            header: "JUMLAH FORECAST x RESEP",
            cell: ({ row }) => {
                const val = row.original.forecast_target_month_needs || 0;
                const breakdown = row.original.fg_forecast_breakdown || [];

                return (
                    <div className="flex flex-col gap-0.5 min-w-[170px]">
                        <span className="font-bold text-rose-700">
                            {formatNumber(val)} {row.original.uom.toUpperCase()}
                        </span>
                        {breakdown.length > 0 && (
                            <div className="flex flex-col gap-1 mt-1.5 border-t border-slate-100 pt-1.5">
                                {breakdown.slice(0, 3).map((b: any, i: number) => (
                                    <div
                                        key={i}
                                        className="text-[9px] font-medium text-slate-500 leading-tight"
                                    >
                                        <span className="text-slate-700 bg-slate-100 px-1 rounded mr-1">
                                            {b.product_code} [v.{b.recipe_version || 1}]
                                        </span>
                                        {formatNumber(Math.round(Number(b.forecast_qty)))}
                                        × {Number(b.recipe_qty)}
                                        {" = "}
                                        <span className="text-rose-600 font-bold">
                                            {formatNumber(Math.round(Number(b.contribution)))}
                                        </span>
                                    </div>
                                ))}
                                {breakdown.length > 3 && (
                                    <span className="text-[8px] text-slate-400 italic">
                                        + {breakdown.length - 3} produk lainnya
                                    </span>
                                )}
                            </div>
                        )}
                        {breakdown.length === 0 && (
                            <span className="text-[9px] text-slate-400 italic">
                                Tidak ada forecast terkait
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "recommendation",
            header: "REKOMENDASI/MINUS",
            cell: ({ row }) => {
                const rec = row.original.recommendation;
                const need = row.original.forecast_target_month_needs || 0;
                const stock = row.original.current_stock;
                const po = row.original.open_po || 0;
                const fg = row.original.stock_fg_x_resep || 0;
                const uom = row.original.uom.toUpperCase();

                const ss = row.original.safety_stock_x_resep || 0;
                const forecastOnly = need;

                const components = (
                    <div className="flex flex-col gap-0.5 mt-1 text-[9px] font-mono text-slate-400 leading-tight">
                        <span className="flex justify-between">
                            <span>Forecast:</span>
                            <span className="text-slate-600 font-bold ml-2">
                                {formatNumber(forecastOnly)}
                            </span>
                        </span>
                        <span className="flex justify-between">
                            <span>Safety Stock:</span>
                            <span className="text-indigo-600 font-bold ml-2">
                                -{formatNumber(ss)}
                            </span>
                        </span>
                        <span className="flex justify-between">
                            <span>Stock RM:</span>
                            <span className="text-slate-600 font-bold ml-2">
                                -{formatNumber(stock)}
                            </span>
                        </span>
                        <span className="flex justify-between">
                            <span>Open PO:</span>
                            <span className="text-slate-600 font-bold ml-2">
                                -{formatNumber(po)}
                            </span>
                        </span>
                        <span className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span>FG×Resep:</span>
                            <span className="text-slate-600 font-bold ml-2">
                                -{formatNumber(fg)}
                            </span>
                        </span>
                        <span className="flex justify-between pt-0.5">
                            <span>Kekurangan:</span>
                            <span
                                className={`font-bold ${rec && rec > 0 ? "text-red-500" : "text-emerald-600"}`}
                            >
                                {formatNumber(forecastOnly - ss - stock - po - fg)} {uom}
                            </span>
                        </span>
                    </div>
                );

                if (rec === null || rec <= 0) {
                    return (
                        <div className="flex flex-col gap-1 py-1.5">
                            <Badge
                                variant="secondary"
                                className="bg-emerald-50 text-emerald-600 font-bold border-emerald-100"
                            >
                                Cukup
                            </Badge>
                            {components}
                        </div>
                    );
                }
                return (
                    <div className="flex flex-col gap-1 py-1.5">
                        <Badge
                            variant="destructive"
                            className="bg-red-50 text-red-700 shadow-none border-red-200 font-bold px-2 py-0.5 whitespace-nowrap w-fit"
                        >
                            Beli {formatNumber(rec)} {uom}
                        </Badge>
                        {components}
                    </div>
                );
            },
        },
        {
            id: "pic_order",
            header: "ORDER PIC",
            cell: ({ row }) => {
                const mat = row.original;
                const { mutate: saveOrder, isPending: isSaving } = useActionSaveOrder();
                const [val, setVal] = useState(mat.pic_order_quantity?.toString() || "");

                useEffect(() => {
                    setVal(mat.pic_order_quantity?.toString() || "");
                }, [mat.pic_order_quantity]);

                // Jika sudah di ACC, tampilkan statis
                if (mat.status === "ACC") {
                    return (
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">
                                {formatNumber(Number(val))}
                            </span>
                            <Badge className="bg-emerald-500 text-white shadow-none">ACC</Badge>
                        </div>
                    );
                }

                const hasChanges = val !== (mat.pic_order_quantity?.toString() || "");

                const handleSaveDraft = () => {
                    const parsedVal = val === "" ? 0 : Number(val);
                    if (hasChanges && parsedVal >= 0) {
                        saveOrder({
                            raw_mat_id: mat.material_id,
                            month: forecast_periods[0]?.month || dayjs().month() + 1,
                            year: forecast_periods[0]?.year || dayjs().year(),
                            period: forecast_periods[0]?.period,
                            quantity: parsedVal,
                        });
                    }
                };

                return (
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            value={val}
                            onChange={(e) => setVal(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveDraft();
                            }}
                            className="w-24 h-8 bg-white border-slate-200 font-bold focus:border-amber-500 transition-all text-sm text-center"
                            placeholder="0"
                        />

                        {/* Jika ada perubahan text (Draft belum disimpan), munculkan tombol Simpan */}
                        {hasChanges && (
                            <button
                                onClick={handleSaveDraft}
                                disabled={isSaving}
                                className="p-1.5 rounded-md text-amber-600 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-50 transition-colors"
                                title="Simpan Sementara (Draft)"
                            >
                                <Save className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                );
            },
        },
    ];

    return [...baseColumns, ...actionColumns]; // ...needsColumns dihilangkan
};
