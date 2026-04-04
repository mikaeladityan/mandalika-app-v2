import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductImportPreviewDTO } from "@/app/(application)/products/import/server/import.schema";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function PreviewTable({ rows }: { rows: ProductImportPreviewDTO[] }) {
    if (!rows.length) return null;

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <TableHead className="font-semibold text-slate-700">CODE</TableHead>
                        <TableHead className="font-semibold text-slate-700">NAME</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-center">
                            GENDER
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-center">
                            SIZE
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-center">
                            TYPE
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-center">
                            UNIT
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">
                            EDAR (%)
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">
                            SAFETY (%)
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">STATUS</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow
                            key={i}
                            className={
                                row.errors.length
                                    ? "bg-red-50/30 hover:bg-red-50/50 transition-colors"
                                    : "hover:bg-slate-50/50 transition-colors"
                            }
                        >
                            <TableCell className="font-medium">{row.code || "-"}</TableCell>
                            <TableCell>{row.name || "-"}</TableCell>
                            <TableCell className="text-center">{row.gender || "-"}</TableCell>
                            <TableCell className="text-center">{row.size || "-"}</TableCell>
                            <TableCell className="text-center">
                                {row.type ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                        {row.type}
                                    </span>
                                ) : (
                                    "-"
                                )}
                            </TableCell>
                            <TableCell className="text-center">{row.unit || "-"}</TableCell>
                            <TableCell className="text-right font-mono text-xs">
                                {row.distribution_percentage * 100}%
                            </TableCell>
                            <TableCell className="text-right font-mono text-xs">
                                {row.safety_percentage * 100}%
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1">
                                    {row.errors.length ? (
                                        <div className="flex items-center gap-1.5 text-red-600">
                                            <AlertCircle className="h-3.5 w-3.5" />
                                            <span className="text-xs font-semibold uppercase tracking-wider">
                                                Invalid
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-green-600">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            <span className="text-xs font-semibold uppercase tracking-wider">
                                                Valid
                                            </span>
                                        </div>
                                    )}
                                    {row.errors.length > 0 && (
                                        <p className="text-[10px] leading-tight text-red-500 max-w-[150px]">
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
