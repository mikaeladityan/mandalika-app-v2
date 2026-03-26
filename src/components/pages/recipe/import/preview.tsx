import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RecipeImportPreviewDTO } from "@/app/(application)/recipes/import/server/import.schema";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function PreviewTable({ rows }: { rows: RecipeImportPreviewDTO[] }) {
    if (!rows.length) return null;

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <TableHead className="font-semibold text-slate-700">PRODUCT CODE</TableHead>
                        <TableHead className="font-semibold text-slate-700">PRODUCT NAME</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-center">SIZE</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-center">TYPE</TableHead>
                        <TableHead className="font-semibold text-slate-700">MATERIAL CODE</TableHead>
                        <TableHead className="font-semibold text-slate-700">MATERIAL NAME</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">QTY</TableHead>
                        <TableHead className="font-semibold text-slate-700">STATUS</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow 
                            key={i} 
                            className={row.errors.length ? "bg-red-50/30 hover:bg-red-50/50 transition-colors" : "hover:bg-slate-50/50 transition-colors"}
                        >
                            <TableCell className="font-medium">{row.product_code || "-"}</TableCell>
                            <TableCell>{row.product_name || "-"}</TableCell>
                            <TableCell className="text-center">{row.product_size || "-"}</TableCell>
                            <TableCell className="text-center">
                                {row.product_type ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                                        {row.product_type}
                                    </span>
                                ) : "-"}
                            </TableCell>
                            <TableCell className="font-mono text-[10px] text-slate-500">{row.material_code || "-"}</TableCell>
                            <TableCell>{row.material_name || "-"}</TableCell>
                            <TableCell className="text-right font-medium">{row.qty ?? "-"}</TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1">
                                    {row.errors.length ? (
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
                                    {row.errors.length > 0 && (
                                        <p className="text-[10px] leading-tight text-red-500 max-w-[200px]">
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
