"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    OnChangeFn,
    useReactTable,
    VisibilityState,
    RowSelectionState,
    Updater,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"; // Gunakan lucide-react (asumsi typo di import anda)
import { ArrowRightLeft as SwipeIcon, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    pageLength?: number[];
    state?: {
        columnVisibility?: VisibilityState;
    };
    onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
    enableMultiSelect?: boolean;
    getRowId?: (row: TData, index: number, parent?: any) => string;
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: (updater: Updater<RowSelectionState>) => void;
}

export function DataTable<TData, TValue>({
    columns: userColumns,
    data,
    page,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
    state,
    onColumnVisibilityChange,
    pageLength,
    enableMultiSelect = false,
    getRowId,
    rowSelection: controlledRowSelection,
    onRowSelectionChange,
}: DataTableProps<TData, TValue>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({});

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const rowSelection =
        controlledRowSelection !== undefined ? controlledRowSelection : internalRowSelection;
    const setRowSelection = onRowSelectionChange ?? setInternalRowSelection;

    const columns = useMemo(() => {
        if (!enableMultiSelect) return userColumns;

        const selectColumn: ColumnDef<TData, any> = {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected()
                            ? true
                            : table.getIsSomePageRowsSelected()
                              ? "indeterminate"
                              : false
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        };

        return [selectColumn, ...userColumns];
    }, [userColumns, enableMultiSelect]);

    const table = useReactTable({
        data,
        columns,
        manualPagination: true,
        pageCount: totalPages,
        state: {
            pagination: { pageIndex: page - 1, pageSize },
            columnVisibility: state?.columnVisibility,
            rowSelection,
        },
        enableRowSelection: enableMultiSelect,
        onRowSelectionChange: setRowSelection,
        getRowId,
        onPaginationChange: (updater) => {
            const next =
                typeof updater === "function" ? updater(table.getState().pagination) : updater;
            if (next.pageIndex !== page - 1) onPageChange(next.pageIndex + 1);
            if (next.pageSize !== pageSize) onPageSizeChange(next.pageSize);
        },
        onColumnVisibilityChange,
        getCoreRowModel: getCoreRowModel(),
    });

    useEffect(() => {
        if (!containerRef.current) return;
        const { scrollWidth, clientWidth } = containerRef.current;
        setIsOverflowing(scrollWidth > clientWidth);
    }, [data, columns, state?.columnVisibility]);

    const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Tooltip Indikator Scroll (Hanya muncul jika tabel meluap di mobile) */}
            {isOverflowing && (
                <div className="flex items-center gap-2 px-1 lg:hidden">
                    <div className="flex items-center justify-center bg-primary/10 text-primary rounded-full p-1 animate-pulse">
                        <SwipeIcon size={12} />
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        Geser horizontal untuk melihat data lengkap
                    </span>
                </div>
            )}

            {/* MAIN TABLE CONTAINER */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div
                    ref={containerRef}
                    className="overflow-auto max-h-250 scrollbar-thin scrollbar-thumb-border"
                >
                    <table className="w-full border-separate border-spacing-0">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header, index) => (
                                        <th
                                            key={header.id}
                                            className={cn(
                                                "sticky top-0 z-20 px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider",
                                                "bg-muted border-b border-border text-muted-foreground",
                                                "transition-colors duration-200",
                                                // Tambahkan border kanan kecuali kolom terakhir untuk kesan grid yang rapih
                                                index !== headerGroup.headers.length - 1 &&
                                                    "border-r border-border/50",
                                                header.column.id === "select" &&
                                                    "w-10 px-2 text-center",
                                            )}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-background">
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="group transition-colors hover:bg-muted/30"
                                    >
                                        {row.getVisibleCells().map((cell, index) => (
                                            <td
                                                key={cell.id}
                                                className={cn(
                                                    "px-4 py-3 text-sm text-foreground/80 border-b border-border",
                                                    "group-last:border-b-0", // Hilangkan border bawah di baris terakhir
                                                    index !== row.getVisibleCells().length - 1 &&
                                                        "border-r border-border/30",
                                                    cell.column.id === "select" &&
                                                        "w-10 px-2 text-center",
                                                )}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={table.getAllLeafColumns().length}
                                        className="h-40 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <MoreHorizontal className="h-8 w-8 opacity-20" />
                                            <p className="text-sm">Tidak ada data ditemukan.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* REFINED PAGINATION */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-1">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-muted-foreground">
                        Menampilkan{" "}
                        <span className="text-foreground">
                            {startItem}-{endItem}
                        </span>{" "}
                        dari <span className="text-foreground">{total}</span>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 lg:gap-8">
                    {/* Rows per page selection */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Baris:</span>
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(v) => onPageSizeChange(Number(v))}
                        >
                            <SelectTrigger className="h-9 w-18.75 border-border bg-background shadow-none focus:ring-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent align="end">
                                {(pageLength || [10, 25, 50, 100, 250, 500, 1000]).map((s) => (
                                    <SelectItem key={s} value={s.toString()} className="text-sm">
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center justify-center px-3 text-sm font-semibold tabular-nums">
                            {page} <span className="mx-1 text-muted-foreground font-normal">/</span>{" "}
                            {totalPages}
                        </div>

                        <div className="flex items-center gap-1 ml-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 border-border shadow-none"
                                onClick={() => onPageChange(1)}
                                disabled={page === 1}
                            >
                                <ChevronsLeft size={16} />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 border-border shadow-none"
                                onClick={() => onPageChange(page - 1)}
                                disabled={page === 1}
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 border-border shadow-none"
                                onClick={() => onPageChange(page + 1)}
                                disabled={page >= totalPages}
                            >
                                <ChevronRight size={16} />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 border-border shadow-none"
                                onClick={() => onPageChange(totalPages)}
                                disabled={page >= totalPages}
                            >
                                <ChevronsRight size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
