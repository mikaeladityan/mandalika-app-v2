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

export function PreviewTable({ rows }: { rows: SalesImportPreviewDTO[] }) {
    if (!rows.length) return null;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Julah Sales</TableHead>
                    <TableHead>Info</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {rows.map((row, i) => (
                    <TableRow key={i}>
                        <TableCell>{row.code}</TableCell>
                        <TableCell>{row.product_name}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{row.amount}</TableCell>
                        <TableCell>
                            <Badge variant={row.errors.length ? "destructive" : "default"}>
                                {row.errors.length ? "Invalid" : "Valid"}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
