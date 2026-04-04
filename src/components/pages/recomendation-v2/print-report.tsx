"use client";

import { RecomendationV2Response } from "@/app/(application)/recomendation-v2/server/recomendation-v2.schema";
import { cn, formatNumber } from "@/lib/utils";
import dayjs from "dayjs";

interface PrintReportProps {
    data: RecomendationV2Response[];
    visibleColumns: string[];
    title: string;
    periods: {
        sales_periods: { month: number; year: number; key: string }[];
        forecast_periods: { month: number; year: number; key: string }[];
        po_periods: { month: number; year: number; key: string }[];
        forecastMonths: number;
    };
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

export function PrintReport({ data, visibleColumns, title, periods }: PrintReportProps) {
    // Filter which columns to show based on visibleColumns from parent
    const showCol = (id: string) => visibleColumns.includes(id);

    const hasData = data && data.length > 0;

    return (
        <div className="print-only hidden print:block p-8 bg-white min-h-screen font-sans text-xs text-slate-900">
            {/* Header Report */}
            <div className="flex justify-between items-start mb-6 border-b-2 border-slate-900 pb-4">
                <div>
                    <h1 className="text-xl font-bold uppercase tracking-tight">{title}</h1>
                    <p className="text-[10px] text-slate-500 font-medium">
                        Laporan Rekomendasi Pengadaan Material
                    </p>
                </div>
                <div className="text-right">
                    <p className="font-bold">Tanggal Cetak: {dayjs().format("DD MMMM YYYY")}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                        ERP SYSTEM - AUTO GENERATED
                    </p>
                </div>
            </div>

            {/* Table */}
            {hasData ? (
                <table className="w-full border-collapse border border-slate-300">
                    <thead>
                        <tr className="bg-slate-50">
                            {showCol("ranking") && (
                                <th className="border border-slate-300 px-2 py-2 text-center text-[10px] font-black">
                                    RANK
                                </th>
                            )}
                            {showCol("material_name") && (
                                <th className="border border-slate-300 px-2 py-2 text-left text-[10px] font-black">
                                    MATERIAL / BARCODE
                                </th>
                            )}
                            {showCol("supplier") && (
                                <th className="border border-slate-300 px-2 py-2 text-left text-[10px] font-black">
                                    SUPPLIER
                                </th>
                            )}
                            {showCol("moq") && (
                                <th className="border border-slate-300 px-2 py-2 text-center text-[10px] font-black">
                                    MOQ
                                </th>
                            )}
                            {showCol("safety_stock_x_resep") && (
                                <th className="border border-slate-300 px-2 py-2 text-center text-[10px] font-black">
                                    SS
                                </th>
                            )}
                            {showCol("current_stock") && (
                                <th className="border border-slate-300 px-2 py-2 text-center text-[10px] font-black">
                                    NET STOCK
                                </th>
                            )}
                            {showCol("available_stock") && (
                                <th className="border border-slate-300 px-2 py-2 text-center text-[10px] font-black text-indigo-700">
                                    READY STOCK
                                </th>
                            )}

                            {/* Dynamic Sales Periods */}
                            {showCol("sales_history") &&
                                periods.sales_periods.map((p) => (
                                    <th
                                        key={`s-${p.key}`}
                                        className="border border-slate-300 px-1 py-2 text-center text-[9px] font-black bg-slate-100/50"
                                    >
                                        {MONTHS_SHORT[p.month - 1]}
                                    </th>
                                ))}

                            {showCol("needs_buy") &&
                                periods.forecast_periods.map((p) => (
                                    <th
                                        key={`f-${p.key}`}
                                        className="border border-slate-300 px-1 py-2 text-center text-[9px] font-black bg-amber-50"
                                    >
                                        {MONTHS_SHORT[p.month - 1]}
                                    </th>
                                ))}

                            {showCol("recommendation_quantity") && (
                                <th className="border border-slate-300 px-2 py-2 text-center text-[10px] font-black bg-red-50 text-red-700">
                                    REKOMENDASI
                                </th>
                            )}

                            {showCol("open_po_consolidated") &&
                                periods.po_periods.map((p) => (
                                    <th
                                        key={`p-${p.key}`}
                                        className="border border-slate-300 px-1 py-2 text-center text-[9px] font-black bg-emerald-50 text-emerald-700"
                                    >
                                        {MONTHS_SHORT[p.month - 1]}
                                    </th>
                                ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, idx) => (
                            <tr
                                key={item.material_id}
                                className={idx % 2 === 1 ? "bg-slate-50/50" : ""}
                            >
                                {showCol("ranking") && (
                                    <td className="border border-slate-300 px-2 py-1.5 text-center font-bold">
                                        {item.ranking}
                                    </td>
                                )}
                                {showCol("material_name") && (
                                    <td className="border border-slate-300 px-2 py-1.5">
                                        <div className="font-bold">{item.material_name}</div>
                                        <div className="text-[9px] text-slate-500 font-mono">
                                            {item.barcode}
                                        </div>
                                    </td>
                                )}
                                {showCol("supplier") && (
                                    <td className="border border-slate-300 px-2 py-1.5 font-medium text-slate-600">
                                        {item.supplier_name || "-"}
                                    </td>
                                )}
                                {showCol("moq") && (
                                    <td className="border border-slate-300 px-2 py-1.5 text-center font-bold">
                                        {formatNumber(item.moq)}
                                    </td>
                                )}
                                {showCol("safety_stock_x_resep") && (
                                    <td className="border border-slate-300 px-2 py-1.5 text-center font-bold text-indigo-600">
                                        {formatNumber(item.safety_stock_x_resep)}
                                    </td>
                                )}
                                {showCol("current_stock") && (
                                    <td
                                        className={cn(
                                            "border border-slate-300 px-2 py-1.5 text-center font-bold",
                                            item.current_stock - item.safety_stock_x_resep < 0
                                                ? "text-red-600"
                                                : "",
                                        )}
                                    >
                                        {formatNumber(item.current_stock - item.safety_stock_x_resep)}
                                    </td>
                                )}
                                {showCol("available_stock") && (
                                    <td className="border border-slate-300 px-2 py-1.5 text-center font-black text-indigo-700 bg-indigo-50/30">
                                        {formatNumber(
                                            item.current_stock -
                                                item.safety_stock_x_resep +
                                                item.open_po,
                                        )}
                                    </td>
                                )}

                                {showCol("sales_history") &&
                                    periods.sales_periods.map((p) => {
                                        const q =
                                            item.sales?.find((s: any) => s.key === p.key)?.quantity ??
                                            0;
                                        return (
                                            <td
                                                key={`val-s-${p.key}`}
                                                className="border border-slate-300 px-1 py-1.5 text-center tabular-nums"
                                            >
                                                {formatNumber(q)}
                                            </td>
                                        );
                                    })}

                                {showCol("needs_buy") &&
                                    periods.forecast_periods.map((p) => {
                                        const q =
                                            item.needs?.find((s: any) => s.key === p.key)?.quantity ??
                                            0;
                                        return (
                                            <td
                                                key={`val-f-${p.key}`}
                                                className="border border-slate-300 px-1 py-1.5 text-center tabular-nums font-medium bg-amber-50/20"
                                            >
                                                {formatNumber(q)}
                                            </td>
                                        );
                                    })}

                                {showCol("recommendation_quantity") && (
                                    <td className="border border-slate-300 px-2 py-1.5 text-center font-black bg-red-50/30 text-red-700">
                                        {/* Logic deficit same as column.tsx */}
                                        {(() => {
                                            const h = item.work_order_horizon || periods.forecastMonths;
                                            const ready =
                                                item.current_stock -
                                                item.safety_stock_x_resep +
                                                item.open_po;
                                            const relevantNeeds = item.needs?.slice(0, h) || [];
                                            const totalNeeded = relevantNeeds.reduce(
                                                (sum, n) => sum + (n.quantity || 0),
                                                0,
                                            );
                                            const result = ready - totalNeeded;
                                            return result < 0
                                                ? `BELI ${formatNumber(Math.abs(result))}`
                                                : "CUKUP";
                                        })()}
                                    </td>
                                )}

                                {showCol("open_po_consolidated") &&
                                    periods.po_periods.map((p) => {
                                        const q =
                                            item.open_pos?.find((s: any) => s.key === p.key)
                                                ?.quantity ?? 0;
                                        return (
                                            <td
                                                key={`val-p-${p.key}`}
                                                className="border border-slate-300 px-1 py-1.5 text-center tabular-nums font-bold text-emerald-700 bg-emerald-50/20"
                                            >
                                                {formatNumber(q)}
                                            </td>
                                        );
                                    })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                    <p className="text-slate-400 font-bold uppercase tracking-widest">
                        Tidak ada data untuk dicetak pada periode ini.
                    </p>
                </div>
            )}

            {/* Signature Area */}
            <div className="mt-16 w-full">
                <div className="flex justify-between items-start">
                    <div className="text-center w-64">
                        <p className="font-bold text-[10px] mb-20 uppercase tracking-widest text-slate-800 underline underline-offset-4">
                            Dibuat Oleh:
                        </p>
                        <div className="border-t border-slate-900 mx-auto w-48 mb-1"></div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase italic">
                            ( Staff Operasional )
                        </p>
                    </div>

                    <div className="text-center w-64">
                        <p className="font-bold text-[10px] mb-20 uppercase tracking-widest text-slate-800 underline underline-offset-4">
                            Diketahui Oleh:
                        </p>
                        <div className="border-t border-slate-900 mx-auto w-48 mb-1"></div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase italic">
                            ( Head Dept / Manager )
                        </p>
                    </div>

                    <div className="text-center w-64">
                        <p className="font-bold text-[10px] mb-20 uppercase tracking-widest text-slate-800 underline underline-offset-4">
                            Disetujui Oleh:
                        </p>
                        <div className="border-t border-slate-900 mx-auto w-48 mb-1"></div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase italic">
                            ( Direktur / COO )
                        </p>
                    </div>
                </div>
            </div>

            {/* Print Footer / Page Number */}
            {/* <div className="fixed bottom-4 left-0 right-0 text-center text-[8px] text-slate-300 uppercase font-black tracking-[0.2em] pointer-events-none">
                Confidential Document - PT MANDALIKA ERP SYSTEM V0.1
            </div> */}

            <style jsx global>{`
                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 15mm 10mm;
                    }
                    body * {
                        visibility: hidden;
                    }
                    .print-only,
                    .print-only * {
                        visibility: visible;
                    }
                    .print-only {
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        display: block !important;
                        background: white;
                    }
                    /* Ensure table headers repeat on every page */
                    thead {
                        display: table-header-group;
                    }
                    /* This trick adds a repeated spacer at the top of every new page's table header */
                    thead tr:first-child th {
                        padding-top: 30px !important;
                    }
                    /* Prevent rows from splitting across pages */
                    tr {
                        break-inside: avoid !important;
                        page-break-inside: avoid !important;
                    }
                    /* Ensure table backgrounds print */
                    table {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        border-collapse: collapse;
                    }
                    th,
                    td {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>
        </div>
    );
}
