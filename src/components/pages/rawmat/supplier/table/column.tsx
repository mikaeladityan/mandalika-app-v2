"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { SortableHeader } from "@/components/ui/table/sortable";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useFormCategory } from "@/app/(application)/rawmat/(component)/categories/server/use.category";
import { ResponseSupplierDTO } from "@/app/(application)/rawmat/(component)/suppliers/server/supplier.schema";
import { ParseDate } from "@/lib/utils";
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
import { useState } from "react";
import { useFormSupplier } from "@/app/(application)/rawmat/(component)/suppliers/server/use.supplier";

type Props = {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    onSort: (key: string) => void;
};

export const SupplierColumns = ({
    sortBy,
    sortOrder,
    onSort,
}: Props): ColumnDef<ResponseSupplierDTO>[] => [
    {
        accessorKey: "name",
        enableHiding: false,
        header: () => (
            <SortableHeader
                label="Nama"
                sortKey="name"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <Link href={`/rawmat/suppliers/${row.original.id}`}>
                <h1 className="font-medium underline">{row.original.name}</h1>
                <p className="text-sm font-medium text-gray-500">{row.original.phone}</p>
            </Link>
        ),
    },

    {
        accessorKey: "country",
        enableHiding: false,
        header: () => (
            <SortableHeader
                label="Negara"
                sortKey="country"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => row.original.country,
    },

    {
        accessorKey: "created_at",
        enableHiding: false,
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
        enableHiding: false,
        header: () => (
            <SortableHeader
                label="Diupdate"
                sortKey="updated_at"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => ParseDate(row.original.updated_at),
    },

    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            return <DialogDelete data={row.original} />;
        },
    },
];
function DialogDelete({ data }: { data: ResponseSupplierDTO }) {
    const [confirm, setConfirm] = useState<string>("");
    const [err, setErr] = useState<string>("");
    const { deleted } = useFormSupplier();
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
                    <DialogTitle className="font-semibold text-lg">Hapus Supplier</DialogTitle>
                    <DialogDescription>
                        Apakah anda yakin untuk menghapus supplier{" "}
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
                        placeholder="Tulis kembali nama supplier"
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
