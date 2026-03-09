"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "@/components/ui/table/sortable";
import { ResponseProductStockDTO } from "@/app/(application)/products/stocks/server/product.stock.schema";
import { cn } from "@/lib/utils";

type ProductColumnsProps = {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    onSort: (key: string) => void;
};

export const ProductColumns = ({
    sortBy,
    sortOrder,
    onSort,
}: ProductColumnsProps): ColumnDef<ResponseProductStockDTO>[] => [
    {
        id: "name",
        accessorKey: "name",
        enableHiding: false, // ❗ biasanya kolom utama tidak boleh di-hide
        header: () => (
            <SortableHeader
                label="Nama Produk"
                sortKey="name"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <div>
                <h2 className="font-medium underline">{row.original.name}</h2>
                <span className="text-xs text-gray-500">{row.original.code}</span>
            </div>
        ),
    },
    {
        id: "gender",
        accessorKey: "gender",
        enableHiding: true,
        header: "Gender",
        cell: ({ row }) => {
            const g = row.original.gender;
            return g === "WOMEN" ? "Wanita" : g === "MEN" ? "Pria" : "Unisex";
        },
    },
    {
        id: "type",
        accessorKey: "type",
        enableHiding: true,
        header: "Tipe Produk",
        cell: ({ row }) => row.original.type?.toUpperCase(),
    },
    {
        id: "size",
        enableHiding: true,
        header: () => (
            <SortableHeader
                label="Ukuran"
                sortKey="size"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <div className="uppercase">
                {row.original.size} {row.original.uom}
            </div>
        ),
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
            const uom = row.original.uom.toUpperCase();

            // Logika threshold untuk warna background
            let bgClass = "bg-green-50 border border-green-200 text-green-900"; // Success (Aman)

            if (amount <= 10) {
                bgClass = "bg-red-50 border border-red-200 text-red-900"; // Danger (Kritis)
            } else if (amount <= 50) {
                bgClass = "bg-yellow-50 border border-yellow-200 text-yellow-900"; // Warning (Menipis)
            }

            return (
                // Menggunakan w-full dan padding agar bg menutupi area sel
                // Anda bisa menyesuaikan angka padding (px, py) dengan padding bawaan <td> di tabel Anda
                <div
                    className={cn(
                        "flex justify-end w-full px-3 py-2 -mx-2 -my-1 rounded-lg",
                        bgClass,
                    )}
                >
                    <span className="font-semibold text-right">{amount} PCS</span>
                </div>
            );
        },
    },
];
