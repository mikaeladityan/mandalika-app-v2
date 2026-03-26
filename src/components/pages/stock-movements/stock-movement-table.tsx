"use client";

import { 
    History, 
    ArrowUpRight, 
    ArrowDownLeft, 
    RefreshCcw, 
    Calendar, 
    User,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    Box,
    Store,
    Warehouse as WarehouseIcon
} from "lucide-react";
import { useStockMovements, useStockMovementTableState } from "@/app/(application)/stock-movements/server/use.stock-movement";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { formatNumber, cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

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
                    Menampilkan <span className="text-foreground font-bold">{formatNumber(startItem)}-{formatNumber(endItem)}</span> dari <span className="text-foreground font-bold">{formatNumber(total)}</span>
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 lg:gap-8">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-black uppercase text-slate-400">Baris:</span>
                    <Select value={pageSize.toString()} onValueChange={(v) => onPageSizeChange(Number(v))}>
                        <SelectTrigger className="h-7 w-16 border-none bg-transparent shadow-none focus:ring-0 font-bold p-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="end" className="rounded-2xl border-indigo-50 shadow-xl">
                            {pageLength.map((s) => (
                                <SelectItem key={s} value={s.toString()} className="text-sm rounded-lg">{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center justify-center px-4 py-2 bg-muted/50 text-foreground rounded-lg text-xs font-bold tabular-nums border border-border/50">
                        {page} <span className="mx-2 text-muted-foreground font-normal">/</span> {totalPages}
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200 rounded-xl" onClick={() => onPageChange(1)} disabled={page === 1}><ChevronsLeft size={16} /></Button>
                        <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200 rounded-xl" onClick={() => onPageChange(page - 1)} disabled={page === 1}><ChevronLeft size={16} /></Button>
                        <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200 rounded-xl" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}><ChevronRight size={16} /></Button>
                        <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200 rounded-xl" onClick={() => onPageChange(totalPages)} disabled={page >= totalPages}><ChevronsRight size={16} /></Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const movementConfig: Record<string, { label: string, color: string, icon: any }> = {
    IN: { label: "Stock In", color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: ArrowDownLeft },
    OUT: { label: "Stock Out", color: "text-rose-600 bg-rose-50 border-rose-100", icon: ArrowUpRight },
    TRANSFER_IN: { label: "Trf In", color: "text-blue-600 bg-blue-50 border-blue-100", icon: ArrowDownLeft },
    TRANSFER_OUT: { label: "Trf Out", color: "text-indigo-600 bg-indigo-50 border-indigo-100", icon: ArrowUpRight },
    ADJUSTMENT: { label: "Adjust", color: "text-amber-600 bg-amber-50 border-amber-100", icon: RefreshCcw },
    OPNAME: { label: "Opname", color: "text-purple-600 bg-purple-50 border-purple-100", icon: ClipboardCheck },
    INITIAL: { label: "Initial", color: "text-slate-600 bg-slate-50 border-slate-100", icon: History },
    POS_SALE: { label: "Sale", color: "text-rose-700 bg-rose-100/50 border-rose-200", icon: ArrowUpRight },
};

function ClipboardCheck(props: any) {
    return <History {...props} />;
}

export function StockMovementTable() {
    const table = useStockMovementTableState();
    const { data: movements, isLoading, isFetching } = useStockMovements(table.queryParams);

    const isDataLoading = isLoading || isFetching;

    return (
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-slate-100 hover:bg-transparent">
                            <TableHead className="w-12 text-center">#</TableHead>
                            <TableHead className="font-bold">Barang</TableHead>
                            <TableHead className="font-bold">Lokasi</TableHead>
                            <TableHead className="font-bold text-center">Tipe Log</TableHead>
                            <TableHead className="font-bold text-center">Qty. Move</TableHead>
                            <TableHead className="font-bold text-center">Stok Akhir</TableHead>
                            <TableHead className="font-bold text-center">Waktu</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isDataLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-slate-50">
                                    <TableCell><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
                                    <TableCell><div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-20" /></div></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 mx-auto rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24 mx-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : movements?.data && movements.data.length > 0 ? (
                            movements.data.map((item, index) => {
                                const MoveIcon = movementConfig[item.movement_type]?.icon || History;
                                return (
                                    <TableRow key={item.id} className="border-slate-50/50 group hover:bg-slate-50/30 transition-colors">
                                        <TableCell className="text-center text-xs text-muted-foreground font-medium tabular-nums">
                                            {(table.queryParams.page! - 1) * table.queryParams.take! + index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-slate-700">{item.product?.name}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-tight">{item.product?.code}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {item.location_type === "WAREHOUSE" ? <WarehouseIcon size={12} className="text-indigo-500" /> : <Store size={12} className="text-emerald-500" />}
                                                <span className="text-xs font-semibold text-slate-600">
                                                    {item.warehouse?.name || item.outlet?.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className={cn(movementConfig[item.movement_type]?.color, "shadow-none text-[10px] uppercase font-bold tracking-wider rounded-lg border px-2 py-0.5 inline-flex items-center gap-1")}>
                                                <MoveIcon size={10} />
                                                {movementConfig[item.movement_type]?.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className={cn(
                                                "inline-flex items-center justify-center font-black tabular-nums text-sm",
                                                ["IN", "TRANSFER_IN", "INITIAL", "ADJUSTMENT"].includes(item.movement_type) ? "text-emerald-600" : "text-rose-600"
                                            )}>
                                                {["IN", "TRANSFER_IN", "INITIAL"].includes(item.movement_type) ? "+" : "-"}
                                                {formatNumber(item.quantity)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-bold text-slate-900 tabular-nums">
                                            {formatNumber(item.qty_after)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center gap-0.5">
                                                <div className="flex items-center gap-1 text-xs font-medium text-slate-600 tabular-nums">
                                                    <Calendar size={12} className="text-slate-400" />
                                                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {new Date(item.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-60 text-center text-muted-foreground bg-slate-50/20">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <History className="h-10 w-10 opacity-10" />
                                        <p className="text-sm font-medium">Belum ada riwayat pergerakan stok.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            {movements && movements.len > 0 && (
                <div className="p-4 border-t bg-slate-50/30">
                    <PaginationControls
                        page={table.queryParams.page!}
                        pageSize={table.queryParams.take!}
                        total={movements.len}
                        onPageChange={table.setPage}
                        onPageSizeChange={table.setPageSize}
                    />
                </div>
            )}
        </Card>
    );
}
