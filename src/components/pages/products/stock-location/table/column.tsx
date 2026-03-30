import { ColumnDef } from "@tanstack/react-table";
import { formatNumber } from "@/lib/utils";
import { ResponseStockLocationDTO } from "@/app/(application)/products/stock-locations/server/stock-location.schema";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ColumnProps {
    sortBy: string;
    sortOrder: "asc" | "desc";
    onSort: (key: string) => void;
    locations: Array<{ id: number; name: string; type: string }>;
}

export function StockLocationColumns({
    sortBy,
    sortOrder,
    onSort,
    locations,
}: ColumnProps): ColumnDef<ResponseStockLocationDTO>[] {
    const baseColumns: ColumnDef<ResponseStockLocationDTO>[] = [
        {
            accessorKey: "code",
            header: "SKU",
            cell: ({ row }) => <span className="font-medium">{row.original.code}</span>,
        },
        {
            accessorKey: "name",
            header: "Nama Produk",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold">{row.original.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">
                        {row.original.type} • {row.original.gender} • {row.original.size}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "total_stock",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => onSort("total_stock")}
                    className="flex items-center gap-1 font-bold text-primary p-0 h-auto hover:bg-transparent"
                >
                    Total Stok
                    <ArrowUpDown size={12} />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="text-center font-black text-primary text-sm">
                    {formatNumber(row.original.total_stock)} {row.original.uom}
                </div>
            ),
        },
    ];

    // Dynamic columns for each location (Warehouse or Outlet)
    const locationColumns: ColumnDef<ResponseStockLocationDTO>[] = locations.map((loc) => ({
        id: `loc-${loc.name}`,
        header: () => (
            <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase text-muted-foreground font-bold leading-tight">
                    {loc.type === "WAREHOUSE" ? "GUDANG" : "OUTLET"}
                </span>
                <span className="text-xs truncate max-w-[120px]" title={loc.name}>
                    {loc.name}
                </span>
            </div>
        ),
        cell: ({ row }) => {
            const qty = row.original.location_stocks[loc.name] || 0;
            return (
                <div className={`text-center font-medium ${qty > 0 ? "text-slate-900" : "text-slate-300"}`}>
                    {qty > 0 ? formatNumber(qty) : "-"}
                </div>
            );
        },
    }));

    return [...baseColumns, ...locationColumns];
}
