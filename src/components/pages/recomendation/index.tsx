"use client";

import { useMemo } from "react";
import {
    useRecomendation,
    useRecomendationTableState,
} from "@/app/(application)/recomendation/server/use.recomendation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import { Boxes, Search, Loader2 } from "lucide-react";
import { RecomendationColumns } from "./table/column";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface RecomendationProps {
    title: string;
    description: string;
    type?: "ffo" | "lokal" | "impor";
}

export function Recomendation({ title, description, type }: RecomendationProps) {
    const table = useRecomendationTableState({ defaultType: type });
    const { list } = useRecomendation(table.queryParams);

    const periods = useMemo(() => {
        if (!list.data?.meta) return { sales_periods: [], forecast_periods: [] };
        return {
            sales_periods: list.data.meta.sales_periods,
            forecast_periods: list.data.meta.forecast_periods,
        };
    }, [list.data?.meta]);

    const columns = useMemo(() => RecomendationColumns(periods), [periods]);

    return (
        <div className="flex flex-col gap-6 p-2 md:p-4">
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="space-y-6 p-6 lg:p-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit">
                            <Boxes className="h-6 w-6" />
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

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Select
                                    value={
                                        table.month
                                            ? String(table.month)
                                            : String(new Date().getMonth() + 1)
                                    }
                                    onValueChange={(val) => table.setMonth(Number(val))}
                                >
                                    <SelectTrigger
                                        className="w-[130px] h-12 bg-slate-50/50 border-slate-200 rounded-2xl"
                                        size="sm"
                                    >
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
                                    <SelectTrigger
                                        className="w-[100px] h-12 bg-slate-50/50 border-slate-200 rounded-2xl"
                                        size="sm"
                                    >
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
                        </div>

                        <div className="relative w-full md:max-w-md group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <Input
                                placeholder="Cari material..."
                                value={table.search}
                                onChange={(e) => table.setSearch(e.target.value)}
                                className="pl-11 h-12 bg-slate-50/50 border-slate-200 rounded-2xl focus-visible:ring-indigo-500/20 transition-all font-medium"
                            />
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
