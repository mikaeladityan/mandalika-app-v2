"use client";

import { ColumnDef } from "@tanstack/react-table";
import { GoodsReceiptDTO } from "@/app/(application)/inventory-v2/gr/server/gr.schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle2, MoreHorizontal, XCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface ColumnProps {
    onDetail: (id: number) => void;
    onPost: (id: number) => void;
    onCancel: (id: number) => void;
}

export const GRColumns = ({ onDetail, onPost, onCancel }: ColumnProps): ColumnDef<GoodsReceiptDTO>[] => [
    {
        accessorKey: "gr_number",
        header: "No. GR",
        cell: ({ row }) => (
            <span className="font-mono font-bold text-slate-600">{row.original.gr_number}</span>
        ),
    },
    {
        accessorKey: "date",
        header: "Tanggal",
        cell: ({ row }) => {
            const dateStr = row.original.date || row.original.created_at;
            let displayDate = "-";
            try {
                displayDate = dateStr ? format(new Date(dateStr), "dd MMM yyyy") : "-";
            } catch (e) {
                displayDate = format(new Date(row.original.created_at), "dd MMM yyyy");
            }
            return <span className="text-zinc-500">{displayDate}</span>;
        },
    },
    {
        accessorKey: "warehouse.name",
        header: "Gudang",
        cell: ({ row }) => (
            <span className="font-medium text-slate-800">{row.original.warehouse.name}</span>
        ),
    },
    {
        accessorKey: "type",
        header: "Tipe",
        cell: ({ row }) => (
            <Badge variant="outline" className="text-zinc-500 border-zinc-200 font-semibold uppercase">
                {row.original.type.toLowerCase().replace("_", " ")}
            </Badge>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <Badge
                    variant={
                        status === "COMPLETED"
                            ? "default"
                            : status === "PENDING"
                              ? "secondary"
                              : "destructive"
                    }
                    className="font-bold uppercase"
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "_count.items",
        header: "Total Item",
        cell: ({ row }) => (
            <span className="font-bold text-slate-700">{row.original._count?.items || 0} SKU</span>
        ),
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const id = row.original.id;
            const status = row.original.status;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onDetail(id)}>
                            <Eye className="mr-2 h-4 w-4" /> Detail
                        </DropdownMenuItem>
                        {status === "PENDING" && (
                            <>
                                <DropdownMenuItem onClick={() => onPost(id)}>
                                    <CheckCircle2 className="mr-2 h-4 w-4" /> Post/Finalize
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onCancel(id)}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    <XCircle className="mr-2 h-4 w-4" /> Batalkan
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
