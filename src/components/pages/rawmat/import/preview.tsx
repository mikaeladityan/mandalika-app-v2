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

export function PreviewTable({ rows }: { rows: RawmatImportPreviewDTO[] }) {
    if (!rows.length) return null;

    const renderNumber = (val: number | null) => (val === null || val === undefined ? "—" : val);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama Material</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Min. Beli</TableHead>
                    <TableHead>Min. Stok</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Negara</TableHead>
                    <TableHead>Lead Time</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {rows.map((row, i) => {
                    const invalid = row.errors.length > 0;

                    return (
                        <TableRow key={i} className={invalid ? "bg-red-50" : ""}>
                            <TableCell className="font-medium">{row.barcode}</TableCell>

                            <TableCell>{row.name}</TableCell>

                            <TableCell>{row.unit}</TableCell>

                            <TableCell>{row.category}</TableCell>

                            <TableCell className="text-right">
                                {row.price !== null ? formatCurrency(row.price) : "—"}
                            </TableCell>

                            <TableCell className="text-right">
                                {renderNumber(row.min_buy)}
                            </TableCell>

                            <TableCell className="text-right">
                                {renderNumber(row.min_stock)}
                            </TableCell>

                            <TableCell>{row.supplier}</TableCell>

                            <TableCell>{row.country}</TableCell>

                            <TableCell className="text-right">{row.lead_time}</TableCell>

                            <TableCell>
                                <div className="flex flex-col gap-1">
                                    <Badge variant={invalid ? "destructive" : "default"}>
                                        {invalid ? "Invalid" : "Valid"}
                                    </Badge>

                                    {invalid && (
                                        <span className="text-xs text-red-500">
                                            {row.errors.join(", ")}
                                        </span>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
