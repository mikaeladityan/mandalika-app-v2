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
import { DatabaseBackup, Loader2, Trash2 } from "lucide-react";
import { useActionRawMat } from "@/app/(application)/rawmat/server/use.rawmat";

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
                <Link href={`/rawmat/${row.original.id}`}>
                    <p className="text-xs text-gray-500 font-semibold">{barcode}</p>
                    <h1 className="font-medium underline">{name}</h1>
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
                <Link
                    className="underline hover:text-blue-500"
                    href={`/rawmat/categories/${row.original.raw_mat_category.id}`}
                >
                    {row.original.raw_mat_category.name}
                </Link>
            ) : (
                "-"
            );
        },
    },
    {
        id: "unit",
        header: "Unit",
        cell: ({ row }) => {
            return (
                <Link
                    className="underline hover:text-blue-500"
                    href={`/rawmat/units/${row.original.unit_raw_material.id}`}
                >
                    {row.original.unit_raw_material.name}
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
                <Link
                    className="underline hover:text-blue-500"
                    href={`/suppliers/${row.original.supplier.id}`}
                >
                    {row.original.supplier.name} ({row.original.supplier.country})
                </Link>
            ) : (
                "-"
            );
        },
    },

    {
        accessorKey: "current_stock",
        header: () => (
            <SortableHeader
                label="Live Stok"
                sortKey="current_stock"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => {
            const stock = Math.round(Number(row.original.current_stock ?? 0));
            const uom = row.original.unit_raw_material?.name?.toUpperCase() || "UNIT";
            return (
                <div className="flex items-center gap-1 font-bold text-slate-700">
                    {stock.toLocaleString("id-ID")} {uom}
                </div>
            );
        },
    },
    {
        accessorKey: "min_stock",
        header: "Min Stok",
        cell: ({ row }) =>
            row.original.min_stock !== null
                ? Math.round(Number(row.original.min_stock)).toLocaleString("id-ID")
                : "-",
    },
    {
        accessorKey: "min_buy",
        header: "Min Beli",
        cell: ({ row }) =>
            row.original.min_buy !== null
                ? Math.round(Number(row.original.min_buy)).toLocaleString("id-ID")
                : "-",
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
        cell: ({ row }) => formatCurrency(row.original.price),
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
        cell: ({ row }) => ParseDate(row.original.created_at),
    },
    {
        accessorKey: "updated_at",
        header: () => (
            <SortableHeader
                label="Editing"
                sortKey="updated_at"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (row.original.updated_at ? ParseDate(row.original.updated_at) : "-"),
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
                    className="text-cyan-500"
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
            <DialogTrigger className="text-rose-500 cursor-pointer">
                {deleted.isPending ? <Loader2 className="animate-spin" /> : <Trash2 size={16} />}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-semibold text-lg">Hapus Raw Material</DialogTitle>
                    <DialogDescription>
                        Apakah anda yakin untuk menghapus raw material{" "}
                        <span className="px-1 rounded bg-gray-100 font-medium">{data.name}</span>?
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <label htmlFor="confirm" className="text-sm font-medium text-gray-700">
                        Konfirmasi
                    </label>
                    <Input
                        name="confirm"
                        onChange={(e) => setConfirm(e.target.value)}
                        value={confirm}
                        placeholder="Tulis kembali nama raw material"
                        disabled={deleted.isPending}
                    />
                    {err && <small className="text-rose-500">{err}</small>}
                </div>
                <DialogFooter>
                    <Button
                        variant={"teal"}
                        type="button"
                        size={"sm"}
                        onClick={() => onConfirm(data.id)}
                    >
                        {deleted.isPending ? <Loader2 className="animate-spin" /> : " Yakin"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
