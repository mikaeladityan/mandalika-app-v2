import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SalesImportPreviewDTO } from "@/app/(application)/sales/import/server/import.schema";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function PreviewTable({ rows }: { rows: SalesImportPreviewDTO[] }) {
    if (!rows.length) return null;

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <TableHead className="font-semibold text-slate-700">CODE</TableHead>
                        <TableHead className="font-semibold text-slate-700">NAMA PRODUK</TableHead>
                        <TableHead className="font-semibold text-slate-700">TYPE</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">JUMLAH SALES</TableHead>
                        <TableHead className="font-semibold text-slate-700">STATUS</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {rows.map((row, i) => {
                        const invalid = row.errors.length > 0;
                        return (
                            <TableRow 
                                key={i} 
                                className={invalid ? "bg-red-50/30 hover:bg-red-50/50 transition-colors" : "hover:bg-slate-50/50 transition-colors"}
                            >
                                <TableCell className="font-medium">{row.code || "-"}</TableCell>
                                <TableCell>{row.product_name || "-"}</TableCell>
                                <TableCell>
                                    {row.type ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                            {row.type}
                                        </span>
                                    ) : "-"}
                                </TableCell>
                                <TableCell className="text-right font-mono font-medium">{row.amount || 0}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        {invalid ? (
                                            <div className="flex items-center gap-1.5 text-red-600">
                                                <AlertCircle className="h-3.5 w-3.5" />
                                                <span className="text-xs font-semibold uppercase tracking-wider">Invalid</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-green-600">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                <span className="text-xs font-semibold uppercase tracking-wider">Valid</span>
                                            </div>
                                        )}
                                        {invalid && (
                                            <p className="text-[10px] leading-tight text-red-500 max-w-[200px]">
                                                {row.errors.join(", ")}
                                            </p>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
