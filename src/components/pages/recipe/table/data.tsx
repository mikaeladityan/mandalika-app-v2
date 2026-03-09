"use client";

import React, { useState, useMemo } from "react";
import {
    ExpandedState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
    OnChangeFn,
} from "@tanstack/react-table";
import {
    ChevronRight,
    ChevronDown,
    Beaker,
    ChevronLeft,
    ChevronRight as LucideChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Eye,
    Trash2,
    Loader2,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ResponseRecipeDTO } from "@/app/(application)/recipes/server/recipe.schema";
import { useActionProduct } from "@/app/(application)/products/server/use.products";
import Link from "next/link";

interface RecipeDataTableProps {
    data: ResponseRecipeDTO[];
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export function RecipeDataTable({
    data,
    page,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
}: RecipeDataTableProps) {
    const [expanded, setExpanded] = useState<ExpandedState>({});

    const groupedData = useMemo(() => {
        const groups: Record<number, any> = {};
        data.forEach((item) => {
            if (!item.product) return;
            const productId = item.product.id;
            if (!groups[productId]) {
                groups[productId] = {
                    ...item.product,
                    materials: [],
                };
            }
            groups[productId].materials.push({
                id: item.id,
                name: item.raw_material?.name,
                quantity: item.quantity,
                unit: item.raw_material?.unit_raw_material.name,
                stock: item.raw_material?.current_stock,
            });
        });
        return Object.values(groups);
    }, [data]);

    const columns = useMemo(
        () => [
            {
                id: "expander",
                header: () => null,
                cell: ({ row }: any) => (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            row.toggleExpanded();
                        }}
                        className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                    >
                        {row.getIsExpanded() ? (
                            <ChevronDown className="h-6 w-6 text-primary" />
                        ) : (
                            <ChevronRight className="h-6 w-6 text-slate-400" />
                        )}
                    </button>
                ),
            },
            {
                accessorKey: "name",
                header: "Produk",
                cell: ({ row }: any) => (
                    <div className="py-1">
                        <p className="font-bold text-slate-900 leading-none mb-1">
                            {row.original.name}
                        </p>
                        <p className="text-xs font-mono text-muted-foreground uppercase">
                            {row.original.code}
                        </p>
                    </div>
                ),
            },
            {
                id: "spec",
                header: "Spesifikasi",
                cell: ({ row }: any) => (
                    <div className="flex gap-1.5">
                        <Badge variant="secondary" className="text-xs uppercase font-medium">
                            {row.original.product_type?.name}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-medium">
                            {row.original.size} {row.original.unit?.name}
                        </Badge>
                    </div>
                ),
            },
            {
                id: "total_materials",
                header: "Komposisi",
                cell: ({ row }: any) => (
                    <div className="flex items-center gap-1.5 text-slate-600">
                        <Beaker className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">
                            {row.original.materials.length} Material
                        </span>
                    </div>
                ),
            },
            {
                id: "actions",
                header: () => <div className="text-center">Aksi</div>,
                cell: ({ row }: any) => (
                    <div
                        className="flex justify-center items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Link href={`/recipes/form/${row.original.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                                <Eye size={16} />
                            </Button>
                        </Link>
                        <DialogDelete data={row.original} />
                    </div>
                ),
            },
        ],
        [],
    );

    const table = useReactTable({
        data: groupedData,
        columns,
        state: { expanded },
        getRowId: (row) => row.id.toString(),
        onExpandedChange: setExpanded as OnChangeFn<ExpandedState>,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: () => true,
    });

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);

    return (
        <div className="space-y-4">
            <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="text-slate-600 font-semibold h-10 text-xs"
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <React.Fragment key={row.id}>
                                    <TableRow
                                        className="hover:bg-slate-50/50 transition-colors border-b cursor-pointer"
                                        onClick={() => row.toggleExpanded()}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-2.5">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>

                                    {row.getIsExpanded() && (
                                        <TableRow className="bg-slate-50/30 hover:bg-slate-50/30">
                                            <TableCell
                                                colSpan={columns.length}
                                                className="p-0 border-b"
                                            >
                                                <div className="px-10 py-5 border-l-4 border-primary bg-white animate-in slide-in-from-top-1 duration-200">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                                        {row.original.materials.map((mat: any) => (
                                                            <div
                                                                key={mat.id}
                                                                className="p-3 rounded-lg border bg-slate-50/50 flex flex-col gap-1.5"
                                                            >
                                                                <span className="text-xs font-semibold text-slate-700 lowercase leading-tight text-wrap">
                                                                    <p className="capitalize">
                                                                        {mat.name.toLowerCase()}
                                                                    </p>
                                                                </span>
                                                                <div className="flex justify-between items-center mt-1">
                                                                    <span className="text-[11px] text-slate-500 font-medium">
                                                                        {mat.quantity} {mat.unit}
                                                                    </span>
                                                                    <Badge
                                                                        className={`text-xs px-1.5 h-4 border-none ${mat.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                                                                    >
                                                                        Stok: {mat.stock}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground text-sm"
                                >
                                    Tidak ada data resep ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ===== FOOTER (DataTable Style) ===== */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-2">
                <div className="text-sm text-muted-foreground">
                    Menampilkan {startItem} - {endItem} dari {total} data
                </div>

                <div className="flex flex-col xl:flex-row items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Baris per halaman:</span>
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(value) => onPageSizeChange(Number(value))}
                        >
                            <SelectTrigger className="w-16 h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 20, 30, 50].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onPageChange(1)}
                            disabled={page === 1}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="px-3 text-xs font-medium">
                            Halaman {page} dari {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                        >
                            <LucideChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onPageChange(totalPages)}
                            disabled={page >= totalPages}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SUB KOMPONEN: DIALOG DELETE ---
function DialogDelete({ data }: { data: any }) {
    const [confirm, setConfirm] = useState<string>("");
    const [err, setErr] = useState<string>("");
    const { deleted } = useActionProduct();

    const onConfirm = async (code: string) => {
        setErr("");
        if (!confirm) {
            setErr("Konfirmasi tidak boleh kosong");
            return;
        }
        if (confirm !== data.name) {
            setErr("Konfirmasi tidak valid");
            return;
        }
        await deleted.mutateAsync({ code });
    };

    return (
        <Dialog onOpenChange={(open) => !open && (setConfirm(""), setErr(""))}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                >
                    {deleted.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Trash2 size={16} />
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle className="font-semibold text-lg text-slate-900">
                        Hapus Produk (Finish Good)
                    </DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Apakah anda yakin untuk menghapus Produk (Finish Good){" "}
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-slate-900">
                            {data.name}
                        </span>
                        ? Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2">
                    <label
                        htmlFor="confirm"
                        className="text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                        Tulis Nama Produk untuk Konfirmasi
                    </label>
                    <Input
                        id="confirm"
                        onChange={(e) => setConfirm(e.target.value)}
                        value={confirm}
                        placeholder={data.name}
                        className={err ? "border-rose-500 focus-visible:ring-rose-500" : ""}
                        disabled={deleted.isPending}
                    />
                    {err && <p className="text-[11px] font-medium text-rose-500">{err}</p>}
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="destructive"
                        type="button"
                        className="w-full sm:w-auto"
                        onClick={() => onConfirm(data.code)}
                        disabled={deleted.isPending}
                    >
                        {deleted.isPending ? (
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        ) : null}
                        Hapus Sekarang
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
