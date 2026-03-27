"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Ban, Clock, Heart, LucideCircleFadingPlus, Pencil, Trash2 } from "lucide-react";

import { ResponseProductDTO } from "@/app/(application)/products/server/products.schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SortableHeader } from "@/components/ui/table/sortable";
import { cn, ParseDate } from "@/lib/utils";
import { StatusEnumDTO } from "@/shared/types";

type ProductColumnsProps = {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    onSort: (key: string) => void;
    onEdit?: (id: number) => void;
};

export const ProductColumns = ({
    sortBy,
    sortOrder,
    onSort,
    onEdit,
}: ProductColumnsProps): ColumnDef<ResponseProductDTO>[] => [
    {
        id: "code",
        accessorKey: "code",
        header: () => (
            <SortableHeader
                label="KODE FG"
                sortKey="code"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <span className="font-mono font-bold text-slate-600">{row.original.code}</span>
        ),
    },
    {
        id: "name",
        accessorKey: "name",
        enableHiding: false,
        header: () => (
            <SortableHeader
                label="NAMA PRODUK"
                sortKey="name"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <Link
                href={`/products/${row.original.id}`}
                className="hover:underline font-medium text-slate-800"
            >
                {row.original.size?.size}
                {row.original.unit?.name.toLocaleUpperCase()} {row.original.gender} -{" "}
                {row.original.name.toLocaleUpperCase()}
            </Link>
        ),
    },
    {
        id: "type",
        accessorKey: "product_type",
        enableHiding: true,
        header: "KATEGORI",
        cell: ({ row }) => (
            <span className="text-zinc-500 font-semibold uppercase">
                {row.original.product_type?.name}
            </span>
        ),
    },
    {
        id: "size",
        enableHiding: true,
        header: () => (
            <SortableHeader
                label="SATUAN"
                sortKey="size"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <div className="font-bold text-slate-700">
                {row.original.size?.size} {row.original.unit?.name}
            </div>
        ),
    },
    {
        id: "status",
        accessorKey: "status",
        enableHiding: true,
        header: "STATUS",
        cell: ({ row }) => <BadgeStatus status={row.original.status as StatusEnumDTO} />,
    },
    {
        id: "actions",
        header: "AKSI",
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-right-1 duration-200">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] py-0 px-2 font-bold bg-white hover:bg-zinc-50 border-zinc-200"
                    asChild
                >
                    <Link href={`/products/${row.original.id}`}>Detail</Link>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] py-0 px-2 font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 cursor-pointer"
                    onClick={() => onEdit?.(row.original.id)}
                >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                </Button>
            </div>
        ),
    },

    {
        id: "created_at",
        accessorKey: "created_at",
        header: "PEMBUATAN",
        cell: ({ row }) => (
            <span className="text-zinc-500">{ParseDate(row.original.created_at)}</span>
        ),
    },
    {
        id: "updated_at",
        accessorKey: "updated_at",
        header: "UPDATE",
        cell: ({ row }) => (
            <span className="text-zinc-500">{ParseDate(row.original.updated_at)}</span>
        ),
    },
    {
        id: "distribution_percentage",
        accessorKey: "distribution_percentage",
        header: "EDAR (%)",
        cell: ({ row }) => (
            <div className="font-mono text-blue-600 font-bold">
                {((row.original.distribution_percentage ?? 0) * 100).toFixed(0)}%
            </div>
        ),
    },
    {
        id: "safety_percentage",
        accessorKey: "safety_percentage",
        header: "SAFETY (%)",
        cell: ({ row }) => (
            <div className="font-mono text-emerald-600 font-bold">
                {((row.original.safety_percentage ?? 0) * 100).toFixed(0)}%
            </div>
        ),
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
