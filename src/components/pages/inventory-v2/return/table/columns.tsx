"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ResponseReturnDTO } from "@/app/(application)/inventory-v2/return/server/return.schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Truck, CheckCircle, XCircle } from "lucide-react";

export const getReturnStatusBadge = (status: string) => {
    switch (status) {
        case "DRAFT":
            return (
                <Badge
                    variant="secondary"
                    className="bg-zinc-100 text-zinc-600 border-zinc-200 font-bold whitespace-nowrap text-[10px] uppercase"
                >
                    Draft
                </Badge>
            );
        case "SHIPPING":
            return (
                <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-600 border-blue-200 font-bold whitespace-nowrap text-[10px] uppercase"
                >
                    Shipping
                </Badge>
            );
        case "RECEIVED":
        case "COMPLETED":
            return (
                <Badge
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-600 border-emerald-200 font-bold whitespace-nowrap text-[10px] uppercase"
                >
                    Received
                </Badge>
            );
        case "CANCELLED":
            return (
                <Badge variant="destructive" className="whitespace-nowrap text-[10px] uppercase">
                    Cancelled
                </Badge>
            );
        default:
            return (
                <Badge variant="outline" className="whitespace-nowrap text-[10px] uppercase">
                    {status}
                </Badge>
            );
    }
};

interface ColumnProps {
    onDetail: (id: number) => void;
    onUpdateStatus: (id: number, status: string) => void;
}

export const ReturnColumns = ({
    onDetail,
    onUpdateStatus,
}: ColumnProps): ColumnDef<ResponseReturnDTO>[] => [
    {
        accessorKey: "return_number",
        header: "No Retur",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-bold text-zinc-900 whitespace-nowrap text-[11px] uppercase tracking-tight">
                    {row.original.return_number}
                </span>
                {row.original.source_transfer && (
                    <div className="flex items-center gap-1 mt-0.5 text-[9px] text-zinc-400 font-medium">
                        <span>REF: {row.original.source_transfer.transfer_number}</span>
                    </div>
                )}
            </div>
        ),
    },
    {
        id: "date",
        header: "Tanggal",
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return (
                <span className="font-bold whitespace-nowrap text-[10px] text-zinc-500 uppercase">
                    {date.toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
                </span>
            );
        },
    },
    {
        id: "from",
        header: "Asal (Returner)",
        cell: ({ row }) => {
            const name = row.original.from_warehouse?.name || row.original.from_outlet?.name || "-";
            return (
                <div className="flex flex-col">
                    <span className="font-bold text-zinc-700 whitespace-nowrap text-[11px] uppercase">
                        {name}
                    </span>
                    <span className="text-[9px] text-zinc-400 font-bold uppercase">
                        {row.original.from_type}
                    </span>
                </div>
            );
        },
    },
    {
        id: "to",
        header: "Tujuan (Gudang)",
        cell: ({ row }) => {
            return (
                <span className="text-zinc-600 font-bold whitespace-nowrap text-[11px] uppercase">
                    {row.original.to_warehouse?.name || "-"}
                </span>
            );
        },
    },
    {
        id: "items_count",
        header: "Total SKU",
        cell: ({ row }) => {
            return (
                <Badge variant="outline" className="font-bold text-zinc-900 text-[10px] bg-white border-zinc-100">
                    {row.original.items?.length || 0} ITEMS
                </Badge>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return getReturnStatusBadge(row.original.status);
        },
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const status = row.original.status;
            const canShip = status === "DRAFT";
            const canReceive = status === "SHIPPING";
            const canCancel = status === "DRAFT" || status === "SHIPPING";

            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 border border-transparent hover:border-zinc-200">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4 text-zinc-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px] p-1 shadow-xl border-zinc-200">
                            <DropdownMenuItem 
                                className="text-xs font-bold gap-2 py-2 cursor-pointer"
                                onClick={() => onDetail(row.original.id)}
                            >
                                <Eye className="h-3.5 w-3.5 text-zinc-400" />
                                DETAIL RETUR
                            </DropdownMenuItem>
                            
                            {(canShip || canReceive || canCancel) && <DropdownMenuSeparator />}
                            
                            {canShip && (
                                <DropdownMenuItem 
                                    className="text-xs font-bold gap-2 py-2 text-blue-600 focus:text-blue-700 focus:bg-blue-50 cursor-pointer"
                                    onClick={() => onUpdateStatus(row.original.id, "SHIPPING")}
                                >
                                    <Truck className="h-3.5 w-3.5" />
                                    KIRIM BARANG
                                </DropdownMenuItem>
                            )}

                            {canReceive && (
                                <DropdownMenuItem 
                                    className="text-xs font-bold gap-2 py-2 text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 cursor-pointer"
                                    onClick={() => onUpdateStatus(row.original.id, "RECEIVED")}
                                >
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    TERIMA BARANG
                                </DropdownMenuItem>
                            )}

                            {canCancel && (
                                <DropdownMenuItem 
                                    className="text-xs font-bold gap-2 py-2 text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer"
                                    onClick={() => onUpdateStatus(row.original.id, "CANCELLED")}
                                >
                                    <XCircle className="h-3.5 w-3.5" />
                                    BATALKAN RETUR
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
