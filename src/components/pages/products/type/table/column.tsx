"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "@/components/ui/table/sortable";
import { ResponseTypeDTO } from "@/app/(application)/products/(component)/type/server/type.schema";
import { useActionType } from "@/app/(application)/products/(component)/type/server/use.type";
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
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

type Props = {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    onSort: (key: string) => void;
};

export const TypeColumns = ({
    sortBy,
    sortOrder,
    onSort,
}: Props): ColumnDef<ResponseTypeDTO>[] => [
    {
        accessorKey: "name",
        enableHiding: false,
        header: () => (
            <SortableHeader
                label="Nama Tipe"
                sortKey="name"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <span className="font-medium">{row.original.name}</span>
        ),
    },
    {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.slug}</span>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            return <DialogDelete data={row.original} />;
        },
    },
];

function DialogDelete({ data }: { data: ResponseTypeDTO }) {
    const [confirm, setConfirm] = useState<string>("");
    const [err, setErr] = useState<string>("");
    const { remove } = useActionType();
    
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

        await remove.mutateAsync(id);
    };

    return (
        <Dialog>
            <DialogTrigger className="text-rose-500 cursor-pointer">
                {remove.isPending ? <Loader2 className="animate-spin" /> : <Trash2 size={16} />}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-semibold text-lg">
                        Hapus Tipe Produk
                    </DialogTitle>
                    <DialogDescription>
                        Apakah anda yakin untuk menghapus tipe produk{" "}
                        <span className="px-1 rounded bg-gray-100 font-medium">{data.name}</span>?
                        Tindakan ini permanen.
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
                        placeholder="Tulis kembali nama tipe produk"
                        disabled={remove.isPending}
                    />
                    {err && <small className="text-rose-500">{err}</small>}
                </div>
                <DialogFooter>
                    <Button size="sm"  variant={"destructive"}
                        type="button"
                        
                        onClick={() => onConfirm(data.id)}
                        disabled={remove.isPending}
                    >
                        {remove.isPending ? <Loader2 className="animate-spin" /> : "Yakin, Hapus"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
