"use client";

import { ConsolidationResponse } from "@/app/(application)/consolidation/server/consolidation.schema";
import { cn, formatNumber } from "@/lib/utils";
import dayjs from "dayjs";

interface PrintReportProps {
    data: ConsolidationResponse[];
    visibleColumns: string[];
    title: string;
}

export function PrintReport({ data, visibleColumns, title }: PrintReportProps) {
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
                        Laporan Konsolidasi Pengadaan Purchasing
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
                            {showCol("material_name") && (
                                <th className="border border-slate-300 px-2 py-2 text-left text-[10px] font-black">
                                    MATERIAL / BARCODE
                                </th>
                            )}
                            {showCol("supplier_name") && (
                                <th className="border border-slate-300 px-2 py-2 text-left text-[10px] font-black">
                                    SUPPLIER
                                </th>
                            )}
                            {showCol("quantity") && (
                                <th className="border border-slate-300 px-2 py-2 text-center text-[10px] font-black">
                                    ORDER QTY
                                </th>
                            )}
                            {showCol("moq") && (
                                <th className="border border-slate-300 px-2 py-2 text-center text-[10px] font-black">
                                    MOQ
                                </th>
                            )}
                            {showCol("price") && (
                                <th className="border border-slate-300 px-2 py-2 text-center text-[10px] font-black">
                                    HARGA SATUAN
                                </th>
                            )}
                            {showCol("total_price") && (
                                <th className="border border-slate-300 px-2 py-2 text-center text-[10px] font-black text-amber-600">
                                    TOTAL HARGA
                                </th>
                            )}
                            {showCol("status") && (
                                <th className="border border-slate-300 px-2 py-2 text-center text-[10px] font-black">
                                    STATUS
                                </th>
                            )}
                            {showCol("pic_id") && (
                                <th className="border border-slate-300 px-2 py-2 text-center text-[10px] font-black">
                                    PIC
                                </th>
                            )}
                            {showCol("created_at") && (
                                <th className="border border-slate-300 px-2 py-2 text-center text-[10px] font-black text-slate-400">
                                    TANGGAL
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, idx) => (
                            <tr
                                key={item.recommendation_id}
                                className={idx % 2 === 1 ? "bg-slate-50/50" : ""}
                            >
                                {showCol("material_name") && (
                                    <td className="border border-slate-300 px-2 py-1.5">
                                        <div className="font-bold">{item.material_name}</div>
                                        <div className="text-[9px] text-slate-500 font-mono">
                                            {item.barcode}
                                        </div>
                                    </td>
                                )}
                                {showCol("supplier_name") && (
                                    <td className="border border-slate-300 px-2 py-1.5 font-medium text-slate-600 uppercase">
                                        {item.supplier_name || "-"}
                                    </td>
                                )}
                                {showCol("quantity") && (
                                    <td className="border border-slate-300 px-2 py-1.5 text-center font-bold">
                                        {formatNumber(item.quantity || 0)}{" "}
                                        <span className="text-[9px] text-slate-400 font-bold uppercase">
                                            {item.uom}
                                        </span>
                                    </td>
                                )}
                                {showCol("moq") && (
                                    <td className="border border-slate-300 px-2 py-1.5 text-center font-bold text-slate-500">
                                        {formatNumber(item.moq || 0)}
                                    </td>
                                )}
                                {showCol("price") && (
                                    <td className="border border-slate-300 px-2 py-1.5 text-center font-bold">
                                        Rp {formatNumber(item.price || 0)}
                                    </td>
                                )}
                                {showCol("total_price") && (
                                    <td className="border border-slate-300 px-2 py-1.5 text-center font-black text-amber-700 bg-amber-50/20">
                                        Rp {formatNumber((item.price || 0) * (item.quantity || 0))}
                                    </td>
                                )}
                                {showCol("status") && (
                                    <td className="border border-slate-300 px-2 py-1.5 text-center uppercase font-black text-[9px]">
                                        {item.status === "ACC" ? "POSTED" : "DRAFT"}
                                    </td>
                                )}
                                {showCol("pic_id") && (
                                    <td className="border border-slate-300 px-2 py-1.5 text-center text-slate-500">
                                        {item.pic_id || "System"}
                                    </td>
                                )}
                                {showCol("created_at") && (
                                    <td className="border border-slate-300 px-2 py-1.5 text-center text-[9px] text-slate-400 tabular-nums">
                                        {dayjs(item.created_at).format("DD/MM/YY HH:mm")}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-slate-900 text-white font-black">
                            <td
                                colSpan={
                                    visibleColumns.filter(
                                        (c) =>
                                            c === "material_name" ||
                                            c === "supplier_name" ||
                                            c === "quantity" ||
                                            c === "moq" ||
                                            c === "price",
                                    ).length
                                }
                                className="border border-slate-900 px-4 py-3 text-right text-[11px] uppercase tracking-widest"
                            >
                                Grand Total Estimasi
                            </td>
                            <td className="border border-slate-900 px-2 py-3 text-center text-sm tabular-nums">
                                Rp{" "}
                                {formatNumber(
                                    data.reduce(
                                        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
                                        0,
                                    ),
                                )}
                            </td>
                            <td
                                colSpan={
                                    visibleColumns.filter(
                                        (c) => c === "status" || c === "pic_id" || c === "created_at",
                                    ).length
                                }
                                className="border border-slate-900"
                            ></td>
                        </tr>
                    </tfoot>
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
                            ( Staff Purchasing )
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

            {/* Print Footer */}
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
                    td,
                    tfoot tr {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>
        </div>
    );
}
