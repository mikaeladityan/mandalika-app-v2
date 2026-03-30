"use client";

import { useMemo } from "react";
import { Search, Loader2, MapPin, Warehouse, Store, Filter } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    useProductStockLocations,
    useStockLocationTableState,
    useLocationsQuery,
} from "@/app/(application)/products/stock-locations/server/use.stock-location";
import { StockLocationColumns } from "./table/column";
import { DataTable } from "@/components/ui/table/data";
import { ColumnDef } from "@tanstack/react-table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function ProductStockLocation() {
    const table = useStockLocationTableState();
    const { locations = [] } = useLocationsQuery();
    const { data: results, isLoading, isFetching } = useProductStockLocations(table.queryParams);

    const columns = useMemo(
        () =>
            StockLocationColumns({
                sortBy: table.sortBy,
                sortOrder: table.sortOrder,
                onSort: table.onSort,
                locations,
            }),
        [table.sortBy, table.sortOrder, locations],
    );

    const warehouseCount = locations.filter((l) => l.type === "WAREHOUSE").length;
    const outletCount = locations.filter((l) => l.type === "OUTLET").length;

    return (
        <section className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
                <div>
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <MapPin size={20} strokeWidth={2.5} />
                        <h2 className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                            Stok per Lokasi
                        </h2>
                    </div>
                    <p className="text-[12px] text-muted-foreground font-medium">
                        Laporan sebaran stok barang jadi (Gudang vs Toko/Outlet) secara real-time
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                            <Warehouse size={16} />
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold block leading-none">GUDANG</span>
                            <span className="text-sm font-black">{warehouseCount}</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-slate-200" />
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                            <Store size={16} />
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold block leading-none">OUTLET</span>
                            <span className="text-sm font-black">{outletCount}</span>
                        </div>
                    </div>
                </div>
            </header>

            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="p-4 border-b bg-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative w-full md:max-w-md group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Cari SKU atau Nama Produk..."
                                value={table.search}
                                onChange={(e) => table.setSearch(e.target.value)}
                                className="pl-9 h-9 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-primary/20 text-sm"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                                <Filter size={12} className="text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase">GENDER</span>
                                <Select value={table.gender || "all"} onValueChange={(v) => table.setGender(v === "all" ? undefined : v)}>
                                    <SelectTrigger className="h-6 w-24 border-none bg-transparent font-black shadow-none focus:ring-0 p-0 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="MEN">MEN</SelectItem>
                                        <SelectItem value="WOMEN">WOMEN</SelectItem>
                                        <SelectItem value="UNISEX">UNISEX</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="py-24 flex flex-col items-center justify-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 blur-xl animate-pulse rounded-full bg-primary/20" />
                                <Loader2 className="animate-spin text-primary relative" size={40} strokeWidth={2} />
                            </div>
                            <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-widest">
                                Menghitung Sebaran Stok...
                            </p>
                        </div>
                    ) : (
                        <div className="p-6">
                           <DataTable
                                tableId="stock-location-recap-table"
                                columns={columns as ColumnDef<unknown, unknown>[]}
                                data={results?.data || []}
                                total={results?.len || 0}
                                page={table.queryParams.page || 1}
                                pageSize={table.queryParams.take || 50}
                                onPageChange={table.setPage}
                                onPageSizeChange={table.setPageSize}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
