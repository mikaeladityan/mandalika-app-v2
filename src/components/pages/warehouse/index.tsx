"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Plus,
    Settings2,
    WarehouseIcon,
    Loader2,
    Trash2,
    AlertTriangle,
    Layers,
    Package,
    Search,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
    useFormWarehouse,
    useWarehouseStatic,
    useWarehouseTableState,
} from "@/app/(application)/warehouses/server/use.warehouse";
import { LayoutGrid, List } from "lucide-react";
import { DataTable } from "@/components/ui/table/data";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { WarehouseColumns } from "./warehouse-table-columns";
import { useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ResponseWarehouseDTO } from "@/app/(application)/warehouses/server/warehouse.schema";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { CreateWarehouseDialog, EditWarehouseDialog } from "./warehouse-form-dialog";

export function Warehouse() {
    const table = useWarehouseTableState();
    const { data: warehouses = [], isLoading, total } = useWarehouseStatic(table.queryParams);

    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<"card" | "table">("card");

    const handleEdit = (id: number) => {
        setEditId(id);
        setOpenEdit(true);
    };

    const columns = useMemo(
        () =>
            WarehouseColumns({
                sortBy: table.sortBy,
                sortOrder: table.sortOrder,
                onSort: table.onSort,
                onEdit: handleEdit,
            }),
        [table.sortBy, table.sortOrder, table.onSort],
    );

    return (
        <section className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-bold text-2xl tracking-tight text-slate-900">
                        Gudang Perusahaan
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                        Manajemen aset dan inventaris logistik pusat.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-inner mr-2">
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

                    <Button
                        size="sm"
                        onClick={() => setOpenCreate(true)}
                        className="rounded-xl shadow-md hover:shadow-lg transition-all h-10 px-4 font-bold text-xs"
                    >
                        <Plus size={16} className="mr-2" />
                        Tambah Gudang
                    </Button>
                </div>
            </header>

            <CreateWarehouseDialog open={openCreate} setOpen={setOpenCreate} />
            <EditWarehouseDialog open={openEdit} setOpen={setOpenEdit} id={editId} />

            {/* FILTERS & SEARCH */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 p-4 rounded-3xl border border-slate-100 shadow-sm backdrop-blur-sm">
                <div className="relative w-full md:w-72 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Cari gudang..."
                        value={table.search}
                        onChange={(e) => table.setSearch(e.target.value)}
                        className="pl-10 h-10 w-full bg-white border-slate-200 rounded-2xl focus-visible:ring-primary/20 shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-2 p-1 bg-slate-100/50 rounded-2xl border border-slate-200/50 w-full md:w-auto">
                    <Button
                        variant={!table.queryParams.type ? "default" : "ghost"}
                        onClick={() => table.setType(undefined)}
                        size="sm"
                        className={cn(
                            "flex-1 md:flex-none rounded-xl font-bold transition-all h-9 px-4 text-xs",
                            !table.queryParams.type
                                ? "shadow-md bg-white text-primary hover:bg-white"
                                : "text-slate-500 hover:text-slate-900 hover:bg-transparent",
                        )}
                    >
                        Semua
                    </Button>
                    <Button
                        variant={table.queryParams.type === "FINISH_GOODS" ? "default" : "ghost"}
                        onClick={() => table.setType("FINISH_GOODS")}
                        size="sm"
                        className={cn(
                            "flex-1 md:flex-none rounded-xl font-bold transition-all h-9 px-4 text-xs gap-2",
                            table.queryParams.type === "FINISH_GOODS"
                                ? "shadow-md bg-white text-primary hover:bg-white"
                                : "text-slate-500 hover:text-slate-900 hover:bg-transparent",
                        )}
                    >
                        <Layers
                            size={14}
                            className={
                                table.queryParams.type === "FINISH_GOODS"
                                    ? "text-primary"
                                    : "text-slate-400"
                            }
                        />
                        FG (Produk Jual)
                    </Button>
                    <Button
                        variant={table.queryParams.type === "RAW_MATERIAL" ? "default" : "ghost"}
                        onClick={() => table.setType("RAW_MATERIAL")}
                        size="sm"
                        className={cn(
                            "flex-1 md:flex-none rounded-xl font-bold transition-all h-9 px-4 text-xs gap-2",
                            table.queryParams.type === "RAW_MATERIAL"
                                ? "shadow-md bg-white text-primary hover:bg-white"
                                : "text-slate-500 hover:text-slate-900 hover:bg-transparent",
                        )}
                    >
                        <Package
                            size={14}
                            className={
                                table.queryParams.type === "RAW_MATERIAL"
                                    ? "text-primary"
                                    : "text-slate-400"
                            }
                        />
                        RM (Bahan Baku)
                    </Button>
                    {(table.queryParams.search || table.queryParams.type) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                table.setSearch("");
                                table.setType(undefined);
                            }}
                            className="h-9 px-3 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                        >
                            Reset <X className="ml-2 h-3.5 w-3.5" />
                        </Button>
                    )}
                </div>
            </div>

            {/* DATA VIEW */}
            {viewMode === "card" ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-10">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i} className="shadow-sm border-slate-200/60">
                                <CardHeader className="flex flex-row justify-between p-4 pb-2">
                                    <Skeleton className="h-5 w-32" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    </div>
                                </CardHeader>
                                <CardContent className="flex justify-center py-6">
                                    <Skeleton className="h-20 w-20 rounded-full" />
                                </CardContent>
                                <CardFooter className="p-2 border-t flex gap-2">
                                    <Skeleton className="h-9 w-full rounded-lg" />
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <>
                            {warehouses.map((w) => (
                                <Card
                                    key={w.id}
                                    className="hover:border-primary/50 transition-all shadow-sm group relative border-slate-200/60 bg-white overflow-hidden"
                                >
                                    <CardHeader className="flex flex-row justify-between p-4 pb-2">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800">
                                                {w.name}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                                                {w.code || "-"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-end gap-1.5 translate-x-2 -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300">
                                            <DeletedWarehouse data={w} />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 rounded-lg border-slate-200 text-slate-400 hover:text-primary hover:bg-slate-50 shadow-sm"
                                                onClick={() => handleEdit(w.id)}
                                            >
                                                <Settings2 size={14} />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex justify-center py-6 relative">
                                        <div className="absolute inset-0 bg-linear-to-b from-transparent to-white/50 pointer-events-none" />
                                        <WarehouseIcon
                                            size={64}
                                            className="text-slate-100 group-hover:text-primary/10 transition-colors duration-500"
                                        />
                                    </CardContent>
                                    <CardFooter className="p-2 border-t bg-slate-50/50 flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full text-xs font-bold text-slate-600 hover:text-primary hover:bg-white rounded-lg transition-all"
                                            asChild
                                        >
                                            <Link href={`/warehouses/${w.id}`}>Lihat Detail</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                            <button
                                onClick={() => setOpenCreate(true)}
                                className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col gap-3 items-center justify-center hover:bg-slate-50 hover:border-primary/30 min-h-45 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <Plus
                                        size={24}
                                        className="text-slate-400 group-hover:text-primary transition-colors"
                                    />
                                </div>
                                <span className="text-xs font-bold text-slate-400 group-hover:text-primary transition-all">
                                    Tambah Gudang
                                </span>
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded border border-slate-100 shadow-sm overflow-hidden p-5">
                    {isLoading ? (
                        <div className="p-4">
                            <TableSkeleton />
                        </div>
                    ) : (
                        <DataTable
                            tableId="warehouse-master-table"
                            columns={columns}
                            data={warehouses || []}
                            page={table.queryParams.page || 1}
                            pageSize={table.queryParams.take || 10}
                            total={total ?? 0}
                            onPageChange={(page) => table.setPage(page)}
                            onPageSizeChange={(size) => table.setPageSize(size)}
                            enableMultiSelect={false}
                            getRowId={(row: any) => String(row.id)}
                        />
                    )}
                </div>
            )}
        </section>
    );
}

export function DeletedWarehouse({ data }: { data: ResponseWarehouseDTO }) {
    const { deleted } = useFormWarehouse(data.id);
    const [confirm, setConfirm] = useState<string>("");
    const [force, setForce] = useState<boolean>(false);
    const [err, setErr] = useState<string>("");

    const onConfirm = async () => {
        setErr("");

        if (!confirm) {
            setErr("Konfirmasi tidak boleh kosong");
            return;
        }

        if (confirm !== data.name) {
            setErr("Konfirmasi tidak valid");
            return;
        }

        await deleted.mutateAsync({ force });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 text-rose-500">
                    {deleted.isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <Trash2 size={14} />
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="font-semibold text-lg">Hapus Gudang</DialogTitle>
                    <DialogDescription>
                        Apakah anda yakin untuk menghapus gudang{" "}
                        <span className="px-1 rounded bg-gray-100 font-medium">{data.name}</span>?
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <label htmlFor="confirm" className="text-sm font-medium text-gray-700">
                            Konfirmasi Nama Gudang
                        </label>
                        <Input
                            name="confirm"
                            onChange={(e) => setConfirm(e.target.value)}
                            value={confirm}
                            placeholder="Tulis kembali nama Gudang"
                            disabled={deleted.isPending}
                        />
                        {err && <small className="text-rose-500 block">{err}</small>}
                    </div>

                    <div className="flex items-start space-x-3 p-4 rounded-xl border border-rose-100 bg-rose-50/30 transition-all hover:bg-rose-50/50 group">
                        <div className="pt-0.5">
                            <Checkbox
                                id="force"
                                checked={force}
                                onCheckedChange={(checked) => setForce(!!checked)}
                                disabled={deleted.isPending}
                                className="border-rose-200 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                            />
                        </div>
                        <div
                            className="grid gap-1.5 leading-none cursor-pointer select-none"
                            onClick={() => setForce(!force)}
                        >
                            <Label
                                htmlFor="force"
                                className="text-sm font-bold text-rose-700 flex items-center gap-1.5 group-hover:text-rose-800 transition-colors cursor-pointer"
                            >
                                <AlertTriangle size={14} className="text-rose-500" />
                                Hapus Paksa Data Terkait
                            </Label>
                            <p className="text-[12px] text-rose-600/80 leading-relaxed font-medium">
                                Centang jika ingin menghapus gudang beserta seluruh riwayat stok,
                                pergerakan barang, dan relasi outlet.
                                <span className="block mt-0.5 font-bold underline decoration-rose-500/30 text-rose-700 uppercase tracking-tight">
                                    Tindakan ini tidak dapat dibatalkan!
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant={"teal"}
                        type="button"
                        size={"sm"}
                        onClick={onConfirm}
                        disabled={deleted.isPending}
                    >
                        {deleted.isPending ? <Loader2 className="animate-spin" /> : " Yakin"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
