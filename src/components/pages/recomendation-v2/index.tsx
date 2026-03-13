"use client";

import { useMemo, useState } from "react";
import {
    useRecomendationV2,
    useRecomendationV2TableState,
} from "@/app/(application)/recomendation-v2/server/use.recomendation-v2";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import { Search, TrendingUp, CalendarDays, Settings2, ChevronDown } from "lucide-react";
import { RecomendationV2Columns } from "./table/column";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { VisibilityState } from "@tanstack/react-table";

interface RecomendationV2Props {
    title: string;
    description: string;
    type?: "ffo" | "lokal" | "impor";
}

export function RecomendationV2({ title, description, type }: RecomendationV2Props) {
    const tableState = useRecomendationV2TableState({ defaultType: type });
    const { list } = useRecomendationV2(tableState.queryParams);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

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

                        <div className="flex flex-col sm:flex-row items-center gap-3">
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

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="h-14 bg-white border-indigo-100 rounded-3xl font-black text-slate-600 hover:bg-slate-50 transition-all border-dashed shadow-sm px-6"
                                    >
                                        <Settings2 className="mr-2 h-5 w-5 text-indigo-500" />
                                        Kolom <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-64 rounded-[1.5rem] p-3 shadow-2xl border-indigo-50"
                                >
                                    <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Konfigurasi Kolom
                                    </div>
                                    <div className="space-y-1 mt-2">
                                        {columns.map((column: any) => {
                                            const columnId = column.accessorKey || column.id;
                                            const header = column.header;

                                            if (!columnId || typeof header !== "string")
                                                return null;

                                            return (
                                                <DropdownMenuCheckboxItem
                                                    key={columnId}
                                                    className="rounded-xl capitalize font-bold text-slate-600 py-3 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-600 cursor-pointer"
                                                    checked={columnVisibility[columnId] !== false}
                                                    onCheckedChange={(value) => {
                                                        setColumnVisibility((prev) => ({
                                                            ...prev,
                                                            [columnId]: !!value,
                                                        }));
                                                    }}
                                                >
                                                    {header.toLowerCase()}
                                                </DropdownMenuCheckboxItem>
                                            );
                                        })}
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
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
                                    state={{ columnVisibility }}
                                    onColumnVisibilityChange={setColumnVisibility}
                                    enableMultiSelect={true}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
