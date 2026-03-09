"use client";

import { ColumnDef } from "@tanstack/react-table";
import { OpenPoResponse } from "@/app/(application)/po/open/server/po-open.schema";
import { formatNumber } from "@/lib/utils";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useActionUpdateOpenPo } from "@/app/(application)/po/open/server/use.po-open";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export const OpenPoColumns = (): ColumnDef<OpenPoResponse>[] => {
    return [
        {
            accessorKey: "material_name",
            header: "MATERIAL / BARCODE",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex flex-col min-w-[200px]">
                        <span className="text-sm font-semibold text-slate-700">
                            {item.material_name}
                        </span>
                        <span className="text-xs font-mono text-slate-400 uppercase">
                            {item.barcode || "-"}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "po_number",
            header: "PO NUMBER",
            cell: ({ row }) => {
                const item = row.original;
                const { mutate: updatePo } = useActionUpdateOpenPo();
                const [val, setVal] = useState(item.po_number || "");

                return (
                    <Input
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        onBlur={() => {
                            if (val !== (item.po_number || "")) {
                                updatePo({ id: item.id, body: { po_number: val } });
                            }
                        }}
                        className="w-fit h-8 text-xs font-bold"
                        placeholder="PO-XXXXX"
                    />
                );
            },
        },
        {
            accessorKey: "quantity",
            header: "QTY OPEN",
            cell: ({ row }) => (
                <span className="font-bold text-slate-800">
                    {formatNumber(row.original.quantity)}
                </span>
            ),
        },
        {
            accessorKey: "expected_arrival",
            header: "EST. ARRIVAL",
            cell: ({ row }) => {
                const item = row.original;
                const { mutate: updatePo } = useActionUpdateOpenPo();
                const [val, setVal] = useState(
                    item.expected_arrival ? dayjs(item.expected_arrival).format("YYYY-MM-DD") : "",
                );

                return (
                    <Input
                        type="date"
                        value={val}
                        onChange={(e) => {
                            const newDate = e.target.value;
                            setVal(newDate);
                            updatePo({ id: item.id, body: { expected_arrival: newDate } });
                        }}
                        className="w-fit h-8 text-xs"
                    />
                );
            },
        },
        {
            accessorKey: "status",
            header: "STATUS",
            cell: ({ row }) => {
                const item = row.original;
                const { mutate: updatePo } = useActionUpdateOpenPo();

                return (
                    <Select
                        defaultValue={item.status}
                        onValueChange={(val) => updatePo({ id: item.id, body: { status: val } })}
                    >
                        <SelectTrigger className="w-28 h-8 text-xs font-semibold">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="OPEN">OPEN</SelectItem>
                            <SelectItem value="RECEIVED">RECEIVED</SelectItem>
                            <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                        </SelectContent>
                    </Select>
                );
            },
        },
        {
            accessorKey: "order_date",
            header: "ORDER DATE",
            cell: ({ row }) => (
                <span className="text-xs text-slate-500">
                    {dayjs(row.original.order_date).format("DD MMM YYYY")}
                </span>
            ),
        },
    ];
};
