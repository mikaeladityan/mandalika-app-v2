"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "@/components/ui/table/sortable";
import { ResponseProductStockDTO } from "@/app/(application)/products/stocks/server/product.stock.schema";
import { cn } from "@/lib/utils";

type ProductColumnsProps = {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    onSort: (key: string) => void;
    warehouseNames: string[];
    showTotal?: boolean;
};

export const ProductColumns = ({
    sortBy,
    sortOrder,
    onSort,
    warehouseNames,
    showTotal = true,
}: ProductColumnsProps): ColumnDef<ResponseProductStockDTO>[] => {
    const baseColumns: ColumnDef<ResponseProductStockDTO>[] = [
        {
            id: "name",
            accessorKey: "name",
            enableHiding: false,
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
            header: "Tipe",
            cell: ({ row }) => (
                <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 rounded-md">
                    {row.original.type?.toUpperCase()}
                </span>
            ),
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
    ];

    // Dynamic Warehouse Columns
    const warehouseColumns: ColumnDef<ResponseProductStockDTO>[] = warehouseNames.map((name) => ({
        id: `warehouse_${name}`,
        header: () => <div className="text-center font-semibold text-xs uppercase">{name}</div>,
        cell: ({ row }) => {
            const stock = row.original.stocks?.[name] || 0;
            return (
                <div className="text-center font-medium">
                    {stock > 0 ? (
                        Math.round(stock).toLocaleString()
                    ) : (
                        <span className="text-gray-300">-</span>
                    )}
                </div>
            );
        },
    }));

    const totalColumn: ColumnDef<ResponseProductStockDTO> = {
        id: "amount",
        accessorKey: "amount",
        enableHiding: false,
        header: () => (
            <SortableHeader
                label="Total"
                sortKey="amount"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => {
            const amount = Math.round(Number(row.original.amount));

            let bgClass = "bg-green-50 border-green-200 text-green-900";
            if (amount <= 10) {
                bgClass = "bg-red-50 border-red-200 text-red-900";
            } else if (amount <= 50) {
                bgClass = "bg-yellow-50 border-yellow-200 text-yellow-900";
            }

            return (
                <div
                    className={cn(
                        "flex justify-center w-full px-2 py-1 rounded-lg border font-bold",
                        bgClass,
                    )}
                >
                    {amount.toLocaleString()}
                </div>
            );
        },
    };

    return [...baseColumns, ...warehouseColumns, ...(showTotal ? [totalColumn] : [])];
};
