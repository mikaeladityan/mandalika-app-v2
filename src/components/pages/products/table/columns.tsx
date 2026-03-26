"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
    Ban,
    Clock,
    DatabaseBackup,
    Heart,
    Loader2,
    LucideCircleFadingPlus,
    Trash2,
} from "lucide-react";

import { ResponseProductDTO } from "@/app/(application)/products/server/products.schema";
// import { useActionProduct } from "@/app/(application)/products/server/use.products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SortableHeader } from "@/components/ui/table/sortable";
import { cn, ParseDate } from "@/lib/utils";
import { StatusEnumDTO } from "@/shared/types";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type ProductColumnsProps = {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    onSort: (key: string) => void;
};

export const ProductColumns = ({
    sortBy,
    sortOrder,
    onSort,
}: ProductColumnsProps): ColumnDef<ResponseProductDTO>[] => [
    {
        id: "name",
        accessorKey: "name",
        enableHiding: false, // ❗ biasanya kolom utama tidak boleh di-hide
        header: () => (
            <SortableHeader
                label="Nama Produk"
                sortKey="name"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <>
                <Link href={`/products/${row.original.id}`}>
                    <h2 className="font-medium underline">{row.original.name}</h2>
                    <span className="text-xs text-gray-500">{row.original.code}</span>
                </Link>
            </>
        ),
    },
    {
        id: "gender",
        accessorKey: "gender",
        enableHiding: true,
        header: "Gender",
        cell: ({ row }) => {
            const g = row.original.gender;
            return g === "WOMEN" ? "Wanita" : g === "MEN" ? "Pria" : "Unisex";
        },
    },
    {
        id: "type",
        accessorKey: "product_type",
        enableHiding: true,
        header: "Tipe Produk",
        cell: ({ row }) => row.original.product_type?.name.toUpperCase(),
    },
    {
        id: "size",
        enableHiding: true,
        header: () => (
            <SortableHeader
                label="Ukuran"
                sortKey="size"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <div className="uppercase font-bold text-slate-700">
                {row.original.size?.size} {row.original.unit?.name}
            </div>
        ),
    },
    {
        id: "created_at",
        accessorKey: "created_at",
        enableHiding: true,
        header: () => (
            <SortableHeader
                label="Pembuatan"
                sortKey="created_at"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => <>{ParseDate(row.original.created_at)} WIB</>,
    },
    {
        id: "updated_at",
        accessorKey: "updated_at",
        enableHiding: true,
        header: () => (
            <SortableHeader
                label="Update"
                sortKey="updated_at"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => <>{ParseDate(row.original.updated_at)} WIB</>,
    },
    {
        id: "distribution_percentage",
        accessorKey: "distribution_percentage",
        header: () => (
            <SortableHeader
                label="Edar (%)"
                sortKey="distribution_percentage"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <div className="font-mono text-blue-600 font-bold">
                {((row.original.distribution_percentage ?? 0) * 100).toFixed(0)}%
            </div>
        ),
    },
    {
        id: "safety_percentage",
        accessorKey: "safety_percentage",
        header: () => (
            <SortableHeader
                label="Safety (%)"
                sortKey="safety_percentage"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <div className="font-mono text-emerald-600 font-bold">
                {((row.original.safety_percentage ?? 0) * 100).toFixed(0)}%
            </div>
        ),
    },
    {
        id: "status",
        accessorKey: "status",
        enableHiding: true,
        header: "Status",
        cell: ({ row }) => <BadgeStatus status={row.original.status as StatusEnumDTO} />,
    },
];

/* ===== Badge Status tetap ===== */

type BadgeStatusProps = {
    status: StatusEnumDTO;
    className?: string;
};

const STATUS_STYLE: Record<
    StatusEnumDTO,
    {
        label: string;
        className: string;
        icon: React.ElementType;
        iconClassName: string;
    }
> = {
    PENDING: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: Clock,
        iconClassName: "text-yellow-700",
    },
    ACTIVE: {
        label: "Aktif",
        className: "bg-green-100 text-green-800 border-green-300",
        icon: LucideCircleFadingPlus,
        iconClassName: "text-green-700",
    },
    FAVOURITE: {
        label: "Favorit",
        className: "bg-pink-100 text-pink-800 border-pink-300",
        icon: Heart,
        iconClassName: "text-pink-700",
    },
    BLOCK: {
        label: "Diblokir",
        className: "bg-red-100 text-red-800 border-red-300",
        icon: Ban,
        iconClassName: "text-red-700",
    },
    DELETE: {
        label: "Dihapus",
        className: "bg-rose-100 text-rose-500 border-rose-300 line-through",
        icon: Trash2,
        iconClassName: "text-rose-500",
    },
};

function BadgeStatus({ status, className }: BadgeStatusProps) {
    const cfg = STATUS_STYLE[status];
    if (!cfg) return null;
    const Icon = cfg.icon;

    return (
        <Badge className={cn("flex gap-1.5", cfg.className, className)}>
            <Icon size={12} className={cfg.iconClassName} />
            {cfg.label}
        </Badge>
    );
}
