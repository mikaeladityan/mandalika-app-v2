"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ResponseTransferGudangDTO } from "@/app/(application)/inventory-v2/tg/server/tg.schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const getTGStatusBadge = (status: string) => {
    switch (status) {
        case "PENDING":
        case "PACKING":
            return (
                <Badge
                    variant="secondary"
                    className="bg-zinc-100 text-zinc-600 border-zinc-200 font-bold whitespace-nowrap"
                >
                    Packing
                </Badge>
            );
        case "SHIPMENT":
            return (
                <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-600 border-blue-200 font-bold whitespace-nowrap"
                >
                    Shipping
                </Badge>
            );
        case "RECEIVED":
        case "FULFILLMENT":
            return (
                <Badge
                    variant="secondary"
                    className="bg-purple-50 text-purple-600 border-purple-200 font-bold whitespace-nowrap"
                >
                    Received
                </Badge>
            );
        case "COMPLETED":
            return (
                <Badge
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-600 border-emerald-200 font-bold whitespace-nowrap"
                >
                    Done / Completed
                </Badge>
            );
        case "CANCELLED":
            return (
                <Badge variant="destructive" className="whitespace-nowrap">
                    Cancelled
                </Badge>
            );
        default:
            return (
                <Badge variant="outline" className="whitespace-nowrap">
                    {status}
                </Badge>
            );
    }
};

interface ColumnProps {
    onDetail: (id: number) => void;
}

export const TGColumns = ({ onDetail }: ColumnProps): ColumnDef<ResponseTransferGudangDTO>[] => [
    {
        accessorKey: "transfer_number",
        header: "No Transfer",
        cell: ({ row }) => {
            const hasDiscrepancy = row.original.items?.some(
                (item: any) => (Number(item.quantity_missing) || 0) > 0 || (Number(item.quantity_rejected) || 0) > 0
            );

            return (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-900 whitespace-nowrap">
                            {row.original.transfer_number}
                        </span>
                        {hasDiscrepancy && row.original.status === "COMPLETED" && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge variant="outline" className="h-5 px-1.5 border-orange-200 bg-orange-50 text-orange-600 flex items-center gap-1 cursor-help">
                                            <AlertTriangle className="h-3 w-3" />
                                            <span className="text-[10px] font-bold">Selisih</span>
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">Terdapat barang hilang atau ditolak pada transfer ini.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "barcode",
        header: "Barcode",
        cell: ({ row }) => (
            <span className="font-mono text-[10px] text-zinc-500">{row.original.barcode}</span>
        ),
    },
    {
        id: "date",
        header: "Tanggal",
        cell: ({ row }) => {
            const dateStr = row.original.date || row.original.created_at;
            if (!dateStr) return "-";
            const date = new Date(dateStr);
            return (
                <div className="flex flex-col">
                    <span className="font-medium whitespace-nowrap">
                        {date.toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                </div>
            );
        },
    },
    {
        id: "source",
        header: "Asal Gudang",
        cell: ({ row }) => {
            return (
                <span className="text-zinc-600 whitespace-nowrap">
                    {row.original.from_warehouse?.name || "-"}
                </span>
            );
        },
    },
    {
        id: "destination",
        header: "Tujuan Gudang",
        cell: ({ row }) => {
            return (
                <span className="font-medium text-zinc-700 whitespace-nowrap">
                    {row.original.to_warehouse?.name || "-"}
                </span>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return getTGStatusBadge(row.original.status);
        },
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-primary hover:bg-primary/5 cursor-pointer"
                        onClick={() => onDetail(row.original.id)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
