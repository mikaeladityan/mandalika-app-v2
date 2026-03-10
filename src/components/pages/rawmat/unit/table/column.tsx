"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { SortableHeader } from "@/components/ui/table/sortable";
import { ParseDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
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
};

export const UnitColumns = ({
    sortBy,
    sortOrder,
    onSort,
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
            return <DialogDelete data={row.original} />;
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
            <DialogTrigger className="text-rose-500 cursor-pointer">
                {deleted.isPending ? <Loader2 className="animate-spin" /> : <Trash2 size={16} />}
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
