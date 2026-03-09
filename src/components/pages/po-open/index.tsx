"use client";

import { useMemo } from "react";
import { useOpenPo, useOpenPoTableState } from "@/app/(application)/po/open/server/use.po-open";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import { Truck, Search, Loader2 } from "lucide-react";
import { OpenPoColumns } from "./table/column";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface OpenPoProps {
    title: string;
    description: string;
}

export function OpenPo({ title, description }: OpenPoProps) {
    const table = useOpenPoTableState();
    const { list } = useOpenPo(table.queryParams);

    const columns = useMemo(() => OpenPoColumns(), []);

    return (
        <div className="flex flex-col gap-6 p-2 md:p-4">
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="space-y-6 p-6 lg:p-8 flex-col sm:flex-row sm:items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit">
                            <Truck className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black text-slate-900">
                                {title}
                            </CardTitle>
                            <CardDescription className="text-slate-500 font-medium">
                                {description}
                            </CardDescription>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row flex-wrap items-center gap-3 w-full">
                        {/* Grup Kiri: Filter Bulan & Tahun */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Select
                                value={
                                    table.month
                                        ? String(table.month)
                                        : String(new Date().getMonth() + 1)
                                }
                                onValueChange={(val) => table.setMonth(Number(val))}
                            >
                                <SelectTrigger className="flex-1 md:w-[130px] h-11 bg-slate-50/50 border-slate-200 rounded-xl">
                                    <SelectValue placeholder="Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        "Januari",
                                        "Februari",
                                        "Maret",
                                        "April",
                                        "Mei",
                                        "Juni",
                                        "Juli",
                                        "Agustus",
                                        "September",
                                        "Oktober",
                                        "November",
                                        "Desember",
                                    ].map((m, i) => (
                                        <SelectItem key={m} value={String(i + 1)}>
                                            {m}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={
                                    table.year
                                        ? String(table.year)
                                        : String(new Date().getFullYear())
                                }
                                onValueChange={(val) => table.setYear(Number(val))}
                            >
                                <SelectTrigger className="flex-1 md:w-[100px] h-11 bg-slate-50/50 border-slate-200 rounded-xl">
                                    <SelectValue placeholder="Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from(
                                        { length: 5 },
                                        (_, i) => new Date().getFullYear() - 2 + i,
                                    ).map((y) => (
                                        <SelectItem key={y} value={String(y)}>
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Grup Kanan: Status & Search (Terdorong ke kanan di Desktop) */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto md:ml-auto">
                            <Select value={table.status} onValueChange={table.setStatus}>
                                <SelectTrigger className="w-full sm:w-[140px] h-11 bg-slate-50/50 border-slate-200 rounded-xl">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="OPEN">OPEN</SelectItem>
                                    <SelectItem value="RECEIVED">RECEIVED</SelectItem>
                                    <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="relative w-full sm:w-64 lg:w-72 group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    placeholder="Cari by material/PO..."
                                    value={table.search}
                                    onChange={(e) => table.setSearch(e.target.value)}
                                    className="pl-11 h-11 w-full bg-slate-50/50 border-slate-200 rounded-xl focus-visible:ring-blue-500/20 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="px-6 lg:px-8 pb-8">
                        {list.isLoading ? (
                            <div className="p-8 border border-slate-100 rounded-2xl">
                                <TableSkeleton />
                            </div>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={list.data?.data ?? []}
                                page={table.page}
                                pageSize={table.take}
                                total={list.data?.meta?.total ?? 0}
                                onPageChange={table.setPage}
                                onPageSizeChange={table.setTake}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
