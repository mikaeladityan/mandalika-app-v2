"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Pencil, Settings2 } from "lucide-react";

import { ResponseWarehouseDTO } from "@/app/(application)/warehouses/server/warehouse.schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SortableHeader } from "@/components/ui/table/sortable";
import { cn } from "@/lib/utils";
import { DeletedWarehouse } from "./index";

type WarehouseColumnsProps = {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    onSort: (key: string) => void;
    onEdit?: (id: number) => void;
};

export const WarehouseColumns = ({
    sortBy,
    sortOrder,
    onSort,
    onEdit,
}: WarehouseColumnsProps): ColumnDef<ResponseWarehouseDTO>[] => [
    {
        id: "code",
        accessorKey: "code",
        header: () => (
            <SortableHeader
                label="KODE"
                sortKey="code"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <span className="font-mono font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                {row.original.code || "-"}
            </span>
        ),
    },
    {
        id: "name",
        accessorKey: "name",
        header: () => (
            <SortableHeader
                label="NAMA GUDANG"
                sortKey="name"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <Link
                href={`/warehouses/${row.original.id}`}
                className="hover:underline font-bold text-slate-800"
            >
                {row.original.name}
            </Link>
        ),
    },
    {
        id: "type",
        accessorKey: "type",
        header: "TIPE",
        cell: ({ row }) => {
            const isFG = row.original.type === "FINISH_GOODS";
            return (
                <Badge
                    variant="outline"
                    className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded-lg border-none",
                        isFG ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                    )}
                >
                    {isFG ? "FG - BARANG JADI" : "RM - BAHAN BAKU"}
                </Badge>
            );
        },
    },
    {
        id: "address",
        header: "ALAMAT",
        cell: ({ row }) => {
            const addr = row.original.warehouse_address;
            if (!addr) return <span className="text-slate-400">-</span>;
            return (
                <div className="flex flex-col text-[11px] leading-tight text-slate-500 font-medium">
                    <span>{addr.city}, {addr.province}</span>
                    <span className="text-[10px] text-slate-400">{addr.district}</span>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "AKSI",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg border-slate-200 text-slate-500 hover:text-primary hover:bg-slate-50"
                    onClick={() => onEdit?.(row.original.id)}
                >
                    <Settings2 size={14} />
                </Button>
                <DeletedWarehouse data={row.original} />
            </div>
        ),
    },
];
