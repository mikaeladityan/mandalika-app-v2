import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { ResponseRawMaterialStockDTO } from "@/app/(application)/rawmat/stocks/server/rawmat.stock.schema";
import { SortableHeader } from "@/components/ui/table/sortable";
import { Package, Tag, Warehouse, AlertCircle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";

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
                <div className="flex flex-col gap-0.5 py-1 max-w-[200px]">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider bg-gray-50 px-1 rounded border border-gray-100">
                            {row.original.barcode || "NO-BARCODE"}
                        </span>
                    </div>
                    <span className="font-semibold text-sm line-clamp-2">
                        {row.original.name}
                    </span>
                </div>
            ),
        },
        {
            id: "category",
            accessorKey: "category",
            enableHiding: true,
            header: "Kategori",
            cell: ({ row }) => (
                row.original.category ? (
                    <Badge variant="outline" className="bg-blue-50/30 text-blue-600 border-blue-100 font-medium">
                        <Tag className="mr-1 size-3" />
                        {row.original.category}
                    </Badge>
                ) : (
                    <span className="text-xs italic text-muted-foreground">-</span>
                )
            ),
        },
        {
            id: "uom",
            accessorKey: "uom",
            enableHiding: true,
            header: "Satuan",
            cell: ({ row }) => (
                <Badge variant="secondary" className="font-medium bg-slate-100/50 text-slate-600">
                    {row.original.uom}
                </Badge>
            ),
        },
    ];

    // Dynamic Warehouse Columns
    const warehouseColumns: ColumnDef<ResponseRawMaterialStockDTO>[] = warehouseNames.map(
        (name) => ({
            id: `warehouse_${name}`,
            header: () => (
                <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Warehouse size={12} />
                    {name}
                </div>
            ),
            cell: ({ row }) => {
                const stock = row.original.stocks?.[name];
                const hasStock = stock !== undefined && stock !== null;
                
                return (
                    <div className={cn(
                        "text-center font-bold tabular-nums text-sm",
                        hasStock && Number(stock) < 0 ? "text-destructive" : "text-slate-700"
                    )}>
                        {hasStock ? (
                            formatNumber(Number(stock))
                        ) : (
                            <span className="text-slate-200 font-normal">-</span>
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
            const amount = Number(row.original.amount);
            const isCritical = amount <= 10;
            const isWarning = amount <= 50;

            return (
                <div className="flex items-center justify-center w-full">
                    <div
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold tabular-nums transition-all",
                            isCritical 
                                ? "bg-rose-50 border-rose-200 text-rose-700 shadow-sm shadow-rose-100" 
                                : isWarning 
                                ? "bg-amber-50 border-amber-200 text-amber-700" 
                                : "bg-emerald-50 border-emerald-200 text-emerald-700"
                        )}
                    >
                        {isCritical ? (
                            <AlertCircle size={14} className="animate-pulse" />
                        ) : isWarning ? (
                            <TrendingUp size={14} className="rotate-45" />
                        ) : (
                            <Package size={14} />
                        )}
                        {formatNumber(amount)}
                    </div>
                </div>
            );
        },
    };

    return [...baseColumns, ...warehouseColumns, ...(showTotal ? [totalColumn] : [])];
};
