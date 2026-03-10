"use client";

import { useMemo, useState } from "react";
import { Search, Loader2, ChevronDown, Import } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    useRawMaterialStocksQuery,
    useRawMaterialStockTableState,
    useRawMaterialStockWarehouses,
} from "@/app/(application)/rawmat/stocks/server/use.rawmat.stock";
import { RawMaterialColumns } from "./table/column";
import { DataTable } from "@/components/ui/table/data";
import { ColumnDef } from "@tanstack/react-table";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";

export function RawMaterialsWarehouseStockDetail() {
    const { id } = useParams<{ id: string }>();
    const table = useRawMaterialStockTableState();

    const { warehouses = [] } = useRawMaterialStockWarehouses();
    const currentWarehouse = useMemo(
        () => warehouses.find((w: any) => w.id === Number(id)),
        [warehouses, id],
    );

    const warehouseNames = useMemo(
        () => (currentWarehouse ? [currentWarehouse.name] : []),
        [currentWarehouse],
    );

    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        category: true,
        uom: true,
    });

    const { rawMaterials, meta, isLoading, isFetching, isRefetching } = useRawMaterialStocksQuery({
        ...table.queryParams,
        warehouse_id: Number(id),
    } as any);

    const columns = useMemo(
        () =>
            RawMaterialColumns({
                sortBy: table.sortBy,
                sortOrder: table.sortOrder,
                onSort: table.onSort,
                warehouseNames,
                showTotal: false,
            }),
        [table.sortBy, table.sortOrder, table.onSort, warehouseNames],
    );

    const isTableLoading = isLoading || isFetching || isRefetching;

    return (
        <section className="space-y-6">
            <header className="space-y-1 mb-5">
                <h2 className="text-xl font-semibold tracking-tight">
                    Stok Bahan Baku: {currentWarehouse?.name || "Gudang RM"}
                </h2>
                <p className="text-sm text-muted-foreground">
                    Lihat detail ketersediaan bahan baku pada gudang terpilih
                </p>
            </header>

            <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="bg-white border-b space-y-4 pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <InputGroup className="w-full md:max-w-xs">
                            <InputGroupInput
                                placeholder="Cari nama atau barcode..."
                                value={table.search}
                                onChange={(e) => table.setSearch(e.target.value)}
                            />
                            <InputGroupAddon>
                                {isFetching ? (
                                    <Loader2 className="animate-spin" size={14} />
                                ) : (
                                    <Search size={14} />
                                )}
                            </InputGroupAddon>
                        </InputGroup>

                        <div className="flex gap-2">
                            <Button variant="success" asChild size="sm">
                                <Link href={`/rawmat/stocks/${id}/import`}>
                                    <Import className="h-4 w-4 mr-2" />
                                    Import
                                </Link>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        Kolom
                                        <ChevronDown className="h-4 w-4 ml-2" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {Object.entries(columnVisibility).map(([key, value]) => (
                                        <DropdownMenuCheckboxItem
                                            key={key}
                                            checked={value}
                                            onCheckedChange={(checked) =>
                                                setColumnVisibility((prev) => ({
                                                    ...prev,
                                                    [key]: Boolean(checked),
                                                }))
                                            }
                                        >
                                            {key.toUpperCase()}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    {isTableLoading && !rawMaterials.length ? (
                        <TableSkeleton />
                    ) : (
                        <DataTable
                            columns={columns as ColumnDef<unknown, unknown>[]}
                            data={rawMaterials}
                            total={meta?.len ?? 0}
                            page={Number(table.queryParams.page)}
                            pageSize={Number(table.queryParams.take)}
                            onPageChange={table.setPage}
                            onPageSizeChange={table.setPageSize}
                            state={{ columnVisibility }}
                            onColumnVisibilityChange={setColumnVisibility}
                        />
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
