import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MapPin, Settings2, Warehouse as WarehouseIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ResponseOutletDTO } from "@/app/(application)/outlets/server/outlet.schema";
import { SortableHeader } from "@/components/ui/table/sortable";

interface OutletColumnsProps {
    sortBy: string;
    sortOrder: "asc" | "desc";
    onSort: (key: string) => void;
    onEdit: (outlet: ResponseOutletDTO) => void;
}

export const OutletColumns = ({
    sortBy,
    sortOrder,
    onSort,
    onEdit,
}: OutletColumnsProps): ColumnDef<ResponseOutletDTO>[] => [
    {
        accessorKey: "code",
        header: () => (
            <SortableHeader
                label="KODE"
                sortKey="code"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <Badge
                variant="outline"
                className="text-[10px] font-mono border-primary/20 text-primary bg-primary/5 uppercase px-1.5 py-0 rounded"
            >
                {row.getValue("code")}
            </Badge>
        ),
    },
    {
        accessorKey: "name",
        header: () => (
            <SortableHeader
                label="NAMA OUTLET"
                sortKey="name"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <div className="flex flex-col gap-0.5">
                <Link
                    href={`/outlets/${row.original.id}`}
                    className="font-bold text-slate-900 hover:text-primary transition-colors line-clamp-1"
                >
                    {row.getValue("name")}
                </Link>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium uppercase tracking-tight leading-none">
                    <span
                        className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            row.original.type === "RETAIL" ? "bg-blue-400" : "bg-amber-400",
                        )}
                    />
                    {row.original.type}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "warehouses",
        header: "GUDANG UTAMA",
        cell: ({ row }) => {
            const warehouses = row.original.warehouses || [];
            return (
                <div className="flex items-center gap-1.5">
                    <div className="p-1 bg-slate-50 border border-slate-100 rounded shadow-xs shrink-0">
                        <WarehouseIcon className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-600 truncate max-w-[150px]">
                        {warehouses.length > 0
                            ? warehouses.map((w: any) => w.warehouse.name).join(", ")
                            : "Belum ditentukan"}
                    </span>
                    {warehouses.length > 1 && (
                        <Badge
                            variant="secondary"
                            className="text-[9px] px-1 py-0 h-4 rounded-full font-bold"
                        >
                            +{warehouses.length - 1}
                        </Badge>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "address",
        header: "LOKASI",
        cell: ({ row }) => {
            const addr = row.original.address;
            if (!addr) return <span className="text-slate-300">-</span>;
            return (
                <div className="flex items-start gap-1.5 max-w-[200px]">
                    <MapPin className="h-3 w-3 text-slate-400 mt-0.5 shrink-0" />
                    <span className="text-[11px] font-medium text-slate-600 line-clamp-1 leading-relaxed">
                        {addr.city}, {addr.province}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "deleted_at",
        header: "STATUS",
        cell: ({ row }) => {
            const isTrash = !!row.original.deleted_at;
            return (
                <Badge
                    variant={isTrash ? "secondary" : "default"}
                    className={cn(
                        "text-[9px] uppercase px-1.5 py-0 h-5 rounded-full font-black tracking-wider shadow-none border-none",
                        isTrash ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-600",
                    )}
                >
                    {isTrash ? "NON-AKTIF" : "AKTIF"}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "AKSI",
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    asChild
                >
                    <Link href={`/outlets/${row.original.id}`}>
                        <Eye size={14} />
                    </Link>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    onClick={() => onEdit(row.original)}
                >
                    <Settings2 size={14} />
                </Button>
            </div>
        ),
    },
];
