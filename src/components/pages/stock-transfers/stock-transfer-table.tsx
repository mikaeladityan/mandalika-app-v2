"use client";

import { 
    Package, 
    ArrowRight, 
    Calendar, 
    Hash, 
    MoreHorizontal, 
    Eye,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Box,
    Store,
    Warehouse as WarehouseIcon
} from "lucide-react";
import Link from "next/link";
import { useStockTransfers, useStockTransferTableState } from "@/app/(application)/stock-transfers/server/use.stock-transfer";
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
import { TRANSFER_STATUS } from "@/shared/types";

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
                                <SelectItem key={s} value={s.toString()} className="text-sm rounded-lg">{s} </SelectItem>
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

const statusConfig: Record<string, { label: string, color: string }> = {
    PENDING: { label: "Pending", color: "bg-amber-500" },
    APPROVED: { label: "Disetujui", color: "bg-blue-500" },
    SHIPMENT: { label: "Pengiriman", color: "bg-indigo-500" },
    RECEIVED: { label: "Diterima", color: "bg-emerald-500" },
    FULFILLMENT: { label: "Fulfilment", color: "bg-purple-500" },
    COMPLETED: { label: "Selesai", color: "bg-green-600" },
    PARTIAL: { label: "Partial", color: "bg-orange-500" },
    MISSING: { label: "Hilang", color: "bg-rose-500" },
    REJECTED: { label: "Ditolak", color: "bg-rose-600" },
    CANCELLED: { label: "Batal", color: "bg-slate-500" },
};

export function StockTransferTable() {
    const table = useStockTransferTableState();
    const { data: transfers, isLoading, isFetching } = useStockTransfers(table.queryParams);

    const isDataLoading = isLoading || isFetching;

    return (
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-slate-100 hover:bg-transparent">
                            <TableHead className="w-12 text-center">#</TableHead>
                            <TableHead className="font-bold">No. Transfer</TableHead>
                            <TableHead className="font-bold">Asal / Tujuan</TableHead>
                            <TableHead className="font-bold text-center">Status</TableHead>
                            <TableHead className="font-bold text-center">Tanggal</TableHead>
                            <TableHead className="w-16"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isDataLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-slate-50">
                                    <TableCell><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
                                    <TableCell><div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-20" /></div></TableCell>
                                    <TableCell><div className="flex items-center gap-3"><Skeleton className="h-8 w-24 rounded-lg" /><ArrowRight size={14} className="text-slate-300" /><Skeleton className="h-8 w-24 rounded-lg" /></div></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 mx-auto rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24 mx-auto" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 mx-auto rounded-lg" /></TableCell>
                                </TableRow>
                            ))
                        ) : transfers?.data && transfers.data.length > 0 ? (
                            transfers.data.map((item, index) => (
                                <TableRow key={item.id} className="border-slate-50/50 group hover:bg-slate-50/30 transition-colors">
                                    <TableCell className="text-center text-xs text-muted-foreground font-medium tabular-nums">
                                        {(table.queryParams.page! - 1) * table.queryParams.take! + index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-bold text-sm text-slate-700 tracking-tight">{item.transfer_number}</span>
                                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                                                <Hash size={10} /> {item.barcode}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                                {item.from_type === "WAREHOUSE" ? <WarehouseIcon size={12} className="text-indigo-500" /> : <Store size={12} className="text-emerald-500" />}
                                                <span className="text-xs font-semibold text-slate-600 truncate max-w-[100px]">
                                                    {item.from_warehouse?.name || item.from_outlet?.name}
                                                </span>
                                            </div>
                                            <ArrowRight size={14} className="text-slate-300 shrink-0" />
                                            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                                {item.to_type === "WAREHOUSE" ? <WarehouseIcon size={12} className="text-indigo-500" /> : <Store size={12} className="text-emerald-500" />}
                                                <span className="text-xs font-semibold text-slate-600 truncate max-w-[100px]">
                                                    {item.to_warehouse?.name || item.to_outlet?.name}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={cn(statusConfig[item.status].color, "shadow-none text-[10px] uppercase font-bold tracking-wider rounded-lg px-2 shrink-0")}>
                                            {statusConfig[item.status].label}
                                        </Badge>
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
                                    <TableCell className="text-right">
                                        <Link href={`/stock-transfers/${item.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900">
                                                <Eye size={16} />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-60 text-center text-muted-foreground bg-slate-50/20">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Box className="h-10 w-10 opacity-10" />
                                        <p className="text-sm font-medium">Belum ada data transfer stok.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            {transfers && transfers.len > 0 && (
                <div className="p-4 border-t bg-slate-50/30">
                    <PaginationControls
                        page={table.queryParams.page!}
                        pageSize={table.queryParams.take!}
                        total={transfers.len}
                        onPageChange={table.setPage}
                        onPageSizeChange={table.setPageSize}
                    />
                </div>
            )}
        </Card>
    );
}
