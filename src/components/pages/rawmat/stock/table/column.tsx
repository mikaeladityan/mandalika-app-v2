"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "@/components/ui/table/sortable";
import { ResponseRawMatStockDTO } from "@/app/(application)/rawmat/stocks/server/rawmat.stock.schema";
import { cn } from "@/lib/utils";

type RawMatColumnsProps = {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    onSort: (key: string) => void;
};

export const RawMatColumns = ({
    sortBy,
    sortOrder,
    onSort,
}: RawMatColumnsProps): ColumnDef<ResponseRawMatStockDTO>[] => [
    {
        id: "name",
        accessorKey: "name",
        enableHiding: false, // ❗ biasanya kolom utama tidak boleh di-hide
        header: () => (
            <SortableHeader
                label="Bahan Baku"
                sortKey="name"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <div>
                <h2 className="font-medium underline">{row.original.name}</h2>
                <span className="text-xs text-gray-500">{row.original.barcode}</span>
            </div>
        ),
    },
    {
        id: "category",
        accessorKey: "category",
        enableHiding: true,
        header: "Kategori",
        cell: ({ row }) => row.original.category?.toUpperCase() ?? "UNKNOWN",
    },
    {
        id: "warehouse",
        accessorKey: "warehouse",
        enableHiding: true,
        header: "Gudang",
        cell: ({ row }) => row.original.warehouse?.name ?? "Total Keseluruhan",
    },
    {
        id: "amount",
        accessorKey: "amount",
        enableHiding: false,
        header: () => (
            <SortableHeader
                label="Stock Terkini"
                sortKey="amount"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => {
            const amount = Math.round(Number(row.original.amount));
            const uom = row.original.uom?.toLocaleUpperCase();

            // Logika threshold untuk warna background
            let bgClass = "bg-green-50 border border-green-200 text-green-900"; // Success (Aman)

            if (amount <= 10) {
                bgClass = "bg-red-50 border border-red-200 text-red-900"; // Danger (Kritis)
            } else if (amount <= 50) {
                bgClass = "bg-yellow-50 border border-yellow-200 text-yellow-900"; // Warning (Menipis)
            }

            return (
                <div
                    className={cn(
                        "flex justify-end w-full px-3 py-2 -mx-2 -my-1 rounded-lg",
                        bgClass,
                    )}
                >
                    <span className="font-semibold text-right">
                        {amount} {uom}
                    </span>
                </div>
            );
        },
    },
];
