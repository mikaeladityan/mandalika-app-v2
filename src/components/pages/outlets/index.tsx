"use client";

import Link from "next/link";
import {
    Plus,
    Search,
    X,
    Store,
    BrushCleaning,
    Warehouse as WarehouseIcon,
    Phone,
    MoreHorizontal,
    Trash2,
    MapPin,
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
    Eye,
    Settings2,
    FileUp,
    LayoutGrid,
    List,
    RotateCcw,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ShoppingCart,
    Layers,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectFilter } from "@/components/ui/form/select";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogAlert } from "@/components/ui/dialog/dialog.alert";
import { DialogDescription } from "@/components/ui/dialog";

import {
    useActionOutlet,
    useOutlets,
    useOutletTableState,
} from "@/app/(application)/outlets/server/use.outlet";
import { useWarehouseStatic } from "@/app/(application)/warehouses/server/use.warehouse";
import { formatNumber, cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/table/data";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { OutletColumns } from "./outlet-table-columns";
import { RowSelectionState } from "@tanstack/react-table";
import { useMemo, useState } from "react";

// Pagination Component Extracted from DataTable
function PaginationControls({
    page,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
    pageLength = [10, 25, 50, 100],
}: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (p: number) => void;
    onPageSizeChange: (s: number) => void;
    pageLength?: number[];
}) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-1">
            <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Menampilkan{" "}
                    <span className="text-foreground font-bold">
                        {formatNumber(startItem)}-{formatNumber(endItem)}
                    </span>{" "}
                    dari <span className="text-foreground font-bold">{formatNumber(total)}</span>
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 lg:gap-8">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-black uppercase text-slate-400">Baris:</span>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(v) => onPageSizeChange(Number(v))}
                    >
                        <SelectTrigger className="h-7 w-16 border-none bg-transparent shadow-none focus:ring-0 font-bold p-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                            align="end"
                            className="rounded-2xl border-indigo-50 shadow-xl"
                        >
                            {pageLength.map((s) => (
                                <SelectItem
                                    key={s}
                                    value={s.toString()}
                                    className="text-sm rounded-lg"
                                >
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-1.5">
                    <div className="flex items-center justify-center px-4 py-2 bg-muted/50 text-foreground rounded-lg text-xs font-bold tabular-nums border border-border/50">
                        {page} <span className="mx-2 text-muted-foreground font-normal">/</span>{" "}
                        {totalPages}
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-slate-200 shadow-none hover:bg-slate-50 hover:text-indigo-600 transition-all rounded-xl"
                            onClick={() => onPageChange(1)}
                            disabled={page === 1}
                        >
                            <ChevronsLeft size={16} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-slate-200 shadow-none hover:bg-slate-50 hover:text-indigo-600 transition-all rounded-xl"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1}
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-slate-200 shadow-none hover:bg-slate-50 hover:text-indigo-600 transition-all rounded-xl"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                        >
                            <ChevronRight size={16} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-slate-200 shadow-none hover:bg-slate-50 hover:text-indigo-600 transition-all rounded-xl"
                            onClick={() => onPageChange(totalPages)}
                            disabled={page >= totalPages}
                        >
                            <ChevronsRight size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { CreateOutletDialog, EditOutletDialog } from "./outlet-form-dialog";

export function Outlets() {
    const table = useOutletTableState();
    const { outlets, isLoading, isFetching } = useOutlets(table.queryParams);
    const { data: warehouseList, isLoading: isWHLoading } = useWarehouseStatic({
        type: "FINISH_GOODS",
        sortBy: "name",
        sortOrder: "asc",
        take: 100,
    });
    const { clean, toggleStatus, bulkStatus, bulkDelete } = useActionOutlet();

    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [editData, setEditData] = useState<any>(null);
    const [viewMode, setViewMode] = useState<"card" | "table">("card");
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const selectedIds = useMemo(() => {
        return Object.keys(rowSelection).map(Number);
    }, [rowSelection]);

    const handleEdit = (outlet: any) => {
        setEditId(outlet.id);
        setEditData(outlet);
        setOpenEdit(true);
    };

    const isDataLoading = isLoading || isFetching;

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <Store className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            Manajemen Outlet
                        </h1>
                        <p className="text-xs text-muted-foreground font-medium">
                            Kelola lokasi toko dan koordinasi gudang utama.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 p-1 bg-slate-100/50 rounded-xl border border-slate-200/50 shadow-inner">
                        <Button
                            variant={viewMode === "card" ? "default" : "ghost"}
                            size="icon"
                            onClick={() => setViewMode("card")}
                            className={cn(
                                "h-8 w-8 rounded-lg transition-all",
                                viewMode === "card"
                                    ? "bg-white shadow-sm text-primary hover:bg-white"
                                    : "text-slate-400 hover:text-slate-600",
                            )}
                        >
                            <LayoutGrid size={16} />
                        </Button>
                        <Button
                            variant={viewMode === "table" ? "default" : "ghost"}
                            size="icon"
                            onClick={() => setViewMode("table")}
                            className={cn(
                                "h-8 w-8 rounded-lg transition-all",
                                viewMode === "table"
                                    ? "bg-white shadow-sm text-primary hover:bg-white"
                                    : "text-slate-400 hover:text-slate-600",
                            )}
                        >
                            <List size={16} />
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            asChild
                            className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs h-10 px-4"
                        >
                            <Link href="/outlets/import">
                                <FileUp size={14} className="mr-2" />
                                Import Toko
                            </Link>
                        </Button>
                        <Button
                            onClick={() => setOpenCreate(true)}
                            className="rounded-xl shadow-md hover:shadow-lg transition-all px-6 font-bold text-xs h-10"
                        >
                            <Plus size={16} className="mr-2" />
                            Tambah Outlet Baru
                        </Button>
                    </div>
                </div>
            </div>

            <CreateOutletDialog open={openCreate} setOpen={setOpenCreate} />
            <EditOutletDialog
                open={openEdit}
                setOpen={setOpenEdit}
                id={editId}
                initialData={editData}
            />

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="space-y-4 border-b bg-white">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                        <div className="relative w-full lg:max-w-md group shrink-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Cari nama atau kode outlet..."
                                value={table.search}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    table.setSearch(e.target.value)
                                }
                                className="pl-10 h-10 bg-muted/30 border-transparent rounded-xl focus-within:ring-1 focus-within:ring-primary/20 transition-all focus-visible:bg-white focus-visible:border-primary/20"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2 items-center">
                            <SelectFilter
                                size={"sm"}
                                placeholder="Semua Gudang"
                                value={table.warehouseId ?? null}
                                options={
                                    warehouseList?.map((w) => ({
                                        value: w.id,
                                        label: `[${w.code}] ${w.name}`,
                                    })) ?? []
                                }
                                onChange={(val) => table.setWarehouseId(Number(val))}
                                onReset={() => table.setWarehouseId(undefined)}
                                isLoading={isWHLoading}
                                canSearching={true}
                                className="min-w-48 bg-white"
                            />

                            <SelectFilter
                                placeholder="Status"
                                size={"sm"}
                                value={table.status ?? null}
                                options={[
                                    { value: "active", label: "Aktif" },
                                    { value: "deleted", label: "Non-Aktif" },
                                ]}
                                onChange={(val) => table.setStatus(val as "active" | "deleted")}
                                onReset={() => table.setStatus(undefined)}
                                className="min-w-32 bg-white"
                            />

                            <div className="flex items-center gap-1.5 p-1 bg-slate-100/50 rounded-xl border border-slate-200/50">
                                <Button
                                    variant={!table.type ? "default" : "ghost"}
                                    onClick={() => table.setType(undefined)}
                                    size="sm"
                                    className={cn(
                                        "rounded-lg font-bold transition-all h-8 px-3 text-[10px] uppercase tracking-wider",
                                        !table.type
                                            ? "shadow-sm bg-white text-primary hover:bg-white"
                                            : "text-slate-500 hover:text-slate-900 hover:bg-transparent",
                                    )}
                                >
                                    Semua
                                </Button>
                                <Button
                                    variant={table.type === "RETAIL" ? "default" : "ghost"}
                                    onClick={() => table.setType("RETAIL")}
                                    size="sm"
                                    className={cn(
                                        "rounded-lg font-bold transition-all h-8 px-3 text-[10px] uppercase tracking-wider gap-1.5",
                                        table.type === "RETAIL"
                                            ? "shadow-sm bg-white text-primary hover:bg-white"
                                            : "text-slate-500 hover:text-slate-900 hover:bg-transparent",
                                    )}
                                >
                                    <ShoppingCart
                                        size={12}
                                        className={
                                            table.type === "RETAIL"
                                                ? "text-primary"
                                                : "text-slate-400"
                                        }
                                    />
                                    Retail
                                </Button>
                                <Button
                                    variant={table.type === "MARKETPLACE" ? "default" : "ghost"}
                                    onClick={() => table.setType("MARKETPLACE")}
                                    size="sm"
                                    className={cn(
                                        "rounded-lg font-bold transition-all h-8 px-3 text-[10px] uppercase tracking-wider gap-1.5",
                                        table.type === "MARKETPLACE"
                                            ? "shadow-sm bg-white text-primary hover:bg-white"
                                            : "text-slate-500 hover:text-slate-900 hover:bg-transparent",
                                    )}
                                >
                                    <Layers
                                        size={12}
                                        className={
                                            table.type === "MARKETPLACE"
                                                ? "text-primary"
                                                : "text-slate-400"
                                        }
                                    />
                                    Marketplace
                                </Button>
                            </div>

                            {(table.warehouseId || table.status || table.search || table.type) && (
                                <Button
                                    variant="ghost"
                                    size={"sm"}
                                    onClick={() => {
                                        table.setSearch("");
                                        table.setWarehouseId(undefined);
                                        table.setStatus(undefined);
                                        table.setType(undefined);
                                    }}
                                    className="h-9 px-3 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                                >
                                    Reset <X className="ml-2 h-3.5 w-3.5" />
                                </Button>
                            )}

                            {table.status === "deleted" && (
                                <DialogAlert
                                    title="Bersihkan Sampah"
                                    asChild
                                    onClick={async () => {
                                        await clean.mutateAsync();
                                    }}
                                    label={
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-10 w-10 rounded-xl border-rose-100 text-rose-500 hover:bg-rose-50 hover:text-rose-600 shadow-sm transition-all active:scale-95 bg-white"
                                        >
                                            <BrushCleaning size={16} />
                                        </Button>
                                    }
                                >
                                    <DialogDescription>
                                        Hapus secara permanen semua outlet yang sudah non-aktif dan
                                        masuk daftar hapus?
                                    </DialogDescription>
                                </DialogAlert>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* DATA VIEW */}
                    {viewMode === "card" ? (
                        <>
                            {/* Grid of Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                                {isDataLoading ? (
                                    Array.from({ length: 8 }).map((_, i) => (
                                        <Card
                                            key={i}
                                            className="shadow-xs border-slate-100/60 bg-white"
                                        >
                                            <CardHeader className="p-4 pb-2 flex flex-row justify-between">
                                                <div className="flex flex-col gap-2">
                                                    <Skeleton className="h-4 w-12" />
                                                    <Skeleton className="h-5 w-32" />
                                                </div>
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                            </CardHeader>
                                            <CardContent className="p-4 pt-2">
                                                <div className="space-y-3">
                                                    <Skeleton className="h-4 w-24" />
                                                    <Skeleton className="h-10 w-full" />
                                                    <Skeleton className="h-4 w-16" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : outlets?.data && outlets.data.length > 0 ? (
                                    outlets.data.map((outlet) => (
                                        <Card
                                            key={outlet.id}
                                            className={cn(
                                                "shadow-xs hover:shadow-md transition-all duration-300 border-slate-200/60 flex flex-col group bg-white",
                                                !!outlet.deleted_at && "opacity-75 grayscale-[0.3]",
                                            )}
                                        >
                                            <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between gap-2">
                                                <div className="flex flex-col space-y-1.5 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px] font-mono border-primary/20 text-primary bg-primary/5 uppercase px-1.5 py-0 rounded"
                                                        >
                                                            {outlet.code}
                                                        </Badge>
                                                        <Badge
                                                            variant={
                                                                outlet.deleted_at
                                                                    ? "secondary"
                                                                    : "default"
                                                            }
                                                            className="text-[10px] uppercase px-1.5 py-0 rounded font-semibold tracking-wide shadow-none"
                                                        >
                                                            {outlet.deleted_at
                                                                ? "Non-Aktif"
                                                                : "Aktif"}
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "text-[10px] uppercase px-1.5 py-0 rounded font-black tracking-widest shadow-none border-none",
                                                                outlet.type === "RETAIL"
                                                                    ? "bg-blue-50 text-blue-600"
                                                                    : "bg-amber-50 text-amber-600",
                                                            )}
                                                        >
                                                            {outlet.type}
                                                        </Badge>
                                                    </div>
                                                    <CardTitle
                                                        className="text-[16px] font-bold leading-tight mt-1 group-hover:text-primary transition-colors truncate"
                                                        title={outlet.name}
                                                    >
                                                        <Link href={`/outlets/${outlet.id}`}>
                                                            {outlet.name}
                                                        </Link>
                                                    </CardTitle>
                                                </div>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 -mt-1 -mr-1 text-slate-400 hover:text-slate-800 shrink-0"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-48 rounded-xl shadow-lg border-slate-100"
                                                    >
                                                        <DropdownMenuLabel>
                                                            Aksi Outlet
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            asChild
                                                            className="cursor-pointer"
                                                        >
                                                            <Link href={`/outlets/${outlet.id}`}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Detail Outlet
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={() => handleEdit(outlet)}
                                                        >
                                                            <Settings2 className="mr-2 h-4 w-4" />
                                                            Edit Outlet
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={() =>
                                                                toggleStatus.mutate({
                                                                    id: outlet.id,
                                                                })
                                                            }
                                                        >
                                                            <Store className="mr-2 h-4 w-4" />
                                                            {outlet.deleted_at
                                                                ? "Aktifkan"
                                                                : "Nonaktifkan"}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </CardHeader>

                                            <CardContent className="p-4 pt-3 grow flex flex-col gap-3">
                                                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-start gap-2.5">
                                                    <div className="p-1.5 bg-white rounded shadow-sm shrink-0">
                                                        <WarehouseIcon className="h-4 w-4 text-emerald-600" />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                            Sumber Gudang
                                                        </span>
                                                        <span
                                                            className="text-[11px] font-semibold text-slate-700 line-clamp-2"
                                                            title={
                                                                outlet.warehouses &&
                                                                outlet.warehouses.length > 0
                                                                    ? outlet.warehouses
                                                                          .map(
                                                                              (w: any) =>
                                                                                  w.warehouse.name,
                                                                          )
                                                                          .join(", ")
                                                                    : "Belum ditentukan"
                                                            }
                                                        >
                                                            {outlet.warehouses &&
                                                            outlet.warehouses.length > 0
                                                                ? outlet.warehouses
                                                                      .map(
                                                                          (w: any) =>
                                                                              w.warehouse.name,
                                                                      )
                                                                      .join(", ")
                                                                : "Belum ditentukan"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 mt-auto">
                                                    {outlet.phone && (
                                                        <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                                            <Phone className="h-3 w-3 shrink-0" />
                                                            <span className="truncate font-medium">
                                                                {outlet.phone}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {outlet.address && (
                                                        <div className="flex items-start gap-2 text-muted-foreground text-xs">
                                                            <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                                                            <span className="line-clamp-2 leading-relaxed font-medium">
                                                                {outlet.address.street &&
                                                                    `${outlet.address.street}, `}
                                                                {outlet.address.district},{" "}
                                                                {outlet.address.city},{" "}
                                                                {outlet.address.province}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>

                                            <div className="h-1 w-full bg-linear-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-full h-40 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-white rounded-xl border border-dashed border-slate-200">
                                        <Store className="h-8 w-8 opacity-20" />
                                        <p className="text-sm font-medium">
                                            Tidak ada outlet ditemukan.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {!isDataLoading && outlets?.data && outlets.len > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-2">
                                    <PaginationControls
                                        page={table.queryParams.page ?? 1}
                                        pageSize={table.queryParams.take ?? 25}
                                        total={outlets?.len ?? 0}
                                        onPageChange={table.setPage}
                                        onPageSizeChange={table.setPageSize}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="overflow-hidden">
                            {isDataLoading ? (
                                <div className="p-4">
                                    <TableSkeleton />
                                </div>
                            ) : (
                                <DataTable
                                    tableId="outlet-master-table"
                                    columns={OutletColumns({
                                        sortBy: table.sortBy,
                                        sortOrder: table.sortOrder,
                                        onSort: table.onSort,
                                        onEdit: handleEdit,
                                    })}
                                    data={outlets?.data || []}
                                    page={table.queryParams.page || 1}
                                    pageSize={table.queryParams.take || 25}
                                    total={outlets?.len ?? 0}
                                    onPageChange={table.setPage}
                                    onPageSizeChange={table.setPageSize}
                                    enableMultiSelect={true}
                                    rowSelection={rowSelection}
                                    onRowSelectionChange={setRowSelection}
                                    getRowId={(row: any) => String(row.id)}
                                />
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* BULK ACTION TOOLBAR */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center gap-3 pr-4 border-r border-slate-700">
                        <div className="size-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center font-bold text-xs ring-1 ring-primary/30">
                            {selectedIds.length}
                        </div>
                        <span className="text-sm font-medium text-slate-300">Terpilih</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {table.status === "deleted" ? (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-9 px-4 rounded-xl text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 font-bold transition-all"
                                onClick={() => {
                                    bulkStatus.mutate({ ids: selectedIds, status: "active" });
                                    setRowSelection({});
                                }}
                            >
                                <CheckCircle2 size={16} className="mr-2" />
                                Pulihkan
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-9 px-4 rounded-xl text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 font-bold transition-all"
                                onClick={() => {
                                    bulkStatus.mutate({ ids: selectedIds, status: "deleted" });
                                    setRowSelection({});
                                }}
                            >
                                <AlertCircle size={16} className="mr-2" />
                                Nonaktifkan
                            </Button>
                        )}

                        {table.status === "deleted" && (
                            <DialogAlert
                                title={`Hapus Permanen ${selectedIds.length} Outlet?`}
                                asChild
                                onClick={async () => {
                                    await bulkDelete.mutateAsync({ ids: selectedIds });
                                    setRowSelection({});
                                }}
                                label={
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-9 px-4 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-bold transition-all"
                                    >
                                        <Trash2 size={16} className="mr-2" />
                                        Hapus Permanen
                                    </Button>
                                }
                            >
                                <DialogDescription>
                                    Anda akan menghapus data ini secara permanen dari basis data.
                                    Tindakan ini tidak dapat dibatalkan.
                                </DialogDescription>
                            </DialogAlert>
                        )}

                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-9 px-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
                            onClick={() => setRowSelection({})}
                        >
                            <X size={16} />
                        </Button>
                    </div>
                </div>
            )}
        </section>
    );
}
