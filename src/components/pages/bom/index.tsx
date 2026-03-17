"use client";

import { useBOM } from "@/app/(application)/bom/server/use.bom";
import { useState } from "react";
import { OnChangeFn, VisibilityState } from "@tanstack/react-table";
import { DataTable } from "../../ui/table/data";
import { BOMColumns } from "./table/column";
import { Input } from "@/components/ui/input";
import { Search, Flame, Download, Filter, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDebounce } from "@/shared/hooks";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { FORECAST_HORIZON_KEY } from "@/app/(application)/forecasts/server/use.forecast";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CalendarRange } from "lucide-react";

export default function BOMPage() {
    const [query, setQuery] = useState<any>({
        page: 1,
        take: 25,
        search: "",
        sortBy: "product_name",
        sortOrder: "asc",
    });

    const [horizon, setHorizon] = useLocalStorage<number>(FORECAST_HORIZON_KEY, 3);

    const debouncedSearch = useDebounce(query.search, 500);
    const { data, isLoading, isFetching } = useBOM({
        ...query,
        search: debouncedSearch,
        forecast_months: horizon,
    });

    const onSort = (key: any) => {
        setQuery((prev: any) => ({
            ...prev,
            sortBy: key,
            sortOrder: prev.sortBy === key && prev.sortOrder === "asc" ? "desc" : "asc",
        }));
    };

    return (
        <div className="py-6 space-y-6 max-w-full overflow-hidden px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black flex items-center gap-2 text-slate-900 tracking-tight">
                        <Flame className="text-orange-600 fill-orange-600 size-6" />
                        BILL OF MATERIALS (BOM)
                    </h1>
                    <p className="text-sm text-slate-500 font-medium italic">
                        Manajemen kebutuhan bahan baku berdasarkan forecast dan riwayat penjualan.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-xl border border-slate-200 shadow-sm flex-1 md:flex-none h-10">
                        <CalendarRange className="h-4 w-4 text-slate-400" />
                        <div className="flex flex-col">
                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-tighter leading-tight">
                                Horizon SS (Avg)
                            </Label>
                            <span className="text-xs font-bold text-slate-700 leading-tight">
                                {horizon} Bulan
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Card className="border-slate-200/60 shadow-md shadow-slate-200/20 overflow-hidden bg-white/50 backdrop-blur-sm rounded-xl">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full sm:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                            <Input
                                placeholder="Cari produk atau material..."
                                className="pl-10 bg-slate-50/50 border-slate-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 rounded-lg"
                                value={query.search}
                                onChange={(e) =>
                                    setQuery({ ...query, search: e.target.value, page: 1 })
                                }
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="relative">
                    {/* Re-fetching Overlay */}
                    {isFetching && !isLoading && (
                        <div className="absolute inset-x-0 top-0 z-50 flex h-1 w-full bg-orange-50 overflow-hidden">
                            <div className="h-full bg-orange-500 animate-pulse origin-left w-full" />
                        </div>
                    )}

                    {isLoading ? (
                        <div className="p-4">
                            <TableSkeleton />
                        </div>
                    ) : (
                        <DataTable
                            tableId="bom-main-table"
                            data={data?.data ?? []}
                            columns={BOMColumns({
                                sortBy: query.sortBy,
                                sortOrder: query.sortOrder,
                                onSort,
                                horizon,
                            })}
                            page={query.page}
                            pageSize={query.take}
                            total={data?.len ?? 0}
                            onPageChange={(page: number) => setQuery({ ...query, page })}
                            onPageSizeChange={(size: number) =>
                                setQuery({ ...query, take: size, page: 1 })
                            }
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
