"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ArrowDown, ArrowUp, Flag, Minus } from "lucide-react";
import { IssuanceListItemDTO } from "@/app/(application)/product-issuance/server/issuance.schema";
import { SortableHeader } from "@/components/ui/table/sortable";

type Props = {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    onSort: (key: string) => void;
    periods: Array<{ year: number; month: number }>;
    type?: string;
};

const formatMonthYear = (year: number, month: number) =>
    new Date(year, month - 1).toLocaleString("id-ID", {
        month: "short",
        year: "2-digit",
    });

export const IssuanceColumns = ({
    sortBy,
    sortOrder,
    onSort,
    periods,
    type,
}: Props): ColumnDef<IssuanceListItemDTO>[] => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const monthColumns: ColumnDef<IssuanceListItemDTO>[] = periods.map((p) => ({
        id: `qty-${p.year}-${p.month}`,
        header: () => {
            const isCurrent = p.year === currentYear && p.month === currentMonth;
            return (
                <div className="font-bold text-[10px] 2xl:text-xs uppercase tracking-tighter">
                    <div className="flex items-center justify-start gap-1 font-bold text-[11px] 2xl:text-xs uppercase tracking-tighter">
                        {formatMonthYear(p.year, p.month)}
                        {isCurrent && <Flag className="size-3 text-blue-600 fill-blue-600" />}
                    </div>
                </div>
            );
        },
        cell: ({ row }) => {
            const found = row.original.quantity.find(
                (q) => q.year === p.year && q.month === p.month,
            );

            if (!found?.quantity) {
                return <div className="text-xs text-muted-foreground text-start px-2">–</div>;
            }

            const TrendIcon =
                found.trend === "UP" ? ArrowUp : found.trend === "DOWN" ? ArrowDown : Minus;

            const trendColor =
                found.trend === "UP"
                    ? "text-green-600"
                    : found.trend === "DOWN"
                      ? "text-rose-600"
                      : "text-muted-foreground";

            return (
                <Link
                    href={`/product-issuance/${row.original.product_id}?month=${found.month}&year=${found.year}${type ? `&type=${type}` : ""}`}
                    className="cursor-pointer group w-full rounded-md px-2 py-1.5 flex items-center justify-start gap-1 hover:bg-muted/60 transition-colors"
                >
                    <span className="text-[13px] font-bold leading-none">
                        {Math.round(Number(found.quantity)).toLocaleString("id-ID")}
                    </span>

                    <TrendIcon className={`size-3 ${trendColor}`} />

                    <span className="ml-auto text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        Detail
                    </span>
                </Link>
            );
        },
    }));

    return [
        {
            id: "product",
            header: () => (
                <SortableHeader
                    label="Produk"
                    sortKey="name"
                    activeSortBy={sortBy}
                    activeSortOrder={sortOrder}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => (
                <div className="overflow-hidden min-w-[180px] py-1">
                    <p className="text-[10px] text-muted-foreground font-mono truncate">
                        {row.original.product.code}
                    </p>
                    <p className="font-bold text-[11px] truncate leading-tight text-primary">
                        {row.original.product.name}{" "}
                        {row.original.product.product_type?.name.toLocaleUpperCase()}{" "}
                        {row.original.product.size.toLocaleUpperCase()}
                    </p>
                </div>
            ),
        },
        ...monthColumns,
    ];
};
