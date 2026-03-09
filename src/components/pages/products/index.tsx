"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RowSelectionState } from "@tanstack/react-table";
import { exportToCSV, getSelectedIds } from "@/components/ui/table/export";
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

export function Products() {
    const table = useProductTableState();
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        gender: true,
        type: true,
        size: true,
        created_at: false,
        updated_at: false,
        status: false,
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

    const { clean } = useActionProduct();

    const columns = useMemo(
        () =>
            ProductColumns({
                sortBy: table.sortBy,
                sortOrder: table.sortOrder,
                onSort: table.onSort,
            }),
        [table.sortBy, table.sortOrder, table.onSort],
    );

    const selectedIds = getSelectedIds(rowSelection);

    const handleExportSelected = () => {
        exportToCSV(
            "data-produk.csv",
            products || [],
            columns as any,
            selectedIds,
            (row: any) => row.id,
        );
    };

    const isTableLoading = isLoading || isFetching || isRefetching;

    return (
        <>
            <header className="space-y-1 mb-5">
                <h2 className="text-xl font-semibold tracking-tight">Manajemen Produk</h2>
                <p className="text-sm text-muted-foreground">Kelola seluruh produk yang tersedia</p>
            </header>

            <Card>
                <CardHeader className="space-y-4">
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
                    </div>

                    {/* ===== Actions ===== */}
                    <div className="flex flex-col md:flex-row justify-between gap-2">
                        <div className="flex gap-2">
                            <Link href="/products/create">
                                <Button>
                                    <Plus className="h-4 w-4" />
                                    Produk
                                </Button>
                            </Link>

                            <Button
                                variant={table.isTrashMode ? "outline" : "rose"}
                                onClick={table.toggleTrashMode}
                            >
                                {table.isTrashMode ? (
                                    <>
                                        <Package className="h-4 w-4" />
                                        List Produk
                                    </>
                                ) : (
                                    <>
                                        <Trash className="h-4 w-4" />
                                        Sampah
                                    </>
                                )}
                            </Button>

                            {table.isTrashMode && (
                                <DialogAlert
                                    title="Bersihkan Sampah Produk"
                                    onClick={async () => {
                                        await clean.mutateAsync();
                                    }}
                                    label={
                                        <>
                                            Bersihkan Sampah <BrushCleaning size={16} />
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        Kolom
                                        <ChevronDown className="h-4 w-4" />
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
                                            {key.replace("_", " ").toUpperCase()}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Link href="/products/import">
                                <Button variant="outline">
                                    <Import className="h-4 w-4" />
                                    Import
                                </Button>
                            </Link>

                            {selectedIds.length > 0 ? (
                                <div className="flex items-center gap-1.5 p-1 px-2 border border-primary/30 bg-primary/10 rounded-md">
                                    <span className="text-sm font-medium text-primary ml-1 mr-2 hidden md:inline">
                                        {selectedIds.length} terpilih
                                    </span>
                                    <span className="text-sm font-medium text-primary ml-1 mr-1 md:hidden">
                                        {selectedIds.length}
                                    </span>
                                    <Button
                                        size="sm"
                                        onClick={handleExportSelected}
                                        className="h-8 shadow-sm cursor-pointer"
                                    >
                                        <Download className="md:mr-2 h-3.5 w-3.5" />
                                        <span className="hidden md:inline">Export CSV</span>
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10"
                                        onClick={() => setRowSelection({})}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <Button variant="success" className="cursor-pointer">
                                    <Download className="h-4 w-4" />
                                    Export
                                </Button>
                            )}
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
                            getRowId={(row: any) => row.id}
                        />
                    </CardContent>
                )}
            </Card>
        </>
    );
}
