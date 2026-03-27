"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { SortableHeader } from "@/components/ui/table/sortable";
import { ParseDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Pencil } from "lucide-react";
import { useFormCategory } from "@/app/(application)/rawmat/(component)/categories/server/use.category";
import { StatusEnumDTO } from "@/shared/types";
import { ResponseRawMaterialUnitDTO } from "@/app/(application)/rawmat/(component)/units/server/unit.schema";
import { useFormUnit } from "@/app/(application)/rawmat/(component)/units/server/use.unit";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

type Props = {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    onSort: (key: string) => void;
    onEdit?: (id: number) => void;
};

export const UnitColumns = ({
    sortBy,
    sortOrder,
    onSort,
    onEdit,
}: Props): ColumnDef<ResponseRawMaterialUnitDTO>[] => [
    {
        accessorKey: "name",
        enableHiding: false,
        header: () => (
            <SortableHeader
                label="Nama Satuan"
                sortKey="name"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <Link href={`/rawmat/units/${row.original.id}`}>
                <h1 className="font-medium underline">{row.original.name}</h1>
            </Link>
        ),
    },

    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                        onClick={() => onEdit?.(row.original.id)}
                    >
                        <Pencil size={16} />
                    </Button>
                    <DialogDelete data={row.original} />
                </div>
            );
        },
    },
];

function DialogDelete({ data }: { data: ResponseRawMaterialUnitDTO }) {
    const [confirm, setConfirm] = useState<string>("");
    const [err, setErr] = useState<string>("");
    const { deleted } = useFormUnit();
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
                    {deleted.isPending ? <Loader2 className="animate-spin" /> : <Trash2 size={16} />}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-semibold text-lg">
                        Hapus Satuan (UOM) Raw Material
                    </DialogTitle>
                    <DialogDescription>
                        Apakah anda yakin untuk menghapus satuan raw material{" "}
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
                        placeholder="Tulis kembali nama unit raw material"
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
