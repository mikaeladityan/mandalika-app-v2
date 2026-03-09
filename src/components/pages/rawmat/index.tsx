"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
    Package,
    Plus,
    Trash,
    Search,
    ChevronDown,
    BrushCleaning,
    Loader2,
    ArrowRight,
    Loader,
    Import,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useCategory } from "@/app/(application)/rawmat/categories/server/use.category";
import { useSupplier } from "@/app/(application)/rawmat/suppliers/server/use.supplier";
import { useUnit } from "@/app/(application)/rawmat/units/server/use.unit";

export function RawMaterials() {
    const router = useRouter();
    const table = useRawMaterialTableState();
    const { countUtils } = useRawMaterialUtils(true);
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        unit: true,
        category: true,
        price: true,
        min_stock: false,
        min_buy: false,
        current_stock: true,
        created_at: false,
        updated_at: true,
    });

    const { data, meta, isLoading, isFetching, isRefetching } = useRawMaterialsQuery(
        table.queryParams,
    );

    // ─── Sub-module data untuk filter ────────────────────────────────────────
    const { categories: categoryList } = useCategory({ page: 1, take: 100, status: "ACTIVE" });
    const { suppliers: supplierList } = useSupplier({ page: 1, take: 100 });
    const { units: unitList } = useUnit({ page: 1, take: 100 });

    const { clean } = useActionRawMat();
    const runClean = async () => {
        await clean.mutateAsync();
    };
    const columns = useMemo(
        () =>
            RawMaterialColumns({
                sortBy: table.sortBy,
                sortOrder: table.sortOrder,
                onSort: table.onSort,
                status: table.status,
            }),
        [table.sortBy, table.sortOrder, table.onSort, table.status],
    );

    const isTableLoading = isLoading || isFetching || isRefetching;

    return (
        <section className="space-y-5 w-full">
            <div className="grid grid-cols-4 gap-5 2xl:w-8/12">
                <Card className="bg-linear-to-tr from-cyan-100 via-cyan-500 to-cyan-700">
                    <CardHeader>
                        <h1 className="font-semibold text-white text-xl">Total Kategori</h1>
                    </CardHeader>
                    <CardContent className="text-center">
                        {countUtils.isLoading ? (
                            <div className="flex items-center justify-center">
                                <Loader2 size={73} className="animate-spin" strokeWidth={4} />
                            </div>
                        ) : (
                            <p className="font-semibold text-white text-7xl">
                                {countUtils.data?.categories}
                            </p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="flex items-center justify-start gap-1 text-black"
                            onClick={() => router.push("/rawmat/categories")}
                            variant={"outline"}
                            size={"sm"}
                        >
                            <p>Selengkapnya</p>
                            <ArrowRight size={18} className="" />
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="bg-linear-to-tr from-amber-100 via-amber-500 to-amber-600">
                    <CardHeader>
                        <h1 className="font-semibold text-xl text-white">Total Satuan</h1>
                    </CardHeader>
                    <CardContent className="text-center text-white">
                        {countUtils.isLoading ? (
                            <div className="flex items-center justify-center">
                                <Loader2 size={73} className="animate-spin" strokeWidth={4} />
                            </div>
                        ) : (
                            <p className="font-semibold text-7xl">{countUtils.data?.units}</p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="flex items-center justify-start gap-1"
                            onClick={() => router.push("/rawmat/units")}
                            variant={"outline"}
                            size={"sm"}
                        >
                            <p>Selengkapnya</p>
                            <ArrowRight size={18} className="" />
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <h1 className="font-semibold  text-xl">Total Supplier</h1>
                    </CardHeader>
                    <CardContent className="text-center">
                        {countUtils.isLoading ? (
                            <div className="flex items-center justify-center">
                                <Loader2 size={73} className="animate-spin" strokeWidth={4} />
                            </div>
                        ) : (
                            <p className="font-semibold text-7xl">{countUtils.data?.suppliers}</p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="flex items-center justify-start gap-1"
                            onClick={() => router.push("/rawmat/suppliers")}
                            variant={"outline"}
                            size={"sm"}
                        >
                            <p>Selengkapnya</p>
                            <ArrowRight size={18} className="" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <Card className="w-full">
                <CardHeader className="space-y-4">
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
                                variant="ghost"
                                onClick={table.resetFilters}
                                className="h-9 px-2 text-muted-foreground hover:text-foreground"
                            >
                                Reset <X className="ml-1 h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>

                    {/* ===== Actions ===== */}
                    <div className="flex flex-col md:flex-row justify-between gap-2">
                        <div className="flex gap-2">
                            <Link href="/rawmat/create">
                                <Button>
                                    <Plus size={16} /> Raw Material
                                </Button>
                            </Link>

                            <Button
                                variant={table.isDeleted ? "outline" : "rose"}
                                onClick={table.toggleTrashMode}
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
                        </div>

                        <div className="flex items-center gap-2">
                            <Link href="/rawmat/import">
                                <Button variant={"outline"}>
                                    <Import size={16} /> Import
                                </Button>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        Kolom <ChevronDown size={16} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {Object.entries(columnVisibility).map(([k, v]) => (
                                        <DropdownMenuCheckboxItem
                                            key={k}
                                            checked={v}
                                            onCheckedChange={(c) =>
                                                setColumnVisibility((p) => ({
                                                    ...p,
                                                    [k]: Boolean(c),
                                                }))
                                            }
                                        >
                                            {k.replace("_", " ").toUpperCase()}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
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
                            data={data}
                            page={table.queryParams.page ?? 1}
                            pageSize={table.queryParams.take ?? 10}
                            total={meta?.len ?? 0}
                            onPageChange={table.setPage}
                            onPageSizeChange={table.setPageSize}
                            state={{ columnVisibility }}
                            onColumnVisibilityChange={setColumnVisibility}
                        />
                    </CardContent>
                )}
            </Card>
        </section>
    );
}
