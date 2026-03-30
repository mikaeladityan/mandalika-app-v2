"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function PreviewTable({ rows }: { rows: any[] }) {
    return (
        <div className="relative overflow-x-auto max-h-[500px]">
            <Table>
                <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                    <TableRow className="border-b border-slate-200">
                        <TableHead className="w-[100px] font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                            Status
                        </TableHead>
                        <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                            Kode
                        </TableHead>
                        <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider min-w-[150px]">
                            Nama Toko
                        </TableHead>
                        <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                            Gudang Supply 1
                        </TableHead>
                        <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                            Gudang Supply 2
                        </TableHead>
                        <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                            Tipe Outlet
                        </TableHead>
                        <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                            Status
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow
                            key={i}
                            className="hover:bg-slate-50/50 border-b border-slate-100 transition-colors"
                        >
                            <TableCell>
                                {row.errors.length > 0 ? (
                                    <div className="group relative">
                                        <Badge
                                            variant="destructive"
                                            className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg shadow-sm"
                                        >
                                            <AlertCircle size={12} />
                                            Error
                                        </Badge>
                                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block transition-all animate-in fade-in zoom-in-95 duration-200">
                                            <div className="bg-slate-900 text-white text-[10px] p-3 rounded-xl shadow-2xl min-w-[240px] border border-slate-800 ring-4 ring-slate-900/5">
                                                <div className="font-black mb-1.5 text-rose-400 uppercase tracking-widest">
                                                    Detail Kesalahan:
                                                </div>
                                                <ul className="space-y-1">
                                                    {row.errors.map((e: string, idx: number) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start gap-2"
                                                        >
                                                            <div className="size-1 w-1 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                                                            <span className="leading-relaxed opacity-90">
                                                                {e}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Badge
                                        variant="secondary"
                                        className="bg-emerald-50 text-emerald-600 border-emerald-100 flex items-center gap-1.5 px-2 py-0.5 rounded-lg shadow-sm"
                                    >
                                        <CheckCircle2 size={12} />
                                        Valid
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell className="font-black text-slate-900 font-mono tracking-tighter">
                                {row.code}
                            </TableCell>
                            <TableCell className="font-bold text-slate-700">{row.name}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="text-[10px] border-indigo-100 text-indigo-600 bg-indigo-50/30">
                                    {row.supply_by_1 || "-"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="text-[10px] border-indigo-100 text-indigo-600 bg-indigo-50/30">
                                    {row.supply_by_2 || "-"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="text-[10px]">
                                    {row.store_type}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={row.is_active ? "default" : "secondary"} className="text-[10px]">
                                    {row.is_active ? "Aktif" : "Non-Aktif"}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
