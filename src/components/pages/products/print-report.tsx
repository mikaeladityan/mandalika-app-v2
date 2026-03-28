"use client";

import { ResponseProductDTO } from "@/app/(application)/products/server/products.schema";
import { cn, formatNumber } from "@/lib/utils";
import dayjs from "dayjs";

interface PrintReportProps {
    data: ResponseProductDTO[];
    visibleColumns: string[];
    title: string;
}

export function PrintReport({ data, visibleColumns, title }: PrintReportProps) {
    if (!data || data.length === 0) return null;

    const showCol = (id: string) => visibleColumns.includes(id);

    // Filtering condition as requested:
    // "hanya untuk product yang memiliki value, %EDAR dan %SAFETY yang tidak punya hapus saja"
    // Assuming 'value' is z_value, and %EDAR is distribution_percentage, %SAFETY is safety_percentage.
    // 'memiliki' usually means > 0 in this context.
    const finalData = data.filter(
        (item) =>
            (item.distribution_percentage ?? 0) > 0 &&
            (item.safety_percentage ?? 0) > 0 &&
            (item.z_value ?? 0) > 0,
    );

    if (finalData.length === 0) return null;

    return (
        <div className="print-only hidden print:block p-8 bg-white min-h-screen font-sans text-xs text-slate-900">
            {/* Header Report */}
            <div className="flex justify-between items-start mb-6 border-b-2 border-slate-900 pb-4">
                <div>
                    <h1 className="text-xl font-bold uppercase tracking-tight">{title}</h1>
                    <p className="text-[10px] text-slate-500 font-medium">
                        Laporan Master Data Produk Terdaftar
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
            <table className="w-full border-collapse border border-slate-300">
                <thead>
                    <tr className="bg-slate-50 text-slate-900">
                        {showCol("code") && (
                            <th className="border border-slate-300 px-3 py-3 text-left text-[10px] font-black uppercase tracking-wider">
                                KODE FG
                            </th>
                        )}
                        {showCol("name") && (
                            <th className="border border-slate-300 px-3 py-3 text-left text-[10px] font-black uppercase tracking-wider">
                                NAMA PRODUK
                            </th>
                        )}
                        {showCol("type") && (
                            <th className="border border-slate-300 px-3 py-3 text-center text-[10px] font-black uppercase tracking-wider">
                                KATEGORI
                            </th>
                        )}
                        {showCol("size") && (
                            <th className="border border-slate-300 px-3 py-3 text-center text-[10px] font-black uppercase tracking-wider">
                                UKURAN
                            </th>
                        )}
                        <th className="border border-slate-300 px-3 py-3 text-center text-[10px] font-black uppercase tracking-wider bg-blue-50/50 text-blue-800">
                            LT (Days)
                        </th>
                        <th className="border border-slate-300 px-3 py-3 text-center text-[10px] font-black uppercase tracking-tighter bg-indigo-50/50 text-indigo-800">
                            VALUE (Z)
                        </th>
                        {showCol("distribution_percentage") && (
                            <th className="border border-slate-300 px-3 py-3 text-center text-[10px] font-black uppercase tracking-wider bg-emerald-50/50 text-emerald-800">
                                % EDAR
                            </th>
                        )}
                        {showCol("safety_percentage") && (
                            <th className="border border-slate-300 px-3 py-3 text-center text-[10px] font-black uppercase tracking-wider bg-rose-50/50 text-rose-800">
                                % SAFETY
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {finalData.map((item, idx) => (
                        <tr key={item.id} className={idx % 2 === 1 ? "bg-slate-50/30" : "bg-white"}>
                            {showCol("code") && (
                                <td className="border border-slate-300 px-3 py-2 font-mono font-bold text-slate-600">
                                    {item.code}
                                </td>
                            )}
                            {showCol("name") && (
                                <td className="border border-slate-300 px-3 py-2 font-bold text-slate-800 uppercase text-[11px]">
                                    {item.name}
                                </td>
                            )}
                            {showCol("type") && (
                                <td className="border border-slate-300 px-3 py-2 text-center uppercase font-medium text-slate-500">
                                    {item.product_type?.name || "-"}
                                </td>
                            )}
                            {showCol("size") && (
                                <td className="border border-slate-300 px-3 py-2 text-center font-bold text-slate-700">
                                    {item.size?.size} {item.unit?.name}
                                </td>
                            )}
                            <td className="border border-slate-300 px-3 py-2 text-center font-black text-blue-700 bg-blue-50/10">
                                {item.lead_time}
                            </td>
                            <td className="border border-slate-300 px-3 py-2 text-center font-black text-indigo-700 bg-indigo-50/10 tabular-nums">
                                {item.z_value?.toFixed(2)}
                            </td>
                            {showCol("distribution_percentage") && (
                                <td className="border border-slate-300 px-3 py-2 text-center font-black text-emerald-700 bg-emerald-50/10 tabular-nums">
                                    {formatNumber((item.distribution_percentage || 0) * 100)}%
                                </td>
                            )}
                            {showCol("safety_percentage") && (
                                <td className="border border-slate-300 px-3 py-2 text-center font-black text-rose-700 bg-rose-50/10 tabular-nums">
                                    {formatNumber((item.safety_percentage || 0) * 100)}%
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Signature Area */}
            <div className="mt-16 w-full">
                <div className="flex justify-between items-start pt-10">
                    <div className="text-center w-72">
                        <p className="font-bold text-[11px] mb-24 uppercase tracking-widest text-slate-800">
                            Dibuat Oleh:
                        </p>
                        <div className="border-t border-slate-900 mx-auto w-56 mb-1">
                            {/* Signature Line */}
                        </div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">
                            Staff Produksi & Inventory
                        </p>
                    </div>

                    <div className="text-center w-72">
                        <p className="font-bold text-[11px] mb-24 uppercase tracking-widest text-slate-800">
                            Diketahui Oleh:
                        </p>
                        <div className="border-t border-slate-900 mx-auto w-56 mb-1">
                            {/* Signature Line */}
                        </div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">
                            Kepala Bagian / Manager
                        </p>
                    </div>
                </div>
            </div>

            {/* Print Footer */}
            {/* <div className="fixed bottom-6 left-0 right-0 text-center text-[9px] text-slate-300 uppercase font-black tracking-[0.3em] pointer-events-none">
                PT MANDALIKA ERP - OFFICIAL PRODUCT MASTER LIST
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
