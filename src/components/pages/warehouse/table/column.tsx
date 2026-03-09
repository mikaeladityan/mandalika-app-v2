"use client";

import { QueryProductInventoryDTO } from "@/app/(application)/warehouses/server/warehouse.schema";
import { ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "@/components/ui/table/sortable";

export const WarehouseInventoryColumns = (
    warehouseNames: string[],
    type: QueryProductInventoryDTO["type"],
): ColumnDef<any>[] => {
    const baseColumns: ColumnDef<any>[] = [
        {
            id: "name",
            accessorFn: (row) => row.product_name || row.material_name,
            enableHiding: false,
            header: () => (
                <SortableHeader
                    label="Nama Item"
                    sortKey="name"
                    activeSortBy={undefined}
                    activeSortOrder={undefined}
                    onSort={() => {}}
                />
            ),
            cell: ({ row }) => (
                <div>
                    <h2 className="font-medium underline">
                        {row.original.product_name || row.original.material_name}
                    </h2>
                    <span className="text-xs text-gray-500">
                        {row.original.product_code || row.original.material_code}
                    </span>
                </div>
            ),
        },
    ];

    // Sisipkan kolom spesifik berdasarkan tipe (FINISH_GOODS vs RAW_MATERIAL)
    if (type === "FINISH_GOODS") {
        baseColumns.push(
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
                header: "Ukuran",
                cell: ({ row }) => (
                    <div className="uppercase">
                        {row.original.size} {row.original.uom}
                    </div>
                ),
            },
        );
    } else {
        baseColumns.push({
            id: "category",
            accessorKey: "category",
            enableHiding: true,
            header: "Kategori",
            cell: ({ row }) => row.original.category?.toUpperCase() ?? "UNKNOWN",
        });
    }

    baseColumns.push({
        id: "total_stock",
        accessorKey: "total_stock",
        enableHiding: false,
        header: () => (
            <SortableHeader
                label="Keseluruhan"
                sortKey="quantity"
                activeSortBy={undefined}
                activeSortOrder={undefined}
                onSort={() => {}}
            />
        ),
        cell: ({ row }) => (
            <div className="font-bold border bg-gray-50 rounded text-center">
                {Math.round(Number(row.original.total_stock)).toLocaleString() || 0}
                {/* {row.original.uom.toUpperCase()} */}
            </div>
        ),
    });

    // Kolom dinamis untuk tiap Gudang (Pivoting)
    const warehouseColumns: ColumnDef<any>[] = warehouseNames.map((wName) => ({
        id: `warehouse_${wName}`,
        header: wName,
        cell: ({ row }) => {
            const stock = row.original.stocks?.[wName] || 0;
            return (
                <div className="text-center">
                    {Math.round(Number(stock)).toLocaleString() || 0}{" "}
                    {/*{row.original.uom.toUpperCase()} */}
                </div>
            );
        },
    }));

    return [...baseColumns, ...warehouseColumns];
};
