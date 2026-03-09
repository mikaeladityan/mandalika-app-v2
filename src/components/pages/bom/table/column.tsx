"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

const formatMonthHeader = (key: string) => {
    const [month, year] = key.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleString("id-ID", { month: "short", year: "2-digit" }).toUpperCase();
};

export const BOMColumns = (monthlyKeys: string[]): ColumnDef<any>[] => {
    return [
        {
            id: "product_info",
            header: "Produk (Finish Good)",
            cell: ({ row }) => (
                <div className="flex flex-col gap-1 min-w-50 p-2">
                    <span className="font-bold text-slate-900 leading-tight">
                        {row.original.product_name}
                    </span>
                    <span className="text-xs font-mono bg-blue-50 text-blue-700 w-fit px-1.5 py-0.5 rounded border border-blue-100 uppercase">
                        {row.original.product_code} | {row.original.product_size}
                    </span>
                </div>
            ),
        },
        {
            id: "material_details",
            header: () => (
                <div className="grid grid-cols-12 w-full gap-2 px-2">
                    <div className="col-span-12 text-left">Detail Material & Komposisi</div>
                    {/* <div className="col-span-6 flex justify-around">
                        {monthlyKeys.map((key) => (
                            <div key={key} className="text-center font-bold">
                                {formatMonthHeader(key)}
                            </div>
                        ))}
                    </div> */}
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex flex-col min-w-150">
                    {row.original.materials.map((mat: any, idx: number) => (
                        <div
                            key={idx}
                            className={`grid grid-cols-12 w-full items-center py-3 px-2 ${
                                idx !== row.original.materials.length - 1
                                    ? "border-b border-slate-100"
                                    : ""
                            } hover:bg-slate-50/50 transition-colors`}
                        >
                            {/* Nama Material */}
                            <Link
                                href={`/bom/${mat.material_code}/`}
                                className="col-span-12 flex flex-col pr-4 group"
                            >
                                <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-600 truncate">
                                    {mat.material_name}
                                </span>
                                <span className="text-xs font-mono text-slate-400 uppercase">
                                    {mat.material_code} • Resep: {Number(mat.recipes)}{" "}
                                    {/* <LogData data={mat} /> */}
                                    {mat.material_unit === "null" || !mat.material_unit
                                        ? "UNIT"
                                        : mat.material_unit.toUpperCase()}
                                </span>
                            </Link>

                            {/* Data Bulanan untuk Material ini dihidden sesuai request user */}
                            {/* <div className="col-span-6 flex justify-around items-center">
                                {monthlyKeys.map((key) => {
                                    const mData = mat.monthly_data[key];
                                    if (!mData)
                                        return (
                                            <div key={key} className="text-slate-300">
                                                -
                                            </div>
                                        );

                                    return (
                                        <div key={key} className="flex flex-col items-center">
                                            <span className="text-sm font-bold text-emerald-600 font-mono">
                                                {mData.requirement.toLocaleString()}
                                            </span>
                                            <span className="text-xs text-slate-400 italic">
                                                {mData.need_produce === "0"
                                                    ? mData.need_produce.toLocaleString()
                                                    : mData.forecast.toLocaleString()}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div> */}
                        </div>
                    ))}
                </div>
            ),
        },
    ];
};
