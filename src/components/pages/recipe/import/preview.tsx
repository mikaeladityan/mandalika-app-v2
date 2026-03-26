import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { RecipeImportPreviewDTO } from "@/app/(application)/recipes/import/server/import.schema";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PreviewTable({ rows }: { rows: RecipeImportPreviewDTO[] }) {
    if (!rows.length) return null;

    return (
        <div className="w-full overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b border-slate-200">
                        <TableHead className="text-[9px] font-black uppercase tracking-wider text-slate-500 py-4">PRODUCT CODE</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-wider text-slate-500 py-4">PRODUCT NAME</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-wider text-slate-500 text-center py-4">SIZE</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-wider text-slate-500 text-center py-4">TYPE</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-wider text-slate-500 py-4">MATERIAL CODE</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-wider text-slate-500 py-4">MATERIAL NAME</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-wider text-slate-500 text-right py-4">QTY</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-wider text-slate-500 py-4">STATUS</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow 
                            key={i} 
                            className={cn(
                                "group transition-colors border-b border-slate-100",
                                row.errors.length ? "bg-rose-50/30 hover:bg-rose-50/50" : "hover:bg-slate-50/50"
                            )}
                        >
                            <TableCell className="text-[11px] font-bold text-slate-900 leading-none py-4">
                                {row.product_code || "-"}
                            </TableCell>
                            <TableCell className="text-[11px] font-medium text-slate-700 py-4">
                                {row.product_name || "-"}
                            </TableCell>
                            <TableCell className="text-center text-[11px] font-bold text-slate-500 py-4">
                                {row.product_size || "-"}
                            </TableCell>
                            <TableCell className="text-center py-4">
                                {row.product_type ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter bg-slate-100 text-slate-600 border border-slate-200 shadow-xs">
                                        {row.product_type}
                                    </span>
                                ) : (
                                    <span className="text-slate-300">—</span>
                                )}
                            </TableCell>
                            <TableCell className="font-mono text-[10px] font-bold text-slate-400 py-4 uppercase tracking-tighter">
                                {row.material_code || "-"}
                            </TableCell>
                            <TableCell className="text-[11px] font-medium text-slate-700 py-4 flex flex-col">
                                {row.material_name || "-"}
                            </TableCell>
                            <TableCell className="text-right text-[11px] font-black text-slate-900 py-4 tabular-nums">
                                {row.qty ?? "-"}
                            </TableCell>
                            <TableCell className="py-4">
                                <div className="flex flex-col gap-1.5 min-w-[120px]">
                                    {row.errors.length ? (
                                        <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 w-fit">
                                            <AlertCircle className="h-3 w-3" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Invalid</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 w-fit">
                                            <CheckCircle2 className="h-3 w-3" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Valid</span>
                                        </div>
                                    )}
                                    {row.errors.length > 0 && (
                                        <p className="text-[10px] leading-tight font-medium text-rose-500 px-1 italic">
                                            {row.errors.join(", ")}
                                        </p>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
