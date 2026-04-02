"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RowSelectionState } from "@tanstack/react-table";
import { getSelectedIds } from "@/components/ui/table/export";
import {
    Package,
    Plus,
    Trash,
    Search,
    ChevronDown,
    BrushCleaning,
    Loader2,
    ArrowRight,
    Import,
    X,
    ArchiveRestore,
    Trash2,
    Download,
    Printer,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { SelectFilter } from "@/components/ui/form/select";

import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { DataTable } from "@/components/ui/table/data";
import {
    useActionRawMat,
    useRawMaterialsQuery,
    useRawMaterialTableState,
    useRawMaterialUtils,
} from "@/app/(application)/rawmat/server/use.rawmat";
import { RawMaterialColumns } from "./table/column";
import { DialogAlert } from "@/components/ui/dialog/dialog.alert";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useCategory } from "@/app/(application)/rawmat/(component)/categories/server/use.category";
import { useSupplier } from "@/app/(application)/rawmat/(component)/suppliers/server/use.supplier";
import { useUnit } from "@/app/(application)/rawmat/(component)/units/server/use.unit";
import { CreateRawMaterialDialog, EditRawMaterialDialog } from "./rawmat-form-dialog";
import { PrintReport } from "./print-report";

export function RawMaterials() {
    const router = useRouter();
    const table = useRawMaterialTableState();
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        price: true,
        min_stock: false,
        min_buy: false,
        current_stock: true,
        created_at: false,
        updated_at: true,
    });

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | undefined>();

    const { countUtils } = useRawMaterialUtils(true);

    const defaultColumnVisibility = useMemo(
        () => ({
            unit: true,
            category: true,
            price: true,
            min_stock: false,
            min_buy: false,
            current_stock: true,
            created_at: false,
            updated_at: true,
            ...columnVisibility, // Use state to override
        }),
        [columnVisibility],
    );

    const { data, meta, isLoading, isFetching, isRefetching } = useRawMaterialsQuery(
        table.queryParams,
    );

    // ─── Sub-module data untuk filter ────────────────────────────────────────
    const { categories: categoryList } = useCategory({ page: 1, take: 100, status: "ACTIVE" });
    const { suppliers: supplierList } = useSupplier({ page: 1, take: 100 });
    const { units: unitList } = useUnit({ page: 1, take: 100 });

    const { clean, bulkStatus, exportCsv } = useActionRawMat();
    const runClean = async () => {
        await clean.mutateAsync();
    };

    const selectedIds = getSelectedIds(rowSelection).map(Number);

    const columns = useMemo(
        () =>
            RawMaterialColumns({
                sortBy: table.sortBy,
                sortOrder: table.sortOrder,
                onSort: table.onSort,
                onEdit: (id) => {
                    setSelectedId(id);
                    setEditOpen(true);
                },
                status: table.status,
            }),
        [table.sortBy, table.sortOrder, table.onSort, table.status],
    );

    const handleExportAll = () => {
        const currentVisible = columns
            .map((c) => (c as any).id || (c as any).accessorKey)
            .filter((id) => id && (defaultColumnVisibility as any)[id] !== false);

        exportCsv.mutate({
            ...table.queryParams,
            visibleColumns: currentVisible.join(","),
        } as any);
    };

    const isTableLoading = isLoading || isFetching || isRefetching || exportCsv.isPending;

    return (
        <section className="space-y-5 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
                <Card className="border-none shadow-xs rounded-2xl overflow-hidden group hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Tipe Kategori
                            </p>
                            <div className="p-2 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                                <Plus size={18} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {countUtils.isLoading ? (
                            <Skeleton className="h-12 w-20" />
                        ) : (
                            <p className="text-5xl font-black tracking-tighter text-slate-900 border-l-4 border-primary pl-4">
                                {countUtils.data?.categories}
                            </p>
                        )}
                    </CardContent>
                    <CardFooter className="pt-0">
                        <Button
                            className="w-full justify-between items-center text-xs font-bold rounded-xl"
                            onClick={() => router.push("/rawmat/categories")}
                            variant="ghost"
                        >
                            <span>Kelola Kategori</span>
                            <ArrowRight size={14} className="text-primary" />
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="border-none shadow-xs rounded-2xl overflow-hidden group hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Satuan / Unit
                            </p>
                            <div className="p-2 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                                <Package size={18} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {countUtils.isLoading ? (
                            <Skeleton className="h-12 w-20" />
                        ) : (
                            <p className="text-5xl font-black tracking-tighter text-slate-900 border-l-4 border-primary pl-4">
                                {countUtils.data?.units}
                            </p>
                        )}
                    </CardContent>
                    <CardFooter className="pt-0">
                        <Button
                            className="w-full justify-between items-center text-xs font-bold rounded-xl"
                            onClick={() => router.push("/rawmat/units")}
                            variant="ghost"
                        >
                            <span>Kelola Satuan</span>
                            <ArrowRight size={14} className="text-primary" />
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="border-none shadow-xs rounded-2xl overflow-hidden group hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Supplier Aktif
                            </p>
                            <div className="p-2 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                                <Plus size={18} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {countUtils.isLoading ? (
                            <Skeleton className="h-12 w-20" />
                        ) : (
                            <p className="text-5xl font-black tracking-tighter text-slate-900 border-l-4 border-primary pl-4">
                                {countUtils.data?.suppliers}
                            </p>
                        )}
                    </CardContent>
                    <CardFooter className="pt-0">
                        <Button
                            className="w-full justify-between items-center text-xs font-bold rounded-xl"
                            onClick={() => router.push("/rawmat/suppliers")}
                            variant="ghost"
                        >
                            <span>Kelola Supplier</span>
                            <ArrowRight size={14} className="text-primary" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <Card className="w-full">
                <CardHeader className="space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">
                            Manajemen Raw Material
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Kelola seluruh produk mentah / material produksi
                        </p>
                    </div>
                    <InputGroup className="md:max-w-sm">
                        <InputGroupInput
                            placeholder="Search raw material..."
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
                                <span className="text-xs">{meta?.len ?? 0} result</span>
                            )}
                        </InputGroupAddon>
                    </InputGroup>

                    {/* ===== Filters ===== */}
                    <div className="flex flex-wrap gap-2 items-center">
                        {/* Filter Kategori */}
                        <SelectFilter
                            size={"sm"}
                            placeholder="Kategori"
                            value={table.categoryId ?? null}
                            options={
                                categoryList.data?.data?.map((c) => ({
                                    value: c.id,
                                    label: c.name,
                                })) ?? []
                            }
                            onChange={(val) => table.setCategoryId(Number(val))}
                            onReset={() => table.setCategoryId(undefined)}
                            isLoading={categoryList.isLoading || categoryList.isRefetching}
                            canSearching={true}
                            className="w-full md:w-auto min-w-58"
                        />

                        {/* Filter Supplier */}
                        <SelectFilter
                            size={"sm"}
                            placeholder="Supplier"
                            value={table.supplierId ?? null}
                            options={
                                supplierList.data?.data?.map((s) => ({
                                    value: s.id,
                                    label: s.name,
                                })) ?? []
                            }
                            onChange={(val) => table.setSupplierId(Number(val))}
                            onReset={() => table.setSupplierId(undefined)}
                            isLoading={supplierList.isLoading || supplierList.isRefetching}
                            canSearching={true}
                            className="w-full md:w-auto min-w-44"
                        />

                        {/* Filter Satuan */}
                        <SelectFilter
                            size={"sm"}
                            placeholder="Satuan"
                            value={table.unitId ?? null}
                            options={
                                unitList.data?.data?.map((u) => ({
                                    value: u.id,
                                    label: u.name,
                                })) ?? []
                            }
                            onChange={(val) => table.setUnitId(Number(val))}
                            onReset={() => table.setUnitId(undefined)}
                            isLoading={unitList.isLoading || unitList.isRefetching}
                            canSearching={true}
                            className="w-full md:w-auto min-w-36"
                        />

                        {/* Reset All Filters */}
                        {(table.categoryId || table.supplierId || table.unitId || table.search) && (
                            <Button
                                size={"sm"}
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
                        <div className="flex gap-2"></div>
                        <Button size={"sm"} onClick={() => setCreateOpen(true)}>
                            <Plus size={16} /> Raw Material
                        </Button>

                        <Button
                            size={"sm"}
                            variant="outline"
                            onClick={table.toggleTrashMode}
                            className={
                                table.isDeleted
                                    ? "text-muted-foreground"
                                    : "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                            }
                        >
                            {table.isDeleted ? <Package size={16} /> : <Trash size={16} />}
                        </Button>

                        {table.isDeleted && (
                            <DialogAlert
                                title="Bersihkan Sampah"
                                onClick={runClean}
                                label={
                                    <>
                                        Bersihkan <BrushCleaning size={16} />
                                    </>
                                }
                            >
                                <DialogDescription>
                                    Bersihkan seluruh data raw material?
                                </DialogDescription>
                            </DialogAlert>
                        )}

                        <div className="flex items-center gap-2">
                            {selectedIds.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-medium text-primary ml-1 mr-2 hidden md:inline">
                                        {selectedIds.length} terpilih
                                    </span>
                                    <span className="text-sm font-medium text-primary ml-1 mr-1 md:hidden">
                                        {selectedIds.length}
                                    </span>

                                    {table.isDeleted ? (
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
                            <Link href="/rawmat/import">
                                <Button size={"sm"} variant={"outline"}>
                                    <Import size={16} className="mr-2" /> Import
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
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <Download size={16} className="mr-2" />
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
                            tableId="rawmat-master-table"
                            columns={columns}
                            data={data}
                            page={table.queryParams.page ?? 1}
                            pageSize={table.queryParams.take ?? 10}
                            total={meta?.len ?? 0}
                            onPageChange={table.setPage}
                            onPageSizeChange={table.setPageSize}
                            state={{ columnVisibility: defaultColumnVisibility }}
                            enableMultiSelect={true}
                            rowSelection={rowSelection}
                            onRowSelectionChange={setRowSelection}
                            getRowId={(row: any) => String(row.id)}
                        />
                    </CardContent>
                )}
            </Card>

            <CreateRawMaterialDialog open={createOpen} setOpen={setCreateOpen} />
            <EditRawMaterialDialog open={editOpen} setOpen={setEditOpen} id={selectedId} />

            {/* Hidden Printable Version */}
            {data && (
                <PrintReport
                    data={data}
                    visibleColumns={columns
                        .map((c) => (c as any).id || (c as any).accessorKey)
                        .filter((id) => id && (defaultColumnVisibility as any)[id] !== false)}
                    title="Laporan Master Raw Material"
                />
            )}
        </section>
    );
}
