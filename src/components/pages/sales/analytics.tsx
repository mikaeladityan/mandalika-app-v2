"use client";

import { useMemo, useState } from "react";
import { ChevronDown, BarChart2, Loader2 } from "lucide-react";

import { useSaleQuery, useSaleTableState } from "@/app/(application)/sales/server/use.sales";
import { useProductsQuery } from "@/app/(application)/products/server/use.products";
import { useDebounce } from "@/shared/hooks";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    Line,
    ComposedChart,
    LabelList,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export function SalesAnalytics() {
    const table = useSaleTableState();
    const { sales, isLoading, isFetching } = useSaleQuery(table.queryParams);

    const [search1, setSearch1] = useState("");
    const [search2, setSearch2] = useState("");
    const debouncedSearch1 = useDebounce(search1, 500);
    const debouncedSearch2 = useDebounce(search2, 500);

    const { data: pList1, isFetching: pLoading1 } = useProductsQuery({
        search: debouncedSearch1,
        take: 15,
        page: 1,
    } as any);
    const { data: pList2, isFetching: pLoading2 } = useProductsQuery({
        search: debouncedSearch2,
        take: 15,
        page: 1,
    } as any);

    const activeHorizon = table.horizon ?? 12;
    const [openProductSelector, setOpenProductSelector] = useState(false);
    const [openProductSelector2, setOpenProductSelector2] = useState(false);

    const chartData = useMemo(() => {
        if (!sales?.sales || sales.sales.length === 0) return [];

        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mei",
            "Jun",
            "Jul",
            "Ags",
            "Sep",
            "Okt",
            "Nov",
            "Des",
        ];

        // Case comparison: iterate periods and find data for both products
        const periods = sales.sales[0].quantity.map((q: any) => ({ month: q.month, year: q.year }));

        return periods.map((p: any) => {
            const periodLabel = `${monthNames[p.month - 1]}${String(p.year).slice(-2)}`;
            const row: any = { period: periodLabel };

            sales.sales.forEach((s: any, idx: number) => {
                const found = s.quantity.find((q: any) => q.month === p.month && q.year === p.year);
                const val = Number(found?.quantity || 0);
                if (sales.sales.length > 1) {
                    row[`quantity_${idx + 1}`] = val;
                    row[`name_${idx + 1}`] = s.product.name;
                } else {
                    row.quantity = val;
                }
            });

            return row;
        });
    }, [sales]);

    const summaries = useMemo(() => {
        if (!sales?.sales || sales.sales.length === 0) return [];

        return sales.sales.map((s: any, idx: number) => {
            const total = s.totalQuantity || 0;
            const avg = chartData.length > 0 ? total / chartData.length : 0;
            return {
                total,
                average: avg.toFixed(0),
                product: s.product,
                color: idx === 0 ? "#10b981" : "#3b82f6", // Emerald for P1, Blue for P2
            };
        });
    }, [sales, chartData]);

    const isDataLoading = isLoading || isFetching;

    const isTrendUp =
        chartData.length > 1
            ? chartData[chartData.length - 1].quantity >= chartData[0].quantity
            : true;
    const chartColor = isTrendUp ? "#10b981" : "#ef4444";

    return (
        <section className="space-y-6">
            <header className="space-y-1">
                <h2 className="text-2xl font-bold">Analitik Penjualan</h2>
                <p className="text-muted-foreground">
                    Analisis data penjualan produk hingga bulan lalu (M-1) dalam rentang{" "}
                    {activeHorizon} bulan.
                </p>
            </header>

            <Card>
                <CardHeader className="py-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center w-full">
                        <div className="flex flex-col md:flex-row gap-2 flex-1">
                            <Popover
                                open={openProductSelector}
                                onOpenChange={setOpenProductSelector}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openProductSelector}
                                        className={cn(
                                            "w-full md:w-fit justify-between text-left font-normal",
                                            !table.product_id && "text-muted-foreground",
                                        )}
                                        disabled={isDataLoading}
                                    >
                                        <div className="truncate flex items-center gap-1.5 flex-wrap">
                                            {(() => {
                                                if (!table.product_id)
                                                    return "Pilih Produk Utama...";

                                                const sItem = sales?.sales?.find(
                                                    (s: any) => s.product_id === table.product_id,
                                                );

                                                if (!sItem)
                                                    return isDataLoading
                                                        ? "Memuat..."
                                                        : "Produk P1";

                                                const selectedProduct = sItem.product;

                                                return (
                                                    <>
                                                        <span className="font-semibold">
                                                            {selectedProduct.name}
                                                        </span>
                                                        {selectedProduct.product_type && (
                                                            <span className="text-xs text-muted-foreground uppercase">
                                                                {selectedProduct.product_type.name}
                                                            </span>
                                                        )}
                                                        <span className="text-[10px] font-medium bg-muted px-1.5 py-0.5 rounded text-muted-foreground uppercase">
                                                            {selectedProduct.size}
                                                        </span>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-fit p-0" align="start">
                                    <Command shouldFilter={false}>
                                        <CommandInput
                                            placeholder="Cari nama atau kode..."
                                            value={search1}
                                            onValueChange={setSearch1}
                                        />
                                        <CommandList>
                                            <CommandEmpty>
                                                {pLoading1 ? (
                                                    <div className="flex justify-center p-4 text-muted-foreground">
                                                        <Loader2 className="animate-spin h-4 w-4" />
                                                    </div>
                                                ) : (
                                                    "Produk tidak ditemukan."
                                                )}
                                            </CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem
                                                    value="PILIH_OTOMATIS"
                                                    onSelect={() => {
                                                        table.setProductId(undefined);
                                                        setOpenProductSelector(false);
                                                    }}
                                                    className="font-medium text-destructive"
                                                >
                                                    Pilih Otomatis (Produk Terlaris)
                                                </CommandItem>
                                                {pList1?.map((p: any) => (
                                                    <CommandItem
                                                        key={p.id}
                                                        value={String(p.id)}
                                                        onSelect={() => {
                                                            table.setProductId(p.id);
                                                            setOpenProductSelector(false);
                                                        }}
                                                    >
                                                        <div className="flex flex-col">
                                                            <span>
                                                                {p.name}{" "}
                                                                {String(
                                                                    p.product_type?.name ||
                                                                        p.type?.name ||
                                                                        p.type ||
                                                                        "",
                                                                ).toUpperCase()}{" "}
                                                                [
                                                                {String(
                                                                    p.product_size?.size ||
                                                                        p.size?.size ||
                                                                        p.size ||
                                                                        "",
                                                                ).toUpperCase()}
                                                                ML]
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                Kode: {p.code}
                                                            </span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            {/* Selector Produk Kedua - Lebih Subtle */}
                            <Popover
                                open={openProductSelector2}
                                onOpenChange={setOpenProductSelector2}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        role="combobox"
                                        aria-expanded={openProductSelector2}
                                        className={cn(
                                            "w-full md:w-fit justify-between text-left font-normal hover:bg-accent/50",
                                            !table.product_id_2 && "text-muted-foreground",
                                            table.product_id_2 &&
                                                "text-blue-600 bg-blue-50/50 hover:bg-blue-100/50",
                                        )}
                                        disabled={isDataLoading}
                                    >
                                        <div className="truncate flex items-center gap-1.5 flex-wrap">
                                            <div
                                                className={cn(
                                                    "w-2 h-2 rounded-full shrink-0",
                                                    table.product_id_2 ? "bg-blue-500" : "bg-muted",
                                                )}
                                            />
                                            {(() => {
                                                if (!table.product_id_2) return "Bandingkan...";

                                                const sItem = sales?.sales?.find(
                                                    (s: any) => s.product_id === table.product_id_2,
                                                );

                                                if (!sItem)
                                                    return isDataLoading
                                                        ? "Memuat..."
                                                        : "Produk P2";

                                                const selectedProduct2 = sItem.product;

                                                return (
                                                    <>
                                                        <span className="font-semibold">
                                                            {selectedProduct2.name}
                                                        </span>
                                                        {selectedProduct2.product_type && (
                                                            <span className="text-xs text-muted-foreground uppercase">
                                                                {selectedProduct2.product_type.name}
                                                            </span>
                                                        )}
                                                        <span className="text-[10px] font-medium bg-blue-100/50 text-blue-700 px-1.5 py-0.5 rounded uppercase">
                                                            {selectedProduct2.size}
                                                        </span>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-fit p-0" align="start">
                                    <Command shouldFilter={false}>
                                        <CommandInput
                                            placeholder="Cari nama atau kode..."
                                            value={search2}
                                            onValueChange={setSearch2}
                                        />
                                        <CommandList>
                                            <CommandEmpty>
                                                {pLoading2 ? (
                                                    <div className="flex justify-center p-4 text-muted-foreground">
                                                        <Loader2 className="animate-spin h-4 w-4" />
                                                    </div>
                                                ) : (
                                                    "Produk tidak ditemukan."
                                                )}
                                            </CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem
                                                    value="HAPUS_PERBANDINGAN"
                                                    onSelect={() => {
                                                        table.setProductId2(undefined);
                                                        setOpenProductSelector2(false);
                                                    }}
                                                    className="font-medium text-destructive"
                                                >
                                                    Hapus Perbandingan
                                                </CommandItem>
                                                {pList2?.map((p: any) => (
                                                    <CommandItem
                                                        key={p.id}
                                                        value={String(p.id)}
                                                        onSelect={() => {
                                                            table.setProductId2(p.id);
                                                            setOpenProductSelector2(false);
                                                        }}
                                                    >
                                                        <div className="flex flex-col">
                                                            <span>
                                                                {p.name}{" "}
                                                                {String(
                                                                    p.product_type?.name ||
                                                                        p.type?.name ||
                                                                        p.type ||
                                                                        "",
                                                                ).toUpperCase()}{" "}
                                                                [
                                                                {String(
                                                                    p.product_size?.size ||
                                                                        p.size?.size ||
                                                                        p.size ||
                                                                        "",
                                                                ).toUpperCase()}
                                                                ]
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                Kode: {p.code}
                                                            </span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="shrink-0">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        className="w-full md:w-40 justify-between font-semibold"
                                    >
                                        {activeHorizon} Bulan Terakhir
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="max-h-60 overflow-y-auto"
                                >
                                    {[2, 4, 6, 8, 10, 12, 16, 20, 24].map((h) => (
                                        <DropdownMenuItem
                                            key={h}
                                            onClick={() => table.setHorizon(h)}
                                        >
                                            {h} Bulan
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuItem
                                        onClick={() => table.setHorizon(undefined)}
                                        className="text-muted-foreground"
                                    >
                                        Default (12 Bulan)
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {summaries.length > 0 && (
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-emerald-50/20 border-emerald-100 col-span-1 md:col-span-1">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 flex-wrap leading-tight">
                                <BarChart2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span className="truncate">{summaries[0].product.name}</span>
                            </CardTitle>
                            <CardDescription className="truncate flex items-center gap-1.5 flex-wrap">
                                <span>{summaries[0].product.code}</span>
                                <span>•</span>
                                <span className="uppercase">
                                    {summaries[0].product.product_type?.name}
                                </span>
                                <span>•</span>
                                <span className="font-medium bg-emerald-100 text-emerald-800 px-1 rounded text-[10px] uppercase">
                                    {String(summaries[0].product.size).toUpperCase()}
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-emerald-700">
                                {summaries[0].total.toLocaleString("id-ID")}{" "}
                                <span className="text-sm font-medium text-muted-foreground uppercase">
                                    {summaries[0].product.size}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 lowercase">
                                total terjual ({activeHorizon} bln)
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className={cn(
                            summaries.length > 1
                                ? "bg-blue-50/20 border-blue-100"
                                : "bg-background",
                        )}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {summaries.length > 1 ? (
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-blue-700 font-bold text-base truncate">
                                            {summaries[1].product.name}
                                        </span>
                                        <span className="text-xs font-normal truncate flex items-center gap-1 flex-wrap text-muted-foreground">
                                            <span>{summaries[1].product.code}</span>
                                            <span>•</span>
                                            <span className="uppercase">
                                                {summaries[1].product.product_type?.name}
                                            </span>
                                            <span>•</span>
                                            <span className="font-medium bg-blue-100 text-blue-800 px-1 rounded text-[10px] uppercase">
                                                {String(summaries[1].product.size).toUpperCase()}
                                            </span>
                                        </span>
                                    </div>
                                ) : (
                                    "Rata-rata Penjualan"
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className={cn(
                                    "text-2xl font-bold",
                                    summaries.length > 1 && "text-blue-800",
                                )}
                            >
                                {summaries.length > 1
                                    ? summaries[1].total.toLocaleString("id-ID")
                                    : Number(summaries[0].average).toLocaleString("id-ID")}
                                {summaries.length > 1 && (
                                    <span className="text-xs font-medium text-muted-foreground ml-1 uppercase">
                                        {summaries[1].product.size}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {summaries.length > 1 ? "Total Terjual (Komp.)" : "per bulan"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {summaries.length > 1 ? "Perbandingan Avg" : "Rentang Waktu"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {summaries.length > 1
                                    ? `${Number(summaries[0].average).toLocaleString("id-ID")} vs ${Number(summaries[1].average).toLocaleString("id-ID")}`
                                    : `${activeHorizon} Bulan`}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {summaries.length > 1
                                    ? "Avg per bulan"
                                    : chartData.length > 0 &&
                                      `${chartData[0]?.period} - ${chartData[chartData.length - 1]?.period}`}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Card className="pt-6">
                <CardContent>
                    {!chartData.length && !isDataLoading ? (
                        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                            Tidak ada data penjualan untuk kriteria ini.
                        </div>
                    ) : (
                        <div className={cn("h-[450px] w-full", isDataLoading && "opacity-50")}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart
                                    data={chartData}
                                    margin={{ top: 40, right: 30, left: 0, bottom: 20 }}
                                    barGap={8}
                                >
                                    <defs>
                                        <linearGradient id="colorP1" x1="0" y1="0" x2="0" y2="1">
                                            <stop
                                                offset="5%"
                                                stopColor="#10b981"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#10b981"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                        <linearGradient id="colorP2" x1="0" y1="0" x2="0" y2="1">
                                            <stop
                                                offset="5%"
                                                stopColor="#3b82f6"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#3b82f6"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="hsl(var(--border))"
                                        opacity={0.4}
                                    />
                                    <XAxis
                                        dataKey="period"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill: "hsl(var(--muted-foreground))",
                                            fontSize: 11,
                                            fontWeight: 600,
                                        }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill: "hsl(var(--muted-foreground))",
                                            fontSize: 11,
                                        }}
                                        tickFormatter={(val) => val.toLocaleString("id-ID")}
                                    />
                                    <Tooltip
                                        cursor={{
                                            stroke: "hsl(var(--primary))",
                                            strokeWidth: 1,
                                            strokeDasharray: "4 4",
                                            fill: "hsl(var(--muted))",
                                            opacity: 0.1,
                                        }}
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                // Filter unique entries by dataKey to avoid duplicates from Area/Bar/Line layers
                                                const filteredPayload = payload.filter(
                                                    (v, i, a) =>
                                                        a.findIndex(
                                                            (t) => t.dataKey === v.dataKey,
                                                        ) === i &&
                                                        !v.dataKey
                                                            ?.toString()
                                                            .startsWith("display"),
                                                );

                                                return (
                                                    <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-2xl min-w-[220px]">
                                                        <div className="flex justify-between items-center mb-3 border-b pb-2">
                                                            <span className="font-black text-slate-800 tracking-tight">
                                                                {label}
                                                            </span>
                                                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded uppercase">
                                                                Penjualan
                                                            </span>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {filteredPayload.map(
                                                                (entry: any, index: number) => {
                                                                    const product =
                                                                        entry.dataKey ===
                                                                        "quantity_2"
                                                                            ? summaries[1]?.product
                                                                            : summaries[0]?.product;

                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            className="flex items-center justify-between gap-4"
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                <div
                                                                                    className="w-2.5 h-2.5 rounded-full"
                                                                                    style={{
                                                                                        backgroundColor:
                                                                                            entry.color,
                                                                                    }}
                                                                                />
                                                                                <span className="text-sm font-medium text-slate-600 truncate max-w-[150px]">
                                                                                    {product?.name ||
                                                                                        entry.name}
                                                                                </span>
                                                                            </div>
                                                                            <span className="text-sm font-black text-slate-900">
                                                                                {Number(
                                                                                    entry.value,
                                                                                ).toLocaleString(
                                                                                    "id-ID",
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />

                                    {/* BACKGROUND AREA GRADS */}
                                    <Area
                                        type="monotone"
                                        dataKey={summaries.length > 1 ? "quantity_1" : "quantity"}
                                        stroke="none"
                                        fill="url(#colorP1)"
                                        animationDuration={1500}
                                    />
                                    {summaries.length > 1 && (
                                        <Area
                                            type="monotone"
                                            dataKey="quantity_2"
                                            stroke="none"
                                            fill="url(#colorP2)"
                                            animationDuration={2000}
                                        />
                                    )}

                                    {/* BARS FOR DISCRETE VALUES */}
                                    <Bar
                                        dataKey={summaries.length > 1 ? "quantity_1" : "quantity"}
                                        name={
                                            summaries.length > 1
                                                ? summaries[0].product.name
                                                : "Sales Volume"
                                        }
                                        fill="#10b981"
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={100}
                                        opacity={0.15}
                                    />
                                    {summaries.length > 1 && (
                                        <Bar
                                            dataKey="quantity_2"
                                            name={summaries[1].product.name}
                                            fill="#3b82f6"
                                            radius={[4, 4, 0, 0]}
                                            maxBarSize={100}
                                            opacity={0.15}
                                        />
                                    )}

                                    {/* MAIN TREND LINES */}
                                    <Line
                                        type="monotone"
                                        dataKey={summaries.length > 1 ? "quantity_1" : "quantity"}
                                        stroke="#10b981"
                                        strokeWidth={4}
                                        dot={{
                                            r: 5,
                                            fill: "#10b981",
                                            stroke: "#fff",
                                            strokeWidth: 3,
                                        }}
                                        activeDot={{ r: 8, strokeWidth: 0 }}
                                        animationDuration={1500}
                                    >
                                        <LabelList
                                            dataKey={
                                                summaries.length > 1 ? "quantity_1" : "quantity"
                                            }
                                            position="top"
                                            offset={15}
                                            fontSize={10}
                                            fontWeight={700}
                                            fill="#047857"
                                            formatter={(val: any) =>
                                                Number(val).toLocaleString("id-ID")
                                            }
                                        />
                                    </Line>
                                    {summaries.length > 1 && (
                                        <Line
                                            type="monotone"
                                            dataKey="quantity_2"
                                            stroke="#3b82f6"
                                            strokeWidth={4}
                                            dot={{
                                                r: 5,
                                                fill: "#3b82f6",
                                                stroke: "#fff",
                                                strokeWidth: 3,
                                            }}
                                            activeDot={{ r: 8, strokeWidth: 0 }}
                                            animationDuration={2000}
                                        >
                                            <LabelList
                                                dataKey="quantity_2"
                                                position="bottom"
                                                offset={15}
                                                fontSize={10}
                                                fontWeight={700}
                                                fill="#1d4ed8"
                                                formatter={(val: any) =>
                                                    Number(val).toLocaleString("id-ID")
                                                }
                                            />
                                        </Line>
                                    )}
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
