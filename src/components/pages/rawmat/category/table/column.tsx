"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { SortableHeader } from "@/components/ui/table/sortable";
import { ParseDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { ResponseRawMatCategoryDTO } from "@/app/(application)/rawmat/(component)/categories/server/category.schema";
import { useFormCategory } from "@/app/(application)/rawmat/(component)/categories/server/use.category";
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

type Props = {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    onSort: (key: string) => void;
    status?: StatusEnumDTO;
};

export const CategoryColumns = ({
    sortBy,
    sortOrder,
    onSort,
    status,
}: Props): ColumnDef<ResponseRawMatCategoryDTO>[] => [
    {
        accessorKey: "name",
        enableHiding: false,
        header: () => (
            <SortableHeader
                label="Nama Kategori"
                sortKey="name"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <Link href={`/rawmat/categories/${row.original.id}`}>
                <h1 className="font-medium underline">{row.original.name}</h1>
            </Link>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
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
            return <DialogDelete data={row.original} />;
        },
    },
];

function DialogDelete({ data }: { data: ResponseRawMatCategoryDTO }) {
    const [confirm, setConfirm] = useState<string>("");
    const [err, setErr] = useState<string>("");
    const { deleted } = useFormCategory();
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
                    <DialogTitle className="font-semibold text-lg">
                        Hapus Kategori Raw Material
                    </DialogTitle>
                    <DialogDescription>
                        Apakah anda yakin untuk menghapus kategori raw material{" "}
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
                        placeholder="Tulis kembali nama kategori raw material"
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
