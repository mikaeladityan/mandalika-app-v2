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
    ColumnOrderState,
} from "@tanstack/react-table";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    GripVertical,
    Settings2,
    ChevronDown,
} from "lucide-react";
import { ArrowRightLeft as SwipeIcon, MoreHorizontal } from "lucide-react";
import { Reorder } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn, formatNumber } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface DataTableProps<TData, TValue> {
    tableId?: string;
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
    tableId,
    columns: userColumns,
    data,
    page,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
    state: externalState,
    onColumnVisibilityChange: externalOnColumnVisibilityChange,
    pageLength,
    enableMultiSelect = false,
    getRowId,
    rowSelection: controlledRowSelection,
    onRowSelectionChange,
}: DataTableProps<TData, TValue>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({});

    // Persistence
    const [persistedVisibility, setPersistedVisibility] = useLocalStorage<VisibilityState>(
        tableId ? `${tableId}-visibility` : "",
        externalState?.columnVisibility || {},
    );
    const [persistedOrder, setPersistedOrder] = useLocalStorage<ColumnOrderState>(
        tableId ? `${tableId}-order` : "",
        [],
    );

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(persistedVisibility);
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(persistedOrder);

    // Sync with persistence only if tableId is provided
    useEffect(() => {
        if (externalState?.columnVisibility) {
            setColumnVisibility((prev) => ({
                ...prev,
                ...externalState.columnVisibility,
            }));
        }
    }, [externalState?.columnVisibility]);

    useEffect(() => {
        if (tableId) {
            setPersistedVisibility(columnVisibility);
        }
    }, [columnVisibility, tableId]);

    useEffect(() => {
        if (tableId) {
            setPersistedOrder(columnOrder);
        }
    }, [columnOrder, tableId]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const rowSelection =
        controlledRowSelection !== undefined ? controlledRowSelection : internalRowSelection;
    const setRowSelection = onRowSelectionChange ?? setInternalRowSelection;

    const columns = useMemo(() => {
        const baseColumns = [...userColumns];
        if (!enableMultiSelect) return baseColumns;

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

        return [selectColumn, ...baseColumns];
    }, [userColumns, enableMultiSelect]);

    const table = useReactTable({
        data,
        columns,
        manualPagination: true,
        pageCount: totalPages,
        state: {
            pagination: { pageIndex: page - 1, pageSize },
            columnVisibility,
            columnOrder,
            rowSelection,
        },
        enableRowSelection: enableMultiSelect,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: (updater) => {
            const next = typeof updater === "function" ? updater(columnVisibility) : updater;
            setColumnVisibility(next);
            externalOnColumnVisibilityChange?.(updater);
        },
        onColumnOrderChange: setColumnOrder,
        getRowId,
        onPaginationChange: (updater) => {
            const next =
                typeof updater === "function" ? updater(table.getState().pagination) : updater;
            if (next.pageIndex !== page - 1) onPageChange(next.pageIndex + 1);
            if (next.pageSize !== pageSize) onPageSizeChange(next.pageSize);
        },
        getCoreRowModel: getCoreRowModel(),
    });

    useEffect(() => {
        if (!containerRef.current) return;
        const { scrollWidth, clientWidth } = containerRef.current;
        setIsOverflowing(scrollWidth > clientWidth);
    }, [data, columns, columnVisibility]);

    // Synchronize column order with actual columns (handling added/removed columns like 'select')
    useEffect(() => {
        const allColumnIds = table.getAllLeafColumns().map((c) => c.id);

        setColumnOrder((prevOrder) => {
            // Filter out stale IDs
            const filteredOrder = prevOrder.filter((id) => allColumnIds.includes(id));

            // Find missing IDs
            const missingIds = allColumnIds.filter((id) => !filteredOrder.includes(id));

            // If nothing changed, return previous state
            if (
                missingIds.length === 0 &&
                filteredOrder.length === prevOrder.length &&
                prevOrder.length > 0
            ) {
                return prevOrder;
            }

            // If prevOrder was empty, just use all identifiers
            if (prevOrder.length === 0) return allColumnIds;

            // Otherwise, construct new order
            let newOrder = [...filteredOrder];

            // If 'select' is missing and should be there, put it at the start
            if (missingIds.includes("select")) {
                newOrder = ["select", ...newOrder];
            }

            // Add remaining missing IDs at the end
            missingIds
                .filter((id) => id !== "select")
                .forEach((id) => {
                    if (!newOrder.includes(id)) newOrder.push(id);
                });

            return newOrder;
        });
    }, [columns, enableMultiSelect]);

    const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    {isOverflowing && (
                        <div className="flex items-center gap-2 lg:hidden">
                            <div className="flex items-center justify-center bg-primary/10 text-primary rounded-full p-1 animate-pulse">
                                <SwipeIcon size={12} />
                            </div>
                            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                                Geser horizontal
                            </span>
                        </div>
                    )}
                </div>

                {/* Column Settings & Reordering */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 ml-auto z-1 bg-white border-dashed border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all rounded-xl"
                        >
                            <Settings2 className="mr-2 h-4 w-4" />
                            Pengaturan Kolom
                            <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-64 p-2 z-1 rounded-2xl shadow-2xl border-indigo-50"
                    >
                        <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
                            Urutan & Visibilitas
                        </div>
                        <Reorder.Group
                            axis="y"
                            values={columnOrder}
                            onReorder={setColumnOrder}
                            className="max-h-[350px] overflow-auto py-1 space-y-0.5"
                        >
                            {columnOrder.map((columnId) => {
                                // Safe lookup to prevent crash
                                const column = table
                                    .getAllLeafColumns()
                                    .find((c) => c.id === columnId);
                                if (!column) return null;
                                const isHidable = column.getCanHide();
                                const header =
                                    typeof column.columnDef.header === "string"
                                        ? column.columnDef.header
                                        : column.id === "select"
                                          ? "Selection"
                                          : column.id || "Action";

                                // Skip select column from reordering in UI if needed, or allow it
                                if (column.id === "select") return null;

                                return (
                                    <Reorder.Item
                                        key={columnId}
                                        value={columnId}
                                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors group cursor-default"
                                    >
                                        <div className="cursor-grab active:cursor-grabbing p-1 text-slate-300 group-hover:text-slate-400 transition-colors">
                                            <GripVertical className="size-3.5" />
                                        </div>
                                        <div className="flex items-center gap-2 flex-1">
                                            <Checkbox
                                                id={`col-vis-${columnId}`}
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(val) =>
                                                    column.toggleVisibility(!!val)
                                                }
                                                disabled={!isHidable}
                                                className="size-4 rounded-md border-slate-200 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                            />
                                            <label
                                                htmlFor={`col-vis-${columnId}`}
                                                className="text-xs font-bold text-slate-600 flex-1 truncate cursor-pointer select-none"
                                            >
                                                {header}
                                            </label>
                                        </div>
                                    </Reorder.Item>
                                );
                            })}
                        </Reorder.Group>
                        <DropdownMenuSeparator className="my-1 bg-slate-50" />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl py-1.5 h-auto"
                            onClick={() => {
                                setColumnOrder(table.getAllLeafColumns().map((d) => d.id));
                                setColumnVisibility({});
                            }}
                        >
                            Reset ke Default
                        </Button>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* MAIN TABLE CONTAINER */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div
                    ref={containerRef}
                    className="overflow-auto max-h-[600px] scrollbar-thin scrollbar-thumb-border"
                >
                    <table className="w-full border-separate border-spacing-0">
                        <thead className="sticky top-0 z-1">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Reorder.Group
                                    key={headerGroup.id}
                                    axis="x"
                                    values={columnOrder}
                                    onReorder={setColumnOrder}
                                    as="tr"
                                >
                                    {headerGroup.headers.map((header, index) => (
                                        <Reorder.Item
                                            key={header.id}
                                            value={header.column.id}
                                            as="th"
                                            className={cn(
                                                "sticky top-0 z-1 px-4 py-4 text-left text-xs font-black uppercase tracking-wider",
                                                "bg-slate-50 border-b border-border text-slate-500",
                                                "transition-colors duration-200 cursor-grab active:cursor-grabbing",
                                                "hover:bg-slate-100/80",
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
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>
                            ))}
                        </thead>
                        <tbody className="bg-background">
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="group transition-colors hover:bg-slate-50/50"
                                    >
                                        {row.getVisibleCells().map((cell, index) => (
                                            <td
                                                key={cell.id}
                                                className={cn(
                                                    "px-4 py-3 text-sm text-foreground/80 border-b border-border",
                                                    "group-last:border-b-0",
                                                    index !== row.getVisibleCells().length - 1 &&
                                                        "border-r border-border/30",
                                                    cell.column.id === "select" &&
                                                        "w-10 px-2 text-center",
                                                    (
                                                        cell.column.columnDef.meta as any
                                                    )?.getCellClassName?.(row.original, cell),
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
                                            <p className="text-sm font-medium">
                                                Tidak ada data ditemukan.
                                            </p>
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
                    <p className="text-sm font-bold text-slate-500">
                        Menampilkan{" "}
                        <span className="text-indigo-600">
                            {formatNumber(startItem)}-{formatNumber(endItem)}
                        </span>{" "}
                        dari <span className="text-indigo-600">{formatNumber(total)}</span>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 lg:gap-8">
                    {/* Rows per page selection */}
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                        <span className="text-[11px] font-black uppercase text-slate-400">
                            Baris:
                        </span>
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
                                {(pageLength || [10, 25, 50, 100, 250, 500, 1000]).map((s) => (
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

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center justify-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black tracking-tighter tabular-nums">
                            {page} <span className="mx-2 text-indigo-300 font-normal">/</span>{" "}
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
        </div>
    );
}
