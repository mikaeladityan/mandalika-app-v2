"use client";

import { ResponseRawMaterialDTO } from "@/app/(application)/rawmat/server/rawmat.schema";
import { formatNumber } from "@/lib/utils";
import dayjs from "dayjs";

interface PrintReportProps {
    data: ResponseRawMaterialDTO[];
    visibleColumns: string[];
    title: string;
}

export function PrintReport({ data, visibleColumns, title }: PrintReportProps) {
    if (!data || data.length === 0) return null;

    const showCol = (id: string) => visibleColumns.includes(id);

    return (
        <div className="print-only hidden print:block p-8 bg-white min-h-screen font-sans text-xs text-slate-900">
            {/* Header Report */}
            <div className="flex justify-between items-start mb-6 border-b-2 border-slate-900 pb-4">
                <div>
                    <h1 className="text-xl font-bold uppercase tracking-tight">{title}</h1>
                    <p className="text-[10px] text-slate-500 font-medium">
                        Laporan Master Data Raw Material Terdaftar
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
                        <th className="border border-slate-300 px-3 py-3 text-left text-[10px] font-black uppercase tracking-wider">
                            NO
                        </th>
                        {showCol("barcode") && (
                            <th className="border border-slate-300 px-3 py-3 text-left text-[10px] font-black uppercase tracking-wider">
                                BARCODE
                            </th>
                        )}
                        {showCol("name") && (
                            <th className="border border-slate-300 px-3 py-3 text-left text-[10px] font-black uppercase tracking-wider">
                                NAMA MATERIAL
                            </th>
                        )}
                        {showCol("category") && (
                            <th className="border border-slate-300 px-3 py-3 text-center text-[10px] font-black uppercase tracking-wider">
                                KATEGORI
                            </th>
                        )}
                        {showCol("supplier") && (
                            <th className="border border-slate-300 px-3 py-3 text-center text-[10px] font-black uppercase tracking-wider">
                                SUPPLIER
                            </th>
                        )}
                        {showCol("unit") && (
                            <th className="border border-slate-300 px-3 py-3 text-center text-[10px] font-black uppercase tracking-wider">
                                SATUAN
                            </th>
                        )}
                        {showCol("price") && (
                            <th className="border border-slate-300 px-3 py-3 text-right text-[10px] font-black uppercase tracking-wider bg-blue-50/50 text-blue-800">
                                HARGA
                            </th>
                        )}
                        {showCol("current_stock") && (
                            <th className="border border-slate-300 px-3 py-3 text-center text-[10px] font-black uppercase tracking-wider bg-emerald-50/50 text-emerald-800">
                                STOK
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, idx) => (
                        <tr key={item.id} className={idx % 2 === 1 ? "bg-slate-50/30" : "bg-white"}>
                            <td className="border border-slate-300 px-3 py-2 text-center text-slate-500">
                                {idx + 1}
                            </td>
                            {showCol("barcode") && (
                                <td className="border border-slate-300 px-3 py-2 font-mono font-bold text-slate-600">
                                    {item.barcode || "-"}
                                </td>
                            )}
                            {showCol("name") && (
                                <td className="border border-slate-300 px-3 py-2 font-bold text-slate-800 uppercase text-[11px]">
                                    {item.name}
                                </td>
                            )}
                            {showCol("category") && (
                                <td className="border border-slate-300 px-3 py-2 text-center uppercase font-medium text-slate-500">
                                    {item.raw_mat_category?.name || "-"}
                                </td>
                            )}
                            {showCol("supplier") && (
                                <td className="border border-slate-300 px-3 py-2 text-center font-bold text-slate-700">
                                    {item.supplier?.name || "-"}
                                </td>
                            )}
                            {showCol("unit") && (
                                <td className="border border-slate-300 px-3 py-2 text-center text-slate-600">
                                    {item.unit_raw_material.name}
                                </td>
                            )}
                            {showCol("price") && (
                                <td className="border border-slate-300 px-3 py-2 text-right font-black text-blue-700 bg-blue-50/10 tabular-nums">
                                    Rp {formatNumber(item.price)}
                                </td>
                            )}
                            {showCol("current_stock") && (
                                <td className="border border-slate-300 px-3 py-2 text-center font-black text-emerald-700 bg-emerald-50/10 tabular-nums">
                                    {formatNumber(item.current_stock ?? 0)}
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
                    thead {
                        display: table-header-group;
                    }
                    thead tr:first-child th {
                        padding-top: 30px !important;
                    }
                    tr {
                        break-inside: avoid !important;
                        page-break-inside: avoid !important;
                    }
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
