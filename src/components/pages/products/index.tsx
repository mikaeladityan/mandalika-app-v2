"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RowSelectionState } from "@tanstack/react-table";
import { getSelectedIds } from "@/components/ui/table/export";
import { CreateProductDialog, EditProductDialog } from "./form/product-form-dialog";
import { CreateProductBody } from "./form/create";
import { EditProductBody } from "./form/edit";
import {
    Package,
    Plus,
    Trash,
    Search,
    ChevronDown,
    Download,
    Import,
    Loader2,
    X,
    ArchiveRestore,
    Trash2,
    Printer,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SelectFilter } from "@/components/ui/form/select";

import { ProductColumns } from "./table/columns";
import {
    useActionProduct,
    useProductsQuery,
    useProductTableState,
} from "@/app/(application)/products/server/use.products";
import { useType } from "@/app/(application)/products/(component)/type/server/use.type";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import { DialogAlert } from "@/components/ui/dialog/dialog.alert";
import { DialogDescription } from "@/components/ui/dialog";
import { BrushCleaning } from "lucide-react";
import { useSizes } from "@/app/(application)/products/(component)/size/server/use.size";
import { PrintReport } from "./print-report";

export function Products() {
    const table = useProductTableState();
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [createOpen, setCreateOpen] = useState(false);
    const [editProductId, setEditProductId] = useState<number | null>(null);
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        gender: false,
        created_at: false,
        updated_at: false,
        distribution_percentage: false,
        safety_percentage: false,
    });

    const {
        data: products,
        meta,
        isLoading,
        isFetching,
        isRefetching,
    } = useProductsQuery(table.queryParams);

    // ─── Sub-module data untuk filter ────────────────────────────────────────
    const { data: typeList, isLoading: typesLoading, isRefetching: typesRefetching } = useType();

    const { data: sizeList, isLoading: sizesLoading, isRefetching: sizesRefetching } = useSizes();

    const { clean, bulkStatus, exportCsv } = useActionProduct();

    const columns = useMemo(
        () =>
            ProductColumns({
                sortBy: table.sortBy,
                sortOrder: table.sortOrder,
                onSort: table.onSort,
                onEdit: (id) => setEditProductId(id),
            }),
        [table.sortBy, table.sortOrder, table.onSort],
    );

    const selectedIds = getSelectedIds(rowSelection).map(Number);

    const handleExportAll = () => {
        const visibleCols = Object.entries(columnVisibility)
            .filter(([_, visible]) => visible)
            .map(([id]) => id);

        // Include default visible columns not in the state or set to true
        // But better: since columnVisibility tracks overrides, we should get exactly what the table sees.
        // Actually, the easiest way is to get all keys from columns that aren't false in visibility.
        const currentVisible = columns
            .map((c) => (c as any).id)
            .filter((id) => columnVisibility[id] !== false);

        exportCsv.mutate({
            ...table.queryParams,
            visibleColumns: currentVisible.join(","),
        } as any);
    };

    const isTableLoading = isLoading || isFetching || isRefetching || exportCsv.isPending;

    return (
        <div className="flex flex-col gap-5">
            <Card>
                <CardHeader className="space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">Manajemen Produk</h2>
                        <p className="text-sm text-muted-foreground">
                            Kelola seluruh produk yang tersedia
                        </p>
                    </div>
                    {/* ===== Search ===== */}
                    <InputGroup className="w-full md:max-w-sm">
                        <InputGroupInput
                            placeholder="Search product..."
                            value={table.search}
                            onChange={(e) => table.setSearch(e.target.value)}
                        />
                        <InputGroupAddon>
                            <Search className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                            {isFetching ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    {meta?.len ?? 0} result
                                </span>
                            )}
                        </InputGroupAddon>
                    </InputGroup>

                    {/* ===== Filters ===== */}
                    <div className="flex flex-wrap gap-2">
                        {/* Gender */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="sm"
                                    variant={table.gender ? "default" : "outline"}
                                    className="w-full md:w-auto justify-between"
                                >
                                    {table.gender === "WOMEN"
                                        ? "Wanita"
                                        : table.gender === "MEN"
                                          ? "Pria"
                                          : table.gender === "UNISEX"
                                            ? "Unisex"
                                            : "Gender"}
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => table.setGender("WOMEN")}>
                                    Wanita
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => table.setGender("MEN")}>
                                    Pria
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => table.setGender("UNISEX")}>
                                    Unisex
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => table.setGender(undefined)}
                                    className="text-muted-foreground"
                                >
                                    Reset
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Tipe Produk */}
                        <SelectFilter
                            size={"sm"}
                            placeholder="Tipe Produk"
                            value={table.type_id ?? null}
                            options={
                                typeList?.map((t) => ({
                                    value: t.id,
                                    label: t.name.toUpperCase(),
                                })) ?? []
                            }
                            onChange={(val) => table.setType(Number(val))}
                            onReset={() => table.setType(undefined)}
                            isLoading={typesLoading || typesRefetching}
                            canSearching={true}
                            className="w-full md:w-auto min-w-50"
                        />

                        {/* Ukuran Produk */}
                        <SelectFilter
                            size={"sm"}
                            placeholder="Ukuran"
                            value={table.size_id ?? null}
                            options={
                                sizeList?.map((s) => ({
                                    value: s.id,
                                    label: String(s.size) + "ML",
                                })) ?? []
                            }
                            onChange={(val) => table.setSize(Number(val))}
                            onReset={() => table.setSize(undefined)}
                            isLoading={sizesLoading || sizesRefetching}
                            canSearching={true}
                            className="w-full md:w-auto min-w-28"
                        />

                        {/* Reset All Filters */}
                        {(table.gender ||
                            table.type_id ||
                            table.size_id ||
                            table.search ||
                            table.sortBy !== "forecast_default") && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={table.resetFilters}
                                className="h-9 px-2 text-muted-foreground hover:text-foreground"
                            >
                                Reset <X className="ml-1 h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>

                    {/* ===== Actions ===== */}
                    <div className="flex flex-col md:flex-row justify-end gap-2">
                        <div className="flex gap-2">
                            <Button size="sm" onClick={() => setCreateOpen(true)}>
                                <Plus className="h-4 w-4" />
                                Produk
                            </Button>

                            <Button
                                size="sm"
                                variant="outline"
                                onClick={table.toggleTrashMode}
                                className={
                                    table.isTrashMode
                                        ? "text-muted-foreground"
                                        : "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                                }
                            >
                                {table.isTrashMode ? <Package /> : <Trash />}
                            </Button>

                            {table.isTrashMode && (
                                <DialogAlert
                                    title="Bersihkan Sampah Produk"
                                    onClick={async () => {
                                        await clean.mutateAsync();
                                    }}
                                    label={
                                        <>
                                            Bersihkan Sampah <BrushCleaning />
                                        </>
                                    }
                                >
                                    <DialogDescription>
                                        Apakah anda yakin untuk membersihkan seluruh sampah produk?
                                    </DialogDescription>
                                </DialogAlert>
                            )}
                        </div>

                        <div className="flex gap-2">
                            {selectedIds.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-medium text-primary ml-1 mr-2 hidden md:inline">
                                        {selectedIds.length} terpilih
                                    </span>
                                    <span className="text-sm font-medium text-primary ml-1 mr-1 md:hidden">
                                        {selectedIds.length}
                                    </span>

                                    {table.isTrashMode ? (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={bulkStatus.isPending}
                                            className="shadow-sm cursor-pointer"
                                            onClick={() =>
                                                bulkStatus.mutate(
                                                    { ids: selectedIds, status: "ACTIVE" },
                                                    { onSuccess: () => setRowSelection({}) },
                                                )
                                            }
                                        >
                                            <ArchiveRestore className="mr-2 h-3.5 w-3.5" />
                                            Restore
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            disabled={bulkStatus.isPending}
                                            className="shadow-sm cursor-pointer border-red-500/30"
                                            onClick={() =>
                                                bulkStatus.mutate(
                                                    { ids: selectedIds, status: "DELETE" },
                                                    { onSuccess: () => setRowSelection({}) },
                                                )
                                            }
                                        >
                                            <Trash2 className="md:mr-2 h-3.5 w-3.5" />
                                            <span className="hidden md:inline">Hapus</span>
                                        </Button>
                                    )}

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10"
                                        onClick={() => setRowSelection({})}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            <Link href="/products/import">
                                <Button size="sm" variant="outline">
                                    <Import className="h-4 w-4" />
                                    Import
                                </Button>
                            </Link>
                            <Button
                                size="sm"
                                variant="default"
                                disabled={exportCsv.isPending}
                                className="cursor-pointer"
                                onClick={handleExportAll}
                            >
                                {exportCsv.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="h-4 w-4" />
                                )}
                                Excel
                            </Button>

                            <Button
                                size="sm"
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200 font-bold gap-1.5 transition-all"
                                onClick={() => window.print()}
                            >
                                <Printer className="h-4 w-4" />
                                Print PDF
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {isTableLoading ? (
                    <CardContent>
                        <TableSkeleton />
                    </CardContent>
                ) : (
                    <CardContent>
                        <DataTable
                            tableId="products-master-table"
                            columns={columns}
                            data={products || []}
                            page={table.queryParams.page || 1}
                            pageSize={table.queryParams.take || 10}
                            total={meta?.len ?? 0}
                            onPageChange={(page) => table.setPage(page)}
                            onPageSizeChange={(size) => table.setPageSize(size)}
                            state={{ columnVisibility }}
                            onColumnVisibilityChange={setColumnVisibility}
                            enableMultiSelect={true}
                            rowSelection={rowSelection}
                            onRowSelectionChange={setRowSelection}
                            getRowId={(row: any) => String(row.id)}
                        />
                    </CardContent>
                )}
            </Card>

            {/* ── Create Dialog ── */}
            <CreateProductDialog open={createOpen} onOpenChange={setCreateOpen}>
                <CreateProductBody
                    onSuccess={(item) => {
                        setCreateOpen(false);
                    }}
                    onCancel={() => setCreateOpen(false)}
                />
            </CreateProductDialog>

            {/* ── Edit Dialog ── */}
            <EditProductDialog
                open={editProductId !== null}
                onOpenChange={(o) => !o && setEditProductId(null)}
                productId={editProductId}
            >
                {editProductId !== null && (
                    <EditProductBody
                        id={editProductId}
                        onSuccess={(item) => {
                            setEditProductId(null);
                        }}
                        onCancel={() => setEditProductId(null)}
                    />
                )}
            </EditProductDialog>

            {/* Hidden Printable Version */}
            {products && (
                <PrintReport
                    data={products}
                    visibleColumns={columns
                        .map((c) => (c as any).id)
                        .filter((id) => columnVisibility[id] !== false)}
                    title="Laporan Master Produk"
                />
            )}
        </div>
    );
}
