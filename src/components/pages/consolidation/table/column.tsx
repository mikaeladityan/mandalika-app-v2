"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ConsolidationResponse } from "@/app/(application)/consolidation/server/consolidation.schema";
import { formatNumber } from "@/lib/utils";
import dayjs from "dayjs";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

import { Check, Trash2 } from "lucide-react";
import { useRecomendationV2Mutations } from "@/app/(application)/recomendation-v2/server/use.recomendation-v2";
import { Button } from "@/components/ui/button";
import { DialogAlert } from "@/components/ui/dialog/dialog.alert";

export const ConsolidationColumns = (): ColumnDef<ConsolidationResponse>[] => {
    return [
        {
            accessorKey: "material_name",
            header: "MATERIAL / BARCODE",
            cell: ({ row }) => {
                const mat = row.original;
                return (
                    <div className="flex flex-col min-w-[200px]">
                        <Link href={`/bom/${mat.barcode}/`} className="flex flex-col pr-4 group">
                            <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-600 truncate">
                                {mat.material_name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 uppercase">
                                {mat.barcode || "-"}
                            </span>
                        </Link>
                    </div>
                );
            },
            enableSorting: true,
        },
        {
            accessorKey: "supplier_name",
            header: "SUPPLIER",
            cell: ({ row }) => (
                <span className="font-bold text-xs text-slate-500">
                    {row.original.supplier_name || "-"}
                </span>
            ),
            enableSorting: true,
        },
        {
            accessorKey: "quantity",
            header: "ORDER QTY",
            cell: ({ row }) => (
                <span className="font-bold text-xs text-slate-800">
                    {formatNumber(row.original.quantity)} {row.original.uom?.toUpperCase()}
                </span>
            ),
            enableSorting: true,
        },
        {
            accessorKey: "moq",
            header: "MOQ",
            cell: ({ row }) => (
                <span className="text-xs text-slate-500">
                    {formatNumber(row.original.moq || 0)} {row.original.uom?.toUpperCase()}
                </span>
            ),
        },
        {
            accessorKey: "price",
            header: "HARGA SATUAN",
            cell: ({ row }) => (
                <span className="font-bold text-xs text-slate-600">
                    Rp {formatNumber(row.original.price || 0)}
                </span>
            ),
            enableSorting: true,
        },
        {
            id: "total_price",
            header: "TOTAL HARGA",
            cell: ({ row }) => {
                const total = (row.original.price || 0) * (row.original.quantity || 0);
                return (
                    <span className="font-bold text-xs text-amber-600">
                        Rp {formatNumber(total)}
                    </span>
                );
            },
        },
        {
            id: "status",
            header: "STATUS",
            cell: ({ row }) => {
                const isAcc = row.original.status === "ACC";
                return isAcc ? (
                    <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-600 border-emerald-200"
                    >
                        Posted
                    </Badge>
                ) : (
                    <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-600 border-amber-200"
                    >
                        Draft
                    </Badge>
                );
            },
        },
        {
            accessorKey: "pic_id",
            header: "PIC",
            cell: ({ row }) => (
                <span className="text-xs text-slate-500">{row.original.pic_id || "System"}</span>
            ),
        },
        {
            accessorKey: "created_at",
            header: "TANGGAL PENGAJUAN",
            cell: ({ row }) => (
                <span className="text-[10px] text-slate-500">
                    {dayjs(row.original.created_at).format("DD MMM YYYY, HH:mm")}
                </span>
            ),
        },
        {
            id: "actions",
            header: "AKSI",
            cell: ({ row }) => {
                const { approveOrder, deleteOrder } = useRecomendationV2Mutations();
                const { mutate: approve, isPending: isApproving } = approveOrder;
                const { mutate: del, isPending: isDeleting } = deleteOrder;
                const isAcc = row.original.status === "ACC";

                if (isAcc) return null;

                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            onClick={() =>
                                approve({
                                    id: row.original.recommendation_id as number,
                                })
                            }
                            disabled={isApproving || isDeleting}
                            title="Setujui & Buat Pengajuan Resmi"
                        >
                            <Check className="h-4 w-4" />
                        </Button>

                        <DialogAlert
                            label={<Trash2 className="h-4 w-4" />}
                            title="Hapus Draft Konsolidasi"
                            onClick={async () => {
                                del(row.original.recommendation_id as number);
                            }}
                        >
                            <p className="text-sm text-slate-600 mt-1">
                                Apakah Anda yakin ingin menghapus draft konsolidasi{" "}
                                <span className="font-bold text-slate-900">
                                    {row.original.material_name}
                                </span>
                                ? Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </DialogAlert>
                    </div>
                );
            },
        },
    ];
};
