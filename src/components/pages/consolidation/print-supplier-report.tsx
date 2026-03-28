"use client";

import { ConsolidationSummaryResponse } from "@/app/(application)/consolidation/server/consolidation.schema";
import { formatNumber } from "@/lib/utils";
import dayjs from "dayjs";

interface PrintSupplierReportProps {
    supplier: ConsolidationSummaryResponse | null;
}

export function PrintSupplierReport({ supplier }: PrintSupplierReportProps) {
    if (!supplier) return null;

    return (
        <div className="print-supplier-only hidden print:block px-8 py-4 bg-white min-h-screen font-sans text-xs text-black leading-normal">
            {/* ===== Header ===== */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-[14px] font-black mb-1">MANDALIKA PERFUMERY</h1>
                    <p className="text-[11px] leading-tight flex flex-col">
                        <span>Jl. Raya Made No.197, Made, Kec.</span>
                        <span>Sambikerep, Surabaya, Jawa Timur</span>
                        <span>60219 info@mandalikaperfume.co.id</span>
                    </p>
                </div>
                <div className="text-right text-[#002f6c]">
                    <h1 className="text-2xl font-black uppercase leading-tight tracking-tight mt-1">
                        FORM
                        <br />
                        PENGAJUAN
                        <br />
                        PURCHASE
                    </h1>
                </div>
            </div>

            {/* ===== Form Fields ===== */}
            <div className="flex justify-between mb-2 text-[11px]">
                {/* Left Form */}
                <div className="w-1/2">
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="py-1 w-36">Nomor</td>
                                <td className="py-1">: FPP/MNDK/{dayjs().format("YYYY")}/__</td>
                            </tr>
                            <tr>
                                <td className="py-1">Dibuat oleh</td>
                                <td className="py-1 flex items-center gap-1">
                                    : <div className="border-b border-black w-40 block"></div>
                                </td>
                            </tr>
                            <tr>
                                <td className="py-1">Tanggal Kebutuhan</td>
                                <td className="py-1 flex items-center gap-1">
                                    : <div className="border-b border-black w-40 block"></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Right Form — Tingkat Urgensi */}
                <div className="w-1/3">
                    <p className="mb-2">Tingkat Urgensi :</p>
                    <div className="space-y-1.5 ml-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border border-black"></div>
                            <span>Biasa (5-7 Work Day)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border border-black"></div>
                            <span>Mendesak (3 Work Day)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border border-black"></div>
                            <span>Super Urgent (1 Work Day)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Supplier Info ===== */}
            <div className="mb-2 text-[11px] border border-black p-2">
                <p className="font-bold mb-1 text-[11px]">Informasi Supplier :</p>
                <table className="w-full">
                    <tbody>
                        <tr>
                            <td className="py-0.5 w-36">Nama Supplier</td>
                            <td className="py-0.5 font-bold">: {supplier.supplier_name}</td>
                        </tr>
                        {supplier.supplier_address && (
                            <tr>
                                <td className="py-0.5 w-36">Alamat</td>
                                <td className="py-0.5">: {supplier.supplier_address}</td>
                            </tr>
                        )}
                        {supplier.supplier_phone && (
                            <tr>
                                <td className="py-0.5 w-36">Telepon</td>
                                <td className="py-0.5">: {supplier.supplier_phone}</td>
                            </tr>
                        )}
                        {supplier.supplier_country && (
                            <tr>
                                <td className="py-0.5 w-36">Negara</td>
                                <td className="py-0.5">: {supplier.supplier_country}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ===== Detail Permintaan Barang Table ===== */}
            <table className="w-full border-collapse border border-black mb-1">
                <thead>
                    <tr>
                        <th
                            colSpan={6}
                            className="bg-[#002f6c] text-white text-left px-2 py-1 text-[10px] font-bold border-b border-white"
                        >
                            Detail Item Pesanan :
                        </th>
                    </tr>
                    <tr className="bg-[#002f6c] text-white text-center text-[9px]">
                        <th className="border-x border-b border-white px-2 py-1.5 font-bold w-10">
                            No.
                        </th>
                        <th className="border-x border-b border-white px-2 py-1.5 font-bold">
                            Nama Barang
                        </th>
                        <th className="border-x border-b border-white px-2 py-1.5 font-bold w-32">
                            Barcode / SKU
                        </th>
                        <th className="border-x border-b border-white px-2 py-1.5 font-bold w-20">
                            QTY
                        </th>
                        <th className="border-x border-b border-white px-2 py-1.5 font-bold w-28">
                            Harga Satuan
                        </th>
                        <th className="border-x border-b border-white px-2 py-1.5 font-bold w-32">
                            Subtotal
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {supplier.items.map((item, idx) => (
                        <tr key={idx} className="text-[9px]">
                            <td className="border border-black px-2 py-1 text-center">
                                {idx + 1}
                            </td>
                            <td className="border border-black px-2 py-1 font-bold uppercase">
                                {item.material_name}
                            </td>
                            <td className="border border-black px-2 py-1 font-mono text-[8px] text-slate-600 uppercase">
                                {item.barcode}
                            </td>
                            <td className="border border-black px-2 py-1 text-center">
                                {formatNumber(item.quantity ?? 0)} {item.uom}
                            </td>
                            <td className="border border-black px-2 py-1 text-right">
                                Rp {formatNumber(item.price ?? 0)}
                            </td>
                            <td className="border border-black px-2 py-1 text-right font-bold">
                                Rp {formatNumber(item.subtotal ?? 0)}
                            </td>
                        </tr>
                    ))}
                    {/* Numbered empty rows up to 5 */}
                    {Array.from({ length: Math.max(0, 5 - (supplier.items?.length || 0)) }).map(
                        (_, i) => (
                            <tr key={`empty-${i}`} className="text-[9px] h-6">
                                <td className="border border-black px-2 py-1 text-center">
                                    {supplier.items.length + i + 1}
                                </td>
                                <td className="border border-black px-2 py-1"></td>
                                <td className="border border-black px-2 py-1"></td>
                                <td className="border border-black px-2 py-1"></td>
                                <td className="border border-black px-2 py-1"></td>
                                <td className="border border-black px-2 py-1"></td>
                            </tr>
                        ),
                    )}
                    {/* Grand Total Row */}
                    <tr className="text-[10px] bg-slate-50">
                        <td colSpan={5} className="border border-black px-2 py-1.5 text-right font-black uppercase">
                            Grand Total Estimasi (Rp)
                        </td>
                        <td className="border border-black px-2 py-1.5 text-right font-black text-[#002f6c] text-[11px]">
                            Rp {formatNumber(supplier.total_amount)}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* ===== Signatures ===== */}
            <table className="w-full border-collapse border border-black text-center text-[10px] mt-4">
                <thead>
                    <tr className="bg-[#002f6c] text-white">
                        <th className="border border-white py-1.5 w-1/3">Pemohon</th>
                        <th className="border border-white py-1.5 w-1/3">
                            Diketahui
                            <br />
                            (Purchaser)
                        </th>
                        <th className="border border-white py-1.5 w-1/3">
                            Disetujui
                            <br />
                            (COO)
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-black h-16"></td>
                        <td className="border border-black h-16"></td>
                        <td className="border border-black h-16"></td>
                    </tr>
                </tbody>
            </table>

            {/* ===== Print Styles ===== */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 15mm 15mm;
                    }
                    body * {
                        visibility: hidden;
                    }
                    .print-supplier-only,
                    .print-supplier-only * {
                        visibility: visible;
                    }
                    .print-supplier-only {
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
                    tr {
                        break-inside: avoid !important;
                        page-break-inside: avoid !important;
                    }
                    table {
                        border-collapse: collapse;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    th,
                    td,
                    tr {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>
        </div>
    );
}
