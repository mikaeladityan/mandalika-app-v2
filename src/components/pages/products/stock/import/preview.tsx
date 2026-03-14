import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductInventoryImportPreviewDTO } from "@/app/(application)/products/stocks/[id]/import/server/import.schema";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function PreviewTable({ rows }: { rows: ProductInventoryImportPreviewDTO[] }) {
    if (!rows.length) return null;

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <TableHead className="font-semibold text-slate-700">SKU</TableHead>
                        <TableHead className="font-semibold text-slate-700">PRODUK</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">AMOUNT</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-center">STATUS</TableHead>
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
                                <TableCell className="font-medium text-xs font-mono">{row.code || "-"}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-900">{row.name || "-"}</span>
                                        <div className="flex gap-1.5 mt-0.5">
                                            {row.type && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 uppercase font-semibold border border-slate-200">
                                                    {row.type}
                                                </span>
                                            )}
                                            {row.size && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-600 uppercase font-semibold border border-blue-100">
                                                    {row.size}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-mono font-bold">{row.amount || 0}</TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center gap-1.5 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                        {invalid ? (
                                            <div className="flex items-center gap-1 text-red-600">
                                                <AlertCircle className="h-3 w-3" />
                                                <span className="text-[10px] font-bold uppercase tracking-tight">Invalid</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-green-600">
                                                <CheckCircle2 className="h-3 w-3" />
                                                <span className="text-[10px] font-bold uppercase tracking-tight">Valid</span>
                                            </div>
                                        )}
                                    </div>
                                    {invalid && (
                                        <p className="text-[9px] text-red-500 mt-0.5 text-center">
                                            {row.errors.join(", ")}
                                        </p>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
