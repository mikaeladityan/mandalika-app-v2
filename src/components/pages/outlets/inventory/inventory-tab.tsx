"use client";

import { 
    Search, 
    AlertTriangle, 
    MoreHorizontal, 
    ArrowUpDown, 
    RefreshCcw,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Edit2,
    Check,
    X
} from "lucide-react";
import { useState, useCallback } from "react";
import { 
    useOutletInventories, 
    useActionOutletInventory, 
    useOutletInventoryTableState 
} from "@/app/(application)/outlets/server/use.outlet-inventory";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { InitInventoryModal } from "./init-inventory-modal";
import { formatNumber, cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface InventoryTabProps {
    outletId: number;
}

function PaginationControls({
    page,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
    pageLength = [10, 25, 50, 100],
}: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (p: number) => void;
    onPageSizeChange: (s: number) => void;
    pageLength?: number[];
}) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-1">
            <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Menampilkan{" "}
                    <span className="text-foreground font-bold">
                        {formatNumber(startItem)}-{formatNumber(endItem)}
                    </span>{" "}
                    dari <span className="text-foreground font-bold">{formatNumber(total)}</span>
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 lg:gap-8">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-black uppercase text-slate-400">Baris:</span>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(v) => onPageSizeChange(Number(v))}
                    >
                        <SelectTrigger className="h-7 w-16 border-none bg-transparent shadow-none focus:ring-0 font-bold p-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="end" className="rounded-2xl border-indigo-50 shadow-xl">
                            {pageLength.map((s) => (
                                <SelectItem key={s} value={s.toString()} className="text-sm rounded-lg">
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-1.5">
                    <div className="flex items-center justify-center px-4 py-2 bg-muted/50 text-foreground rounded-lg text-xs font-bold tabular-nums border border-border/50">
                        {page} <span className="mx-2 text-muted-foreground font-normal">/</span> {totalPages}
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-slate-200 shadow-none hover:bg-slate-50 hover:text-indigo-600 transition-all rounded-xl"
                            onClick={() => onPageChange(1)}
                            disabled={page === 1}
                        >
                            <ChevronsLeft size={16} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-slate-200 shadow-none hover:bg-slate-50 hover:text-indigo-600 transition-all rounded-xl"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1}
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-slate-200 shadow-none hover:bg-slate-50 hover:text-indigo-600 transition-all rounded-xl"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                        >
                            <ChevronRight size={16} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-slate-200 shadow-none hover:bg-slate-50 hover:text-indigo-600 transition-all rounded-xl"
                            onClick={() => onPageChange(totalPages)}
                            disabled={page >= totalPages}
                        >
                            <ChevronsRight size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function InventoryTab({ outletId }: InventoryTabProps) {
    const table = useOutletInventoryTableState();
    const { data: inventories, isLoading, isFetching } = useOutletInventories(outletId, table.queryParams);
    const { setMinStock } = useActionOutletInventory(outletId);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>("");

    const handleStartEdit = (id: number, current: number | null) => {
        setEditingId(id);
        setEditValue(current?.toString() ?? "0");
    };

    const handleSaveEdit = async (productId: number) => {
        await setMinStock.mutateAsync({ 
            productId, 
            body: { min_stock: Number(editValue) } 
        });
        setEditingId(null);
    };

    const isDataLoading = isLoading || isFetching;

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Cari SKU atau nama produk..."
                            value={table.search}
                            onChange={(e) => table.setSearch(e.target.value)}
                            className="pl-10 h-10 bg-muted/30 border-transparent rounded-xl focus-within:ring-1 focus-within:ring-primary/20 transition-all focus-visible:bg-white focus-visible:border-primary/20"
                        />
                    </div>
                    <Button
                        variant={table.lowStock === "true" ? "default" : "outline"}
                        onClick={() => table.setLowStock(table.lowStock === "true" ? undefined : "true")}
                        className={cn(
                            "rounded-xl h-10 px-4 transition-all",
                            table.lowStock === "true" && "bg-rose-500 hover:bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-200"
                        )}
                    >
                        <AlertTriangle className={cn("mr-2 h-4 w-4", table.lowStock === "true" ? "animate-pulse" : "text-rose-500")} />
                        Stok Rendah
                    </Button>
                </div>
                <InitInventoryModal outletId={outletId} />
            </div>

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="border-slate-100 hover:bg-transparent">
                                <TableHead className="w-12 text-center">#</TableHead>
                                <TableHead className="font-bold">Produk</TableHead>
                                <TableHead className="font-bold">SKU / Kode</TableHead>
                                <TableHead className="font-bold text-center">Quantity</TableHead>
                                <TableHead className="font-bold text-center">Min. Stock</TableHead>
                                <TableHead className="font-bold text-center">Status</TableHead>
                                <TableHead className="w-16"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isDataLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="border-slate-50">
                                        <TableCell><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
                                        <TableCell>
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-40" />
                                                <Skeleton className="h-3 w-20" />
                                            </div>
                                        </TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-12 mx-auto rounded-lg" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-12 mx-auto rounded-lg" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-20 mx-auto rounded-full" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8 mx-auto rounded-lg" /></TableCell>
                                    </TableRow>
                                ))
                            ) : inventories?.data && inventories.data.length > 0 ? (
                                inventories.data.map((item, index) => (
                                    <TableRow key={item.id} className="border-slate-50/50 group hover:bg-slate-50/30 transition-colors">
                                        <TableCell className="text-center text-xs text-muted-foreground font-medium tabular-nums">
                                            {(table.queryParams.page! - 1) * table.queryParams.take! + index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-sm text-slate-700">{item.product?.name}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase font-medium">FINISH GOODS</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[10px] font-mono tracking-tight bg-white border-slate-200">
                                                {item.product?.code}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center font-black text-slate-900 tabular-nums">
                                            <div className={cn(
                                                "inline-flex items-center justify-center px-3 py-1 rounded-lg border",
                                                item.is_low_stock ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
                                            )}>
                                                {formatNumber(item.quantity)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center tabular-nums">
                                            {editingId === item.id ? (
                                                <div className="flex items-center justify-center gap-1">
                                                    <Input
                                                        type="number"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        className="w-20 h-8 text-center px-1 rounded-lg border-primary/30"
                                                        autoFocus
                                                    />
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                                                        onClick={() => handleSaveEdit(item.product_id)}
                                                    >
                                                        <Check size={14} />
                                                    </Button>
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="h-8 w-8 text-rose-600 hover:bg-rose-50 rounded-lg"
                                                        onClick={() => setEditingId(null)}
                                                    >
                                                        <X size={14} />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div 
                                                    className="inline-flex items-center justify-center px-3 py-1 rounded-lg border border-slate-200 bg-white hover:border-primary/30 cursor-pointer transition-all gap-2 group-hover:bg-slate-50"
                                                    onClick={() => handleStartEdit(item.id, item.min_stock)}
                                                >
                                                    <span className="font-bold text-slate-700">{item.min_stock ?? 0}</span>
                                                    <Edit2 size={10} className="text-slate-400 group-hover:text-primary transition-colors" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {item.is_low_stock ? (
                                                <Badge className="bg-rose-500 hover:bg-rose-500 shadow-none text-[10px] uppercase font-bold tracking-wider rounded-lg px-2">
                                                    Low Stock
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50/50 text-[10px] uppercase font-bold tracking-wider rounded-lg px-2 shadow-none">
                                                    Safe
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900">
                                                <RefreshCcw size={14} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-60 text-center text-muted-foreground bg-slate-50/20">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <AlertTriangle className="h-10 w-10 opacity-10" />
                                            <p className="text-sm font-medium">Stok tidak ditemukan atau belum di-inisialisasi.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                {inventories && inventories.len > 0 && (
                    <div className="p-4 border-t bg-slate-50/30">
                        <PaginationControls
                            page={table.queryParams.page!}
                            pageSize={table.queryParams.take!}
                            total={inventories.len}
                            onPageChange={table.setPage}
                            onPageSizeChange={table.setPageSize}
                        />
                    </div>
                )}
            </Card>
        </div>
    );
}
