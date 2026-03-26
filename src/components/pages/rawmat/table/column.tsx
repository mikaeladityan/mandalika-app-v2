"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "@/components/ui/table/sortable";
import { formatCurrency, ParseDate } from "@/lib/utils";
import {
    QueryRawMaterialDTO,
    ResponseRawMaterialDTO,
} from "@/app/(application)/rawmat/server/rawmat.schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DatabaseBackup,
    Loader2,
    Trash2,
    Package,
    Tag,
    Truck,
    Info,
    AlertCircle,
    Calendar,
    Clock,
} from "lucide-react";
import { useActionRawMat } from "@/app/(application)/rawmat/server/use.rawmat";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

type Props = {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    onSort: (key: string) => void;
    status?: QueryRawMaterialDTO["status"];
};

export const RawMaterialColumns = ({
    sortBy,
    sortOrder,
    onSort,
    status,
}: Props): ColumnDef<ResponseRawMaterialDTO>[] => [
    {
        accessorKey: "name",
        enableHiding: false,
        header: () => (
            <SortableHeader
                label="Nama Material"
                sortKey="name"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => {
            const name = row.original.name;
            const barcode = row.original.barcode;
            return (
                <Link
                    href={`/rawmat/${row.original.id}`}
                    className="group flex flex-col gap-0.5 max-w-[200px] py-1"
                >
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider bg-gray-50 px-1 rounded border border-gray-100">
                            {barcode}
                        </span>
                    </div>
                    <span className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2 decoration-primary/30 underline-offset-4 group-hover:underline">
                        {name}
                    </span>
                </Link>
            );
        },
    },

    {
        id: "category",
        header: () => (
            <SortableHeader
                label="Kategori"
                sortKey="category"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => {
            return row.original.raw_mat_category ? (
                <Link href={`/rawmat/categories/${row.original.raw_mat_category.id}`}>
                    <Badge
                        variant="outline"
                        className="bg-blue-50/30 text-blue-600 border-blue-100 hover:bg-blue-50 transition-colors pointer-events-none"
                    >
                        <Tag className="mr-1 size-3" />
                        {row.original.raw_mat_category.name}
                    </Badge>
                </Link>
            ) : (
                <span className="text-muted-foreground text-xs italic">Tanpa Kategori</span>
            );
        },
    },
    {
        id: "unit",
        header: "Unit",
        cell: ({ row }) => {
            return (
                <Link href={`/rawmat/units/${row.original.unit_raw_material.id}`}>
                    <Badge
                        variant="secondary"
                        className="font-medium bg-slate-100/50 text-slate-600 hover:bg-slate-100 transition-colors pointer-events-none"
                    >
                        {row.original.unit_raw_material.name}
                    </Badge>
                </Link>
            );
        },
    },

    {
        id: "supplier",
        header: () => (
            <SortableHeader
                label="Supplier"
                sortKey="supplier"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => {
            return row.original.supplier ? (
                <Link className="group" href={`/suppliers/${row.original.supplier.id}`}>
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 text-sm font-medium group-hover:text-primary transition-colors decoration-primary/30 group-hover:underline underline-offset-4">
                            <Truck className="size-3 text-muted-foreground" />
                            {row.original.supplier.name}
                        </div>
                        <span className="text-[10px] text-muted-foreground px-1 py-0 w-fit bg-gray-50 rounded border border-gray-100 uppercase font-medium">
                            {row.original.supplier.country}
                        </span>
                    </div>
                </Link>
            ) : (
                <span className="text-muted-foreground text-xs italic">-</span>
            );
        },
    },

    // {
    //     accessorKey: "current_stock",
    //     header: () => (
    //         <SortableHeader
    //             label="Live Stok"
    //             sortKey="current_stock"
    //             activeSortBy={sortBy}
    //             activeSortOrder={sortOrder}
    //             onSort={onSort}
    //         />
    //     ),
    //     cell: ({ row }) => {
    //         const stock = Number(row.original.current_stock ?? 0);
    //         const minStock = Number(row.original.min_stock ?? 0);
    //         const isLow = stock <= minStock;
    //         const uom = row.original.unit_raw_material?.name || "Unit";

    //         return (
    //             <div className="flex flex-col gap-1">
    //                 <div
    //                     className={cn(
    //                         "flex items-center gap-1.5 font-bold tabular-nums text-sm",
    //                         isLow ? "text-destructive" : "text-emerald-600",
    //                     )}
    //                 >
    //                     {isLow ? (
    //                         <AlertCircle size={14} className="animate-pulse" />
    //                     ) : (
    //                         <Package size={14} />
    //                     )}
    //                     <span>{formatNumber(stock)}</span>
    //                     <span className="text-[10px] font-medium text-muted-foreground/70 uppercase">
    //                         {uom}
    //                     </span>
    //                 </div>
    //             </div>
    //         );
    //     },
    // },
    {
        accessorKey: "min_stock",
        header: "Min Stok",
        cell: ({ row }) => (
            <div className="text-muted-foreground font-medium tabular-nums">
                {row.original.min_stock !== null
                    ? formatNumber(Number(row.original.min_stock))
                    : "-"}
            </div>
        ),
    },
    {
        accessorKey: "min_buy",
        header: "Min Beli",
        cell: ({ row }) => (
            <div className="text-muted-foreground font-medium tabular-nums">
                {row.original.min_buy !== null ? formatNumber(Number(row.original.min_buy)) : "-"}
            </div>
        ),
    },

    {
        accessorKey: "price",
        header: () => (
            <SortableHeader
                label="Harga"
                sortKey="price"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <div className="font-bold text-slate-900 tabular-nums">
                {formatCurrency(row.original.price)}
            </div>
        ),
    },

    {
        accessorKey: "created_at",
        header: () => (
            <SortableHeader
                label="Dibuat"
                sortKey="created_at"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <div className="flex flex-col gap-0.5 min-w-[100px]">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                    <Calendar className="size-3 text-muted-foreground" />
                    {ParseDate(row.original.created_at).split(",")[0]}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Clock className="size-3" />
                    {ParseDate(row.original.created_at).split(",")[1]}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "updated_at",
        header: () => (
            <SortableHeader
                label="Perubahan"
                sortKey="updated_at"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) =>
            row.original.updated_at ? (
                <div className="flex flex-col gap-0.5 min-w-[100px]">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                        <Calendar className="size-3 text-muted-foreground" />
                        {ParseDate(row.original.updated_at).split(",")[0]}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <Clock className="size-3" />
                        {ParseDate(row.original.updated_at).split(",")[1]}
                    </div>
                </div>
            ) : (
                <span className="text-muted-foreground text-[11px]">-</span>
            ),
    },

    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const { restore } = useActionRawMat();
            return status === "deleted" ? (
                <Button
                    size="icon"
                    variant="ghost"
                    className="text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50"
                    onClick={() => restore.mutateAsync({ id: row.original.id })}
                >
                    {restore.isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <DatabaseBackup size={16} />
                    )}
                </Button>
            ) : (
                <DialogDelete data={row.original} />
            );
        },
    },
];

function DialogDelete({ data }: { data: ResponseRawMaterialDTO }) {
    const [confirm, setConfirm] = useState<string>("");
    const [err, setErr] = useState<string>("");
    const { deleted } = useActionRawMat();
    const onConfirm = async (id: number) => {
        setErr("");

        if (!confirm) {
            setErr("Konfirmasi tidak boleh kosong");
            return;
        }

        if (confirm !== data.name) {
            setErr("Konfirmasi tidak valid");
            return;
        }

        await deleted.mutateAsync({ id });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                >
                    {deleted.isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <Trash2 size={16} />
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-rose-600 mb-2">
                        <AlertCircle size={20} />
                        <DialogTitle className="font-bold text-xl">Konfirmasi Hapus</DialogTitle>
                    </div>
                    <DialogDescription className="text-slate-600">
                        Anda akan menghapus data{" "}
                        <span className="font-bold text-slate-900 bg-slate-100 px-1 rounded">
                            {data.name}
                        </span>
                        . Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label
                            htmlFor="confirm"
                            className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1"
                        >
                            Tulis Nama Material untuk Konfirmasi
                        </label>
                        <Input
                            name="confirm"
                            className={cn(
                                "border-slate-200 focus:ring-rose-500 focus:border-rose-500 transition-all",
                                err && "border-rose-500 focus:ring-rose-500 focus:border-rose-500",
                            )}
                            onChange={(e) => setConfirm(e.target.value)}
                            value={confirm}
                            placeholder={data.name}
                            disabled={deleted.isPending}
                        />
                        {err && (
                            <div className="flex items-center gap-1.5 text-rose-500 px-1 pt-1 font-medium">
                                <AlertCircle size={12} />
                                <small className="text-[11px]">{err}</small>
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="destructive"
                        type="button"
                        className="w-full sm:w-auto font-bold"
                        onClick={() => onConfirm(data.id)}
                        disabled={deleted.isPending || confirm !== data.name}
                    >
                        {deleted.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menghapus...
                            </>
                        ) : (
                            "Ya, Hapus Material"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
