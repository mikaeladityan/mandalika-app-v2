import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RawmatImportPreviewDTO } from "@/app/(application)/rawmat/import/server/import.schema";
import { formatCurrency } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function PreviewTable({ rows }: { rows: RawmatImportPreviewDTO[] }) {
    if (!rows.length) return null;

    const renderNumber = (val: number | null | undefined) => (val === null || val === undefined ? "—" : val);

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <TableHead className="font-semibold text-slate-700">KODE</TableHead>
                        <TableHead className="font-semibold text-slate-700">NAMA MATERIAL</TableHead>
                        <TableHead className="font-semibold text-slate-700">SATUAN</TableHead>
                        <TableHead className="font-semibold text-slate-700">KATEGORI</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">HARGA</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">MIN. BELI</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">MIN. STOK</TableHead>
                        <TableHead className="font-semibold text-slate-700">LEAD TIME</TableHead>
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
                                <TableCell className="font-medium">{row.barcode || "-"}</TableCell>
                                <TableCell>{row.name || "-"}</TableCell>
                                <TableCell>{row.unit || "-"}</TableCell>
                                <TableCell>
                                    {row.category ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                                            {row.category}
                                        </span>
                                    ) : "-"}
                                </TableCell>
                                <TableCell className="text-right font-mono text-xs">
                                    {row.price !== null ? formatCurrency(row.price) : "—"}
                                </TableCell>
                                <TableCell className="text-right">{renderNumber(row.min_buy)}</TableCell>
                                <TableCell className="text-right">{renderNumber(row.min_stock)}</TableCell>
                                <TableCell className="text-center">{row.lead_time || 0} hari</TableCell>
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
                                            <p className="text-[10px] leading-tight text-red-500 max-w-[150px]">
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
