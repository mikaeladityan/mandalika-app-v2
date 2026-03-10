import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { ResponseRawMaterialStockDTO } from "@/app/(application)/rawmat/stocks/server/rawmat.stock.schema";
import { SortableHeader } from "@/components/ui/table/sortable";

type RawMaterialColumnsProps = {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    onSort: (key: string) => void;
    warehouseNames: string[];
    showTotal?: boolean;
};

export const RawMaterialColumns = ({
    sortBy,
    sortOrder,
    onSort,
    warehouseNames,
    showTotal = true,
}: RawMaterialColumnsProps): ColumnDef<ResponseRawMaterialStockDTO>[] => {
    const baseColumns: ColumnDef<ResponseRawMaterialStockDTO>[] = [
        {
            id: "name",
            accessorKey: "name",
            enableHiding: false,
            header: () => (
                <SortableHeader
                    label="Nama Material"
                    sortKey="name"
                    activeSortBy={sortBy}
                    activeSortOrder={sortOrder}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => (
                <div>
                    <h2 className="font-medium underline">{row.original.name}</h2>
                    <span className="text-xs text-gray-500">{row.original.barcode || "-"}</span>
                </div>
            ),
        },
        {
            id: "category",
            accessorKey: "category",
            enableHiding: true,
            header: "Kategori",
            cell: ({ row }) => (
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                    {row.original.category?.toUpperCase()}
                </span>
            ),
        },
        {
            id: "uom",
            accessorKey: "uom",
            enableHiding: true,
            header: "Satuan",
            cell: ({ row }) => <span className="uppercase text-xs">{row.original.uom}</span>,
        },
    ];

    // Dynamic Warehouse Columns
    const warehouseColumns: ColumnDef<ResponseRawMaterialStockDTO>[] = warehouseNames.map(
        (name) => ({
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
        }),
    );

    const totalColumn: ColumnDef<ResponseRawMaterialStockDTO> = {
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
