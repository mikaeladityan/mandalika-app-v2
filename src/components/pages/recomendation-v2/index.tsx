"use client";

import { useMemo } from "react";
import {
    useRecomendationV2,
    useRecomendationV2TableState,
} from "@/app/(application)/recomendation-v2/server/use.recomendation-v2";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import { Search, TrendingUp, CalendarDays } from "lucide-react";
import { RecomendationV2Columns } from "./table/column";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface RecomendationV2Props {
    title: string;
    description: string;
    type?: "ffo" | "lokal" | "impor";
}

export function RecomendationV2({ title, description, type }: RecomendationV2Props) {
    const tableState = useRecomendationV2TableState({ defaultType: type });
    const { list } = useRecomendationV2(tableState.queryParams);

    const columns = useMemo(() => RecomendationV2Columns(), []);

    const months = [
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
    ];

    return (
        <div className="flex flex-col gap-6 p-2 md:p-4">
            <Card className="border-none shadow-2xl shadow-indigo-100/50 rounded-[2.5rem] overflow-hidden bg-white">
                <CardHeader className="space-y-8 p-8 lg:p-10 border-b border-indigo-50/50 bg-linear-to-br from-white to-indigo-50/20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-indigo-600 text-white rounded-3xl shadow-lg shadow-indigo-200 animate-pulse-slow">
                                <TrendingUp className="h-7 w-7" />
                            </div>
                            <div>
                                <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">
                                    {title} <span className="text-indigo-600">v2</span>
                                </CardTitle>
                                <CardDescription className="text-slate-500 font-medium text-sm mt-1">
                                    {description}
                                </CardDescription>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-white p-2 rounded-3xl border border-indigo-100 shadow-sm">
                            <CalendarDays className="size-4 text-indigo-400 ml-2" />
                            <Select
                                value={String(tableState.month)}
                                onValueChange={(val) => tableState.setMonth(Number(val))}
                            >
                                <SelectTrigger className="w-[140px] h-10 border-none bg-transparent focus:ring-0 font-bold text-slate-700">
                                    <SelectValue placeholder="Bulan" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-indigo-50 shadow-xl">
                                    {months.map((m, i) => (
                                        <SelectItem
                                            key={m}
                                            value={String(i + 1)}
                                            className="rounded-xl"
                                        >
                                            {m}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="w-px h-6 bg-indigo-100" />

                            <Select
                                value={String(tableState.year)}
                                onValueChange={(val) => tableState.setYear(Number(val))}
                            >
                                <SelectTrigger className="w-[100px] h-10 border-none bg-transparent focus:ring-0 font-bold text-slate-700">
                                    <SelectValue placeholder="Tahun" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-indigo-50 shadow-xl">
                                    {Array.from(
                                        { length: 5 },
                                        (_, i) => new Date().getFullYear() - 2 + i,
                                    ).map((y) => (
                                        <SelectItem
                                            key={y}
                                            value={String(y)}
                                            className="rounded-xl"
                                        >
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="relative group max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-all duration-300" />
                        <Input
                            placeholder="Cari material berdasarkan nama atau barcode..."
                            value={tableState.search}
                            onChange={(e) => tableState.setSearch(e.target.value)}
                            className="pl-12 h-14 bg-white border-slate-200 rounded-[1.25rem] focus-visible:ring-indigo-500/10 focus:border-indigo-500/50 transition-all duration-300 font-medium shadow-sm group-hover:shadow-md"
                        />
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="px-8 lg:px-10 py-10">
                        {list.isLoading ? (
                            <div className="space-y-4">
                                <TableSkeleton />
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2rem] border border-slate-100/80 shadow-sm overflow-hidden">
                                <DataTable
                                    columns={columns}
                                    data={list.data?.data ?? []}
                                    page={tableState.page}
                                    pageSize={tableState.take}
                                    total={list.data?.meta?.total ?? 0}
                                    onPageChange={tableState.setPage}
                                    onPageSizeChange={tableState.setTake}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
