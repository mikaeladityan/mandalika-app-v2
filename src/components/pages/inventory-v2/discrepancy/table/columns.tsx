"use client";

import { ResponseDiscrepancyDTO } from "@/app/(application)/inventory-v2/discrepancy/server/discrepancy.schema";
import { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, Home, Store, ArrowRightLeft } from "lucide-react";

export const DiscrepancyColumns: ColumnDef<ResponseDiscrepancyDTO>[] = [
    {
        accessorKey: "transfer.transfer_number",
        header: "No. Dokumen",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-bold text-zinc-900">
                    {row.original.transfer.transfer_number}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-medium">
                    {new Date(row.original.transfer.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
                </span>
            </div>
        ),
    },
    {
        id: "route",
        header: "Rute Transfer",
        cell: ({ row }) => {
            const t = row.original.transfer;
            const from = t.from_warehouse?.name || "Gudang";
            const to = t.to_outlet?.name || t.to_warehouse?.name || "Tujuan";
            const isTG = !!t.to_warehouse;

            return (
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-600">
                    <Home className="h-3 w-3 text-rose-500" />
                    <span>{from}</span>
                    <ArrowRightLeft className="h-3 w-3 text-zinc-300" />
                    {isTG ? (
                        <Home className="h-3 w-3 text-emerald-500" />
                    ) : (
                        <Store className="h-3 w-3 text-blue-500" />
                    )}
                    <span
                        className={isTG ? "text-emerald-700 font-bold" : "text-blue-700 font-bold"}
                    >
                        {to}
                    </span>
                </div>
            );
        },
    },
    {
        id: "product",
        header: "Produk Selisih",
        cell: ({ row }) => {
            const p = row.original.product;
            return (
                <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-primary text-[10px] tracking-tight uppercase">
                        {p.code}
                    </span>
                    <div className="flex flex-col">
                        <span className="text-slate-900 font-bold text-xs uppercase leading-tight">
                            {p.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                            {p.product_type?.name || "-"} • {p.size?.size || "-"} •{" "}
                            {p.unit?.name || "-"} • {p.gender || "-"}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "quantity_packed",
        header: "Pack",
        cell: ({ row }) => (
            <span className="font-mono font-bold text-zinc-500">
                {row.original.quantity_packed || row.original.quantity_requested}
            </span>
        ),
    },
    {
        accessorKey: "quantity_fulfilled",
        header: "Fulfillment",
        cell: ({ row }) => (
            <span className="font-mono font-bold text-emerald-600">
                {row.original.quantity_fulfilled || 0}
            </span>
        ),
    },
    {
        accessorKey: "quantity_missing",
        header: "Missing",
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5">
                <span
                    className={`font-mono font-bold ${row.original.quantity_missing > 0 ? "text-orange-600" : "text-zinc-300"}`}
                >
                    {row.original.quantity_missing}
                </span>
                {row.original.quantity_missing > 0 && (
                    <AlertTriangle className="h-3 w-3 text-orange-500" />
                )}
            </div>
        ),
    },
    {
        accessorKey: "quantity_rejected",
        header: "Rejected",
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5">
                <span
                    className={`font-mono font-bold ${row.original.quantity_rejected > 0 ? "text-rose-600" : "text-zinc-300"}`}
                >
                    {row.original.quantity_rejected}
                </span>
                {row.original.quantity_rejected > 0 && (
                    <AlertTriangle className="h-3 w-3 text-rose-500" />
                )}
            </div>
        ),
    },
];
