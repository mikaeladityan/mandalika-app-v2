"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ResponseDeliveryOrderDTO } from "@/app/(application)/inventory-v2/do/server/do.schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const getDOStatusBadge = (status: string) => {
    switch (status) {
        case "PENDING":
        case "PACKING": // mapping for UI context
            return <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 border-zinc-200 font-bold whitespace-nowrap">Packing</Badge>;
        case "SHIPMENT":
            return <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-200 font-bold whitespace-nowrap">Shipping</Badge>;
        case "RECEIVED":
        case "COMPLETED":
        case "FULFILLMENT":
            return <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-200 font-bold whitespace-nowrap">Received</Badge>;
        case "CANCELLED":
            return <Badge variant="destructive" className="whitespace-nowrap">Cancelled</Badge>;
        default:
            return <Badge variant="outline" className="whitespace-nowrap">{status}</Badge>;
    }
};

interface ColumnProps {
    onDetail: (id: number) => void;
}

export const DOColumns = ({ onDetail }: ColumnProps): ColumnDef<ResponseDeliveryOrderDTO>[] => [
    {
        accessorKey: "transfer_number",
        header: "No DO",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col gap-1">
                    <span className="font-semibold text-zinc-900 whitespace-nowrap">{row.original.transfer_number}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "barcode",
        header: "Barcode",
        cell: ({ row }) => <span className="font-mono text-[10px] text-zinc-500">{row.original.barcode}</span>,
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
                    <span className="font-medium whitespace-nowrap">{date.toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
            );
        },
    },
    {
        id: "destination",
        header: "Tujuan",
        cell: ({ row }) => {
            return <span className="font-medium text-zinc-700 whitespace-nowrap">{row.original.to_outlet?.name || "-"}</span>;
        },
    },
    {
        id: "source",
        header: "Gudang Asal",
        cell: ({ row }) => {
            return <span className="text-zinc-600 whitespace-nowrap">{row.original.from_warehouse?.name || "-"}</span>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return getDOStatusBadge(row.original.status);
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
